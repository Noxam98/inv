"""One-off operations runnable via `python -m src.cli <command>`."""
from __future__ import annotations

import asyncio
import sys

from .db import close_db, get_db, open_db
from .auth.service import (
    create_user,
    generate_handle,
    generate_password,
)
from .migrations.runner import apply_pending


async def _create_admin() -> None:
    await open_db()
    await apply_pending()

    conn = get_db()
    async with conn.execute(
        "SELECT handle FROM users WHERE is_admin = 1 LIMIT 1"
    ) as cur:
        row = await cur.fetchone()
    if row:
        print(f"Admin already exists: handle={row['handle']}")
        return

    handle = generate_handle(prefix="adm_")
    password = generate_password()
    await create_user(handle, password, is_admin=True)

    print()
    print("=== ADMIN CREATED — SAVE THESE NOW ===")
    print(f"handle:   {handle}")
    print(f"password: {password}")
    print(f"code:     {handle}.{password}")
    print("=== Cannot be recovered if lost ===")
    print()


async def _migrate() -> None:
    await open_db()
    applied = await apply_pending()
    if applied:
        print("Applied:", ", ".join(applied))
    else:
        print("Nothing to apply.")


COMMANDS = {
    "create-admin": _create_admin,
    "migrate": _migrate,
}


async def main(argv: list[str]) -> int:
    if len(argv) < 2 or argv[1] not in COMMANDS:
        print(f"Usage: python -m src.cli [{' | '.join(COMMANDS)}]")
        return 1
    try:
        await COMMANDS[argv[1]]()
    finally:
        await close_db()
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main(sys.argv)))
