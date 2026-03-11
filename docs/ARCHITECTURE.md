# OttLeszek — Architecture

## Stack decisions

### Backend: Fastify vs NestJS

- **Choice: Fastify.**
- **Reasoning:** MVP needs speed of implementation, lower overhead, and a lean API surface. NestJS adds structure but also ceremony; for a small team and clear domain, Fastify + explicit module folders is sufficient. We keep domain boundaries in code (auth, users, plans, reminders, outreach, consents) without framework mandate. If the team grows and needs stricter conventions, we can document a “NestJS-style” layer pattern without migrating.

### Mobile

- **Expo + TypeScript:** Standard choice for RN; Expo for build and OTA.
- **Expo Router:** File-based routing, deep linking, and layout support; fits “screen per flow” and evaluation clarity.
- **Zustand:** Lightweight store; enough for auth + UI state without Redux.
- **TanStack Query:** Server state, caching, refetch; aligns with backend-first API.
- **React Hook Form + Zod:** Forms and validation at boundaries; shared Zod schemas in `packages/shared` where useful.
- **NativeWind (Tailwind for RN):** Utility-first, theme tokens; good fit for design system. Alternative: StyleSheet + design tokens in `packages/ui` if NativeWind causes issues.
- **MMKV / secure storage:** Tokens and sensitive prefs; Expo SecureStore for secrets.

### Backend data layer

- **Prisma:** Strong DX, migrations, type-safe client; PostgreSQL. Drizzle is lighter but Prisma’s migration and introspection story wins for delivery credibility.

### Auth

- **JWT in Authorization header** for API; httpOnly cookie is awkward for mobile. Short-lived access token + optional refresh; token in secure storage.

### Other

- **Background jobs:** In-MVP we can use a simple queue (e.g. `bull` with Redis) or deferred in-process jobs for reminders; document extension for worker later.
- **Notifications:** Expo Notifications; backend stores push tokens and reminder schedule; cron or job triggers send via Expo push.
- **Analytics:** None in MVP beyond optional privacy-safe events (e.g. “reminder_sent” without PII); document approach.
- **Logging:** Structured JSON logs; no PII in logs.
- **Migrations:** Prisma migrate; review before apply.
- **API docs:** OpenAPI (e.g. fastify-swagger or @fastify/swagger) from JSDoc or schema.

---

## Monorepo structure

```
apps/
  mobile/          # Expo React Native app
  backend/         # Fastify API + workers (if any)
packages/
  shared/          # Shared types, Zod schemas, constants (minimal)
  ui/              # Design tokens, base components (optional; can live in mobile initially)
  config/          # ESLint, TypeScript base configs
docs/              # Framing, ADRs, API, demo script
```

**Justification:** Single repo for aligned releases, shared types, and one clone. `shared` is minimal (contracts, enums, validation schemas). `ui` can start as a folder inside `apps/mobile` and be extracted when components are stable.

---

## Mobile architecture

- **Feature-first** under `app/`: `(tabs)/`, `onboarding/`, `plan/`, `reminders/`, `outreach/`, `settings/`.
- **State:** Zustand for auth and global UI; TanStack Query for all server state.
- **Navigation:** Expo Router file-based; stack and tabs as needed.
- **Theme:** Design tokens (colors, spacing, typography) in `packages/ui` or `mobile/theme`; components consume tokens.
- **API:** Single API client (fetch or axios) with base URL from env; TanStack Query hooks per resource.

---

## Backend architecture

- **Domain modules** (folders under `src/`): `auth`, `users`, `plans`, `reminders`, `outreach`, `consents`, `notifications`, `health`.
- **Per module:** `routes.ts`, `service.ts`, `repository.ts` (or Prisma only), schemas (Zod) for DTOs.
- **Cross-cutting:** `plugins/` (auth, rate-limit, logging), `lib/` (db, config, errors).
- **No controller/service/repository mandate:** Prefer route → service → Prisma; repository only where we need to abstract for tests or multiple data sources.

---

## Initial backend domain model (MVP)

Only entities that MVP truly needs:

| Entity                       | Purpose                                                                                        | MVP                                        |
| ---------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------ |
| **users**                    | Identity and notification target (e.g. phone/email for OTP and push).                          | Yes                                        |
| **profiles**                 | Display name, locale; minimal.                                                                 | Yes (can be merged into users if trivial). |
| **commitments**              | User’s pledge “I will participate”; one per user (or per campaign if we add later).            | Yes                                        |
| **plans**                    | One plan per user; holds high-level “participation plan.”                                      | Yes                                        |
| **plan_steps**               | 3–5 steps per plan; order, title, optional due, done flag.                                     | Yes                                        |
| **reminders**                | When to remind (cron-like or datetime); linked to user/plan.                                   | Yes                                        |
| **notification_preferences** | Channels (push, in-app), frequency, quiet hours.                                               | Yes                                        |
| **outreach_contacts**        | Manually entered; name + contact (phone/email); user-scoped.                                   | Yes (outreach MVP)                         |
| **outreach_actions**         | Log that user “sent” a template to contact (idempotent).                                       | Yes                                        |
| **consent_records**          | Type, version, timestamp; for consent center and audit.                                        | Yes                                        |
| **audit_events**             | Optional; high-level events (e.g. plan_created, reminder_sent) for debugging and future admin. | Optional in MVP (schema only or minimal)   |

**Not in MVP:** Separate `campaigns`, `templates` in DB (templates can be static in app or config); `analytics_events`; full `admin_users`.

---

## API route groups

- `POST /auth/otp/request`, `POST /auth/otp/verify` → tokens.
- `GET/PATCH /users/me`, `GET/PATCH /users/me/profile`.
- `GET/POST /plans` (current user’s plan), `PATCH /plans/:id`, `GET/POST/PATCH/DELETE /plans/:id/steps`.
- `GET/POST/PATCH /reminders` (user-scoped).
- `GET/PATCH /notification-preferences`.
- `GET/POST/DELETE /outreach/contacts`, `POST /outreach/send` (idempotent).
- `GET/POST /consents` (record consent), `GET /consents/summary`.
- `GET /health`, `GET /health/ready`.

---

## Data flow (high level)

1. **Mobile** → HTTPS → **Fastify** → auth plugin (JWT) → route → service → Prisma → PostgreSQL.
2. **Reminders:** Stored in DB; job or cron reads “due” reminders, sends via Expo push (or in-app only in MVP).
3. **Consent:** Stored on first use and when user changes preferences; shown in Consent center.
