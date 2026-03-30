# app/api/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User
from app.models.progress import UserProgress
from app.schemas.auth import SignupRequest, LoginRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])


# ── POST /api/auth/signup ────────────────────────────────────────────────────

@router.post(
    "/signup",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
)
async def signup(
    body: SignupRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Register a new user.
    - Validates request via SignupRequest schema
    - Checks email is not already taken
    - Hashes password with bcrypt
    - Creates User row + UserProgress row in one transaction
    - Returns a JWT token so the user is instantly logged in
    """

    # 1. Check email uniqueness
    existing = await db.execute(
        select(User).where(User.email == body.email)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    # 2. Hash the password — NEVER store plain text
    hashed = hash_password(body.password)

    # 3. Create the user row
    user = User(
        first_name=body.first_name,
        last_name=body.last_name,
        email=body.email,
        phone=body.phone,
        hashed_password=hashed,
        is_active=True,
        is_verified=False,   # no email verification for now
    )
    db.add(user)
    await db.flush()   # flush to get user.id without committing yet

    # 4. Create UserProgress row — every user starts with
    #    50 hint credits and zero everything else
    progress = UserProgress(
        user_id=user.id,
        total_xp=0,
        hint_credits=50,
        current_streak=0,
        longest_streak=0,
        easy_solved=0,
        medium_solved=0,
        hard_solved=0,
        monthly_activity=[],
        badges=[],
    )
    db.add(progress)
    await db.commit()
    await db.refresh(user)

    # 5. Generate JWT and return — user is auto logged in
    token = create_access_token(subject=user.id)

    return TokenResponse(
        access_token=token,
        user_id=user.id,
        first_name=user.first_name,
        email=user.email,
    )


# ── POST /api/auth/login ─────────────────────────────────────────────────────

@router.post("/login", response_model=TokenResponse)
async def login(
    body: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Login with email + password.
    - Looks up user by email
    - Verifies bcrypt hash
    - Returns a JWT token
    """

    # 1. Find user by email
    result = await db.execute(
        select(User).where(User.email == body.email)
    )
    user = result.scalar_one_or_none()

    # 2. Generic error — don't reveal whether email exists or password wrong
    #    Both cases return the same 401 message (security best practice)
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )

    # 3. Issue token
    token = create_access_token(subject=user.id)

    return TokenResponse(
        access_token=token,
        user_id=user.id,
        first_name=user.first_name,
        email=user.email,
    )