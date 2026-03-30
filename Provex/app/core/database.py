# app/core/database.py
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings


# The engine manages the connection pool
engine = create_async_engine(
    settings.database_url,
    echo=settings.is_development,   # logs SQL in dev, silent in prod
    pool_size=10,
    max_overflow=20,
)

# Session factory — each request gets its own session
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,   # keep objects usable after commit
)


# All models inherit from this Base
class Base(DeclarativeBase):
    pass


# FastAPI dependency — yields a session per request, always closes it
async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()