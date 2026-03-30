# app/api/challenges.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel


from app.core.database import get_db
from app.models.problem import Problem
from app.models.submission import Submission
from app.models.progress import UserProgress
from app.services.compiler import sphere_engine
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.services.gamification import gamification

router = APIRouter(prefix="/challenges", tags=["challenges"])


# ── Request / Response schemas ──────────────────────────────────────────────

class RunRequest(BaseModel):
    source_code: str
    language: str        # "python3" | "cpp" | "java" | "javascript"
    stdin_input: str = ""


class SubmitRequest(BaseModel):
    problem_id: int
    source_code: str
    language: str
          


# ── POST /challenges/run ─────────────────────────────────────────────────────
# User clicks the RUN button. Executes code with optional stdin.
# Does NOT save to DB, does NOT award XP.

@router.post("/run")
async def run_code(req: RunRequest):
    """
    Sends code to Sphere Engine and returns stdout output.
    Used for the 'RUN' button — quick feedback, no judging.
    """
    try:
        result = await sphere_engine.run_code(
            source_code=req.source_code,
            language=req.language,
            stdin_input=req.stdin_input,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except PermissionError:
        raise HTTPException(status_code=503, detail="Compiler service authentication failed")
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))

    return {
        "status":       result["status_name"],
        "output":       result["output"],
        "error":        result["error"],
        "compile_info": result["compile_info"],
        "time_seconds": result["time_seconds"],
        "memory_kb":    result["memory_kb"],
    }


# ── POST /challenges/submit ──────────────────────────────────────────────────
# User clicks SUBMIT. Judges against all hidden test cases.
# Saves result to DB. Awards XP if fully passed.

@router.post("/submit")
async def submit_code(
    req: SubmitRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Runs user code against every test case stored in the problem.
    Saves submission record. Awards XP on full pass.
    """
    # 1. Load the problem
    result = await db.execute(
        select(Problem).where(Problem.id == req.problem_id)
    )
    problem = result.scalar_one_or_none()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    # 2. Run against all test cases via Sphere Engine
    try:
        judge_result = await sphere_engine.run_against_test_cases(
            source_code=req.source_code,
            language=req.language,
            test_cases=problem.test_cases,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except PermissionError:
        raise HTTPException(status_code=503, detail="Compiler service authentication failed")
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))

    # 3. Calculate XP earned
    # Full pass = full reward. Partial pass = proportional reward.
    xp_earned = 0
    if judge_result["passed"]:
        xp_earned = problem.xp_reward
    elif judge_result["passed_count"] > 0:
        ratio = judge_result["passed_count"] / judge_result["total"]
        xp_earned = int(problem.xp_reward * ratio * 0.5)  # partial = 50% rate

    # 4. Save submission to DB
    submission = Submission(
        user_id=current_user.id,
        problem_id=req.problem_id,
        code=req.source_code,
        language=req.language,
        passed=judge_result["passed"],
        test_results=judge_result["results"],
        hints_used=0,
        xp_earned=xp_earned,
    )
    db.add(submission)

    # 5. Award XP — update user progress
    if xp_earned > 0:
        progress_result = await db.execute(
            select(UserProgress).where(UserProgress.user_id == current_user.id)
        )
        progress = progress_result.scalar_one_or_none()

        if progress:
            progress.total_xp += xp_earned

            # Increment difficulty counter on full pass
            if judge_result["passed"]:
                diff = problem.difficulty.value  # "easy" | "medium" | "hard"
                if diff == "easy":
                    progress.easy_solved += 1
                elif diff == "medium":
                    progress.medium_solved += 1
                elif diff == "hard":
                    progress.hard_solved += 1

    await db.commit()

    # 6. Gamification — only runs on full pass
    if judge_result["passed"]:
        # Update streak
        await gamification.update_streak(db, current_user.id)

        # Reload progress after commit so counts are fresh
        progress_result = await db.execute(
            select(UserProgress).where(UserProgress.user_id == current_user.id)
        )
        progress = progress_result.scalar_one_or_none()

        if progress:
            # Check easy mission
            if problem.difficulty.value == "easy" and progress.easy_solved >= 3:
                await gamification.complete_mission(db, current_user.id, "solve_3_easy")

            # Check medium mission
            if problem.difficulty.value == "medium":
                await gamification.complete_mission(db, current_user.id, "solve_1_medium")

    # 7. Return result to frontend
    return {
        "passed":       judge_result["passed"],
        "passed_count": judge_result["passed_count"],
        "total":        judge_result["total"],
        "xp_earned":    xp_earned,
        "results":      judge_result["results"],
    }

    