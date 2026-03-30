# app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.challenges import router as challenges_router

from app.core.config import settings
from app.core.database import engine
from app.api.health import router as health_router
from app.api.auth import router as auth_router          
from app.api.users import router as users_router        
from app.api.challenges import router as challenges_router
from app.api.gamification import router as gamification_router
from app.api.problems import router as problems_router
from app.api.lessons import router as lessons_router
from app.api.agent import router as agent_router
from app.api.hints import router as hints_router



@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: test DB connection
    async with engine.begin() as conn:
        pass   # if this doesn't raise, DB is reachable
    yield
    # Shutdown: close engine pool
    await engine.dispose()


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers — only health for now
app.include_router(health_router, prefix="/api")
app.include_router(challenges_router, prefix="/api")
app.include_router(auth_router,       prefix="/api")   
app.include_router(users_router,      prefix="/api") 
app.include_router(gamification_router, prefix="/api")
app.include_router(problems_router, prefix="/api")
app.include_router(lessons_router, prefix="/api")
app.include_router(agent_router, prefix="/api")
app.include_router(hints_router, prefix="/api")