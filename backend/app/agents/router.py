# app/agents/router.py
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.config import settings
from app.agents.state import NexusLearnState
import json

# LLM used for intent routing
llm = ChatOllama(
    model=settings.llama_model,
    base_url=settings.ollama_base_url,
    temperature=0,
)

ROUTER_SYSTEM_PROMPT = """
You are an intent classifier for a coding education platform.
Given a user message, classify the intent as one of:
- "study"   → user wants to learn a topic or generate a lesson
- "coding"  → user wants a coding problem or challenge
- "gamify"  → user wants to check XP, streaks, badges, leaderboard

Return ONLY a JSON object like:
{"intent": "study", "topic": "Binary Search Trees", "difficulty": "medium"}

If topic is unclear, use "general".
If difficulty is unclear, use "medium".
Return ONLY the JSON, no extra text.
"""


def router_node(state: NexusLearnState) -> NexusLearnState:
    """
    Reads the last user message and sets intent, topic, difficulty.
    """
    messages = state.get("messages", [])
    if not messages:
        return {**state, "intent": "study", "topic": "general", "difficulty": "medium"}

    last_message = messages[-1]
    user_text = last_message.get("content", "") if isinstance(last_message, dict) else str(last_message)

    response = llm.invoke([
        SystemMessage(content=ROUTER_SYSTEM_PROMPT),
        HumanMessage(content=user_text),
    ])

    try:
        raw = response.content.strip()
        # Strip markdown fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        parsed = json.loads(raw.strip())
        intent     = parsed.get("intent",     "study")
        topic      = parsed.get("topic",      "general")
        difficulty = parsed.get("difficulty", "medium")
    except Exception:
        intent     = "study"
        topic      = "general"
        difficulty = "medium"

    return {
        **state,
        "intent":     intent,
        "topic":      topic,
        "difficulty": difficulty,
    }