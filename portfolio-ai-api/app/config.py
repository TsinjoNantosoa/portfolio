from functools import lru_cache
from typing import Annotated, Literal

from pydantic import AliasChoices, Field, field_validator, model_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    environment: Literal["development", "test", "production"] = "development"
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"
    openai_embedding_model: str = "text-embedding-3-small"
    openai_timeout_seconds: float = Field(default=60, ge=10, le=120)
    qdrant_url: str = ""
    qdrant_api_key: str = ""
    qdrant_collection: str = "portfolio_knowledge"
    session_secret: str = "development-only-change-this-secret"
    allowed_origins: Annotated[list[str], NoDecode] = Field(
        default_factory=lambda: [
            "http://localhost:8080",
            "http://127.0.0.1:8080",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:4173",
            "http://127.0.0.1:4173",
        ]
    )
    public_site_url: str = "https://tsinjona.netlify.app"
    trust_proxy_headers: bool = False
    trusted_proxy_provider: Literal["none", "render"] = "none"
    session_ttl_minutes: int = Field(default=30, ge=5, le=60)
    ip_rate_limit_per_minute: int = Field(default=15, ge=1, le=100)
    session_rate_limit_per_hour: int = Field(default=60, ge=1, le=500)
    max_input_chars: int = Field(default=800, ge=100, le=2000)
    openai_max_output_tokens: int = Field(
        default=450,
        ge=100,
        le=1000,
        validation_alias=AliasChoices(
            "OPENAI_MAX_OUTPUT_TOKENS",
            "MAX_OUTPUT_TOKENS",
        ),
    )
    rag_top_k: int = Field(
        default=4,
        ge=1,
        le=8,
        validation_alias=AliasChoices("RAG_TOP_K", "RETRIEVAL_LIMIT"),
    )
    retrieval_score_threshold: float = Field(default=0.20, ge=0, le=1)
    playground_enabled: bool = False
    playground_max_input_chars: int = Field(default=400, ge=100, le=800)
    playground_session_rate_limit_per_hour: int = Field(default=12, ge=1, le=60)
    playground_ip_rate_limit_per_hour: int = Field(default=24, ge=1, le=200)
    playground_global_rate_limit_per_hour: int = Field(default=120, ge=1, le=1000)
    playground_max_concurrent_requests: int = Field(default=2, ge=1, le=10)
    playground_max_output_tokens: int = Field(default=300, ge=100, le=600)
    playground_instance_count: int = Field(default=1, ge=1, le=20)
    playground_request_timeout_seconds: float = Field(default=70, ge=0.01, le=120)
    corpus_readiness_ttl_seconds: float = Field(default=60, ge=0, le=300)
    operations_monitor_enabled: bool = False
    operations_retention_hours: int = Field(default=24, ge=1, le=168)
    operations_max_events: int = Field(default=5000, ge=100, le=50000)
    operations_stale_after_minutes: int = Field(default=15, ge=1, le=1440)
    operations_cache_seconds: int = Field(default=30, ge=0, le=300)
    operations_rate_limit_per_minute: int = Field(default=30, ge=1, le=120)

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def split_origins(cls, value):
        if isinstance(value, str):
            return [
                item.strip().rstrip("/") for item in value.split(",") if item.strip()
            ]
        return value

    @model_validator(mode="after")
    def validate_security(self):
        if "*" in self.allowed_origins:
            raise ValueError("ALLOWED_ORIGINS must be an explicit allowlist")
        if self.environment == "production" and (
            len(self.session_secret) < 32
            or self.session_secret == "development-only-change-this-secret"  # nosec B105
        ):
            raise ValueError(
                "SESSION_SECRET must be a non-default value with at least 32 characters in production"
            )
        if (
            self.environment == "production"
            and self.public_site_url.rstrip("/") not in self.allowed_origins
        ):
            raise ValueError(
                "PUBLIC_SITE_URL must be included in ALLOWED_ORIGINS in production"
            )
        if (
            self.environment == "production"
            and self.trust_proxy_headers
            and self.trusted_proxy_provider != "render"
        ):
            raise ValueError(
                "Production proxy trust requires TRUSTED_PROXY_PROVIDER=render"
            )
        if (
            self.environment == "production"
            and self.playground_enabled
            and self.playground_instance_count != 1
        ):
            raise ValueError(
                "The Playground uses process-local limits and must remain single-instance "
                "until a shared atomic rate limiter is configured"
            )
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
