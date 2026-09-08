import argparse
import asyncio
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parents[1]))

from app.config import get_settings
from app.rag import QdrantRetriever

EVAL_FILE = Path(__file__).parents[1] / "tests" / "evals" / "recruiter_questions.json"


async def evaluate(limit: int | None):
    settings = get_settings()
    if not settings.openai_api_key or not settings.qdrant_url:
        raise SystemExit("OPENAI_API_KEY and QDRANT_URL are required for retrieval evaluation")
    items = [item for item in json.loads(EVAL_FILE.read_text(encoding="utf-8")) if not item["out_of_scope"] and item["expected_source_slugs"]]
    if limit:
        items = items[:limit]
    retriever = QdrantRetriever(settings)
    passed = 0
    results = []
    for item in items:
        chunks = await retriever.retrieve(item["question"])
        retrieved = {chunk.slug for chunk in chunks}
        expected = set(item["expected_source_slugs"])
        matched = bool(retrieved & expected)
        passed += int(matched)
        results.append({"question": item["question"], "passed": matched, "expected": sorted(expected), "retrieved": sorted(retrieved)})
    print(json.dumps({"evaluated": len(items), "passed": passed, "recall_at_k": round(passed / len(items), 4) if items else 0, "results": results}, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run recruiter-question retrieval evaluation against Qdrant")
    parser.add_argument("--limit", type=int, default=None)
    args = parser.parse_args()
    asyncio.run(evaluate(args.limit))
