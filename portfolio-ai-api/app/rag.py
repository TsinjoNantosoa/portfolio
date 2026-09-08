from openai import AsyncOpenAI
from qdrant_client import AsyncQdrantClient
import structlog

from app.config import Settings
from app.schemas import KnowledgeChunk

logger = structlog.get_logger()


class QdrantRetriever:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.openai = AsyncOpenAI(api_key=settings.openai_api_key)
        self.qdrant = AsyncQdrantClient(url=settings.qdrant_url, api_key=settings.qdrant_api_key or None)

    async def retrieve(self, query: str) -> list[KnowledgeChunk]:
        embedding = await self.openai.embeddings.create(model=self.settings.openai_embedding_model, input=query)
        response = await self.qdrant.query_points(
            collection_name=self.settings.qdrant_collection,
            query=embedding.data[0].embedding,
            limit=min(self.settings.retrieval_limit * 3, 30),
            score_threshold=self.settings.retrieval_score_threshold,
            with_payload=True,
        )
        chunks = []
        per_slug: dict[str, int] = {}
        for point in response.points:
            payload = point.payload or {}
            slug = str(payload.get("slug", ""))
            if not slug or per_slug.get(slug, 0) >= 2:
                continue
            try:
                chunk = KnowledgeChunk(**{**payload, "id": str(point.id), "score": float(point.score)})
            except (KeyError, ValueError, TypeError):
                continue
            chunks.append(chunk)
            per_slug[slug] = per_slug.get(slug, 0) + 1
            if len(chunks) >= self.settings.retrieval_limit:
                break
        logger.info("retrieval_completed", top_k=self.settings.retrieval_limit, result_count=len(chunks), source_ids=[chunk.id for chunk in chunks], scores=[round(chunk.score, 4) for chunk in chunks])
        return chunks

    async def readiness(self) -> dict:
        exists = await self.qdrant.collection_exists(self.settings.qdrant_collection)
        if not exists:
            return {"ready": False, "reason": "collection_missing", "documents": 0}
        count = await self.qdrant.count(collection_name=self.settings.qdrant_collection, exact=False)
        return {"ready": count.count > 0, "reason": None if count.count > 0 else "collection_empty", "documents": count.count}
