# app/api/agent.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.core.database import get_db
from app.agents.graph import nexus_graph
from app.models.progress import UserProgress

router = APIRouter(prefix="/agent", tags=["agent"])


class AgentRequest(BaseModel):
    user_id:  int
    message:  str       # e.g. "Teach me about Binary Search Trees"


@router.post("/chat")
async def agent_chat(
    req: AgentRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Main orchestrator endpoint.
    Routes user message through LangGraph:
    router → [study | coding | gamify] → state_updater
    """
    initial_state = {
        "user_id":    str(req.user_id),
        "intent":     "",
        "topic":      "",
        "difficulty": "medium",
        "messages":   [{"role": "user", "content": req.message}],
        "result":     {},
        "xp_delta":   0,
    }

    try:
        final_state = nexus_graph.invoke(initial_state)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Award XP if any
    xp_delta = final_state.get("xp_delta", 0)
    if xp_delta > 0:
        progress_result = await db.execute(
            select(UserProgress).where(
                UserProgress.user_id == req.user_id
            )
        )
        progress = progress_result.scalar_one_or_none()
        if progress:
            progress.total_xp += xp_delta
            await db.commit()

    return {
        "intent":     final_state.get("intent"),
        "topic":      final_state.get("topic"),
        "difficulty": final_state.get("difficulty"),
        "result":     final_state.get("result"),
        "xp_delta":   xp_delta,
    }