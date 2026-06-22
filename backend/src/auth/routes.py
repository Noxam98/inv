from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel, Field

from ..config import settings
from .deps import make_current_user_dep, make_session_token_dep
from .service import (
    User,
    create_session,
    delete_session,
    find_user_by_handle,
    find_user_by_id,
    format_code,
    parse_code,
    register_anonymous,
    verify_password,
)


router = APIRouter(prefix="/api/auth", tags=["auth"])
current_user = make_current_user_dep()
current_session_token = make_session_token_dep()


class RegisterResponse(BaseModel):
    handle: str
    password: str
    code: str
    user: "UserOut"


class UserOut(BaseModel):
    handle: str
    is_admin: bool


class LoginRequest(BaseModel):
    code: str | None = None
    handle: str | None = None
    password: str | None = None


def _set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=settings.session_cookie,
        value=token,
        max_age=settings.session_ttl,
        httponly=True,
        secure=settings.cookie_secure,
        samesite="lax",
        path="/",
    )


def _clear_session_cookie(response: Response) -> None:
    response.delete_cookie(
        key=settings.session_cookie,
        path="/",
        secure=settings.cookie_secure,
        samesite="lax",
        httponly=True,
    )


@router.post("/register", response_model=RegisterResponse)
async def register(response: Response) -> RegisterResponse:
    handle, password, user_id = await register_anonymous()
    token = await create_session(user_id)
    _set_session_cookie(response, token)
    user = await find_user_by_id(user_id)
    assert user is not None
    return RegisterResponse(
        handle=handle,
        password=password,
        code=format_code(handle, password),
        user=UserOut(handle=user.handle, is_admin=user.is_admin),
    )


@router.post("/login", response_model=UserOut)
async def login(req: LoginRequest, response: Response) -> UserOut:
    handle: str | None
    password: str | None
    if req.code:
        parsed = parse_code(req.code)
        if not parsed:
            raise HTTPException(status_code=400, detail="Invalid code format")
        handle, password = parsed
    elif req.handle and req.password:
        handle, password = req.handle.lower(), req.password
    else:
        raise HTTPException(status_code=400, detail="Missing credentials")

    found = await find_user_by_handle(handle)
    if not found:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user_id, pwd_hash, is_admin = found

    if not verify_password(pwd_hash, password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = await create_session(user_id)
    _set_session_cookie(response, token)
    return UserOut(handle=handle, is_admin=is_admin)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    response: Response,
    token: str | None = Depends(current_session_token),
) -> Response:
    # Invalidate the server-side session so a stolen cookie can't be replayed
    # until TTL. Tolerate missing/invalid tokens — logout should always succeed
    # from the client's perspective.
    if token:
        await delete_session(token)
    _clear_session_cookie(response)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/me", response_model=UserOut)
async def me(user: User = Depends(current_user)) -> UserOut:
    return UserOut(handle=user.handle, is_admin=user.is_admin)


RegisterResponse.model_rebuild()
