# app/agents/study_node.py
from app.agents.state import NexusLearnState
import asyncio


def study_node(state: NexusLearnState) -> NexusLearnState:
    """
    Triggered when intent == "study".
    Calls the LlamaIndex study pipeline synchronously.
    """
    from app.pipelines.study_pipeline import study_pipeline

    topic   = state.get("topic", "general")
    user_id = int(state.get("user_id", 0))

    try:
        # Run async pipeline in sync context
        result = asyncio.run(
            study_pipeline.generate_from_topic(
                user_id=user_id,
                topic=topic,
            )
        )
        return {
            **state,
            "result":   result,
            "xp_delta": 10,   # XP for studying a topic
        }
    except Exception as e:
        return {
            **state,
            "result":   {"error": str(e)},
            "xp_delta": 0,
        }