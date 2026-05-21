import json
import pytest
from channels.testing import WebsocketCommunicator
from channels.layers import get_channel_layer
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

from chat.consumers import ChatConsumer
from chat.models import ChatRoom, ChatMessage
from .conftest import ChatRoomFactory, UserFactory, AdminUserFactory

User = get_user_model()

pytestmark = [pytest.mark.django_db(transaction=True), pytest.mark.asyncio]


# ─── Helpers ──────────────────────────────────────────────────────────────────


def _access_token(user) -> str:
    return str(RefreshToken.for_user(user).access_token)


async def _connect(room_id, token: str | None = None, expect_connected: bool = True):
    """
    Build a WebsocketCommunicator for a given room and optional token.
    Returns the communicator (connected or not).
    """
    url = f"/ws/chat/{room_id}/"
    if token:
        url += f"?token={token}"

    app = ChatConsumer.as_asgi()
    communicator = WebsocketCommunicator(app, url)
    connected, code = await communicator.connect()
    assert (
        connected == expect_connected
    ), f"Expected connected={expect_connected}, got code={code}"
    return communicator


# ─── Connection auth ──────────────────────────────────────────────────────────


class TestWebSocketConnection:

    async def test_unauthenticated_connection_is_rejected(self, db):
        room = await pytest.asyncio.get_event_loop().run_in_executor(
            None, ChatRoomFactory
        )
        communicator = WebsocketCommunicator(
            ChatConsumer.as_asgi(), f"/ws/chat/{room.pk}/"
        )
        connected, code = await communicator.connect()
        assert connected is False
        assert code == 4001

    async def test_invalid_token_is_rejected(self, db):
        room = await pytest.asyncio.get_event_loop().run_in_executor(
            None, ChatRoomFactory
        )
        communicator = WebsocketCommunicator(
            ChatConsumer.as_asgi(),
            f"/ws/chat/{room.pk}/?token=not-a-real-jwt",
        )
        connected, code = await communicator.connect()
        assert connected is False
        assert code == 4001

    async def test_customer_can_connect_to_own_room(self, db):
        from asgiref.sync import sync_to_async

        customer = await sync_to_async(UserFactory)()
        room = await sync_to_async(ChatRoomFactory)(customer=customer)
        token = _access_token(customer)
        communicator = await _connect(room.pk, token)
        await communicator.disconnect()

    async def test_customer_cannot_connect_to_others_room(self, db):
        from asgiref.sync import sync_to_async

        customer = await sync_to_async(UserFactory)()
        other = await sync_to_async(UserFactory)()
        room = await sync_to_async(ChatRoomFactory)(customer=other)
        communicator = WebsocketCommunicator(
            ChatConsumer.as_asgi(),
            f"/ws/chat/{room.pk}/?token={_access_token(customer)}",
        )
        connected, code = await communicator.connect()
        assert connected is False
        assert code == 4003

    async def test_agent_can_connect_to_any_room(self, db):
        from asgiref.sync import sync_to_async

        agent = await sync_to_async(AdminUserFactory)()
        room = await sync_to_async(ChatRoomFactory)()
        communicator = await _connect(room.pk, _access_token(agent))
        await communicator.disconnect()

    async def test_connection_to_nonexistent_room_is_rejected(self, db):
        from asgiref.sync import sync_to_async
        import uuid

        customer = await sync_to_async(UserFactory)()
        fake_id = uuid.uuid4()
        communicator = WebsocketCommunicator(
            ChatConsumer.as_asgi(),
            f"/ws/chat/{fake_id}/?token={_access_token(customer)}",
        )
        connected, code = await communicator.connect()
        assert connected is False


# ─── Sending messages ─────────────────────────────────────────────────────────


