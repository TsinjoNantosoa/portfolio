import pytest
from fastapi import HTTPException

from app.rate_limit import ConcurrencyLimiter


@pytest.mark.asyncio
async def test_concurrency_limiter_rejects_parallel_slot_and_recovers():
    limiter = ConcurrencyLimiter(1)

    async with limiter.slot():
        with pytest.raises(HTTPException) as error:
            async with limiter.slot():
                pass
        assert error.value.status_code == 429
        assert error.value.headers == {"Retry-After": "2"}

    async with limiter.slot():
        pass
