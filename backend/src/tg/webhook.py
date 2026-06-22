from __future__ import annotations

from fastapi import APIRouter, Header, HTTPException, Request

from ..config import settings
from .bot import handle_update


router = APIRouter(prefix="/tg", tags=["telegram"])


@router.post("/webhook")
async def webhook(
    request: Request,
    x_telegram_bot_api_secret_token: str | None = Header(default=None),
) -> dict[str, str]:
    if not settings.tg_enabled:
        raise HTTPException(503, "telegram bridge disabled")
    if settings.tg_webhook_secret and x_telegram_bot_api_secret_token != settings.tg_webhook_secret:
        raise HTTPException(401, "bad secret")

    update = await request.json()
    await handle_update(update)
    return {"ok": "true"}
