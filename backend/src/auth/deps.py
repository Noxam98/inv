from __future__ import annotations

from fastapi import Cookie, HTTPException, status

from ..config import settings
from .service import User, lookup_session


async def current_user(session: str | None = Cookie(default=None, alias=None)) -> User:
    # Cookie alias is resolved at runtime from settings.session_cookie. We accept
    # the raw cookie via a custom helper below to support a configurable name.
    raise NotImplementedError  # replaced by current_user_factory at app init


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


def make_admin_required_dep(current_dep):
    async def dep(user: User = None):  # type: ignore[assignment]
        # placeholder; real wiring done in routes via Depends(current_dep)
        if user is None or not user.is_admin:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")
        return user

    return dep
