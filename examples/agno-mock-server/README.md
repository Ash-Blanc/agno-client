# Agno Mock Server

A mock Agno agent server demonstrating generative UI capabilities with interactive charts, cards, tables, and visualizations.

## Features

- Revenue charts (bar/line)
- Rental car cards
- Product comparison tables
- Dashboard metrics
- Smart data visualization

## Setup

### 1. Create a Python virtual environment

```bash
cd examples/agno-mock-server

# Create virtual environment
python -m venv .venv

# Activate it
# macOS/Linux:
source .venv/bin/activate

# Windows:
.venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

Copy the example environment file and add your API keys:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```
ANTHROPIC_API_KEY=your-anthropic-key
OPENAI_API_KEY=your-openai-key
```

### 4. Start the server

```bash
python agno-server.py
```

The server will start on `http://localhost:7777`.

## Example Prompts

Once the server is running, you can test it with these prompts:

- "Show me monthly revenue"
- "What rental cars are available?"
- "Compare laptops"
- "Show my dashboard"
- "Visualize market share data"

## API Endpoints

The server exposes standard Agno endpoints:

- `GET /health` - Health check
- `GET /agents` - List available agents
- `POST /agents/{id}/runs` - Run agent (streaming)
- `GET /sessions` - List sessions
- `GET /sessions/{id}/runs` - Get session history
