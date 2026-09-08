from openai import AsyncOpenAI
from qdrant_client import AsyncQdrantClient

from app.config import Settings
from app.schemas import KnowledgeChunk


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
            limit=self.settings.retrieval_limit,
            score_threshold=self.settings.retrieval_score_threshold,
            with_payload=True,
        )
        chunks = []
        for point in response.points:
            payload = point.payload or {}
            chunks.append(KnowledgeChunk(id=str(point.id), score=float(point.score), **{key: payload[key] for key in ("type", "slug", "title", "section", "url", "content")}))
        return chunks
