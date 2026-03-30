# app/services/gamification.py  (continued from above)
from datetime import datetime, timezone, date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.progress import UserProgress

BADGES = [
    {
        "id": "beginners_batch",
        "name": "Beginners Batch",
        "description": "Solve your first 5 problems",
        "stars": 1,
        "check": lambda p: (p.easy_solved + p.medium_solved + p.hard_solved) >= 5,
    },
    {
        "id": "easy_dozen",
        "name": "Easy Dozen",
        "description": "Solve 12 easy problems",
        "stars": 2,
        "check": lambda p: p.easy_solved >= 12,
    },
    {
        "id": "medium_mastery",
        "name": "Medium Mastery",
        "description": "Solve 10 medium problems",
        "stars": 2,
        "check": lambda p: p.medium_solved >= 10,
    },
    {
        "id": "hard_hitter",
        "name": "Hard Hitter",
        "description": "Solve 5 hard problems",
        "stars": 3,
        "check": lambda p: p.hard_solved >= 5,
    },
    {
        "id": "xp_500",
        "name": "XP Hunter",
        "description": "Earn 500 total XP",
        "stars": 2,
        "check": lambda p: p.total_xp >= 500,
    },
    {
        "id": "xp_1000",
        "name": "XP Legend",
        "description": "Earn 1000 total XP",
        "stars": 3,
        "check": lambda p: p.total_xp >= 1000,
    },
    {
        "id": "streak_7",
        "name": "Week Warrior",
        "description": "Maintain a 7-day streak",
        "stars": 2,
        "check": lambda p: p.current_streak >= 7,
    },
    {
        "id": "streak_30",
        "name": "Monthly Champion",
        "description": "Maintain a 30-day streak",
        "stars": 3,
        "check": lambda p: p.current_streak >= 30,
    },
]

DAILY_MISSIONS = [
    {
        "id": "solve_3_easy",
        "label": "Complete 3 easy problems",
        "xp_reward": 50,
    },
    {
        "id": "solve_no_hints",
        "label": "Submit without using hints",
        "xp_reward": 30,
    },
    {
        "id": "solve_1_medium",
        "label": "Solve one medium problem",
        "xp_reward": 60,
    },
    {
        "id": "streak_5",
        "label": "Maintain a 5-problem streak today",
        "xp_reward": 40,
    },
    {
        "id": "beat_best_time",
        "label": "Beat your best time on any problem",
        "xp_reward": 35,
    },
]

