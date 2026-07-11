# Code Standards

## General

- **Single Responsibility**: Keep modules, functions, and components small and focused on a single task (e.g., an agent only scores, a service only orchestrates).
- **Clear Boundaries**: Do not mix UI rendering logic with backend API calls directly inside components; use dedicated fetching hooks or server actions.
- **Resilience**: Handle failures gracefully, especially in the agent pipeline. If treasury fails, settlement should not even be attempted.

## TypeScript (Frontend)

- **Strict Mode**: TypeScript strict mode is required throughout the project.
- **Explicit Typing**: Avoid `any`. Define precise interfaces or types for all API responses and component props.
- **Validation**: Validate external data (like API responses) before trusting it in the UI.

## Next.js (Frontend)

- **Server Components**: Default to React Server Components for data fetching and layout.
- **Client Components**: Add `"use client"` only at the leaves of the component tree where browser interactivity (state, effects, event listeners) is required.
- **Routing**: Keep route components (`page.tsx`) focused on composition. Move complex UI into the `components/` folder.

## Python (Backend)

- **Type Hinting**: Use Python type hints extensively. All function arguments and return types must be annotated.
- **Pydantic**: Use Pydantic models for all data validation, both for incoming API requests and outgoing responses.
- **Async/Await**: Utilize `async def` for FastAPI route handlers, especially when interacting with the database or external APIs (like Grok).

## Styling

- **Design System Tokens**: Use the Tailwind CSS variables defined in `ui-context.md` and `design-system.md` (e.g., `var(--bg-base)`, `var(--text-primary)`). Do not use hardcoded hex colors in classes.
- **Tailwind Utility Classes**: Prefer utility classes over custom CSS unless defining global theme variables or complex animations.

## API Routes

- **Validation**: Rely on FastAPI's dependency injection and Pydantic models to parse and validate request input before execution.
- **Predictable Responses**: Always return data using the standard response envelope defined in `api-contracts.md` (`success`, `data`, `error`).
- **HTTP Methods**: Use appropriate HTTP methods (`GET` for reading, `POST` for creating/actions).

## Data and Storage

- **Source of Truth**: The database (SQLite or JSON) is the source of truth. Services mediate access to it.
- **Mock Data**: For MVP, mock data should be structured exactly as it would be if coming from a real production database.

## File Organization

- `frontend/frontend/app/` — Next.js App Router pages and layouts.
- `frontend/frontend/components/` — Reusable React components.
- `backend/api/` — FastAPI router definitions (endpoints).
- `backend/agents/` — Core AI decision logic classes.
- `backend/services/` — Business logic and data access orchestration.
- `backend/models/` — Pydantic schema definitions.
