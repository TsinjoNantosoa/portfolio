from starlette.requests import Request

from app.client_ip import get_client_ip


def make_request(
    forwarded_for: str | None = None,
    direct_ip: str = "127.0.0.1",
) -> Request:
    headers = []
    if forwarded_for is not None:
        headers.append((b"x-forwarded-for", forwarded_for.encode()))
    return Request(
        {
            "type": "http",
            "method": "GET",
            "path": "/",
            "headers": headers,
            "client": (direct_ip, 12345),
        }
    )


def test_direct_request_uses_socket_address():
    assert get_client_ip(make_request(), trust_proxy_headers=False) == "127.0.0.1"


def test_single_forwarded_ip_uses_render_client_address():
    request = make_request("203.0.113.42", direct_ip="10.0.0.2")
    assert get_client_ip(request, trust_proxy_headers=True) == "203.0.113.42"


def test_multiple_forwarded_addresses_use_first_address():
    request = make_request("203.0.113.42, 10.0.0.3, 10.0.0.4")
    assert get_client_ip(request, trust_proxy_headers=True) == "203.0.113.42"


def test_empty_forwarding_header_falls_back_to_socket_address():
    request = make_request("  ", direct_ip="10.0.0.2")
    assert get_client_ip(request, trust_proxy_headers=True) == "10.0.0.2"


def test_malformed_forwarding_header_falls_back_to_socket_address():
    request = make_request("not-an-ip, 203.0.113.42", direct_ip="10.0.0.2")
    assert get_client_ip(request, trust_proxy_headers=True) == "10.0.0.2"


def test_forwarded_header_is_ignored_when_proxy_trust_is_disabled():
    request = make_request("203.0.113.42", direct_ip="127.0.0.1")
    assert get_client_ip(request, trust_proxy_headers=False) == "127.0.0.1"
