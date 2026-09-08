from functools import lru_cache
from typing import Annotated, Literal

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    environment: Literal["development", "test", "production"] = "development"
    openai_api_key: str = ""
    openai_chat_model: str = "gpt-6-astra"
    openai_embedding_model: str = "text-embedding-3-small"
    qdrant_url: str = ""
    qdrant_api_key: str = ""
    qdrant_collection: str = "portfolio_knowledge"
    session_secret: str = "development-only-change-this-secret"
    cors_origins: Annotated[list[str], NoDecode] = Field(default_factory=lambda: ["http://localhost:8080", "http://localhost:5173"])
    public_site_url: str = "https://tsinjona.netlify.app"
    session_ttl_minutes: int = Field(default=30, ge=5, le=60)
    ip_rate_limit_per_minute: int = Field(default=15, ge=1, le=100)
    session_rate_limit_per_hour: int = Field(default=60, ge=1, le=500)
    max_input_chars: int = Field(default=800, ge=100, le=2000)
    max_output_tokens: int = Field(default=700, ge=100, le=2000)
    retrieval_limit: int = Field(default=5, ge=1, le=10)
    retrieval_score_threshold: float = Field(default=0.25, ge=0, le=1)

    @field_validator("cors_origins", mode="before")
    @classmethod
    def split_origins(cls, value):
        if isinstance(value, str):
            return [item.strip().rstrip("/") for item in value.split(",") if item.strip()]
        return value

    @model_validator(mode="after")
    def validate_security(self):
        if "*" in self.cors_origins:
            raise ValueError("CORS_ORIGINS must be an explicit allowlist")
        if self.environment == "production" and (len(self.session_secret) < 32 or self.session_secret == "development-only-change-this-secret"):
            raise ValueError("SESSION_SECRET must be a non-default value with at least 32 characters in production")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
