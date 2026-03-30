# app/api/hints.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.progress import UserProgress
from app.models.problem import Problem

router = APIRouter(prefix="/hints", tags=["hints"])


class HintUnlockRequest(BaseModel):
    problem_id: int
    hint_index: int


@router.post("/unlock")
async def unlock_hint(
    req: HintUnlockRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Load problem
    result = await db.execute(
        select(Problem).where(Problem.id == req.problem_id)
    )
    problem = result.scalar_one_or_none()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    hints = problem.hints
    if req.hint_index >= len(hints):
        raise HTTPException(status_code=400, detail="Hint index out of range")

    hint = hints[req.hint_index]
    cost = hint.get("cost", 5)

    # Load progress
    progress_result = await db.execute(
        select(UserProgress).where(
            UserProgress.user_id == current_user.id
        )
    )
    progress = progress_result.scalar_one_or_none()
    if not progress:
        raise HTTPException(status_code=404, detail="Progress not found")

    # Check credits
    if progress.hint_credits < cost:
        raise HTTPException(
            status_code=402,
            detail=f"Not enough credits. Need {cost}, have {progress.hint_credits}",
        )

    # Deduct credits and save
    progress.hint_credits -= cost
    await db.commit()

    return {
        "hint_index":        req.hint_index,
        "hint_text":         hint.get("text", ""),
        "cost":              cost,
        "credits_remaining": progress.hint_credits,
    }