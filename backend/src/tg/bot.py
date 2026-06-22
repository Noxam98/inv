"""Telegram bridge — scaffolded. Wire up once the bot token + group ID are set.

The intended flow:
  user → DB → broker (WebSocket) → forward_to_telegram(...)
  TG admin reply → webhook → handle_update(...) → DB → broker

For now both functions are safe no-ops if `settings.tg_enabled` is False.
"""
from __future__ import annotations

import logging
from typing import Any

import httpx

from ..config import settings
from ..db import get_db, transaction
from ..chat.broker import broker
from ..chat.service import insert_message

log = logging.getLogger(__name__)


async def _tg_api(method: str, payload: dict[str, Any]) -> dict[str, Any]:
    url = f"https://api.telegram.org/bot{settings.tg_bot_token}/{method}"
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.post(url, json=payload)
        data = resp.json()
    if not data.get("ok"):
        raise RuntimeError(f"TG {method} failed: {data}")
    return data["result"]


async def _ensure_thread(chat_session_id: int, user_handle: str) -> int | None:
    """Create a forum topic for this chat session if it doesn't have one yet."""
    if not settings.tg_enabled:
        return None
    conn = get_db()
    async with conn.execute(
        "SELECT tg_thread_id FROM chat_sessions WHERE id = ?", (chat_session_id,)
    ) as cur:
        row = await cur.fetchone()
    if row and row["tg_thread_id"]:
        return row["tg_thread_id"]

    result = await _tg_api(
        "createForumTopic",
        {"chat_id": settings.tg_group_id, "name": user_handle},
    )
    thread_id = result["message_thread_id"]
    async with transaction() as conn:
        await conn.execute(
            "UPDATE chat_sessions SET tg_thread_id = ? WHERE id = ?",
            (thread_id, chat_session_id),
        )
    return thread_id


async def forward_to_telegram(
    chat_session_id: int, sender: str, message: dict[str, Any]
) -> None:
    """Push a freshly-stored message into the corresponding TG topic. No-op
    if the bridge isn't configured. Failures are logged, not raised — the
    user-facing chat must not depend on TG availability."""
    if not settings.tg_enabled:
        return
    if sender != "user":
        # Admin replies originate from TG; no need to echo them back.
        return
    try:
        conn = get_db()
        async with conn.execute(
            "SELECT cs.tg_thread_id, u.handle FROM chat_sessions cs "
            "JOIN users u ON u.id = cs.user_id WHERE cs.id = ?",
            (chat_session_id,),
        ) as cur:
            row = await cur.fetchone()
        if not row:
            return

        thread_id = row["tg_thread_id"]
        if thread_id is None:
            thread_id = await _ensure_thread(chat_session_id, row["handle"])
            if thread_id is None:
                return

        await _tg_api(
            "sendMessage",
            {
                "chat_id": settings.tg_group_id,
                "message_thread_id": thread_id,
                "text": message["body"],
            },
        )
    except Exception:
        log.exception("forward_to_telegram failed for chat_session_id=%s", chat_session_id)


async def handle_update(update: dict[str, Any]) -> None:
    """Inbound update from TG webhook.

    Only handles messages posted into existing forum topics that we know about.
    Admin commands and topic management are TODOs.
    """
    msg = update.get("message")
    if not msg:
        return
    thread_id = msg.get("message_thread_id")
    text = msg.get("text") or msg.get("caption")
    if thread_id is None or not text:
        return

    conn = get_db()
    async with conn.execute(
        "SELECT id FROM chat_sessions WHERE tg_thread_id = ?", (thread_id,)
    ) as cur:
        row = await cur.fetchone()
    if not row:
        return
    chat_session_id = row["id"]

    stored = await insert_message(
        chat_session_id, sender="admin", body=text, tg_message_id=msg.get("message_id")
    )
    await broker.broadcast(
        chat_session_id,
        {
            "type": "message",
            "chat_session_id": chat_session_id,
            "message": {"id": stored["id"], "sender": "admin", "body": text},
        },
    )
