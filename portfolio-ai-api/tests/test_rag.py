import json
from pathlib import Path
from types import SimpleNamespace

import pytest

from app.config import Settings
from app.rag import QdrantRetriever
from app.response_metadata import build_response_metadata
from app.schemas import KnowledgeChunk

ROOT = Path(__file__).parents[2]
KNOWLEDGE = ROOT / "portfolio-ai-api" / "app" / "knowledge" / "public_portfolio.json"


def chunk(slug: str, section: str, score: float, links=None):
    return {
        "id": f"project:{slug}:{section}",
        "type": "project",
        "slug": slug,
        "title": slug.title(),
        "section": section,
        "url": f"/work/{slug}",
        "content": "Public portfolio evidence with enough detail.",
        "links": links or [],
        "suggested_questions": [f"More about {slug}?"],
    }


@pytest.mark.asyncio
async def test_retrieval_diversifies_projects_and_limits_results():
    retriever = QdrantRetriever(
        Settings(
            environment="test",
            openai_api_key="test",
            qdrant_url="http://qdrant.test",
            RAG_TOP_K=3,
        )
    )
    retriever.openai = SimpleNamespace(
        embeddings=SimpleNamespace(create=lambda **_kwargs: None)
    )

    async def embedding(**_kwargs):
        return SimpleNamespace(data=[SimpleNamespace(embedding=[0.1, 0.2])])

    retriever.openai.embeddings.create = embedding
    points = [
        SimpleNamespace(
            id=str(index),
            score=1 - index / 100,
            payload=chunk(slug, f"section-{index}", 1),
        )
        for index, slug in enumerate(
            ["arcwell", "arcwell", "arcwell", "sihia", "ai-sales"]
        )
    ]

    async def query_points(**kwargs):
        assert kwargs["limit"] == 24
        return SimpleNamespace(points=points)

    retriever.qdrant = SimpleNamespace(query_points=query_points)
    results = await retriever.retrieve("Which project uses LangGraph?")
    assert [item.slug for item in results] == ["arcwell", "arcwell", "sihia"]


def test_source_metadata_is_deduplicated_and_urls_are_deterministic():
    items = [
        KnowledgeChunk(
            **chunk(
                "arcwell",
                "Architecture",
                0.9,
                [{"label": "View Arcwell", "url": "/work/arcwell"}],
            ),
            score=0.9,
        ),
        KnowledgeChunk(
            **chunk(
                "arcwell",
                "Security",
                0.8,
                [{"label": "View Arcwell", "url": "/work/arcwell"}],
            ),
            score=0.8,
        ),
    ]
    sources, links, questions = build_response_metadata(items)
    assert len(sources) == 1
    assert links == [{"label": "View Arcwell", "url": "/work/arcwell"}]
    assert questions == ["More about arcwell?"]


def test_generated_public_corpus_has_depth_valid_routes_and_no_private_markers():
    documents = json.loads(KNOWLEDGE.read_text(encoding="utf-8"))
    assert 40 <= len(documents) <= 60
    assert {
        "project",
        "experience",
        "education",
        "certification",
        "skill",
        "contact",
    }.issubset({item["type"] for item in documents})
    assert {
        "multi-tenant-rag",
        "arcwell-agentic-crm",
        "ai-business-os",
        "sihia",
        "ai-sales-assistant",
    }.issubset({item["slug"] for item in documents})
    allowed_routes = {
        "/#work",
        "/#expertise",
        "/#experience",
        "/#background",
        "/#contact",
        "/work/multi-tenant-rag",
        "/work/arcwell-agentic-crm",
        "/work/ai-business-os",
        "/work/sihia",
        "/work/ai-sales-assistant",
    }
    assert all(
        not item["url"].startswith("/") or item["url"] in allowed_routes
        for item in documents
    )
    serialized = json.dumps(documents).lower()
    assert (
        "victrix" not in serialized
        and "x-tenant-id" not in serialized
        and "api_key" not in serialized
    )
