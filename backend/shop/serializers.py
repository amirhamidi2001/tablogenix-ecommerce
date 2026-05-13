from rest_framework import serializers
from .models import Category, Brand, Color, Product, ProductImage, ProductColor, Review


class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ("id", "name", "slug", "parent", "image", "children", "created_at")

    def get_children(self, obj):
        children = obj.children.all()
        return CategorySerializer(children, many=True, context=self.context).data


class CategoryMinimalSerializer(serializers.ModelSerializer):
    """Lightweight serializer used inside product representations."""

    class Meta:
        model = Category
        fields = ("id", "name", "slug")


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ("id", "name", "slug", "logo")


class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ("id", "name", "hex_code")


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ("id", "image")


class ProductColorSerializer(serializers.ModelSerializer):
    color = ColorSerializer(read_only=True)

    class Meta:
        model = ProductColor
        fields = ("id", "color")


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ("id", "name", "rating", "headline", "comment", "created_at")


# ─── Product list serializer — lightweight, no nested reviews ─────────────
class ProductListSerializer(serializers.ModelSerializer):
    category = CategoryMinimalSerializer(read_only=True)
    brand = BrandSerializer(read_only=True)
    thumbnail_url = serializers.SerializerMethodField()
    discount_percent = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "slug",
            "short_description",
            "price",
            "original_price",
            "discount_percent",
            "stock",
            "rating",
            "reviews_count",
            "is_new",
            "is_sale",
            "thumbnail_url",
            "category",
            "brand",
            "created_at",
        )

    def get_thumbnail_url(self, obj):
        request = self.context.get("request")
        if obj.thumbnail and request:
            return request.build_absolute_uri(obj.thumbnail.url)
        return None


# ─── Product detail serializer — full with nested relations ───────────────
class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategoryMinimalSerializer(read_only=True)
    brand = BrandSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    colors = ProductColorSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    thumbnail_url = serializers.SerializerMethodField()
    discount_percent = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "slug",
            "short_description",
            "description",
            "price",
            "original_price",
            "discount_percent",
            "stock",
            "rating",
            "reviews_count",
            "is_new",
            "is_sale",
            "thumbnail_url",
            "images",
            "colors",
            "reviews",
            "category",
            "brand",
            "created_at",
        )

    def get_thumbnail_url(self, obj):
        request = self.context.get("request")
        if obj.thumbnail and request:
            return request.build_absolute_uri(obj.thumbnail.url)
        return None
