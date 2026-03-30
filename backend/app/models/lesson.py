# app/models/lesson.py
from datetime import datetime, timezone
from sqlalchemy import String, Text, Integer, JSON, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class Lesson(Base):
    __tablename__ = "lessons"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    topic: Mapped[str] = mapped_column(String(255))
    source: Mapped[str] = mapped_column(String(50))   # "prompt" | "upload"

    # LlamaIndex output stored as structured JSON
    sections: Mapped[list] = mapped_column(JSON)       # lesson body
    qa_pairs: Mapped[list] = mapped_column(JSON)       # Q&A accordion
    quiz: Mapped[list] = mapped_column(JSON)           # 5 MCQs

    # User's quiz result (filled after they take it)
    quiz_score: Mapped[int | None] = mapped_column(Integer)
    quiz_completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )