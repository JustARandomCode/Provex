# app/agents/state_updater.py
from app.agents.state import NexusLearnState
from datetime import datetime, timezone


def state_updater_node(state: NexusLearnState) -> NexusLearnState:
    """
    Final node — runs after study/coding/gamify node.
    Logs completion timestamp into result.
    XP is actually awarded by the API layer using xp_delta.
    """
    result = state.get("result", {})
    result["completed_at"] = datetime.now(timezone.utc).isoformat()
    result["xp_delta"]     = state.get("xp_delta", 0)

    return {
        **state,
        "result": result,
    }