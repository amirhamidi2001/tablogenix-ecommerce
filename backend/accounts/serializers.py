from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode

from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Profile
from .tokens import password_reset_token

User = get_user_model()


class RegisterSerializer(serializers.Serializer):
    """Creates a User + updates the auto-generated Profile."""

    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=255)
    last_name = serializers.CharField(max_length=255)
    password = serializers.CharField(write_only=True, validators=[validate_password])

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
        )
        # The Profile is created by the post_save signal; just update it.
        user.profile.first_name = validated_data["first_name"]
        user.profile.last_name = validated_data["last_name"]
        user.profile.save()
        return user


class RegisterResponseSerializer(serializers.Serializer):
    """Returns JWT tokens alongside a lightweight user payload."""

    email = serializers.EmailField(source="user.email")
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    access = serializers.SerializerMethodField()
    refresh = serializers.SerializerMethodField()

    def _tokens(self, obj):
        if not hasattr(self, "_cached_tokens"):
            refresh = RefreshToken.for_user(obj.user)
            self._cached_tokens = {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
        return self._cached_tokens

    def get_access(self, obj):
        return self._tokens(obj)["access"]

    def get_refresh(self, obj):
        return self._tokens(obj)["refresh"]


class ProfileSerializer(serializers.ModelSerializer):
    """Handles GET and PATCH for the logged-in user's profile + email."""

    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Profile
        fields = [
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "image",
            "order_updates",
            "promotions",
            "newsletter",
        ]
        extra_kwargs = {
            "image": {"read_only": True},  # handled by a separate upload endpoint
        }

    def validate_phone_number(self, value):
        """Loose E.164-style check: optional +, then up to 12 digits."""
        if value:
            stripped = value.replace(" ", "").replace("-", "")
            digits = stripped.lstrip("+")
            if not digits.isdigit() or len(digits) > 12:
                raise serializers.ValidationError(
                    "Enter a valid phone number (max 12 digits, optional leading +)."
                )
        return value

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class ChangePasswordSerializer(serializers.Serializer):
    """Authenticated endpoint: supply current password then set a new one."""

    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(
        write_only=True, validators=[validate_password]
    )
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = self.context["request"].user

        if not user.check_password(attrs["current_password"]):
            raise serializers.ValidationError(
                {"current_password": "Current password is incorrect."}
            )

        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "New passwords do not match."}
            )

        return attrs

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user


class PasswordResetRequestSerializer(serializers.Serializer):
    """Accepts an email address and triggers the reset email."""

    email = serializers.EmailField()

    def validate_email(self, value):
        return value

    def get_user(self):
        email = self.validated_data["email"]
        try:
            return User.objects.get(email=email, is_active=True)
        except User.DoesNotExist:
            return None


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Validates the uidb64 + token pair and sets a new password."""

    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(
        write_only=True, validators=[validate_password]
    )
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match."}
            )

        try:
            uid = force_str(urlsafe_base64_decode(attrs["uid"]))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError({"uid": "Invalid reset link."})

        if not password_reset_token.check_token(user, attrs["token"]):
            raise serializers.ValidationError(
                {"token": "Token is invalid or has expired."}
            )

        attrs["user"] = user
        return attrs

    def save(self, **kwargs):
        user = self.validated_data["user"]
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user
