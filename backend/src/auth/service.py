from __future__ import annotations

import secrets
import string
import time
from dataclasses import dataclass

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

from ..config import settings
from ..db import get_db, transaction


_HANDLE_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789"
_PASSWORD_ALPHABET = string.ascii_letters + string.digits


# Argon2id with reasonable defaults. Tunable if needed.
_hasher = PasswordHasher()


@dataclass(slots=True)
class User:
    id: int
    handle: string
    is_admin: bool


def generate_handle(prefix: str = "usr_", length: int = 8) -> str:
    return prefix + "".join(secrets.choice(_HANDLE_ALPHABET) for _ in range(length))


def generate_password(length: int = 20) -> str:
    return "".join(secrets.choice(_PASSWORD_ALPHABET) for _ in range(length))


def format_code(handle: str, password: str) -> str:
    return f"{handle}.{password}"


def parse_code(code: str) -> tuple[str, str] | None:
    code = (code or "").strip()
    dot = code.find(".")
    if dot <= 0 or dot == len(code) - 1:
        return None
    return code[:dot].lower(), code[dot + 1:]


def hash_password(password: str) -> str:
    return _hasher.hash(password)


def verify_password(password_hash: str, password: str) -> bool:
    try:
        return _hasher.verify(password_hash, password)
    except VerifyMismatchError:
        return False


async def create_user(handle: str, password_plain: str, is_admin: bool = False) -> int:
    pwd_hash = hash_password(password_plain)
    async with transaction() as conn:
        cursor = await conn.execute(
            "INSERT INTO users(handle, password_hash, is_admin) VALUES (?, ?, ?)",
            (handle.lower(), pwd_hash, 1 if is_admin else 0),
        )
        user_id = cursor.lastrowid
        await conn.execute(
            "INSERT INTO chat_sessions(user_id) VALUES (?)",
            (user_id,),
        )
    return user_id


async def register_anonymous() -> tuple[str, str, int]:
    """Allocate a fresh user. Returns (handle, password, user_id)."""
    for _ in range(8):
        handle = generate_handle()
        password = generate_password()
        try:
            user_id = await create_user(handle, password)
            return handle, password, user_id
        except Exception as exc:
            if "UNIQUE" in str(exc) and "users.handle" in str(exc):
                continue
            raise
    raise RuntimeError("Could not allocate a unique handle after 8 attempts")


async def find_user_by_handle(handle: str) -> tuple[int, str, bool] | None:
    conn = get_db()
    async with conn.execute(
        "SELECT id, password_hash, is_admin FROM users WHERE handle = ?",
        (handle.lower(),),
    ) as cur:
        row = await cur.fetchone()
    if row is None:
        return None
    return row["id"], row["password_hash"], bool(row["is_admin"])


async def find_user_by_id(user_id: int) -> User | None:
    conn = get_db()
    async with conn.execute(
        "SELECT id, handle, is_admin FROM users WHERE id = ?",
        (user_id,),
    ) as cur:
        row = await cur.fetchone()
    if row is None:
        return None
    return User(id=row["id"], handle=row["handle"], is_admin=bool(row["is_admin"]))


async def create_session(user_id: int) -> str:
    token = secrets.token_urlsafe(32)
    expires_at = int(time.time()) + settings.session_ttl
    async with transaction() as conn:
        await conn.execute(
            "INSERT INTO sessions(token, user_id, expires_at) VALUES (?, ?, ?)",
            (token, user_id, expires_at),
        )
        await conn.execute(
            "UPDATE users SET last_seen_at = unixepoch() WHERE id = ?",
            (user_id,),
        )
    return token


async def lookup_session(token: str) -> User | None:
    if not token:
        return None
    conn = get_db()
    now = int(time.time())
    async with conn.execute(
        """
        SELECT u.id, u.handle, u.is_admin
        FROM sessions s
        JOIN users u ON u.id = s.user_id
        WHERE s.token = ? AND s.expires_at > ?
        """,
        (token, now),
    ) as cur:
        row = await cur.fetchone()
    if row is None:
        return None
    return User(id=row["id"], handle=row["handle"], is_admin=bool(row["is_admin"]))


async def delete_session(token: str) -> None:
    async with transaction() as conn:
        await conn.execute("DELETE FROM sessions WHERE token = ?", (token,))


async def purge_expired_sessions() -> int:
    now = int(time.time())
    async with transaction() as conn:
        cur = await conn.execute("DELETE FROM sessions WHERE expires_at <= ?", (now,))
        return cur.rowcount or 0
