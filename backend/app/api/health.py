# app/api/health.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import redis.asyncio as aioredis

from app.core.database import get_db
from app.core.redis_client import get_redis_dep
from app.services.compiler import sphere_engine

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check(
    db: AsyncSession = Depends(get_db),
    redis: aioredis.Redis = Depends(get_redis_dep),
):
    await db.execute(text("SELECT 1"))
    await redis.ping()
    se_ok = await sphere_engine.test_connection()

    return {
        "status":        "ok",
        "database":      "connected",
        "redis":         "connected",
        "sphere_engine": "connected" if se_ok else "unreachable",
    }