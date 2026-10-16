from ipaddress import ip_address
from typing import Literal

from fastapi import Request


def _normalized_ip(value: str) -> str | None:
    try:
        return str(ip_address(value.strip()))
    except ValueError:
        return None


def get_client_ip(
    request: Request,
    trust_proxy_headers: bool,
    trusted_proxy_provider: Literal["none", "render"] = "none",
) -> str:
    """Resolve a client address without trusting a caller-controlled XFF chain."""
    direct_address = request.client.host if request.client else "unknown"
    direct_ip = _normalized_ip(direct_address) or "unknown"
    if not trust_proxy_headers or trusted_proxy_provider != "render":
        return direct_ip

    # Render public services receive both markers from its edge. Render documents
    # CF-Connecting-IP as overwritten by Cloudflare, unlike append-only XFF.
    if not request.headers.get("cf-ray") or not request.headers.get("rndr-id"):
        return direct_ip
    forwarded = request.headers.get("cf-connecting-ip", "")
    if "," in forwarded:
        return direct_ip
    trusted_ip = _normalized_ip(forwarded)
    if trusted_ip is None:
        return direct_ip
    return trusted_ip
