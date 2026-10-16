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


class OperationsMetricsResponse(BaseModel):
    requests: int | None = None
    successful_requests: int | None = None
    errors: int | None = None
    success_rate: float | None = None
    error_rate: float | None = None
    refusals: int | None = None
    p50_latency_ms: float | None = None
    p95_latency_ms: float | None = None
    retrieval_p95_ms: float | None = None
    generation_p95_ms: float | None = None
    input_tokens: int | None = None
    output_tokens: int | None = None


class OperationsRequestDistribution(BaseModel):
    assistant: int = 0
    playground: int = 0
    test: int = 0
    demo: int = 0


class OperationsSummaryResponse(BaseModel):
    status: Literal["available", "no_data", "disabled", "stale"]
    period: Literal["24h"]
    period_start: str
    period_end: str
    metrics: OperationsMetricsResponse
    request_distribution: OperationsRequestDistribution
    error_distribution: dict[
        Literal[
            "cancelled",
            "generation",
            "internal",
            "rate_limit",
            "retrieval",
            "timeout",
            "unavailable",
            "validation",
        ],
        int,
    ] = Field(default_factory=dict)
    last_event_at: str | None = None
    last_updated: str
    measurement_note: str


PlaygroundCorpus = Literal["projects", "engineering_lab"]


class PlaygroundRequest(BaseModel):
    message: str = Field(min_length=1, max_length=800)
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
    refusal_reason: (
        Literal["prompt_injection", "sensitive_request", "out_of_scope", "no_evidence"]
        | None
    ) = None
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
