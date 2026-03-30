# app/agents/gamify_node.py
from app.agents.state import NexusLearnState


def gamify_node(state: NexusLearnState) -> NexusLearnState:
    """
    Triggered when intent == "gamify".
    Returns XP, streak, badge info for the user.
    Actual DB fetch happens in the API layer — this node
    just packages the result structure.
    """
    return {
        **state,
        "result": {
            "message":  "Fetching your progress...",
            "user_id":  state.get("user_id"),
            "action":   "fetch_progress",
        },
        "xp_delta": 0,
    }