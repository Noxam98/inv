from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .db import close_db, open_db
from .migrations.runner import apply_pending
from .auth.routes import router as auth_router
from .chat.routes import router as chat_router
from .chat.ws import router as ws_router
from .tg.webhook import router as tg_router


logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
log = logging.getLogger("inds")


@asynccontextmanager
async def lifespan(app: FastAPI):
    await open_db()
    applied = await apply_pending()
    if applied:
        log.info("Applied migrations: %s", ", ".join(applied))
    yield
    await close_db()


app = FastAPI(title="INDS backend", lifespan=lifespan)

if settings.cors_origins_list:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(ws_router)
app.include_router(tg_router)


@app.get("/healthz")
async def healthz() -> dict[str, str]:
    return {"status": "ok"}
