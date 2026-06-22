from __future__ import annotations

import os
from pathlib import Path

from ..db import get_db


MIGRATIONS_DIR = Path(__file__).parent


async def _ensure_migrations_table() -> None:
    conn = get_db()
    await conn.execute(
        """
        CREATE TABLE IF NOT EXISTS _migrations (
            name        TEXT PRIMARY KEY,
            applied_at  INTEGER NOT NULL DEFAULT (unixepoch())
        )
        """
    )
    await conn.commit()


async def _applied() -> set[str]:
    conn = get_db()
    async with conn.execute("SELECT name FROM _migrations") as cur:
        rows = await cur.fetchall()
    return {row["name"] for row in rows}


async def apply_pending() -> list[str]:
    """Run all migrations under this directory in name order. Idempotent."""
    await _ensure_migrations_table()
    done = await _applied()

    sql_files = sorted(p for p in MIGRATIONS_DIR.iterdir() if p.suffix == ".sql")
    applied = []
    conn = get_db()
    for path in sql_files:
        if path.name in done:
            continue
        sql = path.read_text(encoding="utf-8")
        await conn.executescript(sql)
        await conn.execute("INSERT INTO _migrations(name) VALUES (?)", (path.name,))
        await conn.commit()
        applied.append(path.name)
    return applied
