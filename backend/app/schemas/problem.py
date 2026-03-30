# app/schemas/problem.py
from pydantic import BaseModel
from typing import Optional


class GenerateRequest(BaseModel):
    topic: str       # "Arrays", "Dynamic Programming", etc.
    difficulty: str  # "easy" | "medium" | "hard"
    language: str    # "python3" | "cpp" | "java" | "javascript"


class SeedRequest(BaseModel):
    topics: list[str]
    difficulties: list[str]
    language: str
    count_per_combo: int = 2  # how many problems per topic+difficulty pair


class ProblemResponse(BaseModel):
    id: int
    title: str
    slug: str
    description: str
    difficulty: str
    topic: str
    language: str
    xp_reward: int
    examples: list[dict]
    constraints: str | None
    hints: list[dict]     # hints without solution — frontend shows these

    model_config = {"from_attributes": True}


class ProblemDetailResponse(ProblemResponse):
    test_cases: list[dict]   # only sent when user starts solving