import hashlib
import json
from types import SimpleNamespace

import pytest

from scripts.ingest_portfolio import (
    FILTERABLE_PAYLOAD_FIELDS,
    KNOWLEDGE_FILE,
    MANIFEST_FILE,
    embedding_text,
    ensure_payload_indexes,
    list_collection_point_ids,
)


def test_embedding_text_includes_title_section_and_content():
    document = {
        "title": "Arcwell",
        "section": "Architecture",
        "content": "A governed LangGraph workflow.",
    }
    assert embedding_text(document) == (
        "Arcwell\nArchitecture\nA governed LangGraph workflow."
    )


@pytest.mark.asyncio
async def test_collection_point_ids_are_read_across_all_pages():
    class FakeQdrant:
        async def scroll(self, **kwargs):
            if kwargs["offset"] is None:
                return [SimpleNamespace(id="current"), SimpleNamespace(id="stale")], 2
            return [SimpleNamespace(id="last")], None

    point_ids = await list_collection_point_ids(FakeQdrant(), "portfolio_knowledge")
    assert point_ids == {"current", "stale", "last"}


@pytest.mark.asyncio
async def test_filterable_payload_indexes_are_created_as_keywords():
    calls = []

    class FakeQdrant:
        async def create_payload_index(self, **kwargs):
            calls.append(kwargs)

    await ensure_payload_indexes(FakeQdrant(), "portfolio_knowledge")

    assert [call["field_name"] for call in calls] == list(
        FILTERABLE_PAYLOAD_FIELDS
    )
    assert all(
        call["field_schema"].value == "keyword" and call["wait"] is True
        for call in calls
    )


def test_generated_manifest_matches_document_ids_hash_and_fingerprint():
    documents = json.loads(KNOWLEDGE_FILE.read_text(encoding="utf-8"))
    manifest = json.loads(MANIFEST_FILE.read_text(encoding="utf-8"))
    ordered = sorted(documents, key=lambda item: item["id"])
    ids_hash = hashlib.sha256(
        "\n".join(item["id"] for item in ordered).encode()
    ).hexdigest()
    fingerprint = hashlib.sha256(
        "\n".join(
            f"{item['id']}:{item['document_hash']}" for item in ordered
        ).encode()
    ).hexdigest()

    assert manifest["document_count"] == len(documents)
    assert manifest["document_ids_sha256"] == ids_hash
    assert manifest["document_fingerprint_sha256"] == fingerprint
    assert manifest["corpus_version"] == fingerprint[:16]
