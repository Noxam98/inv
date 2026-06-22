from __future__ import annotations

from fastapi import Cookie, HTTPException, status

from ..config import settings
from .service import User, lookup_session


async def _resolve_user(token: str | None) -> User | None:
    if not token:
        return None
    return await lookup_session(token)


def make_current_user_dep():
    cookie_name = settings.session_cookie

    async def dep(request_cookie: str | None = Cookie(default=None, alias=cookie_name)) -> User:
        user = await _resolve_user(request_cookie)
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
        return user

    return dep


def make_optional_current_user_dep():
    cookie_name = settings.session_cookie

    async def dep(request_cookie: str | None = Cookie(default=None, alias=cookie_name)) -> User | None:
        return await _resolve_user(request_cookie)

    return dep


def make_session_token_dep():
    """Returns the raw cookie value (or None). Used by logout to invalidate the
    server-side session row before clearing the cookie."""
    cookie_name = settings.session_cookie

    async def dep(request_cookie: str | None = Cookie(default=None, alias=cookie_name)) -> str | None:
        return request_cookie

    return dep
