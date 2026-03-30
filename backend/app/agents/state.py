# app/agents/state.py
from typing import TypedDict, Optional


class NexusLearnState(TypedDict):
    user_id:    str
    intent:     str        # "study" | "coding" | "gamify"
    topic:      str
    difficulty: str        # "easy" | "medium" | "hard"
    messages:   list
    result:     dict
    xp_delta:   int