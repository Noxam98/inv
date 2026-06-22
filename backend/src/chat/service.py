from __future__ import annotations

from typing import Any

from ..db import get_db, transaction


async def get_or_create_chat_session(user_id: int) -> int:
    conn = get_db()
    async with conn.execute(
        "SELECT id FROM chat_sessions WHERE user_id = ?", (user_id,)
    ) as cur:
        row = await cur.fetchone()
    if row:
        return row["id"]

    async with transaction() as conn:
        cur = await conn.execute(
            "INSERT INTO chat_sessions(user_id) VALUES (?)", (user_id,)
        )
        return cur.lastrowid


async def get_chat_session_for_user(user_id: int) -> dict[str, Any] | None:
    conn = get_db()
    async with conn.execute(
        "SELECT id, user_id, tg_thread_id, status, last_message_at "
        "FROM chat_sessions WHERE user_id = ?",
        (user_id,),
    ) as cur:
        row = await cur.fetchone()
    return dict(row) if row else None


async def get_chat_session_by_id(chat_session_id: int) -> dict[str, Any] | None:
    conn = get_db()
    async with conn.execute(
        "SELECT id, user_id, tg_thread_id, status, last_message_at "
        "FROM chat_sessions WHERE id = ?",
        (chat_session_id,),
    ) as cur:
        row = await cur.fetchone()
    return dict(row) if row else None


async def list_chat_sessions_for_admin(limit: int = 100) -> list[dict[str, Any]]:
    conn = get_db()
    async with conn.execute(
        """
        SELECT cs.id, cs.user_id, u.handle, cs.tg_thread_id, cs.status,
               cs.last_message_at, cs.created_at,
               (SELECT body FROM messages
                  WHERE chat_session_id = cs.id
                  ORDER BY id DESC LIMIT 1) AS last_body
        FROM chat_sessions cs
        JOIN users u ON u.id = cs.user_id
        ORDER BY cs.last_message_at DESC
        LIMIT ?
        """,
        (limit,),
    ) as cur:
        rows = await cur.fetchall()
    return [dict(r) for r in rows]


async def insert_message(
    chat_session_id: int,
    sender: str,
    body: str,
    tg_message_id: int | None = None,
) -> dict[str, Any]:
    assert sender in ("user", "admin", "system")
    async with transaction() as conn:
        cur = await conn.execute(
            "INSERT INTO messages(chat_session_id, sender, body, tg_message_id) "
            "VALUES (?, ?, ?, ?)",
            (chat_session_id, sender, body, tg_message_id),
        )
        message_id = cur.lastrowid
        await conn.execute(
            "UPDATE chat_sessions SET last_message_at = unixepoch() WHERE id = ?",
            (chat_session_id,),
        )

    return {
        "id": message_id,
        "chat_session_id": chat_session_id,
        "sender": sender,
        "body": body,
        "tg_message_id": tg_message_id,
    }


async def list_messages(
    chat_session_id: int, since_id: int | None = None, limit: int = 200
) -> list[dict[str, Any]]:
    conn = get_db()
    if since_id is not None:
        async with conn.execute(
            "SELECT id, sender, body, created_at FROM messages "
            "WHERE chat_session_id = ? AND id > ? ORDER BY id ASC LIMIT ?",
            (chat_session_id, since_id, limit),
        ) as cur:
            rows = await cur.fetchall()
    else:
        async with conn.execute(
            "SELECT id, sender, body, created_at FROM messages "
            "WHERE chat_session_id = ? ORDER BY id DESC LIMIT ?",
            (chat_session_id, limit),
        ) as cur:
            rows = list(await cur.fetchall())
            rows.reverse()
    return [dict(r) for r in rows]
