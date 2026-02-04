"""
Agno Mock Server

Serves both an agent and a team for testing the agno-client library.

Usage:
    python examples/agno-mock-server/server.py

Then connect the frontend to http://localhost:7777
"""

from agno.db.sqlite import SqliteDb
from agno.os import AgentOS
from dotenv import load_dotenv

from agent import create_agent
from team import create_team

load_dotenv()

# Shared database for all components
db = SqliteDb(db_file="tmp/data.db")

# Create the agent and team
agent = create_agent(db)
team = create_team(db)

# Create AgentOS with both agent and team
agent_os = AgentOS(
    id="agno-demo",
    description="Demo server with agent and team examples",
    agents=[agent],
    teams=[team],
)

app = agent_os.get_app()

if __name__ == "__main__":
    print("\n" + "="*70)
    print("Agno Demo Server")
    print("="*70)
    print("\nAvailable components:")
    print("\n  AGENT: generative-ui-demo")
    print("    - Revenue charts (bar/line)")
    print("    - Rental car cards")
    print("    - Product comparison tables")
    print("    - Dashboard metrics")
    print("    - Smart data visualization")
    print("\n  TEAM: simple-team")
    print("    - Researcher agent")
    print("    - Writer agent")
    print("    - Coordinate mode for collaboration")
    print("\nStarting server on http://localhost:7777")
    print("\nExample prompts:")
    print("  Agent: 'Show me monthly revenue'")
    print("  Agent: 'Compare laptops'")
    print("  Team:  'Research and write about climate change'")
    print("\n" + "="*70 + "\n")

    agent_os.serve(app="server:app", reload=True)
