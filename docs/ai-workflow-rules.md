# AI Workflow Rules

## Approach

Build this project incrementally using a spec-driven workflow.
Context files define what to build, how to build it, and the current state of progress. Always implement against these specs — do not infer or invent behavior from scratch.

Given the tight deadline, we focus strictly on the defined MVP scope (V1).

## Scoping Rules

- Work on one feature unit at a time.
- Prefer small, verifiable increments over large speculative changes.
- Do not combine unrelated system boundaries in a single implementation step (e.g., do not build backend agent logic and frontend UI components in the same tool call).

## When to Split Work

Split an implementation step if it combines:

- UI changes (Frontend) and Data/Agent logic changes (Backend).
- Multiple unrelated API routes (e.g., separating Recommendations from Wallet APIs).
- Behavior not clearly defined in the context files (pause to clarify first).

If a change cannot be verified end to end quickly, the scope is too broad — split it.

## Handling Missing Requirements

- Do not invent product behavior not defined in the context files (`agent-behavior.md`, `api-contracts.md`, etc.).
- If a requirement is ambiguous, resolve it in the relevant context file before implementing.
- If a requirement is missing, add it as an open question in `progress-tracker.md` before continuing.

## Protected Files

Do not modify the following unless explicitly instructed:

- `frontend/frontend/node_modules/*`
- `frontend/frontend/.next/*`
- `backend/.venv/*`
- `backend/venv/*`

## Keeping Docs in Sync

Update the relevant context file whenever implementation changes:

- System architecture or boundaries (`architecture.md`)
- Storage model decisions (`architecture.md`)
- Code conventions or standards (`code-standards.md`)
- Feature scope (`project-overview.md`)
- Current status (`progress-tracker.md`)

## Before Moving to the Next Unit

1. The current unit works end to end within its defined scope.
2. No invariant defined in `architecture.md` or `agent-behavior.md` was violated.
3. `progress-tracker.md` reflects the completed work.
4. The backend server starts cleanly (`uvicorn main:app`).
5. The frontend builds cleanly (`npm run build`).
