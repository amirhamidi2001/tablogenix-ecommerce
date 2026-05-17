import logging

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .filters import ProductFilter
from .models import Brand, Category, Color, Product
from .pagination import StandardResultsPagination
from .search import SearchUnavailable, autocomplete_products, search_products
from .serializers import (
    BrandSerializer,
    CategorySerializer,
    ColorSerializer,
    ProductDetailSerializer,
    ProductListSerializer,
)

logger = logging.getLogger(__name__)


# ═══════════════════════════════════════════════════════════════════════════════
# Existing views (unchanged)
# ═══════════════════════════════════════════════════════════════════════════════


class CategoryListView(generics.ListAPIView):
    """Return top-level categories with nested children."""

    permission_classes = [AllowAny]
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(parent__isnull=True).prefetch_related("children")


class BrandListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = BrandSerializer
    queryset = Brand.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]
    pagination_class = None


class ColorListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ColorSerializer
    queryset = Color.objects.all()
    pagination_class = None


class ProductListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ProductListSerializer
    pagination_class = StandardResultsPagination
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = ProductFilter
    search_fields = [
        "name",
        "short_description",
        "description",
        "brand__name",
        "category__name",
    ]
    ordering_fields = ["price", "rating", "created_at", "reviews_count"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return (
            Product.objects.select_related("category", "brand")
            .prefetch_related("colors__color")
            .all()
        )


class ProductDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = ProductDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Product.objects.select_related("category", "brand").prefetch_related(
            "images", "colors__color", "reviews"
        )


class RelatedProductsView(generics.ListAPIView):
    """Return up to 8 products from the same category, excluding the current one."""

    permission_classes = [AllowAny]
    serializer_class = ProductListSerializer
    pagination_class = None

    def get_queryset(self):
        slug = self.kwargs.get("slug")
        try:
            product = Product.objects.get(slug=slug)
        except Product.DoesNotExist:
            return Product.objects.none()

        return (
            Product.objects.filter(category=product.category)
            .exclude(slug=slug)
            .select_related("category", "brand")
            .order_by("-rating")[:8]
        )


# ═══════════════════════════════════════════════════════════════════════════════
# NEW — Elasticsearch-powered views
# ═══════════════════════════════════════════════════════════════════════════════


class ProductSearchView(APIView):
    """
    GET /api/search/

    Query parameters
    ────────────────
    q           string   Full-text search query
    category    string   Category slug (exact filter)
    brand       string   Brand slug (exact filter)
    min_price   float    Lower price bound (inclusive)
    max_price   float    Upper price bound (inclusive)
    is_new      bool     Only new arrivals
    is_sale     bool     Only on-sale products
    in_stock    bool     Only products with stock > 0
    sort        string   relevance | price-asc | price-desc | rating |
                         newest | name-asc | name-desc | popular
    page        int      Page number (default: 1)
    page_size   int      Results per page (default: 12, max: 48)

    Response
    ────────
    {
      "count": 45,
      "page": 1,
      "pages": 4,
      "page_size": 12,
      "results": [ <product_document>, … ],
      "aggregations": {
        "categories": [ {"slug", "name", "count"}, … ],
        "brands":     [ {"slug", "name", "count"}, … ],
        "price_stats": {"min", "max", "avg"},
        "price_ranges": [ {"key", "from", "to", "count"}, … ],
        "new_count": 5,
        "sale_count": 12
      }
    }
    """

    permission_classes = [AllowAny]

    # Maximum page_size accepted from clients
    MAX_PAGE_SIZE = 48

    def get(self, request):
        params = request.query_params

        q = params.get("q", "").strip()
        category = params.get("category", "").strip()
        brand = params.get("brand", "").strip()
        sort = params.get("sort", "relevance")
        in_stock = params.get("in_stock", "").lower() in ("1", "true", "yes")

        # Optional boolean filters
        is_new = self._parse_bool(params.get("is_new"))
        is_sale = self._parse_bool(params.get("is_sale"))

        # Price range
        min_price = self._parse_float(params.get("min_price"))
        max_price = self._parse_float(params.get("max_price"))

        # Pagination
        try:
            page = max(1, int(params.get("page", 1)))
        except (TypeError, ValueError):
            page = 1

        try:
            page_size = min(
                self.MAX_PAGE_SIZE,
                max(1, int(params.get("page_size", 12))),
            )
        except (TypeError, ValueError):
            page_size = 12

        try:
            data = search_products(
                q=q,
                category=category,
                brand=brand,
                min_price=min_price,
                max_price=max_price,
                is_new=is_new,
                is_sale=is_sale,
                in_stock=in_stock,
                sort=sort,
                page=page,
                page_size=page_size,
            )
            return Response(data)

        except SearchUnavailable:
            # Graceful degradation — fall back to a basic DB query so the
            # storefront never returns a 500 due to Elasticsearch downtime.
            logger.warning(
                "Elasticsearch unavailable; falling back to DB search for q=%r", q
            )
            return self._db_fallback(q, page, page_size)

    # ── Helpers ───────────────────────────────────────────────────────────────

    @staticmethod
    def _parse_bool(value):
        if value is None:
            return None
        return value.lower() in ("1", "true", "yes")

    @staticmethod
    def _parse_float(value):
        if value is None:
            return None
        try:
            return float(value)
        except (TypeError, ValueError):
            return None

    def _db_fallback(self, q, page, page_size):
        """
        Minimal Django ORM fallback when ES is unreachable.
        Returns the same envelope shape so the frontend never breaks.
        """
        qs = Product.objects.select_related("category", "brand").prefetch_related(
            "colors__color"
        )
        if q:
            from django.db.models import Q as DQ

            qs = qs.filter(
                DQ(name__icontains=q)
                | DQ(short_description__icontains=q)
                | DQ(brand__name__icontains=q)
                | DQ(category__name__icontains=q)
            )

        total = qs.count()
        pages = max(1, (total + page_size - 1) // page_size)
        start = (page - 1) * page_size
        products = qs[start : start + page_size]

        serializer = ProductListSerializer(
            products, many=True, context={"request": None}
        )
        return Response(
            {
                "count": total,
                "page": page,
                "pages": pages,
                "page_size": page_size,
                "results": serializer.data,
                "aggregations": {},
                "fallback": True,  # signals to the frontend that ES was unavailable
            },
            status=status.HTTP_200_OK,
        )


class ProductAutocompleteView(APIView):
    """
    GET /api/search/autocomplete/?q=<query>

    Returns up to 8 lightweight product suggestions.

    Response
    ────────
    {
      "suggestions": [
        {"id": 1, "name": "…", "slug": "…", "thumbnail": "…",
         "price": 99.99, "category": "Electronics"},
        …
      ]
    }
    """

    permission_classes = [AllowAny]

    def get(self, request):
        q = request.query_params.get("q", "").strip()
        suggestions = autocomplete_products(q, size=8)
        return Response({"suggestions": suggestions})
