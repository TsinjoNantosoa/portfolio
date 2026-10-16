import json
import math
import re
import sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parents[1]))

from app.chat import (
    is_clearly_unrelated,
    is_prompt_injection,
    is_sensitive_data_request,
)

ROOT = Path(__file__).parents[1]
KNOWLEDGE_FILE = ROOT / "app" / "knowledge" / "public_portfolio.json"
EVAL_FILE = ROOT / "tests" / "evals" / "playground_retrieval.json"
LAB_SLUGS = {
    "lab-rag",
    "lab-agentic",
    "lab-automation",
    "lab-production",
    "lab-assisted-development",
}
TOKEN_PATTERN = re.compile(r"[a-z0-9+#.-]{3,}", re.IGNORECASE)
STOP_WORDS = {
    "about", "and", "are", "avec", "comment", "dans", "does", "for",
    "from", "how", "les", "pour", "that", "the", "what", "which", "with",
}


def tokens(value: str) -> list[str]:
    return [
        token.lower()
        for token in TOKEN_PATTERN.findall(value)
        if token.lower() not in STOP_WORDS
    ]


def corpus_documents(documents: list[dict], corpus: str) -> list[dict]:
    if corpus == "projects":
        return [item for item in documents if item["type"] == "project"]
    if corpus == "engineering_lab":
        return [item for item in documents if item["slug"] in LAB_SLUGS]
    raise ValueError(f"Unsupported corpus: {corpus}")


def rank(query: str, documents: list[dict], limit: int = 4) -> list[tuple[float, dict]]:
    document_tokens = [
        tokens(f"{item['title']} {item['section']} {item['content']}")
        for item in documents
    ]
    document_frequency = Counter(
        token for item_tokens in document_tokens for token in set(item_tokens)
    )
    query_tokens = tokens(query)
    ranked = []
    for item, item_tokens in zip(documents, document_tokens, strict=True):
        counts = Counter(item_tokens)
        score = 0.0
        for token in query_tokens:
            if token not in counts:
                continue
            inverse_frequency = math.log(
                (len(documents) + 1) / (document_frequency[token] + 1)
            ) + 1
            score += inverse_frequency * (1 + math.log(counts[token]))
        title_overlap = set(query_tokens) & set(tokens(item["title"]))
        score += 2.0 * len(title_overlap)
        if score > 0:
            ranked.append((round(score, 6), item))
    selected = []
    per_slug = Counter()
    for row in sorted(ranked, key=lambda candidate: candidate[0], reverse=True):
        slug = row[1]["slug"]
        if per_slug[slug] >= 2:
            continue
        selected.append(row)
        per_slug[slug] += 1
        if len(selected) >= limit:
            break
    return selected


def evaluate(documents: list[dict], cases: list[dict]) -> dict:
    results = []
    hits = 0
    reciprocal_rank = 0.0
    no_answer_hits = 0
    no_answer_total = 0
    citation_matches = 0
    false_positives = 0
    category_totals = Counter()
    category_hits = Counter()
    for case in cases:
        category = case.get("category", "simple")
        category_totals[category] += 1
        guarded = any(
            guard(case["question"])
            for guard in (
                is_prompt_injection,
                is_sensitive_data_request,
                is_clearly_unrelated,
            )
        )
        candidates = [] if guarded else rank(
            case["question"], corpus_documents(documents, case["corpus"])
        )
        retrieved = [item["slug"] for _score, item in candidates]
        expected = set(case["expected_source_slugs"])
        if case["no_answer"]:
            no_answer_total += 1
            matched = not candidates
            no_answer_hits += int(matched)
            false_positives += int(not matched)
            rank_value = None
        else:
            positions = [
                index
                for index, slug in enumerate(retrieved, start=1)
                if slug in expected
            ]
            rank_value = min(positions) if positions else None
            matched = rank_value is not None
            hits += int(matched)
            if rank_value:
                reciprocal_rank += 1 / rank_value
            citation_matches += int(expected.issubset(set(retrieved)))
        category_hits[category] += int(matched)
        results.append(
            {
                "question": case["question"],
                "corpus": case["corpus"],
                "passed": matched,
                "expected": sorted(expected),
                "retrieved": retrieved,
                "expected_rank": rank_value,
                "category": category,
                "guarded": guarded,
            }
        )
    answer_cases = len(cases) - no_answer_total
    return {
        "documents": len(documents),
        "evaluated": len(cases),
        "answerable_cases": answer_cases,
        "recall_at_4": round(hits / answer_cases, 4) if answer_cases else 0,
        "mean_reciprocal_rank": round(reciprocal_rank / answer_cases, 4)
        if answer_cases
        else 0,
        "no_answer_accuracy": round(no_answer_hits / no_answer_total, 4)
        if no_answer_total
        else 0,
        "appropriate_refusal_rate": round(no_answer_hits / no_answer_total, 4)
        if no_answer_total
        else 0,
        "false_positive_rate": round(false_positives / no_answer_total, 4)
        if no_answer_total
        else 0,
        "citation_source_match": round(citation_matches / answer_cases, 4)
        if answer_cases
        else 0,
        "category_accuracy": {
            category: round(category_hits[category] / total, 4)
            for category, total in sorted(category_totals.items())
        },
        "results": results,
    }


def main():
    documents = json.loads(KNOWLEDGE_FILE.read_text(encoding="utf-8"))
    cases = json.loads(EVAL_FILE.read_text(encoding="utf-8"))
    print(json.dumps(evaluate(documents, cases), indent=2, ensure_ascii=False))


if __name__ == "__main__":
    sys.exit(main())
