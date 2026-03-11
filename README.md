# OttLeszek

Privacy-conscious, lawful civic participation app for the Hungarian context: plan, reminders, action checklist, and optional outreach — without dark patterns or manipulation.

## Repo structure

- **apps/mobile** — React Native (Expo) app
- **apps/backend** — Fastify API (Node.js, TypeScript, Prisma)
- **packages/shared** — Shared types and constants
- **packages/config** — Shared ESLint/TypeScript config
- **docs** — Product framing, architecture, ADRs, roadmap, demo script

## Prerequisites

- Node.js ≥ 20
- pnpm 9+

## Setup

```bash
pnpm install
```

### Backend

```bash
cd apps/backend
cp .env.example .env   # adjust if needed
pnpm run db:generate   # Prisma client (Phase 2: migrations)
pnpm run dev           # http://localhost:3000
```

Health: `GET http://localhost:3000/health`

### Mobile

```bash
cd apps/mobile
pnpm run dev           # Expo dev server; scan QR or press i/a for simulator
```

## Scripts (from repo root)

| Command                | Description                                        |
| ---------------------- | -------------------------------------------------- |
| `pnpm run dev`         | Run mobile and backend in parallel (if configured) |
| `pnpm run dev:mobile`  | Expo dev server                                    |
| `pnpm run dev:backend` | Fastify dev server                                 |
| `pnpm run typecheck`   | TypeScript check all packages                      |
| `pnpm run lint`        | Lint all packages                                  |
| `pnpm run format`      | Format with Prettier                               |

## Documentation

- [Project framing & MVP](docs/PROJECT_FRAMING.md)
- [MVP feature matrix](docs/MVP_FEATURE_MATRIX.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Design & UX](docs/DESIGN_UX.md)
- [Data model](docs/DATA_MODEL.md)
- [Privacy & security](docs/PRIVACY_SECURITY.md)
- [Agents](docs/AGENTS.md)
- [Rules](docs/RULES.md)
- [Skills](docs/SKILLS.md)
- [Roadmap](docs/ROADMAP.md)
- [Demo script](docs/DEMO_SCRIPT.md)
- [**Tesztelés és demó (gyors útmutató)**](docs/TESTING_AND_DEMO.md)
- [ADRs](docs/adr/)

## MVP status

- [x] **Phase 1:** Monorepo, backend (Fastify, health), mobile shell (Expo, theme, onboarding shell), shared, config, docs
- [x] **Phase 2:** Prisma schema (User, Profile, Commitment, Plan, PlanStep, Reminder, NotificationPreferences, OutreachContact, OutreachAction, ConsentRecord, AuditEvent), migrations, auth (OTP mock), all domain routes
- [x] **Phase 3:** Onboarding (welcome, consent, login), commitment, plan builder, checklist (dashboard), reminders, API wiring
- [x] **Phase 4:** Outreach (contacts, templates), consent center & notification prefs in Settings
- [x] **Phase 5:** Settings (export, delete account), notification prefs UI
- [x] **Phase 6:** Demo script, Cursor rules & skills

**Cursor:** Project rules in `.cursor/rules/` (ottleszek, backend, mobile, privacy, agents). Skills in `.cursor/skills/` (mvp-scope-guard, privacy-review, backend-endpoint, screen-blueprint).

## License

Private / TBD.
