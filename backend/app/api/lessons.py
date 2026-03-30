# app/api/lessons.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.core.database import get_db
from app.models.lesson import Lesson
from app.pipelines.study_pipeline import study_pipeline

router = APIRouter(prefix="/study", tags=["study"])


class GenerateRequest(BaseModel):
    user_id: int
    topic: str


class UploadRequest(BaseModel):
    user_id: int
    topic: str
    content: str          # raw text from uploaded file


# ── POST /study/generate ────────────────────────────────────────────────────
@router.post("/generate")
async def generate_lesson(
    req: GenerateRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Triggers LlamaIndex pipeline to generate a lesson from topic.
    Returns structured lesson JSON.
    """
    try:
        result = await study_pipeline.generate_from_topic(
            user_id=req.user_id,
            topic=req.topic,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Save to DB
    lesson = Lesson(
        user_id=req.user_id,
        topic=req.topic,
        source="prompt",
        sections=result["sections"],
        qa_pairs=result["qa_pairs"],
        quiz=result["quiz"],
    )
    db.add(lesson)
    await db.commit()
    await db.refresh(lesson)

    return {"lesson_id": lesson.id, **result}


# ── POST /study/upload ───────────────────────────────────────────────────────
@router.post("/upload")
async def upload_lesson(
    req: UploadRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Ingests user-uploaded text and generates a lesson from it.
    """
    try:
        result = await study_pipeline.generate_from_text(
            user_id=req.user_id,
            topic=req.topic,
            raw_text=req.content,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    lesson = Lesson(
        user_id=req.user_id,
        topic=req.topic,
        source="upload",
        sections=result["sections"],
        qa_pairs=result["qa_pairs"],
        quiz=result["quiz"],
    )
    db.add(lesson)
    await db.commit()
    await db.refresh(lesson)

    return {"lesson_id": lesson.id, **result}


# ── GET /study/lesson/{id} ───────────────────────────────────────────────────
@router.get("/lesson/{lesson_id}")
async def get_lesson(
    lesson_id: int,
    db: AsyncSession = Depends(get_db),
):
    """
    Fetch a stored lesson by ID.
    """
    result = await db.execute(
        select(Lesson).where(Lesson.id == lesson_id)
    )
    lesson = result.scalar_one_or_none()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    return {
        "lesson_id":   lesson.id,
        "topic":       lesson.topic,
        "source":      lesson.source,
        "sections":    lesson.sections,
        "qa_pairs":    lesson.qa_pairs,
        "quiz":        lesson.quiz,
        "quiz_score":  lesson.quiz_score,
        "created_at":  lesson.created_at,
    }


# ── POST /quiz/submit ────────────────────────────────────────────────────────
@router.post("/quiz/submit")
async def submit_quiz(
    lesson_id: int,
    answers: list[int],       # index of chosen option per question
    db: AsyncSession = Depends(get_db),
):
    """
    Evaluates quiz answers, saves score, returns result.
    """
    result = await db.execute(
        select(Lesson).where(Lesson.id == lesson_id)
    )
    lesson = result.scalar_one_or_none()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    quiz = lesson.quiz
    if len(answers) != len(quiz):
        raise HTTPException(status_code=400, detail="Answer count mismatch")

    # Score the quiz
    correct = sum(
        1 for i, q in enumerate(quiz)
        if answers[i] == q["correct_index"]
    )
    score = int((correct / len(quiz)) * 100)

    # Save score
    from datetime import datetime, timezone
    lesson.quiz_score = score
    lesson.quiz_completed_at = datetime.now(timezone.utc)
    await db.commit()

    return {
        "score":   score,
        "correct": correct,
        "total":   len(quiz),
    }