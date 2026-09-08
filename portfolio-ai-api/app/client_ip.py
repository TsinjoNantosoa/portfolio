from ipaddress import ip_address

from fastapi import Request


def get_client_ip(request: Request, trust_proxy_headers: bool) -> str:
    """Resolve the client IP, trusting Render's forwarding chain only when enabled."""
    direct_address = request.client.host if request.client else "unknown"
    if not trust_proxy_headers:
        return direct_address

    forwarded = request.headers.get("x-forwarded-for", "")
    first_address = forwarded.split(",", maxsplit=1)[0].strip()
    if not first_address:
        return direct_address

    try:
        return str(ip_address(first_address))
    except ValueError:
        return direct_address
