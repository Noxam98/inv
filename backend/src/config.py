from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    db_path: str = "./data/inds.db"

    session_cookie: str = "inds_session"
    session_ttl: int = 60 * 60 * 24 * 30  # 30 days
    cookie_secure: bool = False

    cors_origins: str = ""

    tg_bot_token: str = ""
    tg_group_id: str = ""
    tg_webhook_secret: str = ""

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def tg_enabled(self) -> bool:
        return bool(self.tg_bot_token and self.tg_group_id)


settings = Settings()
