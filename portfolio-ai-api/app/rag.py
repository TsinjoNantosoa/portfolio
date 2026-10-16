import asyncio
import hashlib
import json
import re
import time
from functools import lru_cache
from pathlib import Path

import structlog
from openai import AsyncOpenAI
from qdrant_client import AsyncQdrantClient, models

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

PLAYGROUND_CORPUS_FILTERS = {
    "projects": models.Filter(
        must=[models.FieldCondition(key="type", match=models.MatchValue(value="project"))]
    ),
    "engineering_lab": models.Filter(
        must=[
            models.FieldCondition(
                key="slug",
                match=models.MatchAny(
                    any=[
                        "lab-rag",
                        "lab-agentic",
                        "lab-automation",
                        "lab-production",
                        "lab-assisted-development",
                    ]
                ),
            )
        ]
    ),
}
LAB_SLUGS = {
    "lab-rag",
    "lab-agentic",
    "lab-automation",
    "lab-production",
    "lab-assisted-development",
}
KNOWLEDGE_DIR = Path(__file__).parent / "knowledge"


@lru_cache
def expected_corpus_version() -> str:
    return str(expected_corpus_manifest().get("corpus_version", ""))


@lru_cache
def expected_corpus_manifest() -> dict:
    manifest_file = KNOWLEDGE_DIR / "public_portfolio.manifest.json"
    return json.loads(manifest_file.read_text(encoding="utf-8"))


@lru_cache
def expected_documents() -> dict[str, dict]:
    knowledge_file = KNOWLEDGE_DIR / "public_portfolio.json"
    documents = json.loads(knowledge_file.read_text(encoding="utf-8"))
    return {str(item["id"]): item for item in documents}


def _document_fingerprint(documents: dict[str, dict]) -> str:
    rows = [
        f"{document_id}:{document.get('document_hash', '')}"
        for document_id, document in sorted(documents.items())
    ]
    return hashlib.sha256("\n".join(rows).encode()).hexdigest()


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
        self._readiness_cache: tuple[float, dict] | None = None
        self._readiness_lock = asyncio.Lock()

    def _query_filter(self, corpus: str | None) -> models.Filter:
        version_condition = models.FieldCondition(
            key="corpus_version",
            match=models.MatchValue(value=expected_corpus_version()),
        )
        if corpus:
            corpus_filter = PLAYGROUND_CORPUS_FILTERS[corpus]
            return models.Filter(must=[*(corpus_filter.must or []), version_condition])
        return models.Filter(
            must=[version_condition],
            must_not=[
                models.FieldCondition(
                    key="type", match=models.MatchValue(value="corpus_manifest")
                )
            ],
        )

    async def ensure_ready(self) -> dict:
        now = time.monotonic()
        cached = self._readiness_cache
        if cached and now - cached[0] <= self.settings.corpus_readiness_ttl_seconds:
            diagnostic = cached[1]
        else:
            async with self._readiness_lock:
                cached = self._readiness_cache
                if cached and now - cached[0] <= self.settings.corpus_readiness_ttl_seconds:
                    diagnostic = cached[1]
                else:
                    diagnostic = await self.readiness()
        if not diagnostic.get("ready"):
            raise RuntimeError(f"corpus_not_ready:{diagnostic.get('reason', 'unknown')}")
        return diagnostic

    async def retrieve(
        self, query: str, corpus: str | None = None
    ) -> list[KnowledgeChunk]:
        if corpus:
            await self.ensure_ready()
        query_filter = self._query_filter(corpus)
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
            query_filter=query_filter,
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
            corpus=corpus or "public_portfolio",
        )
        return chunks

    async def _all_payloads(self) -> list[dict]:
        payloads = []
        offset = None
        while True:
            points, offset = await self.qdrant.scroll(
                collection_name=self.settings.qdrant_collection,
                limit=256,
                offset=offset,
                with_payload=[
                    "id",
                    "type",
                    "slug",
                    "corpus_version",
                    "document_hash",
                    "schema_version",
                    "document_count",
                    "document_ids_sha256",
                    "document_fingerprint_sha256",
                    "corpus_counts",
                ],
                with_vectors=False,
            )
            payloads.extend(point.payload or {} for point in points)
            if offset is None:
                return payloads

    async def readiness(self) -> dict:
        exists = await self.qdrant.collection_exists(self.settings.qdrant_collection)
        if not exists:
            result = {"ready": False, "reason": "collection_missing", "documents": 0}
            self._readiness_cache = (time.monotonic(), result)
            return result
        count = await self.qdrant.count(
            collection_name=self.settings.qdrant_collection, exact=True
        )
        if count.count == 0:
            result = {"ready": False, "reason": "collection_empty", "documents": 0}
            self._readiness_cache = (time.monotonic(), result)
            return result

        payloads = await self._all_payloads()
        manifests = [item for item in payloads if item.get("type") == "corpus_manifest"]
        indexed_documents = {
            str(item.get("id")): item
            for item in payloads
            if item.get("type") != "corpus_manifest" and item.get("id")
        }
        expected = expected_documents()
        expected_manifest = expected_corpus_manifest()
        indexed_version = (
            str(manifests[0].get("corpus_version", "")) if len(manifests) == 1 else ""
        )
        reason = None
        if len(manifests) != 1:
            reason = "manifest_missing_or_duplicated"
        elif any(
            manifests[0].get(key) != expected_manifest.get(key)
            for key in (
                "schema_version",
                "corpus_version",
                "document_count",
                "document_ids_sha256",
                "document_fingerprint_sha256",
                "corpus_counts",
            )
        ):
            reason = "manifest_mismatch"
        elif count.count != len(expected) + 1:
            reason = "collection_count_mismatch"
        elif set(indexed_documents) != set(expected):
            reason = "document_ids_mismatch"
        elif any(
            item.get("corpus_version") != expected_manifest["corpus_version"]
            for item in indexed_documents.values()
        ):
            reason = "corpus_version_mismatch"
        elif _document_fingerprint(indexed_documents) != expected_manifest["document_fingerprint_sha256"]:
            reason = "document_fingerprint_mismatch"
        else:
            indexed_counts = {
                "projects": sum(item.get("type") == "project" for item in indexed_documents.values()),
                "engineering_lab": sum(item.get("slug") in LAB_SLUGS for item in indexed_documents.values()),
            }
            if indexed_counts != expected_manifest["corpus_counts"]:
                reason = "corpus_counts_mismatch"

        result = {
            "ready": reason is None,
            "reason": reason,
            "documents": len(indexed_documents),
            "corpus_version": indexed_version,
            "expected_corpus_version": expected_manifest["corpus_version"],
            "expected_documents": expected_manifest["document_count"],
        }
        self._readiness_cache = (time.monotonic(), result)
        return result
