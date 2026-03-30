# app/api/problems.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.exc import IntegrityError

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.problem import Problem, Difficulty
from app.pipelines.qwen import qwen_pipeline, VALID_TOPICS
from app.schemas.problem import (
    GenerateRequest,
    SeedRequest,
    ProblemResponse,
    ProblemDetailResponse,
)

router = APIRouter(prefix="/problems", tags=["problems"])


# ── POST /problems/generate ───────────────────────────────────────────────────
# On-demand: generate one problem via Qwen and save it

@router.post("/generate", response_model=ProblemDetailResponse)
async def generate_problem(
    body: GenerateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Generate a single problem using Qwen via Ollama.
    Saves to DB and returns the full problem including test cases.
    Takes 10-30 seconds depending on your hardware.
    """
    try:
        problem_data = await qwen_pipeline.generate(
            topic=body.topic,
            difficulty=body.difficulty,
            language=body.language,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))

    # Check slug uniqueness — regenerate title suffix if duplicate
    slug = problem_data["slug"]
    existing = await db.execute(
        select(Problem).where(Problem.slug == slug)
    )
    if existing.scalar_one_or_none():
        slug = f"{slug}-v2"

    problem = Problem(
        title=problem_data["title"],
        slug=slug,
        description=problem_data["description"],
        difficulty=Difficulty(problem_data["difficulty"]),
        topic=problem_data["topic"],
        language=problem_data["language"],
        xp_reward=problem_data["xp_reward"],
        examples=problem_data["examples"],
        test_cases=problem_data["test_cases"],
        hints=problem_data["hints"],
        solution_code=problem_data["solution_code"],
        constraints=problem_data.get("constraints"),
    )
    db.add(problem)

    try:
        await db.commit()
        await db.refresh(problem)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=409,
            detail="A problem with this title already exists"
        )

    return problem


# ── POST /problems/seed ───────────────────────────────────────────────────────
# Pre-generate a bank of problems for all topic+difficulty combos

@router.post("/seed")
async def seed_problems(
    body: SeedRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Bulk generate problems and store them.
    Example: 3 topics × 3 difficulties × 2 per combo = 18 problems.
    This runs synchronously — expect it to take several minutes.
    Call this once to populate your problem bank before launch.
    """
    generated = []
    failed    = []

    for topic in body.topics:
        for difficulty in body.difficulties:
            for i in range(body.count_per_combo):
                try:
                    problem_data = await qwen_pipeline.generate(
                        topic=topic,
                        difficulty=difficulty,
                        language=body.language,
                    )

                    slug = problem_data["slug"]
                    # Make slug unique across iterations
                    existing = await db.execute(
                        select(Problem).where(Problem.slug == slug)
                    )
                    if existing.scalar_one_or_none():
                        slug = f"{slug}-{i+2}"

                    problem = Problem(
                        title=problem_data["title"],
                        slug=slug,
                        description=problem_data["description"],
                        difficulty=Difficulty(problem_data["difficulty"]),
                        topic=problem_data["topic"],
                        language=problem_data["language"],
                        xp_reward=problem_data["xp_reward"],
                        examples=problem_data["examples"],
                        test_cases=problem_data["test_cases"],
                        hints=problem_data["hints"],
                        solution_code=problem_data["solution_code"],
                        constraints=problem_data.get("constraints"),
                    )
                    db.add(problem)
                    await db.commit()
                    await db.refresh(problem)
                    generated.append(problem.slug)

                except Exception as e:
                    await db.rollback()
                    failed.append({
                        "topic": topic,
                        "difficulty": difficulty,
                        "error": str(e),
                    })

    return {
        "generated": len(generated),
        "failed":    len(failed),
        "slugs":     generated,
        "errors":    failed,
    }


# ── GET /problems/list ────────────────────────────────────────────────────────
# Powers the Coding Arena page — filter by topic + difficulty

@router.get("/list", response_model=list[ProblemResponse])
async def list_problems(
    topic:      str | None = Query(None),
    difficulty: str | None = Query(None),
    language:   str | None = Query(None),
    limit:      int        = Query(20, le=100),
    offset:     int        = Query(0),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns problems filtered by topic, difficulty, and language.
    Used to populate the challenge list panel on the left of the
    coding arena page (image 8 in your design screenshots).
    """
    query = select(Problem)

    if topic:
        query = query.where(Problem.topic == topic)
    if difficulty:
        query = query.where(Problem.difficulty == Difficulty(difficulty))
    if language:
        query = query.where(Problem.language == language)

    query = query.order_by(Problem.difficulty, Problem.id)
    query = query.limit(limit).offset(offset)

    result = await db.execute(query)
    problems = result.scalars().all()

    return problems


# ── GET /problems/:id ─────────────────────────────────────────────────────────
# Full problem detail — called when user clicks a problem to solve it

@router.get("/{problem_id}", response_model=ProblemDetailResponse)
async def get_problem(
    problem_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns the full problem including test_cases.
    Called when the user enters the challenge page for a specific problem.
    """
    result = await db.execute(
        select(Problem).where(Problem.id == problem_id)
    )
    problem = result.scalar_one_or_none()

    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    return problem


# ── GET /problems/topics/list ─────────────────────────────────────────────────
# Returns available topics and counts for the arena sidebar

@router.get("/topics/list")
async def get_topics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns each topic with problem counts per difficulty.
    Used to render the course cards on the Coding Arena page.
    """
    result = await db.execute(
        select(
            Problem.topic,
            Problem.difficulty,
            func.count(Problem.id).label("count"),
        ).group_by(Problem.topic, Problem.difficulty)
    )
    rows = result.all()

    # Reshape into { topic: { easy: N, medium: N, hard: N, total: N } }
    topics: dict = {}
    for row in rows:
        t = row.topic
        if t not in topics:
            topics[t] = {"easy": 0, "medium": 0, "hard": 0, "total": 0}
        topics[t][row.difficulty.value] += row.count
        topics[t]["total"] += row.count

    return {"topics": topics}