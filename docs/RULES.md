# OttLeszek — Project ruleset

## Architecture

- **Feature-first:** Mobile and backend are organized by feature/domain; avoid layer-only folders that hide ownership.
- **Modular boundaries:** Backend domains (auth, users, plans, reminders, outreach, consents) own their routes and services; no cross-domain DB access without service API.
- **State ownership:** Server state in TanStack Query; global UI/auth in Zustand; no duplicate source of truth.
- **Shared package:** Only types, Zod schemas, and constants that both mobile and backend need; no UI in shared.
- **Route versioning:** No `/v1` in MVP; add when we break contract.

## Code quality

- **Naming:** PascalCase components/types; camelCase functions/vars; UPPER_SNAKE for env and constants.
- **File size:** Prefer &lt; 300 lines per file; split by feature or component when larger.
- **Typing:** Strict TypeScript; no `any` without comment and approval.
- **Validation:** Zod at API and form boundaries; shared schemas where possible.
- **Errors:** Structured errors; user-facing messages without leaking internals.
- **Logging:** Structured (JSON); no PII in logs.
- **TODOs:** Concrete, with ticket or short description; no permanent “TODO: fix.”

## Backend/API

- **Routes:** REST-style; `GET/POST/PATCH/DELETE` with clear resource names (e.g. `/plans`, `/plans/:id/steps`).
- **Request/response:** DTOs validated with Zod; OpenAPI documented.
- **Auth:** JWT in `Authorization: Bearer`; validate on every protected route.
- **Transactions:** Use for multi-table writes that must be atomic (e.g. plan + steps).
- **Migrations:** Review SQL; no destructive change without backup/ADR.
- **Health:** `GET /health` (liveness), `GET /health/ready` (DB + critical deps).

## UI

- **Spacing:** Design tokens (e.g. 4, 8, 16, 24); no magic numbers.
- **Typography:** Scale from tokens; one primary font, one mono if needed.
- **Buttons:** Primary for main action; secondary for cancel/back; destructive for delete.
- **Screens:** One primary action; loading, empty, error states for every data-dependent view.
- **Forms:** Inline validation; clear error messages; no submit without required fields.
- **Copy:** Calm, clear, Hungarian; no urgency manipulation; explain why we ask for data.
- **Reminders:** Useful, not invasive; respect quiet hours and preferences.

## Data/privacy

- Do not collect contacts by default; manual entry only in MVP.
- Explicit consent for outreach and notifications; explain at point of use.
- Local-only or pseudonymized where feasible; no unnecessary tracking.
- Deletion-aware design; export and delete flows implemented.
- No dark patterns; no pre-ticked optional consent.

## Security

- No secrets in client bundle; env for API URL only.
- Strict env separation (dev/staging/prod); backend validates all authorization.
- Secure token storage (Expo SecureStore); short-lived JWT.
- Rate limiting on auth and send endpoints; document limits.

## Testing

- Critical path first: onboarding, plan creation, reminders, consent.
- Test validation and error states; test backend contracts.
- Avoid brittle snapshot overuse; prefer behavior and accessibility.

## Git

- Small, focused commits; meaningful messages.
- Migration and schema changes reviewed.

## Documentation

- README: setup, run, test, env template.
- ADRs for significant architecture decisions.
- API contract (OpenAPI) and env vars documented.
- Demo script and “implemented vs planned” kept current.
