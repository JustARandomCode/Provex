# app/models/problem.py
from sqlalchemy import String, Text, Integer, JSON, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
import enum


class Difficulty(str, enum.Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


class Problem(Base):
    __tablename__ = "problems"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    description: Mapped[str] = mapped_column(Text)
    difficulty: Mapped[Difficulty] = mapped_column(Enum(Difficulty))
    topic: Mapped[str] = mapped_column(String(100), index=True)   # "ARRAY", "DP", etc.
    language: Mapped[str] = mapped_column(String(50))              # "python3", "cpp"
    xp_reward: Mapped[int] = mapped_column(Integer, default=30)

    # Stored as JSON arrays
    examples: Mapped[list] = mapped_column(JSON)         # [{input, output, explain}]
    hints: Mapped[list] = mapped_column(JSON)            # [{cost, text}]
    test_cases: Mapped[list] = mapped_column(JSON)       # [{input, expected}]
    solution_code: Mapped[str] = mapped_column(Text)
    constraints: Mapped[str | None] = mapped_column(Text)

    submissions: Mapped[list["Submission"]] = relationship(back_populates="problem")