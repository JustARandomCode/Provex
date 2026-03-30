# app/core/redis_client.py
import redis.asyncio as aioredis
from app.core.config import settings

# Single connection pool shared across the app
redis_pool = aioredis.ConnectionPool.from_url(
    settings.redis_url,
    max_connections=20,
    decode_responses=True,    # return strings not bytes
)


def get_redis() -> aioredis.Redis:
    return aioredis.Redis(connection_pool=redis_pool)


# FastAPI dependency
async def get_redis_dep() -> aioredis.Redis:
    client = get_redis()
    try:
        yield client
    finally:
        await client.aclose()