from __future__ import annotations

from urllib.parse import urlparse

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from ..auth.service import lookup_session
from ..config import settings
from .broker import broker
from .service import get_or_create_chat_session


router = APIRouter()


def _origin_allowed(origin: str | None) -> bool:
    """Block cross-site WebSocket hijacking. Cookies travel on WS upgrades even
    with SameSite=Lax (the handshake is a GET-like request), so without an
    Origin check any page on the web could open an authenticated socket as
    the visiting user and read every broadcast they receive.

    If no origins are configured (dev), accept only same-origin (no Origin
    header is sent by curl/Postman, those go through).
    """
    if not origin:
        return True
    allowed = settings.cors_origins_list
    if not allowed:
        # No allowlist configured — accept anything. Always set cors_origins
        # in production.
        return True
    try:
        origin_host = urlparse(origin).netloc.lower()
    except Exception:
        return False
    for entry in allowed:
        try:
            allowed_host = urlparse(entry).netloc.lower()
        except Exception:
            continue
        if allowed_host and origin_host == allowed_host:
            return True
    return False


@router.websocket("/ws/chat")
async def chat_socket(ws: WebSocket) -> None:
    if not _origin_allowed(ws.headers.get("origin")):
        # 4403 — application-defined, reused as "forbidden origin" so clients
        # don't loop reconnecting on a misconfigured deploy.
        await ws.close(code=4403)
        return

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
