from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

from ..auth.deps import make_current_user_dep
from ..auth.service import User
from .broker import broker
from .service import (
    get_chat_session_by_id,
    get_chat_session_for_user,
    get_or_create_chat_session,
    insert_message,
    list_chat_sessions_for_admin,
    list_messages,
)


router = APIRouter(prefix="/api/chat", tags=["chat"])
current_user = make_current_user_dep()


class MessageOut(BaseModel):
    id: int
    sender: str
    body: str
    created_at: int


class ChatSessionOut(BaseModel):
    id: int
    user_id: int
    handle: str | None = None
    tg_thread_id: int | None = None
    status: str
    last_message_at: int
    last_body: str | None = None


class SendMessageBody(BaseModel):
    body: str = Field(..., min_length=1, max_length=4000)
    chat_session_id: int | None = None


async def _resolve_target_session(user: User, requested_id: int | None) -> int:
    if user.is_admin:
        if requested_id is None:
            raise HTTPException(400, "admin must specify chat_session_id")
        session = await get_chat_session_by_id(requested_id)
        if not session:
            raise HTTPException(404, "chat_session not found")
        return session["id"]
    if requested_id is not None:
        # Non-admin trying to write to someone else's session — disallow even
        # accidentally. Just route them to their own.
        own = await get_or_create_chat_session(user.id)
        if own != requested_id:
            raise HTTPException(403, "not your chat_session")
        return own
    return await get_or_create_chat_session(user.id)


@router.get("/sessions", response_model=list[ChatSessionOut])
async def list_sessions(user: User = Depends(current_user)) -> list[ChatSessionOut]:
    if not user.is_admin:
        raise HTTPException(403, "admin only")
    rows = await list_chat_sessions_for_admin()
    return [ChatSessionOut(**row) for row in rows]


@router.get("/messages", response_model=list[MessageOut])
async def messages(
    user: User = Depends(current_user),
    chat_session_id: int | None = Query(default=None),
    since_id: int | None = Query(default=None),
    limit: int = Query(default=200, ge=1, le=500),
) -> list[MessageOut]:
    target = await _resolve_target_session(user, chat_session_id)
    rows = await list_messages(target, since_id=since_id, limit=limit)
    return [MessageOut(**row) for row in rows]


@router.post("/messages", response_model=MessageOut)
async def send_message(
    payload: SendMessageBody,
    user: User = Depends(current_user),
) -> MessageOut:
    target = await _resolve_target_session(user, payload.chat_session_id)
    sender = "admin" if user.is_admin else "user"
    msg = await insert_message(target, sender, payload.body)

    await broker.broadcast(
        target,
        {
            "type": "message",
            "chat_session_id": target,
            "message": {
                "id": msg["id"],
                "sender": sender,
                "body": msg["body"],
            },
        },
    )

    # Forward outbound messages to Telegram if bridge is wired (no-op otherwise).
    try:
        from ..tg.bot import forward_to_telegram  # local import to avoid hard dep
        await forward_to_telegram(target, sender, msg)
    except Exception:
        pass

    # `created_at` is set by SQLite default; fetch fresh value cheaply.
    from ..db import get_db
    async with get_db().execute(
        "SELECT created_at FROM messages WHERE id = ?", (msg["id"],)
    ) as cur:
        row = await cur.fetchone()

    return MessageOut(
        id=msg["id"],
        sender=sender,
        body=msg["body"],
        created_at=row["created_at"] if row else 0,
    )
