import json
import logging
import time
from contextlib import asynccontextmanager

import structlog
from fastapi import Depends, FastAPI, Header, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from app.chat import PortfolioChatService
from app.config import Settings, get_settings
from app.rag import QdrantRetriever
from app.rate_limit import SlidingWindowLimiter
from app.schemas import ChatRequest, SessionResponse
from app.security import create_session_token, decode_session_token

logging.basicConfig(level=logging.INFO, format="%(message)s")
structlog.configure(processors=[structlog.processors.TimeStamper(fmt="iso"), structlog.processors.add_log_level, structlog.processors.JSONRenderer()])
logger = structlog.get_logger()


def sse(payload: dict) -> str:
    return f"data: {json.dumps(payload, ensure_ascii=False)}\n\n"


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
        yield

    app = FastAPI(title="Tsinjo AI Portfolio API", version="1.0.0", docs_url=None if settings.environment == "production" else "/docs", lifespan=lifespan)
    app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origins, allow_credentials=False, allow_methods=["GET", "POST", "OPTIONS"], allow_headers=["Authorization", "Content-Type"])

    def client_ip(request: Request) -> str:
        forwarded = request.headers.get("x-forwarded-for", "").split(",")[0].strip()
        return forwarded or (request.client.host if request.client else "unknown")

    async def claims(authorization: str | None = Header(default=None)) -> dict:
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Bearer session required")
        return decode_session_token(authorization[7:], settings)

    @app.get("/health")
    async def health(request: Request):
        return {"status": "ok", "service": "tsinjo-portfolio-ai", "ready": request.app.state.chat is not None}

    @app.post("/api/public/session", response_model=SessionResponse)
    async def session(request: Request):
        await request.app.state.limiter.check(f"session-ip:{client_ip(request)}", settings.ip_rate_limit_per_minute, 60)
        token, expires, session_id = create_session_token(settings)
        logger.info("session_created", session_id=session_id, ip=client_ip(request))
        return SessionResponse(token=token, expires_at=expires.isoformat(), session_id=session_id)

    @app.post("/api/public/chat/stream")
    async def chat(body: ChatRequest, request: Request, session_claims: dict = Depends(claims)):
        if len(body.message) > settings.max_input_chars:
            raise HTTPException(status_code=422, detail=f"Message exceeds {settings.max_input_chars} characters")
        ip = client_ip(request)
        sid = session_claims["sid"]
        if body.conversation_id and body.conversation_id != sid:
            raise HTTPException(status_code=403, detail="Conversation does not belong to this session")
        await request.app.state.limiter.check(f"chat-ip:{ip}", settings.ip_rate_limit_per_minute, 60)
        await request.app.state.limiter.check(f"chat-session:{sid}", settings.session_rate_limit_per_hour, 3600)
        service = request.app.state.chat
        if service is None:
            raise HTTPException(status_code=503, detail="Knowledge service is not configured")
        logger.info("chat_started", session_id=sid, message_chars=len(body.message))

        async def events():
            yield sse({"type": "status", "message": "retrieving"})
            try:
                chunks, tokens = await service.stream(body.message)
                async for token in tokens:
                    yield sse({"type": "delta", "text": token})
                sources = []
                seen = set()
                for chunk in chunks:
                    key = (chunk.url, chunk.section)
                    if key not in seen:
                        seen.add(key)
                        sources.append({"title": chunk.title, "url": chunk.url, "section": chunk.section})
                selected_sources = sources[:4]
                suggested_links = [{"label": f"Open {source['title']}", "url": source["url"]} for source in selected_sources[:2]]
                yield sse({"type": "done", "sources": selected_sources, "suggested_links": suggested_links})
                logger.info("chat_completed", session_id=sid, source_count=len(sources))
            except Exception as exc:
                logger.error("chat_failed", session_id=sid, error_type=type(exc).__name__)
                yield sse({"type": "error", "message": "The assistant could not complete this response."})

        return StreamingResponse(events(), media_type="text/event-stream", headers={"Cache-Control": "no-cache, no-transform", "X-Accel-Buffering": "no"})

    return app


app = create_app()
