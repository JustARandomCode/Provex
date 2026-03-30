# app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",       # ← add this line, ignores unknown env vars
    )

    # App
    app_name: str = "ProVex"
    app_env: str = "development"
    cors_origins: List[str] = ["http://localhost:3000"]

    # Database
    database_url: str

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # JWT
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 10080

    # AI (used in Phase 2)
    ollama_base_url: str = "http://localhost:11434"
    qwen_model: str = "qwen2.5-coder:7b"
    llama_model: str = "llama3.1:8b"
    qdrant_url: str = "http://localhost:6333"

    # Compiler
    online_compiler_api_key: str = ""

    @property
    def is_development(self) -> bool:
        return self.app_env == "development"


settings = Settings()