from __future__ import annotations

import asyncio
from typing import Any

from fastapi import WebSocket


class Broker:
    """In-memory pub/sub for chat WebSockets, scoped to a single process.

    For multi-instance deploys, swap the internals for Redis pub/sub — but the
    public API (subscribe/unsubscribe/broadcast) stays the same.
    """

    def __init__(self) -> None:
        self._user_subs: dict[int, set[WebSocket]] = {}
        self._admin_subs: set[WebSocket] = set()
        self._lock = asyncio.Lock()

    async def subscribe_user(self, chat_session_id: int, ws: WebSocket) -> None:
        async with self._lock:
            self._user_subs.setdefault(chat_session_id, set()).add(ws)

    async def subscribe_admin(self, ws: WebSocket) -> None:
        async with self._lock:
            self._admin_subs.add(ws)

    async def unsubscribe(self, ws: WebSocket) -> None:
        async with self._lock:
            for subs in self._user_subs.values():
                subs.discard(ws)
            self._admin_subs.discard(ws)

    async def broadcast(self, chat_session_id: int, payload: dict[str, Any]) -> None:
        # Collect targets under lock, send outside lock so a slow client can't
        # block other broadcasts.
        async with self._lock:
            user_targets = list(self._user_subs.get(chat_session_id, ()))
            admin_targets = list(self._admin_subs)

        targets = user_targets + [a for a in admin_targets if a not in user_targets]
        if not targets:
            return

        results = await asyncio.gather(
            *(ws.send_json(payload) for ws in targets),
            return_exceptions=True,
        )
        # Drop sockets that errored so we don't keep trying.
        dead = [ws for ws, res in zip(targets, results) if isinstance(res, BaseException)]
        if dead:
            async with self._lock:
                for ws in dead:
                    for subs in self._user_subs.values():
                        subs.discard(ws)
                    self._admin_subs.discard(ws)


broker = Broker()
