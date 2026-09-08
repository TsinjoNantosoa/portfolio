import asyncio
import hashlib
import hmac
import json
import logging
import time
from contextlib import asynccontextmanager
from uuid import uuid4

import structlog
from fastapi import Depends, FastAPI, Header, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse

from app.chat import PortfolioChatService
from app.client_ip import get_client_ip
from app.config import Settings, get_settings
from app.rag import QdrantRetriever
from app.rate_limit import SlidingWindowLimiter
from app.response_metadata import build_response_metadata
from app.schemas import ChatRequest, SessionResponse
from app.security import create_session_token, decode_session_token

logging.basicConfig(level=logging.INFO, format="%(message)s")
structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.add_log_level,
        structlog.processors.JSONRenderer(),
    ]
)
logger = structlog.get_logger()


def sse(payload: dict) -> str:
    return f"data: {json.dumps(payload, ensure_ascii=False)}\n\n"


def error_code(status_code: int) -> str:
    return {
        401: "SESSION_INVALID",
        403: "FORBIDDEN",
        404: "NOT_FOUND",
        422: "INVALID_REQUEST",
        429: "RATE_LIMITED",
        503: "ASSISTANT_UNAVAILABLE",
    }.get(status_code, "REQUEST_FAILED")


def create_app(settings: Settings | None = None, chat_service=None) -> FastAPI:
    settings = settings or get_settings()

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        app.state.started_at = time.monotonic()
        app.state.limiter = SlidingWindowLimiter()
        if chat_service is not None:
            app.state.chat = chat_service
        elif settings.openai_api_key and settings.qdrant_url:
            app.state.chat = PortfolioChatService(settings, QdrantRetriever(settings))
        else:
            app.state.chat = None
            logger.warning(
                "assistant_not_configured",
                missing_openai_key=not bool(settings.openai_api_key),
                missing_qdrant_url=not bool(settings.qdrant_url),
            )
        yield

    app = FastAPI(
        title="Tsinjo AI Portfolio API",
        version="1.1.0",
        docs_url=None if settings.environment == "production" else "/docs",
        lifespan=lifespan,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=False,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
        expose_headers=["X-Request-ID"],
    )

    @app.middleware("http")
    async def request_context(request: Request, call_next):
        request_id = request.headers.get("x-request-id", "").strip()[:64] or str(
            uuid4()
        )
        request.state.request_id = request_id
        started = time.monotonic()
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "no-referrer"
        logger.info(
            "request_completed",
            request_id=request_id,
            method=request.method,
            path=request.url.path,
            status=response.status_code,
            latency_ms=round((time.monotonic() - started) * 1000, 2),
        )
        return response

    @app.exception_handler(HTTPException)
    async def http_error(request: Request, exc: HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "code": error_code(exc.status_code),
                    "message": str(exc.detail),
                    "request_id": request.state.request_id,
                }
            },
            headers=exc.headers,
        )

    @app.exception_handler(RequestValidationError)
    async def validation_error(request: Request, _exc: RequestValidationError):
        return JSONResponse(
            status_code=422,
            content={
                "error": {
                    "code": "INVALID_REQUEST",
                    "message": "The request payload is invalid.",
                    "request_id": request.state.request_id,
                }
            },
        )

    def client_key(request: Request) -> str:
        address = get_client_ip(request, settings.trust_proxy_headers)
        return hmac.new(
            settings.session_secret.encode(), address.encode(), hashlib.sha256
        ).hexdigest()[:24]

    def safe_session_id(session_id: str) -> str:
        return hashlib.sha256(session_id.encode()).hexdigest()[:12]

    async def claims(authorization: str | None = Header(default=None)) -> dict:
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="A valid portfolio session is required.",
            )
        return decode_session_token(authorization[7:], settings)

    @app.get("/health")
    async def health():
        return {"status": "ok", "service": "tsinjo-portfolio-ai"}

    @app.get("/ready")
    async def ready(request: Request):
        service = request.app.state.chat
        if service is None:
            raise HTTPException(
                status_code=503, detail="The assistant is not configured."
            )
        try:
            diagnostic = await asyncio.wait_for(service.readiness(), timeout=4)
        except Exception as exc:
            logger.warning(
                "readiness_failed",
                request_id=request.state.request_id,
                error_type=type(exc).__name__,
            )
            raise HTTPException(
                status_code=503, detail="Portfolio knowledge is not ready."
            ) from exc
        if not diagnostic.get("ready"):
            raise HTTPException(
                status_code=503, detail="Portfolio knowledge is not ready."
            )
        return {
            "status": "ready",
            "collection": settings.qdrant_collection,
            "documents": diagnostic.get("documents", 0),
        }

    @app.post("/api/public/session", response_model=SessionResponse)
    async def session(request: Request):
        ip_key = client_key(request)
        await request.app.state.limiter.check(
            f"session-ip:{ip_key}", settings.ip_rate_limit_per_minute, 60
        )
        token, expires, session_id = create_session_token(settings)
        logger.info(
            "session_created",
            request_id=request.state.request_id,
            session_id=safe_session_id(session_id),
        )
        return SessionResponse(
            token=token, expires_at=expires.isoformat(), session_id=session_id
        )

    @app.post("/api/public/chat/stream")
    async def chat(
        body: ChatRequest,
        request: Request,
        session_claims: dict = Depends(claims),  # noqa: B008
    ):
        if len(body.message) > settings.max_input_chars:
            raise HTTPException(
                status_code=422,
                detail=f"Message exceeds {settings.max_input_chars} characters.",
            )
        sid = session_claims["sid"]
        if body.conversation_id and body.conversation_id != sid:
            raise HTTPException(
                status_code=403, detail="Conversation does not belong to this session."
            )
        await request.app.state.limiter.check(
            f"chat-ip:{client_key(request)}", settings.ip_rate_limit_per_minute, 60
        )
        await request.app.state.limiter.check(
            f"chat-session:{sid}", settings.session_rate_limit_per_hour, 3600
        )
        service = request.app.state.chat
        if service is None:
            raise HTTPException(
                status_code=503, detail="The assistant is temporarily unavailable."
            )
        safe_sid = safe_session_id(sid)
        logger.info(
            "chat_started",
            request_id=request.state.request_id,
            session_id=safe_sid,
            message_chars=len(body.message),
            model=settings.openai_model,
        )

        async def events():
            yield sse(
                {
                    "type": "status",
                    "status": "thinking",
                    "message": "Searching portfolio...",
                    "request_id": request.state.request_id,
                }
            )
            try:
                chunks, tokens = await service.stream(body.message)
                async for token in tokens:
                    yield sse({"type": "delta", "text": token})
                sources, suggested_links, suggested_questions = build_response_metadata(
                    chunks
                )
                yield sse(
                    {
                        "type": "done",
                        "sources": sources,
                        "suggested_links": suggested_links,
                        "suggested_questions": suggested_questions,
                        "request_id": request.state.request_id,
                    }
                )
                logger.info(
                    "chat_completed",
                    request_id=request.state.request_id,
                    session_id=safe_sid,
                    retrieval_count=len(chunks),
                    source_count=len(sources),
                    model=settings.openai_model,
                )
            except Exception as exc:  # noqa: BLE001
                logger.error(
                    "chat_failed",
                    request_id=request.state.request_id,
                    session_id=safe_sid,
                    error_type=type(exc).__name__,
                )
                yield sse(
                    {
                        "type": "error",
                        "code": "STREAM_FAILED",
                        "message": "The assistant could not complete this response.",
                        "request_id": request.state.request_id,
                    }
                )

        return StreamingResponse(
            events(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache, no-transform",
                "X-Accel-Buffering": "no",
            },
        )

    return app


app = create_app()
