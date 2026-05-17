import logging

from elasticsearch_dsl import Q

from .documents import ProductDocument
from .models import Brand, Category

logger = logging.getLogger(__name__)

# ─── Sort mapping ─────────────────────────────────────────────────────────────
SORT_OPTIONS = {
    "relevance": "_score",
    "price-asc": "price",
    "price-desc": "-price",
    "rating": "-rating",
    "newest": "-created_at",
    "name-asc": "name.raw",
    "name-desc": "-name.raw",
    "popular": "-reviews_count",
}

# ─── Price bucket presets ─────────────────────────────────────────────────────
PRICE_RANGES = [
    {"key": "under-50", "to": 50},
    {"key": "50-100", "from": 50, "to": 100},
    {"key": "100-200", "from": 100, "to": 200},
    {"key": "over-200", "from": 200},
]


# ─── Core search ──────────────────────────────────────────────────────────────


def build_search(
    q: str = "",
    category: str = "",
    brand: str = "",
    min_price: float | None = None,
    max_price: float | None = None,
    is_new: bool | None = None,
    is_sale: bool | None = None,
    in_stock: bool = False,
    sort: str = "relevance",
    page: int = 1,
    page_size: int = 12,
):
    """
    Build and return an elasticsearch-dsl Search object.
    Nothing is sent to ES until .execute() is called.
    """
    s = ProductDocument.search()

    # ── Main query ────────────────────────────────────────────────────────────
    if q:
        main_query = Q(
            "multi_match",
            query=q,
            fields=[
                "name^4",
                "name.suggest^3",
                "short_description^2",
                "description",
                "brand_name^2",
                "category_name^2",
            ],
            type="best_fields",
            fuzziness="AUTO",
            operator="or",
        )
        # Boost exact phrase matches
        phrase_boost = Q("match_phrase", **{"name": {"query": q, "boost": 2}})
        s = s.query(Q("bool", should=[main_query, phrase_boost]))
    else:
        s = s.query("match_all")

    # ── Filters ───────────────────────────────────────────────────────────────
    if category:
        s = s.filter("term", category_slug=category)
    if brand:
        s = s.filter("term", brand_slug=brand)
    if min_price is not None:
        s = s.filter("range", price={"gte": min_price})
    if max_price is not None:
        s = s.filter("range", price={"lte": max_price})
    if is_new is not None:
        s = s.filter("term", is_new=is_new)
    if is_sale is not None:
        s = s.filter("term", is_sale=is_sale)
    if in_stock:
        s = s.filter("range", stock={"gt": 0})

    # ── Aggregations (for faceted sidebar) ────────────────────────────────────
    s.aggs.bucket("categories", "terms", field="category_slug", size=30)
    s.aggs.bucket("brands", "terms", field="brand_slug", size=30)
    s.aggs.metric("price_stats", "stats", field="price")
    s.aggs.bucket("price_ranges", "range", field="price", ranges=PRICE_RANGES)
    # Counts for tag-filters (always returns regardless of current filter)
    s.aggs.bucket("new_products", "filter", filter={"term": {"is_new": True}})
    s.aggs.bucket("sale_products", "filter", filter={"term": {"is_sale": True}})

    # ── Sorting ───────────────────────────────────────────────────────────────
    sort_field = SORT_OPTIONS.get(sort, "_score")
    s = s.sort(sort_field)

    # ── Pagination ────────────────────────────────────────────────────────────
    start = (page - 1) * page_size
    s = s[start : start + page_size]

    return s


def execute_search(s, page: int, page_size: int) -> dict:
    """
    Execute a Search object and return a normalised dict ready for
    JSON serialisation.
    """
    response = s.execute()

    total = response.hits.total.value
    pages = max(1, (total + page_size - 1) // page_size)

    # ── Results ───────────────────────────────────────────────────────────────
    results = []
    for hit in response.hits:
        doc = hit.to_dict()
        doc["score"] = hit.meta.score
        results.append(doc)

    # ── Aggregations ──────────────────────────────────────────────────────────
    aggs_raw = response.aggregations

    # Resolve category names from DB (one tiny query)
    cat_slugs = [b.key for b in aggs_raw.categories.buckets]
    cat_map = {
        c.slug: c.name
        for c in Category.objects.filter(slug__in=cat_slugs).only("slug", "name")
    }

    # Resolve brand names from DB
    brand_slugs = [b.key for b in aggs_raw.brands.buckets]
    brand_map = {
        b.slug: b.name
        for b in Brand.objects.filter(slug__in=brand_slugs).only("slug", "name")
    }

    price_st = aggs_raw.price_stats
    aggregations = {
        "categories": [
            {
                "slug": b.key,
                "name": cat_map.get(b.key, b.key),
                "count": b.doc_count,
            }
            for b in aggs_raw.categories.buckets
        ],
        "brands": [
            {
                "slug": b.key,
                "name": brand_map.get(b.key, b.key),
                "count": b.doc_count,
            }
            for b in aggs_raw.brands.buckets
        ],
        "price_stats": {
            "min": price_st.min,
            "max": price_st.max,
            "avg": round(price_st.avg, 2) if price_st.avg else None,
        },
        "price_ranges": [
            {
                "key": b.key,
                "from": getattr(b, "from", None),
                "to": getattr(b, "to", None),
                "count": b.doc_count,
            }
            for b in aggs_raw.price_ranges.buckets
        ],
        "new_count": aggs_raw.new_products.doc_count,
        "sale_count": aggs_raw.sale_products.doc_count,
    }

    return {
        "count": total,
        "page": page,
        "pages": pages,
        "page_size": page_size,
        "results": results,
        "aggregations": aggregations,
    }


def search_products(
    q: str = "",
    category: str = "",
    brand: str = "",
    min_price: float | None = None,
    max_price: float | None = None,
    is_new: bool | None = None,
    is_sale: bool | None = None,
    in_stock: bool = False,
    sort: str = "relevance",
    page: int = 1,
    page_size: int = 12,
) -> dict:
    """
    High-level helper: build + execute + return normalised results.
    Catches connection errors and re-raises as SearchUnavailable.
    """
    try:
        s = build_search(
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
        return execute_search(s, page, page_size)
    except Exception as exc:
        logger.exception("Elasticsearch search failed: %s", exc)
        raise SearchUnavailable(str(exc)) from exc


# ─── Autocomplete ─────────────────────────────────────────────────────────────


def autocomplete_products(q: str, size: int = 8) -> list[dict]:
    """
    Return lightweight product suggestions for the search-as-you-type
    input using match_phrase_prefix on name.suggest.
    """
    if not q or len(q.strip()) < 2:
        return []

    try:
        s = (
            ProductDocument.search()
            .query(
                Q(
                    "bool",
                    should=[
                        Q(
                            "match_phrase_prefix",
                            **{"name.suggest": {"query": q, "boost": 2}}
                        ),
                        Q("match", **{"name": {"query": q, "fuzziness": "AUTO"}}),
                    ],
                )
            )
            .source(["id", "name", "slug", "thumbnail", "price", "category_name"])[
                :size
            ]
        )
        response = s.execute()
        return [
            {
                "id": hit.id,
                "name": hit.name,
                "slug": hit.slug,
                "thumbnail": getattr(hit, "thumbnail", None),
                "price": getattr(hit, "price", None),
                "category": getattr(hit, "category_name", None),
            }
            for hit in response.hits
        ]
    except Exception as exc:
        logger.warning("Autocomplete ES query failed: %s", exc)
        return []


# ─── Custom exception ─────────────────────────────────────────────────────────


class SearchUnavailable(Exception):
    """Raised when Elasticsearch cannot be reached."""
