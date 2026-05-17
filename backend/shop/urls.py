from django.urls import path

from .views import (
    BrandListView,
    CategoryListView,
    ColorListView,
    ProductAutocompleteView,
    ProductDetailView,
    ProductListView,
    ProductSearchView,
    RelatedProductsView,
)

urlpatterns = [
    # ── Categories / Brands / Colors ─────────────────────────────────────────
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("brands/", BrandListView.as_view(), name="brand-list"),
    path("colors/", ColorListView.as_view(), name="color-list"),
    # ── Products (existing — unchanged) ──────────────────────────────────────
    path("products/", ProductListView.as_view(), name="product-list"),
    path("products/<slug:slug>/", ProductDetailView.as_view(), name="product-detail"),
    path(
        "products/<slug:slug>/related/",
        RelatedProductsView.as_view(),
        name="product-related",
    ),
    # ── Elasticsearch search ──────────────────────────────────────────────────
    # GET /api/search/?q=...&category=...&brand=...&sort=...&page=...
    path("search/", ProductSearchView.as_view(), name="product-search"),
    # GET /api/search/autocomplete/?q=...
    path(
        "search/autocomplete/",
        ProductAutocompleteView.as_view(),
        name="product-autocomplete",
    ),
]
