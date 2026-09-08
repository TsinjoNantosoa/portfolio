from types import SimpleNamespace

import pytest

from scripts.ingest_portfolio import embedding_text, list_collection_point_ids


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
