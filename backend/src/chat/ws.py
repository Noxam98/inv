from __future__ import annotations

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from ..auth.service import lookup_session
from ..config import settings
from .broker import broker
from .service import get_or_create_chat_session


router = APIRouter()


@router.websocket("/ws/chat")
async def chat_socket(ws: WebSocket) -> None:
    # Authenticate via session cookie. Browsers send cookies on WS upgrade for
    # same-origin requests.
    token = ws.cookies.get(settings.session_cookie)
    user = await lookup_session(token) if token else None
    if user is None:
        await ws.close(code=4401)
        return

    await ws.accept()
    try:
        if user.is_admin:
            await broker.subscribe_admin(ws)
            await ws.send_json({"type": "ready", "role": "admin"})
        else:
            chat_session_id = await get_or_create_chat_session(user.id)
            await broker.subscribe_user(chat_session_id, ws)
            await ws.send_json({"type": "ready", "role": "user", "chat_session_id": chat_session_id})

        while True:
            # We don't need to receive anything; the client posts messages via
            # REST. But we still drain incoming frames so the socket health is
            # tracked correctly.
            await ws.receive_text()
    except WebSocketDisconnect:
        pass
    finally:
        await broker.unsubscribe(ws)
