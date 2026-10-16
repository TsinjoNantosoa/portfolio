import json
from pathlib import Path

from scripts.evaluate_playground_offline import (
    EVAL_FILE,
    KNOWLEDGE_FILE,
    corpus_documents,
    evaluate,
)


def test_offline_playground_eval_is_reproducible_and_corpus_scoped():
    documents = json.loads(Path(KNOWLEDGE_FILE).read_text(encoding="utf-8"))
    cases = json.loads(Path(EVAL_FILE).read_text(encoding="utf-8"))
    result = evaluate(documents, cases)

    assert result["documents"] == len(documents)
    assert result["evaluated"] >= 20
    assert all(
        item["type"] == "project"
        for item in corpus_documents(documents, "projects")
    )
    assert {
        item["slug"] for item in corpus_documents(documents, "engineering_lab")
    } == {
        "lab-rag",
        "lab-agentic",
        "lab-automation",
        "lab-production",
        "lab-assisted-development",
    }
    assert result["recall_at_4"] >= 0.75
    assert 0 <= result["false_positive_rate"] <= 1
    assert 0 <= result["citation_source_match"] <= 1
    assert {
        "ambiguous",
        "false_premise",
        "multi_passage",
        "no_answer",
        "out_of_scope",
        "prompt_injection",
        "simple",
        "wrong_corpus",
    }.issubset(result["category_accuracy"])
