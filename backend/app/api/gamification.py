# app/api/gamification.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.problem import Problem
from app.services.gamification import gamification
from app.schemas.gamification import HintUnlockRequest, MissionCompleteRequest

router = APIRouter(prefix="/gamification", tags=["gamification"])


# ── GET /gamification/status ─────────────────────────────────────────────────
# Powers the "Your STATUS" section on the dashboard —
# XP progress, streak, hint credits, badges, missions

@router.get("/status")
async def get_status(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Full gamification snapshot for the dashboard."""
    badges   = await gamification.get_badges(db, current_user.id)
    missions = await gamification.get_daily_missions(db, current_user.id)

    from app.models.progress import UserProgress
    result = await db.execute(
        select(UserProgress).where(UserProgress.user_id == current_user.id)
    )
    progress = result.scalar_one_or_none()

    return {
        "total_xp":       progress.total_xp if progress else 0,
        "hint_credits":   progress.hint_credits if progress else 50,
        "current_streak": progress.current_streak if progress else 0,
        "longest_streak": progress.longest_streak if progress else 0,
        "easy_solved":    progress.easy_solved if progress else 0,
        "medium_solved":  progress.medium_solved if progress else 0,
        "hard_solved":    progress.hard_solved if progress else 0,
        "monthly_activity": progress.monthly_activity if progress else [],
        "badges":         badges,
        "missions":       missions,
    }


# ── POST /gamification/login-streak ──────────────────────────────────────────
# Call this once per session after login to update the streak

@router.post("/login-streak")
async def record_login(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update streak on login. Safe to call multiple times per day."""
    result = await gamification.update_streak(db, current_user.id)
    return result


# ── POST /gamification/hints/unlock ──────────────────────────────────────────
# User clicks "Unlock Hint" on the challenge page

@router.post("/hints/unlock")
async def unlock_hint(
    body: HintUnlockRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Spend hint credits to reveal a hint.
    Returns the hint text if credits are sufficient.
    """
    # Load the problem to get hint cost and text
    result = await db.execute(
        select(Problem).where(Problem.id == body.problem_id)
    )
    problem = result.scalar_one_or_none()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    hints = problem.hints or []
    if body.hint_index >= len(hints):
        raise HTTPException(status_code=404, detail="Hint not found")

    hint = hints[body.hint_index]
    cost = hint.get("cost", 10)

    # Try to spend credits
    try:
        credit_result = await gamification.spend_hint_credits(
            db, current_user.id, cost
        )
    except ValueError as e:
        raise HTTPException(status_code=402, detail=str(e))

    return {
        "hint_text":         hint.get("text", ""),
        "credits_spent":     credit_result["credits_spent"],
        "credits_remaining": credit_result["credits_remaining"],
    }


# ── GET /gamification/missions ────────────────────────────────────────────────
# Returns today's missions with completion status

@router.get("/missions")
async def get_missions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    missions = await gamification.get_daily_missions(db, current_user.id)
    return {"missions": missions}


# ── POST /gamification/missions/complete ─────────────────────────────────────
# Mark a mission as done — called from your frontend logic

@router.post("/missions/complete")
async def complete_mission(
    body: MissionCompleteRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        result = await gamification.complete_mission(
            db, current_user.id, body.mission_id
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return result


# ── GET /gamification/badges ──────────────────────────────────────────────────
# Returns all badges with earned status — for the achievements row

@router.get("/badges")
async def get_badges(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    badges = await gamification.get_badges(db, current_user.id)
    return {"badges": badges}