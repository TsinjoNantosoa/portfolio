from datetime import UTC, datetime, timedelta
from typing import cast
from uuid import uuid4

import jwt
from fastapi import HTTPException, status

from app.config import Settings

ALGORITHM = "HS256"
SCOPE = "portfolio_chat"
TENANT = "portfolio"


def create_session_token(settings: Settings) -> tuple[str, datetime, str]:
    now = datetime.now(UTC)
    expires = now + timedelta(minutes=settings.session_ttl_minutes)
    session_id = str(uuid4())
    payload = {
        "sub": "anonymous",
        "sid": session_id,
        "scope": SCOPE,
        "tenant": TENANT,
        "iat": now,
        "exp": expires,
    }
    token = cast(
        str,
        jwt.encode(payload, settings.session_secret, algorithm=ALGORITHM),
    )
    return token, expires, session_id


def decode_session_token(token: str, settings: Settings) -> dict:
    try:
        payload = jwt.decode(
            token,
            settings.session_secret,
            algorithms=[ALGORITHM],
            options={"require": ["exp", "iat", "sub"]},
        )
    except jwt.ExpiredSignatureError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired"
        ) from exc
    except jwt.InvalidTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session"
        ) from exc
    if (
        payload.get("scope") != SCOPE
        or payload.get("tenant") != TENANT
        or payload.get("sub") != "anonymous"
        or not payload.get("sid")
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Invalid session scope"
        )
    return payload
