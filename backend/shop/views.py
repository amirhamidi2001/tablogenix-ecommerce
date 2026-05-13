from rest_framework import generics, filters
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend

from .models import Category, Brand, Color, Product
from .serializers import (
    CategorySerializer,
    BrandSerializer,
    ColorSerializer,
    ProductListSerializer,
    ProductDetailSerializer,
)
from .filters import ProductFilter
from .pagination import StandardResultsPagination


# ─── Categories ────────────────────────────────────────────────────────────
class CategoryListView(generics.ListAPIView):
    """Return top-level categories with nested children."""

    permission_classes = [AllowAny]
    serializer_class = CategorySerializer

    def get_queryset(self):
        # Return only root categories; children are nested via serializer
        return Category.objects.filter(parent__isnull=True).prefetch_related("children")


# ─── Brands ────────────────────────────────────────────────────────────────
class BrandListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = BrandSerializer
    queryset = Brand.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]
    pagination_class = None  # Return all brands without pagination


# ─── Colors ────────────────────────────────────────────────────────────────
class ColorListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ColorSerializer
    queryset = Color.objects.all()
    pagination_class = None  # Return all colors without pagination


# ─── Products list ─────────────────────────────────────────────────────────
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


# ─── Product detail ────────────────────────────────────────────────────────
class ProductDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = ProductDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Product.objects.select_related("category", "brand").prefetch_related(
            "images", "colors__color", "reviews"
        )


# ─── Related products ──────────────────────────────────────────────────────
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
