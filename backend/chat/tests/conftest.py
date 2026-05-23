import pytest
import factory
from factory.django import DjangoModelFactory
from faker import Faker
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

fake = Faker()
User = get_user_model()


# ═══════════════════════════════════════════════════════════════════════════
# Factories
# ═══════════════════════════════════════════════════════════════════════════


class UserFactory(DjangoModelFactory):
    class Meta:
        model = User
        skip_postgeneration_save = True

    email = factory.LazyFunction(lambda: fake.unique.email())
    password = factory.PostGenerationMethodCall("set_password", "Str0ngPass!")
    is_active = True
    is_verified = True
    type = 1  # CUSTOMER


class AdminUserFactory(UserFactory):
    is_staff = True
    type = 2  # ADMIN


class SuperUserFactory(UserFactory):
    is_staff = True
    is_superuser = True
    type = 3  # SUPERUSER


# ── Chat factories ────────────────────────────────────────────────────────


class ChatRoomFactory(DjangoModelFactory):
    class Meta:
        model = "chat.ChatRoom"

    customer = factory.SubFactory(UserFactory)
    status = "open"
    subject = factory.LazyFunction(lambda: fake.sentence(nb_words=4))


class ChatMessageFactory(DjangoModelFactory):
    class Meta:
        model = "chat.ChatMessage"

    room = factory.SubFactory(ChatRoomFactory)
    sender = factory.SubFactory(UserFactory)
    content = factory.LazyFunction(fake.sentence)
    message_type = "text"


# ═══════════════════════════════════════════════════════════════════════════
# Fixtures
# ═══════════════════════════════════════════════════════════════════════════


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def customer(db):
    return UserFactory()


@pytest.fixture
def admin_user(db):
    return AdminUserFactory()


@pytest.fixture
def superuser(db):
    return SuperUserFactory()


def _jwt_client(user):
    """Return an APIClient with a valid Bearer token for *user*."""
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(refresh.access_token)}")
    return client


@pytest.fixture
def customer_client(customer):
    return _jwt_client(customer)


@pytest.fixture
def admin_client(admin_user):
    return _jwt_client(admin_user)


@pytest.fixture
def superuser_client(superuser):
    return _jwt_client(superuser)


@pytest.fixture
def chat_room(db, customer):
    return ChatRoomFactory(customer=customer)


@pytest.fixture
def chat_message(db, chat_room, customer):
    return ChatMessageFactory(room=chat_room, sender=customer)
