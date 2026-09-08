import argparse
import asyncio
import json
import sys
from pathlib import Path
from uuid import NAMESPACE_URL, uuid5

sys.path.insert(0, str(Path(__file__).parents[1]))

from openai import AsyncOpenAI
from qdrant_client import AsyncQdrantClient, models

from app.config import get_settings

KNOWLEDGE_FILE = Path(__file__).parents[1] / "app" / "knowledge" / "public_portfolio.json"


async def ingest(dry_run: bool, recreate: bool):
    settings = get_settings()
    documents = json.loads(KNOWLEDGE_FILE.read_text(encoding="utf-8"))
    if dry_run:
        print(json.dumps({"collection": settings.qdrant_collection, "documents": len(documents), "source": str(KNOWLEDGE_FILE)}, indent=2))
        return
    if not settings.openai_api_key or not settings.qdrant_url:
        raise SystemExit("OPENAI_API_KEY and QDRANT_URL are required")
    openai = AsyncOpenAI(api_key=settings.openai_api_key)
    qdrant = AsyncQdrantClient(url=settings.qdrant_url, api_key=settings.qdrant_api_key or None)
    embeddings = await openai.embeddings.create(model=settings.openai_embedding_model, input=[item["content"] for item in documents])
    vector_size = len(embeddings.data[0].embedding)
    exists = await qdrant.collection_exists(settings.qdrant_collection)
    if recreate and exists:
        await qdrant.delete_collection(settings.qdrant_collection)
        exists = False
    if not exists:
        await qdrant.create_collection(settings.qdrant_collection, vectors_config=models.VectorParams(size=vector_size, distance=models.Distance.COSINE))
    points = []
    for item, embedding in zip(documents, embeddings.data, strict=True):
        stable_id = str(uuid5(NAMESPACE_URL, f"portfolio:{item['type']}:{item['slug']}:{item['section']}"))
        points.append(models.PointStruct(id=stable_id, vector=embedding.embedding, payload=item))
    await qdrant.upsert(collection_name=settings.qdrant_collection, points=points, wait=True)
    print(json.dumps({"collection": settings.qdrant_collection, "upserted": len(points)}, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Idempotently ingest curated public portfolio knowledge")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--recreate", action="store_true")
    args = parser.parse_args()
    asyncio.run(ingest(args.dry_run, args.recreate))
