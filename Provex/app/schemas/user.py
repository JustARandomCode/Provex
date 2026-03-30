# app/schemas/user.py
from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserProfile(BaseModel):
    id: int
    email: EmailStr
    first_name: str
    last_name: str
    is_active: bool
    created_at: datetime

    # Progress fields
    total_xp: int = 0
    hint_credits: int = 50
    current_streak: int = 0
    easy_solved: int = 0
    medium_solved: int = 0
    hard_solved: int = 0

    model_config = {"from_attributes": True}
    # from_attributes=True lets Pydantic read
    # directly from SQLAlchemy model instances