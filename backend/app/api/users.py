# app/api/users.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.progress import UserProgress
from app.schemas.user import UserProfile

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserProfile)
async def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Returns the authenticated user's profile + progress stats.
    The Depends(get_current_user) does ALL the token validation —
    if no valid token, FastAPI never runs this function body.
    """
    result = await db.execute(
        select(UserProgress).where(
            UserProgress.user_id == current_user.id
        )
    )
    progress = result.scalar_one_or_none()

    return UserProfile(
        id=current_user.id,
        email=current_user.email,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        is_active=current_user.is_active,
        created_at=current_user.created_at,
        total_xp=progress.total_xp if progress else 0,
        hint_credits=progress.hint_credits if progress else 50,
        current_streak=progress.current_streak if progress else 0,
        easy_solved=progress.easy_solved if progress else 0,
        medium_solved=progress.medium_solved if progress else 0,
        hard_solved=progress.hard_solved if progress else 0,
    )