"""
Simple Agno Team Example

This demonstrates the simplest possible Agno team setup with two agents
that can collaborate to answer questions.
"""

from agno.agent import Agent
from agno.team import Team
from agno.models.openai import OpenAIChat


def create_team(db):
    """Create and return a simple team with two agents."""

    # Agent 1: Research specialist
    researcher = Agent(
        name="researcher",
        db=db,
        model=OpenAIChat(id="gpt-4o-mini"),
        description="Research specialist who gathers and analyzes information.",
        instructions=[
            "You are a research specialist.",
            "Your role is to gather information and provide detailed analysis.",
            "Be thorough and cite your reasoning.",
        ],
        add_history_to_context=True,
        markdown=True,
    )

    # Agent 2: Writer specialist
    writer = Agent(
        name="writer",
        db=db,
        model=OpenAIChat(id="gpt-4o-mini"),
        description="Writing specialist who creates clear, engaging content.",
        instructions=[
            "You are a writing specialist.",
            "Your role is to create clear, engaging, and well-structured content.",
            "Focus on clarity and readability.",
        ],
        add_history_to_context=True,
        markdown=True,
    )

    # Create the team
    team = Team(
        name="simple-team",
        db=db,
        members=[researcher, writer],
        model=OpenAIChat(id="gpt-4o-mini"),
        description="A simple team with a researcher and a writer that collaborate to answer questions.",
        instructions=[
            "You are a team leader coordinating between a researcher and a writer.",
            "For questions requiring research, delegate to the researcher first.",
            "For content creation, use the writer.",
            "Combine their outputs to provide comprehensive answers.",
        ],
        add_history_to_context=True,
        markdown=True,
        # respond_directly=False,
        # show_members_responses
        # debug_mode=True,
        # debug_level=2,
    )

    team = Team(
        name="language-team",
        db=db,
        members=[
            Agent(name="English Agent", role="You answer questions in English"),
            Agent(name="Chinese Agent", role="You answer questions in Chinese"),
            Team(
                name="Germanic Team",
                role="You coordinate the team members to answer questions in German and Dutch",
                members=[
                    Agent(name="German Agent", role="You answer questions in German"),
                    Agent(name="Dutch Agent", role="You answer questions in Dutch"),
                ],
            ),
    ])

    return team
