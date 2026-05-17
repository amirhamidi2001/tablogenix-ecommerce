from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry

from .models import Brand, Category, Product


@registry.register_document
class ProductDocument(Document):
    # ── Full-text fields ──────────────────────────────────────────────────────
    name = fields.TextField(
        analyzer="english",
        fields={
            # Keyword sub-field for sorting & exact-match aggregations
            "raw": fields.KeywordField(),
            # Standard-analysed sub-field used for match_phrase_prefix autocomplete
            "suggest": fields.TextField(analyzer="standard"),
        },
    )
    short_description = fields.TextField(analyzer="english")
    description = fields.TextField(analyzer="english")

    # ── Nested objects (returned verbatim in results) ─────────────────────────
    category = fields.ObjectField(
        properties={
            "id": fields.IntegerField(),
            "name": fields.TextField(fields={"raw": fields.KeywordField()}),
            "slug": fields.KeywordField(),
        }
    )
    brand = fields.ObjectField(
        properties={
            "id": fields.IntegerField(),
            "name": fields.TextField(fields={"raw": fields.KeywordField()}),
            "slug": fields.KeywordField(),
        }
    )

    # ── Flat keyword fields (used in terms-aggregations for facets) ───────────
    # These duplicate the nested slug/name so ES can aggregate them cheaply
    # without a nested path.
    category_slug = fields.KeywordField()
    category_name = fields.KeywordField()
    brand_slug = fields.KeywordField()
    brand_name = fields.KeywordField()

    # ── Numeric / boolean / date ──────────────────────────────────────────────
    price = fields.FloatField()
    original_price = fields.FloatField()
    stock = fields.IntegerField()
    rating = fields.FloatField()
    reviews_count = fields.IntegerField()
    is_new = fields.BooleanField()
    is_sale = fields.BooleanField()
    slug = fields.KeywordField()
    thumbnail = fields.KeywordField()  # Stored as absolute URL string
    created_at = fields.DateField()

    # ── Index configuration ───────────────────────────────────────────────────
    class Index:
        name = "products"
        settings = {
            "number_of_shards": 1,
            "number_of_replicas": 0,  # 1 in multi-node production clusters
            "refresh_interval": "1s",  # Near-real-time; increase for heavy write loads
            "max_result_window": 50_000,
        }

    class Django:
        model = Product
        # Fields sourced directly from the model without custom prepare_*
        fields = ["id"]
        # Auto-index related products when a Category or Brand is updated
        related_models = [Category, Brand]

    # ── queryset ──────────────────────────────────────────────────────────────
    def get_queryset(self):
        """Avoid N+1 when bulk-indexing."""
        return super().get_queryset().select_related("category", "brand")

    # ── prepare_* helpers ─────────────────────────────────────────────────────
    def prepare_name(self, instance):
        return instance.name

    def prepare_short_description(self, instance):
        return instance.short_description or ""

    def prepare_description(self, instance):
        return instance.description or ""

    def prepare_category(self, instance):
        if instance.category:
            return {
                "id": instance.category.id,
                "name": instance.category.name,
                "slug": instance.category.slug,
            }
        return {}

    def prepare_brand(self, instance):
        if instance.brand:
            return {
                "id": instance.brand.id,
                "name": instance.brand.name,
                "slug": instance.brand.slug,
            }
        return {}

    def prepare_category_slug(self, instance):
        return instance.category.slug if instance.category else None

    def prepare_category_name(self, instance):
        return instance.category.name if instance.category else None

    def prepare_brand_slug(self, instance):
        return instance.brand.slug if instance.brand else None

    def prepare_brand_name(self, instance):
        return instance.brand.name if instance.brand else None

    def prepare_price(self, instance):
        return float(instance.price)

    def prepare_original_price(self, instance):
        return float(instance.original_price) if instance.original_price else None

    def prepare_rating(self, instance):
        return float(instance.rating)

    def prepare_thumbnail(self, instance):
        """Return a relative URL path so it works behind any domain."""
        if instance.thumbnail:
            return instance.thumbnail.url
        return None

    # ── Related-model signal bridge ───────────────────────────────────────────
    def get_instances_from_related(self, related_instance):
        """
        When a Category or Brand is saved, re-index all products that
        reference it so the denormalised fields stay consistent.
        """
        if isinstance(related_instance, Category):
            return related_instance.products.all()
        if isinstance(related_instance, Brand):
            return related_instance.products.all()
        return []
