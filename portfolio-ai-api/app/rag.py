import re

import structlog
from openai import AsyncOpenAI
from qdrant_client import AsyncQdrantClient

from app.config import Settings
from app.schemas import KnowledgeChunk

logger = structlog.get_logger()

TOKEN_PATTERN = re.compile(r"[a-z0-9+#.-]{3,}", re.IGNORECASE)
STOP_WORDS = {
    "about",
    "does",
    "have",
    "what",
    "which",
    "with",
    "tells",
    "tell",
    "tjinjo",
    "tsinjo",
}


def relevance_bonus(query: str, chunk: KnowledgeChunk) -> float:
    query_tokens = {
        token.lower()
        for token in TOKEN_PATTERN.findall(query)
        if token.lower() not in STOP_WORDS
    }
    title_tokens = {token.lower() for token in TOKEN_PATTERN.findall(chunk.title)}
    content_tokens = {token.lower() for token in TOKEN_PATTERN.findall(chunk.content)}
    bonus = 0.06 * len(query_tokens & title_tokens)
    bonus += 0.01 * len(query_tokens & content_tokens)

    query_lower = query.lower()
    intended_types = {
        "project": "project",
        "experience": "experience",
        "education": "education",
        "certification": "certification",
        "skill": "skill",
        "technolog": "skill",
    }
    if any(
        marker in query_lower and chunk.type == expected_type
        for marker, expected_type in intended_types.items()
    ):
        bonus += 0.08
    return bonus


class QdrantRetriever:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.openai = AsyncOpenAI(
            api_key=settings.openai_api_key,
            timeout=settings.openai_timeout_seconds,
            max_retries=1,
        )
        self.qdrant = AsyncQdrantClient(
            url=settings.qdrant_url, api_key=settings.qdrant_api_key or None
        )

    async def retrieve(self, query: str) -> list[KnowledgeChunk]:
        embedding = await self.openai.embeddings.create(
            model=self.settings.openai_embedding_model, input=query
        )
        response = await self.qdrant.query_points(
            collection_name=self.settings.qdrant_collection,
            query=embedding.data[0].embedding,
            # Fetch a wider candidate pool for local re-ranking, but only send
            # rag_top_k chunks to the generation model.
            limit=24,
            score_threshold=self.settings.retrieval_score_threshold,
            with_payload=True,
        )
        candidates: list[tuple[float, KnowledgeChunk]] = []
        for point in response.points:
            payload = point.payload or {}
            try:
                chunk = KnowledgeChunk(
                    **{
                        **payload,
                        "id": str(point.id),
                        "score": float(point.score),
                    }
                )
            except (KeyError, ValueError, TypeError):
                continue
            candidates.append((chunk.score + relevance_bonus(query, chunk), chunk))

        candidates.sort(key=lambda candidate: candidate[0], reverse=True)
        chunks = []
        per_slug: dict[str, int] = {}
        for _adjusted_score, chunk in candidates:
            slug = chunk.slug
            if not slug or per_slug.get(slug, 0) >= 2:
                continue
            chunks.append(chunk)
            per_slug[slug] = per_slug.get(slug, 0) + 1
            if len(chunks) >= self.settings.rag_top_k:
                break
        logger.info(
            "retrieval_completed",
            top_k=self.settings.rag_top_k,
            result_count=len(chunks),
            source_ids=[chunk.id for chunk in chunks],
            scores=[round(chunk.score, 4) for chunk in chunks],
        )
        return chunks

    async def readiness(self) -> dict:
        exists = await self.qdrant.collection_exists(self.settings.qdrant_collection)
        if not exists:
            return {"ready": False, "reason": "collection_missing", "documents": 0}
        count = await self.qdrant.count(
            collection_name=self.settings.qdrant_collection, exact=False
        )
        return {
            "ready": count.count > 0,
            "reason": None if count.count > 0 else "collection_empty",
            "documents": count.count,
        }
