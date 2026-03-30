# app/agents/coding_node.py
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage
from app.agents.state import NexusLearnState
from app.core.config import settings
import json

llm = ChatOllama(
    model=settings.qwen_model,      # Qwen handles coding problems
    base_url=settings.ollama_base_url,
    temperature=0.3,
)

CODING_PROMPT = """
Generate a {difficulty} coding problem about {topic}.

Return ONLY valid JSON:
{{
  "title": "...",
  "description": "...",
  "examples": [
    {{"input": "...", "output": "...", "explain": "..."}}
  ],
  "constraints": "...",
  "hints": [
    {{"cost": 5,  "text": "..."}},
    {{"cost": 10, "text": "..."}}
  ],
  "solution_code": "...",
  "test_cases": [
    {{"input": "...", "expected": "..."}}
  ]
}}
Return ONLY the JSON object, no extra text.
"""


def coding_node(state: NexusLearnState) -> NexusLearnState:
    """
    Triggered when intent == "coding".
    Generates a coding problem using Qwen.
    """
    topic      = state.get("topic",      "Arrays")
    difficulty = state.get("difficulty", "medium")

    prompt = CODING_PROMPT.format(topic=topic, difficulty=difficulty)

    try:
        response = llm.invoke([
            SystemMessage(content="You are an expert coding problem generator. Return only valid JSON."),
            HumanMessage(content=prompt),
        ])

        raw = response.content.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        result = json.loads(raw.strip())

        return {
            **state,
            "result":   result,
            "xp_delta": 0,    # XP awarded after submission, not generation
        }
    except Exception as e:
        return {
            **state,
            "result":   {"error": str(e)},
            "xp_delta": 0,
        }