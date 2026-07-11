# Architecture Context

## Stack

| Layer     | Technology                  | Role   |
| --------- | --------------------------- | ------ |
| Framework | Next.js 16 + TypeScript     | Frontend web application and routing |
| UI        | TailwindCSS v4              | Styling and design system implementation |
| Backend   | FastAPI (Python)            | API layer and core orchestration |
| Agents    | Python Classes (MVP)        | Encapsulated logic for recommendation, treasury, and settlement |
| Database  | SQLite (MVP) / JSON         | Persistent storage for bookings, wallet state, and properties |
| AI        | Grok API (planned)          | Natural language explanations for recommendations |
| Payments  | Simulated (MVP)             | Mock USDC wallet for settlement |

## System Boundaries

- `frontend/frontend/app/` — Owns the UI, user interactions, preference forms, and displays data fetched from the API.
- `backend/api/` — Owns the REST API endpoints. Validates incoming requests and routes them to the appropriate services/agents.
- `backend/agents/` — Owns the autonomous decision-making logic (Scoring, Financial Approval, Settlement Execution).
- `backend/services/` — Owns business logic that coordinates between models, agents, and data storage.
- `backend/models/` — Owns the Pydantic schemas defining the data structures (Properties, Bookings, Preferences, Wallet).
- `backend/data/` — Owns the persistent data storage (JSON files or SQLite DB).

## Storage Model

- **Database (SQLite/JSON)**: Stores Property listings, User Bookings, Wallet state (balance), and Transaction history.
- **In-Memory (MVP transition)**: Some state may temporarily live in memory during initial development before wiring up SQLite completely.

## Auth and Access Model

- **MVP Authentication**: No authentication is required for MVP. The app assumes a single-user flow for demonstration purposes.
- **Wallet Ownership**: The simulated wallet belongs to the current active session.

## Invariants

1. **Treasury Supremacy**: A booking must NEVER be settled if it has not been explicitly approved by the Treasury Agent.
2. **Budget Enforcement**: A booking must NEVER be approved if the per-night price exceeds the user's stated budget or if the total cost exceeds the wallet balance.
3. **Agent Isolation**: Agents must not directly modify the database; they evaluate inputs and return decisions/actions to the services orchestrating them.
4. **Data Integrity**: Settlement transactions must exactly match the total cost of the approved booking.