class GamificationService:
    

    async def award_xp(
        self,
        db: AsyncSession,
        user_id: int,
        amount: int,
        reason: str = "",
    ) -> dict:
        """
        Add XP to a user's total.
        Also triggers badge check after every XP award.
        Returns: { total_xp, xp_added, new_badges }
        """
        progress = await self._get_progress(db, user_id)
        progress.total_xp += amount

        new_badges = await self._check_and_award_badges(progress)
        await db.commit()

        return {
            "xp_added":  amount,
            "total_xp":  progress.total_xp,
            "reason":    reason,
            "new_badges": new_badges,
        }

    # ── Streaks ──────────────────────────────────────────────────────────────

    async def update_streak(
        self,
        db: AsyncSession,
        user_id: int,
    ) -> dict:
        """
        Called on every login and every problem solve.
        Logic:
          - If last_active_date was yesterday → increment streak
          - If last_active_date was today already → no change
          - If last_active_date was 2+ days ago → reset to 1
          - If never set → set to 1

        Also updates monthly_activity array (30 booleans
        representing the last 30 days — used for the calendar
        in your dashboard design).

        Returns: { current_streak, longest_streak, streak_changed }
        """
        progress = await self._get_progress(db, user_id)
        today = date.today()
        old_streak = progress.current_streak
        streak_changed = False

        if progress.last_active_date is None:
            # First ever login
            progress.current_streak = 1
            streak_changed = True

        else:
            last = progress.last_active_date.date()
            delta = (today - last).days

            if delta == 0:
                # Already logged in today — no change
                pass
            elif delta == 1:
                # Consecutive day — increment
                progress.current_streak += 1
                streak_changed = True
            else:
                # Missed a day — reset
                progress.current_streak = 1
                streak_changed = True

        # Update longest streak record
        if progress.current_streak > progress.longest_streak:
            progress.longest_streak = progress.current_streak

        # Update last active timestamp
        progress.last_active_date = datetime.now(timezone.utc)

        # Update the monthly activity array (30 slots, index 0 = today)
        activity = list(progress.monthly_activity or [False] * 30)
        if len(activity) < 30:
            activity = activity + [False] * (30 - len(activity))
        activity[0] = True   # mark today as active
        progress.monthly_activity = activity

        # Check streak badges
        new_badges = await self._check_and_award_badges(progress)
        await db.commit()

        return {
            "current_streak": progress.current_streak,
            "longest_streak": progress.longest_streak,
            "streak_changed": streak_changed,
            "new_badges":     new_badges,
        }

    # ── Hint credits ─────────────────────────────────────────────────────────

    async def spend_hint_credits(
        self,
        db: AsyncSession,
        user_id: int,
        cost: int,
    ) -> dict:
        """
        Deduct hint credits from user balance.
        Raises ValueError if they don't have enough.
        Returns: { credits_remaining, credits_spent }
        """
        progress = await self._get_progress(db, user_id)

        if progress.hint_credits < cost:
            raise ValueError(
                f"Not enough credits. You have {progress.hint_credits}, need {cost}."
            )

        progress.hint_credits -= cost
        await db.commit()

        return {
            "credits_spent":     cost,
            "credits_remaining": progress.hint_credits,
        }

    async def earn_hint_credits(
        self,
        db: AsyncSession,
        user_id: int,
        amount: int,
        reason: str = "",
    ) -> dict:
        """
        Award hint credits — given for completing lessons,
        daily missions, etc.
        Returns: { credits_added, credits_total }
        """
        progress = await self._get_progress(db, user_id)
        progress.hint_credits += amount
        await db.commit()

        return {
            "credits_added": amount,
            "credits_total": progress.hint_credits,
            "reason":        reason,
        }

    # ── Missions ─────────────────────────────────────────────────────────────

    async def get_daily_missions(
        self,
        db: AsyncSession,
        user_id: int,
    ) -> list[dict]:
        """
        Returns today's missions with completion status.
        Missions are stored as JSON on UserProgress.daily_missions:
        {
            "date": "2026-03-29",
            "missions": {
                "solve_3_easy":   { "completed": True,  "progress": 3 },
                "solve_no_hints": { "completed": False, "progress": 0 },
                ...
            }
        }
        If the stored date is not today, resets missions for the new day.
        """
        progress = await self._get_progress(db, user_id)
        today_str = date.today().isoformat()

        stored = progress.daily_missions or {}
        if stored.get("date") != today_str:
            # New day — reset all missions
            stored = {
                "date": today_str,
                "missions": {
                    m["id"]: {"completed": False, "progress": 0}
                    for m in DAILY_MISSIONS
                },
            }
            progress.daily_missions = stored
            await db.commit()

        # Merge definition data with completion state
        result = []
        for mission_def in DAILY_MISSIONS:
            state = stored["missions"].get(
                mission_def["id"],
                {"completed": False, "progress": 0}
            )
            result.append({
                "id":        mission_def["id"],
                "label":     mission_def["label"],
                "xp_reward": mission_def["xp_reward"],
                "completed": state["completed"],
                "progress":  state["progress"],
            })
        return result

    async def complete_mission(
        self,
        db: AsyncSession,
        user_id: int,
        mission_id: str,
    ) -> dict:
        """
        Mark a mission as complete and award its XP.
        Safe to call multiple times — ignores if already completed.
        Returns: { mission_id, xp_awarded, already_completed }
        """
        progress = await self._get_progress(db, user_id)
        today_str = date.today().isoformat()
        stored = progress.daily_missions or {}

        if stored.get("date") != today_str:
            await self.get_daily_missions(db, user_id)
            await db.refresh(progress)
            stored = progress.daily_missions

        mission_state = stored["missions"].get(mission_id, {})

        if mission_state.get("completed"):
            return {
                "mission_id":       mission_id,
                "xp_awarded":       0,
                "already_completed": True,
            }

        # Find the XP reward from definitions
        mission_def = next(
            (m for m in DAILY_MISSIONS if m["id"] == mission_id), None
        )
        if not mission_def:
            raise ValueError(f"Unknown mission: {mission_id}")

        # Mark complete
        stored["missions"][mission_id]["completed"] = True
        progress.daily_missions = stored

        # Award XP
        xp = mission_def["xp_reward"]
        progress.total_xp += xp

        new_badges = await self._check_and_award_badges(progress)
        await db.commit()

        return {
            "mission_id":        mission_id,
            "xp_awarded":        xp,
            "already_completed": False,
            "new_badges":        new_badges,
        }

    # ── Badges ───────────────────────────────────────────────────────────────

    async def get_badges(
        self,
        db: AsyncSession,
        user_id: int,
    ) -> list[dict]:
        """
        Returns all badge definitions with earned=True/False
        for this user. Used to render the achievements row
        on the dashboard.
        """
        progress = await self._get_progress(db, user_id)
        earned_ids = set(progress.badges or [])

        return [
            {
                "id":          b["id"],
                "name":        b["name"],
                "description": b["description"],
                "stars":       b["stars"],
                "earned":      b["id"] in earned_ids,
            }
            for b in BADGES
        ]

    # ── Internal helpers ─────────────────────────────────────────────────────

    async def _get_progress(
        self,
        db: AsyncSession,
        user_id: int,
    ) -> UserProgress:
        """Fetch UserProgress row, raise clearly if missing."""
        result = await db.execute(
            select(UserProgress).where(UserProgress.user_id == user_id)
        )
        progress = result.scalar_one_or_none()
        if not progress:
            raise ValueError(f"No progress record for user {user_id}")
        return progress

    async def _check_and_award_badges(
        self,
        progress: UserProgress,
    ) -> list[str]:
        """
        Check all badge conditions against current progress.
        Awards any newly earned badges and returns their IDs.
        Called internally after XP, streaks, and missions.
        Does NOT commit — caller must commit.
        """
        earned_ids = set(progress.badges or [])
        new_badges = []

        for badge in BADGES:
            if badge["id"] not in earned_ids:
                try:
                    if badge["check"](progress):
                        earned_ids.add(badge["id"])
                        new_badges.append(badge["id"])
                except Exception:
                    pass  # never let a badge check crash the whole request

        progress.badges = list(earned_ids)
        return new_badges


# Singleton
gamification = GamificationService()