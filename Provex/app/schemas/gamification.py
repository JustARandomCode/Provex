# app/schemas/gamification.py
from pydantic import BaseModel


class HintUnlockRequest(BaseModel):
    problem_id: int
    hint_index: int   # which hint (0-based index into problem.hints array)


class MissionCompleteRequest(BaseModel):
    mission_id: str


class XPAwardRequest(BaseModel):
    amount: int
    reason: str = ""