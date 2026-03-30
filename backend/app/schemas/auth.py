# app/schemas/auth.py
from pydantic import BaseModel, EmailStr, field_validator
import re


class SignupRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr          # Pydantic validates email format automatically
    phone: str | None = None
    password: str

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        # Minimum 8 chars, at least one digit
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one number")
        return v

    @field_validator("first_name", "last_name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Name cannot be empty")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    first_name: str
    email: str