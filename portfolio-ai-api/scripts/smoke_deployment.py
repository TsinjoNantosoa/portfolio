import argparse
import json
import sys
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import Request, urlopen


def validate_base_url(value: str) -> str:
    base_url = value.rstrip("/")
    parsed = urlsplit(base_url)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise ValueError("Base URL must be an absolute HTTP(S) URL")
    return base_url


def request_json(
    base_url: str,
    path: str,
    *,
    method: str = "GET",
    body: dict | None = None,
    token: str | None = None,
) -> dict:
    headers = {"Accept": "application/json"}
    data = None
    if body is not None:
        data = json.dumps(body).encode()
        headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = f"Bearer {token}"
    request = Request(
        f"{base_url}{path}",
        data=data,
        headers=headers,
        method=method,
    )
    with urlopen(request, timeout=90) as response:  # nosec B310
        return json.loads(response.read())


def smoke(base_url: str, include_chat: bool, include_playground: bool) -> None:
    base_url = validate_base_url(base_url)
    health = request_json(base_url, "/health")
    print(f"health: {health.get('status')}")

    ready = request_json(base_url, "/ready")
    print(
        f"ready: {ready.get('status')} "
        f"(collection={ready.get('collection')}, documents={ready.get('documents')}, "
        f"corpus_version={ready.get('corpus_version')})"
    )

    session = request_json(
        base_url,
        "/api/public/session",
        method="POST",
    )
    print(f"session: {'ok' if session.get('token') else 'failed'}")

    if not include_chat:
        print("chat: skipped (use --chat for one paid generation request)")

    if include_chat:
        request = Request(
            f"{base_url}/api/public/chat/stream",
            data=json.dumps(
                {
                    "message": "What are Tsinjo's main AI engineering areas?",
                    "conversation_id": session["session_id"],
                }
            ).encode(),
            headers={
                "Authorization": f"Bearer {session['token']}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        saw_done = False
        with urlopen(request, timeout=90) as response:  # nosec B310
            for raw_line in response:
                line = raw_line.decode().strip()
                if not line.startswith("data:"):
                    continue
                event = json.loads(line[5:].strip())
                if event.get("type") == "error":
                    raise RuntimeError("Chat smoke test returned a safe stream error")
                saw_done = saw_done or event.get("type") == "done"
        if not saw_done:
            raise RuntimeError("Chat stream ended without a done event")
        print("chat: ok")

    if not include_playground:
        print(
            "playground: skipped "
            "(use --playground for one paid embedding + generation request)"
        )
        return

    result = request_json(
        base_url,
        "/api/public/playground/query",
        method="POST",
        token=session["token"],
        body={
            "message": "How does SIHIA combine dense retrieval and BM25?",
            "corpus": "projects",
            "conversation_id": session["session_id"],
        },
    )
    if (
        result.get("execution_mode") != "live"
        or not result.get("generated_from_retrieved_documents")
        or not result.get("citations_available")
        or result.get("support_status") != "not_evaluated"
        or not result.get("evidence")
    ):
        raise RuntimeError("Playground smoke response failed acceptance checks")
    if not all(
        str(item.get("url", "")).startswith(("/work/", "/lab"))
        for item in result["evidence"]
    ):
        raise RuntimeError("Playground returned a non-public citation")
    print(
        "playground: ok "
        f"(passages={result.get('selected_passages')}, "
        f"response_time_ms={result.get('response_time_ms')})"
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Smoke-test a deployed Tsinjo AI API",
    )
    parser.add_argument("--base-url", required=True)
    parser.add_argument(
        "--chat",
        action="store_true",
        help="Perform one paid OpenAI-backed chat request",
    )
    parser.add_argument(
        "--playground",
        action="store_true",
        help="Perform one paid OpenAI/Qdrant Playground request",
    )
    args = parser.parse_args()
    try:
        smoke(args.base_url, args.chat, args.playground)
    except (HTTPError, URLError, ValueError, RuntimeError) as exc:
        print(f"smoke failed: {type(exc).__name__}", file=sys.stderr)
        raise SystemExit(1) from exc
