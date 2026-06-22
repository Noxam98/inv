from __future__ import annotations

import asyncio
import os
from contextlib import asynccontextmanager
from typing import AsyncIterator

import aiosqlite

from .config import settings


_PRAGMAS = (
    "PRAGMA journal_mode=WAL",
    "PRAGMA synchronous=NORMAL",
    "PRAGMA foreign_keys=ON",
    "PRAGMA busy_timeout=5000",
    "PRAGMA temp_store=MEMORY",
)


_connection: aiosqlite.Connection | None = None
# A single shared aiosqlite connection serializes statements on one worker
# thread, but a transaction is a multi-statement sequence (BEGIN…COMMIT) and
# without external coordination a second coroutine can issue BEGIN IMMEDIATE
# while the first transaction is still open, which SQLite rejects. This
# process-wide write lock pins one transaction at a time.
_write_lock: asyncio.Lock | None = None


async def open_db() -> aiosqlite.Connection:
    """Open the single shared connection used by HTTP and WebSocket handlers."""
    global _connection, _write_lock
    if _connection is not None:
        return _connection

    db_dir = os.path.dirname(os.path.abspath(settings.db_path))
    if db_dir:
        os.makedirs(db_dir, exist_ok=True)

    conn = await aiosqlite.connect(settings.db_path)
    conn.row_factory = aiosqlite.Row
    for pragma in _PRAGMAS:
        await conn.execute(pragma)
    await conn.commit()
    _connection = conn
    _write_lock = asyncio.Lock()
    return conn


async def close_db() -> None:
    global _connection, _write_lock
    if _connection is not None:
        await _connection.close()
        _connection = None
    _write_lock = None


def get_db() -> aiosqlite.Connection:
    if _connection is None:
        raise RuntimeError("DB not opened. Did lifespan run?")
    return _connection


@asynccontextmanager
async def transaction() -> AsyncIterator[aiosqlite.Connection]:
    """Short-lived write transaction. Holds the process-wide write lock to
    prevent overlapping BEGIN IMMEDIATE on the shared connection."""
    conn = get_db()
    if _write_lock is None:
        raise RuntimeError("DB not opened. Did lifespan run?")
    async with _write_lock:
        try:
            await conn.execute("BEGIN IMMEDIATE")
            yield conn
            await conn.commit()
        except Exception:
            await conn.rollback()
            raise
