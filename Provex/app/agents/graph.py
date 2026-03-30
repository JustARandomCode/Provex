# app/agents/graph.py
from langgraph.graph import StateGraph, END
from app.agents.state import NexusLearnState
from app.agents.router import router_node
from app.agents.study_node import study_node
from app.agents.coding_node import coding_node
from app.agents.gamify_node import gamify_node
from app.agents.state_updater import state_updater_node


def route_intent(state: NexusLearnState) -> str:
    """
    Conditional edge — reads intent set by router_node
    and routes to the correct node.
    """
    intent = state.get("intent", "study")
    if intent == "coding":
        return "coding_node"
    elif intent == "gamify":
        return "gamify_node"
    else:
        return "study_node"   # default


def build_graph():
    graph = StateGraph(NexusLearnState)

    # Add all nodes
    graph.add_node("router_node",       router_node)
    graph.add_node("study_node",        study_node)
    graph.add_node("coding_node",       coding_node)
    graph.add_node("gamify_node",       gamify_node)
    graph.add_node("state_updater",     state_updater_node)

    # Entry point
    graph.set_entry_point("router_node")

    # Conditional routing after router
    graph.add_conditional_edges(
        "router_node",
        route_intent,
        {
            "study_node":  "study_node",
            "coding_node": "coding_node",
            "gamify_node": "gamify_node",
        }
    )

    # All nodes flow into state_updater then END
    graph.add_edge("study_node",    "state_updater")
    graph.add_edge("coding_node",   "state_updater")
    graph.add_edge("gamify_node",   "state_updater")
    graph.add_edge("state_updater", END)

    return graph.compile()


# Singleton — import this everywhere
nexus_graph = build_graph()