class TestSendMessage:

    async def test_sent_message_is_broadcast_back(self, db):
        from asgiref.sync import sync_to_async

        customer = await sync_to_async(UserFactory)()
        room = await sync_to_async(ChatRoomFactory)(customer=customer)
        communicator = await _connect(room.pk, _access_token(customer))

        await communicator.send_json_to({"type": "chat_message", "content": "Hello!"})
        response = await communicator.receive_json_from(timeout=5)

        assert response["type"] == "chat_message"
        assert response["content"] == "Hello!"
        assert response["sender_id"] == customer.pk
        await communicator.disconnect()

    async def test_sent_message_is_persisted(self, db):
        from asgiref.sync import sync_to_async

        customer = await sync_to_async(UserFactory)()
        room = await sync_to_async(ChatRoomFactory)(customer=customer)
        communicator = await _connect(room.pk, _access_token(customer))

        await communicator.send_json_to(
            {"type": "chat_message", "content": "Persisted?"}
        )
        await communicator.receive_json_from(timeout=5)

        count = await sync_to_async(
            ChatMessage.objects.filter(room=room, content="Persisted?").count
        )()
        assert count == 1
        await communicator.disconnect()

    async def test_message_received_by_second_connected_client(self, db):
        from asgiref.sync import sync_to_async

        customer = await sync_to_async(UserFactory)()
        agent = await sync_to_async(AdminUserFactory)()
        room = await sync_to_async(ChatRoomFactory)(customer=customer)

        c1 = await _connect(room.pk, _access_token(customer))
        c2 = await _connect(room.pk, _access_token(agent))

        await c1.send_json_to({"type": "chat_message", "content": "For both!"})

        r1 = await c1.receive_json_from(timeout=5)
        r2 = await c2.receive_json_from(timeout=5)
        assert r1["content"] == "For both!"
        assert r2["content"] == "For both!"

        await c1.disconnect()
        await c2.disconnect()

    async def test_empty_message_returns_error(self, db):
        from asgiref.sync import sync_to_async

        customer = await sync_to_async(UserFactory)()
        room = await sync_to_async(ChatRoomFactory)(customer=customer)
        communicator = await _connect(room.pk, _access_token(customer))

        await communicator.send_json_to({"type": "chat_message", "content": "  "})
        response = await communicator.receive_json_from(timeout=5)
        assert response["type"] == "error"
        await communicator.disconnect()

    async def test_oversized_message_returns_error(self, db):
        from asgiref.sync import sync_to_async

        customer = await sync_to_async(UserFactory)()
        room = await sync_to_async(ChatRoomFactory)(customer=customer)
        communicator = await _connect(room.pk, _access_token(customer))

        big_content = "x" * 5_000
        await communicator.send_json_to(
            {"type": "chat_message", "content": big_content}
        )
        response = await communicator.receive_json_from(timeout=5)
        assert response["type"] == "error"
        await communicator.disconnect()

    async def test_invalid_json_returns_error(self, db):
        from asgiref.sync import sync_to_async

        customer = await sync_to_async(UserFactory)()
        room = await sync_to_async(ChatRoomFactory)(customer=customer)
        communicator = await _connect(room.pk, _access_token(customer))

        await communicator.send_to(text_data="this is not json {{")
        response = await communicator.receive_json_from(timeout=5)
        assert response["type"] == "error"
        await communicator.disconnect()

    async def test_unknown_message_type_returns_error(self, db):
        from asgiref.sync import sync_to_async

        customer = await sync_to_async(UserFactory)()
        room = await sync_to_async(ChatRoomFactory)(customer=customer)
        communicator = await _connect(room.pk, _access_token(customer))

        await communicator.send_json_to({"type": "unknown_type", "data": "x"})
        response = await communicator.receive_json_from(timeout=5)
        assert response["type"] == "error"
        await communicator.disconnect()


# ─── Typing indicators ────────────────────────────────────────────────────────


class TestTypingIndicator:

    async def test_typing_forwarded_to_other_client(self, db):
        from asgiref.sync import sync_to_async

        customer = await sync_to_async(UserFactory)()
        agent = await sync_to_async(AdminUserFactory)()
        room = await sync_to_async(ChatRoomFactory)(customer=customer)

        c_customer = await _connect(room.pk, _access_token(customer))
        c_agent = await _connect(room.pk, _access_token(agent))

        await c_customer.send_json_to({"type": "typing", "is_typing": True})
        response = await c_agent.receive_json_from(timeout=5)

        assert response["type"] == "typing"
        assert response["is_typing"] is True
        assert response["sender_id"] == customer.pk

        await c_customer.disconnect()
        await c_agent.disconnect()

    async def test_typing_not_echoed_back_to_sender(self, db):
        from asgiref.sync import sync_to_async

        customer = await sync_to_async(UserFactory)()
        room = await sync_to_async(ChatRoomFactory)(customer=customer)
        communicator = await _connect(room.pk, _access_token(customer))

        await communicator.send_json_to({"type": "typing", "is_typing": True})
        # No message should come back to the sender — timeout means nothing received
        assert await communicator.receive_nothing(timeout=1) is True
        await communicator.disconnect()


# ─── Auto-assign agent ────────────────────────────────────────────────────────


class TestAgentAutoAssign:

    async def test_agent_is_auto_assigned_on_first_reply(self, db):
        from asgiref.sync import sync_to_async

        customer = await sync_to_async(UserFactory)()
        agent = await sync_to_async(AdminUserFactory)()
        room = await sync_to_async(ChatRoomFactory)(customer=customer, status="open")
        assert room.agent is None

        c_agent = await _connect(room.pk, _access_token(agent))
        await c_agent.send_json_to(
            {"type": "chat_message", "content": "Hi, I'm here to help!"}
        )
        await c_agent.receive_json_from(timeout=5)

        await sync_to_async(room.refresh_from_db)()
        assert room.agent_id == agent.pk
        assert room.status == "assigned"
        await c_agent.disconnect()
