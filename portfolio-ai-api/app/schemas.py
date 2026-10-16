from typing import Literal

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


PlaygroundCorpus = Literal["projects", "engineering_lab"]


class PlaygroundRequest(BaseModel):
    message: str = Field(min_length=1, max_length=400)
    corpus: PlaygroundCorpus
    conversation_id: str | None = Field(default=None, max_length=100)

    @field_validator("message")
    @classmethod
    def clean_message(cls, value: str):
        value = " ".join(value.strip().split())
        if not value:
            raise ValueError("Message cannot be empty")
        return value


class PlaygroundEvidence(BaseModel):
    id: str
    rank: int
    title: str
    section: str
    url: str
    excerpt: str
    score: float


class PlaygroundTraceStep(BaseModel):
    id: Literal[
        "query",
        "processing",
        "retrieval",
        "context",
        "generation",
        "answer",
        "citations",
    ]
    status: Literal["completed", "skipped", "error"]
    detail: str
    duration_ms: float | None = None


class PlaygroundResponse(BaseModel):
    answer: str
    corpus: PlaygroundCorpus
    execution_mode: Literal["live", "guarded", "no_evidence"]
    generated_from_retrieved_documents: bool
    citations_available: bool
    support_status: Literal["not_evaluated", "not_applicable"]
    refusal_reason: Literal[
        "prompt_injection", "sensitive_request", "out_of_scope", "no_evidence"
    ] | None = None
    evidence: list[PlaygroundEvidence] = Field(default_factory=list)
    trace: list[PlaygroundTraceStep]
    retrieval_strategy: str
    selected_passages: int
    response_time_ms: float
    limitations: list[str]
    request_id: str


class Source(BaseModel):
    title: str
    url: str
    section: str | None = None


class KnowledgeLink(BaseModel):
    label: str
    url: str


class KnowledgeChunk(BaseModel):
    id: str
    type: str
    slug: str
    title: str
    section: str
    url: str
    content: str
    score: float = 0
    corpus_version: str = ""
    links: list[KnowledgeLink] = Field(default_factory=list)
    suggested_questions: list[str] = Field(default_factory=list)
