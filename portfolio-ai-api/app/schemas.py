from pydantic import BaseModel, Field, field_validator


class ChatRequest(BaseModel):
    message: str = Field(min_length=1)
    conversation_id: str | None = Field(default=None, max_length=100)

    @field_validator("message")
    @classmethod
    def clean_message(cls, value: str):
        value = " ".join(value.strip().split())
        if not value:
            raise ValueError("Message cannot be empty")
        return value


class SessionResponse(BaseModel):
    token: str
    expires_at: str
    session_id: str


class Source(BaseModel):
    title: str
    url: str
    section: str | None = None


class KnowledgeChunk(BaseModel):
    id: str
    type: str
    slug: str
    title: str
    section: str
    url: str
    content: str
    score: float = 0
