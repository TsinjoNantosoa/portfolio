import json
from pathlib import Path

from app.chat import is_clearly_unrelated, is_prompt_injection

EVALS = Path(__file__).parent / "evals" / "recruiter_questions.json"


def test_recruiter_eval_dataset_is_well_formed_and_broad():
    items = json.loads(EVALS.read_text(encoding="utf-8"))
    assert 30 <= len(items) <= 50
    assert len({item["question"] for item in items}) == len(items)
    assert all(
        {
            "question",
            "expected_source_slugs",
            "expected_keywords",
            "must_not_contain",
            "out_of_scope",
        }
        <= item.keys()
        for item in items
    )
    assert sum(item["out_of_scope"] for item in items) >= 6


def test_obvious_eval_attacks_and_unrelated_prompts_are_guarded():
    items = json.loads(EVALS.read_text(encoding="utf-8"))
    guarded = [item for item in items if item["out_of_scope"]]
    assert all(
        is_prompt_injection(item["question"]) or is_clearly_unrelated(item["question"])
        for item in guarded
    )
