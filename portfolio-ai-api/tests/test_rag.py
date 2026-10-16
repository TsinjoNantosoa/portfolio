import json
import time
from pathlib import Path
from types import SimpleNamespace

import pytest

from app.config import Settings
from app.rag import (
    QdrantRetriever,
    expected_corpus_manifest,
    expected_corpus_version,
    expected_documents,
)
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

    applied_filters = []

    async def query_points(**kwargs):
        assert kwargs["limit"] == 24
        applied_filters.append(kwargs["query_filter"])
        return SimpleNamespace(points=points)

    retriever.qdrant = SimpleNamespace(query_points=query_points)
    results = await retriever.retrieve("Which project uses LangGraph?")
    assert [item.slug for item in results] == ["arcwell", "arcwell", "sihia"]
    retriever._readiness_cache = (time.monotonic(), {"ready": True})
    await retriever.retrieve("How is the Lab structured?", corpus="engineering_lab")
    assert len(applied_filters[0].must) == 1
    assert applied_filters[0].must[0].key == "corpus_version"
    assert len(applied_filters[1].must) == 2


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


class FakeCorpusQdrant:
    def __init__(self, payloads=None, exists=True, failure=None):
        documents = [dict(item) for item in expected_documents().values()]
        manifest = {
            "id": "portfolio-corpus-manifest",
            "type": "corpus_manifest",
            **expected_corpus_manifest(),
        }
        self.payloads = payloads if payloads is not None else [*documents, manifest]
        self.exists = exists
        self.failure = failure

    async def collection_exists(self, _name):
        if self.failure:
            raise self.failure
        return self.exists

    async def count(self, **_kwargs):
        return SimpleNamespace(count=len(self.payloads))

    async def scroll(self, **kwargs):
        offset = kwargs.get("offset")
        if offset:
            return [], None
        return [SimpleNamespace(payload=item) for item in self.payloads], None


def make_retriever():
    return QdrantRetriever(
        Settings(
            environment="test",
            openai_api_key="test",
            qdrant_url="http://qdrant.test",
            corpus_readiness_ttl_seconds=0,
        )
    )


@pytest.mark.asyncio
async def test_readiness_accepts_only_complete_manifested_collection():
    retriever = make_retriever()
    retriever.qdrant = FakeCorpusQdrant()
    current = await retriever.readiness()
    assert current["ready"] is True
    assert current["documents"] == expected_corpus_manifest()["document_count"]
    assert current["corpus_version"] == expected_corpus_version()


@pytest.mark.asyncio
@pytest.mark.parametrize(
    ("mutation", "reason"),
    [
        (lambda rows: rows[:-2] + rows[-1:], "collection_count_mismatch"),
        (
            lambda rows: [
                *[{**rows[0], "corpus_version": "stale-version"}],
                *rows[1:],
            ],
            "corpus_version_mismatch",
        ),
        (lambda rows: rows[1:], "collection_count_mismatch"),
        (
            lambda rows: [
                *rows,
                {
                    **rows[0],
                    "id": "project:obsolete:overview",
                    "document_hash": "obsolete",
                },
            ],
            "collection_count_mismatch",
        ),
        (
            lambda rows: [
                {**rows[0], "document_hash": "tampered"},
                *rows[1:],
            ],
            "document_fingerprint_mismatch",
        ),
        (lambda rows: rows[:-1], "manifest_missing_or_duplicated"),
        (
            lambda rows: [
                *rows[:-1],
                {**rows[-1], "document_count": 999},
            ],
            "manifest_mismatch",
        ),
    ],
)
async def test_readiness_rejects_incomplete_stale_or_tampered_indexes(mutation, reason):
    retriever = make_retriever()
    valid = FakeCorpusQdrant().payloads
    retriever.qdrant = FakeCorpusQdrant(payloads=mutation(valid))
    diagnostic = await retriever.readiness()
    assert diagnostic["ready"] is False
    assert diagnostic["reason"] == reason


@pytest.mark.asyncio
async def test_readiness_handles_missing_empty_failure_and_reindex_recovery():
    retriever = make_retriever()
    retriever.qdrant = FakeCorpusQdrant(exists=False)
    assert (await retriever.readiness())["reason"] == "collection_missing"

    retriever.qdrant = FakeCorpusQdrant(payloads=[])
    assert (await retriever.readiness())["reason"] == "collection_empty"

    retriever.qdrant = FakeCorpusQdrant(failure=RuntimeError("temporary-qdrant"))
    with pytest.raises(RuntimeError, match="temporary-qdrant"):
        await retriever.readiness()

    retriever.qdrant = FakeCorpusQdrant(payloads=FakeCorpusQdrant().payloads[:-2] + FakeCorpusQdrant().payloads[-1:])
    assert (await retriever.readiness())["ready"] is False
    retriever.qdrant = FakeCorpusQdrant()
    assert (await retriever.readiness())["ready"] is True


@pytest.mark.asyncio
async def test_playground_retrieval_refuses_an_incomplete_index_before_embedding():
    retriever = QdrantRetriever(
        Settings(
            environment="test",
            openai_api_key="test",
            qdrant_url="http://qdrant.test",
            corpus_readiness_ttl_seconds=0,
        )
    )
    retriever.qdrant = FakeCorpusQdrant(payloads=FakeCorpusQdrant().payloads[:-2] + FakeCorpusQdrant().payloads[-1:])
    with pytest.raises(RuntimeError, match="corpus_not_ready"):
        await retriever.retrieve("How does SIHIA work?", corpus="projects")


def test_generated_public_corpus_has_depth_valid_routes_and_no_private_markers():
    documents = json.loads(KNOWLEDGE.read_text(encoding="utf-8"))
    assert 40 <= len(documents) <= 80
    assert len({item["id"] for item in documents}) == len(documents)
    assert all(len(item["document_hash"]) == 64 for item in documents)
    assert {item["corpus_version"] for item in documents} == {
        expected_corpus_version()
    }
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
        "/work/offshore-fares",
        "/work/arcwell-agentic-crm",
        "/work/ai-business-os",
        "/work/sihia",
        "/work/ai-sales-assistant",
        "/lab",
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
