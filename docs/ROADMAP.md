# OttLeszek — Implementation roadmap

## Phase 1 — Foundation

- **Goal:** Monorepo, mobile and backend runnable; conventions and docs in place.
- **Deliverables:** pnpm workspaces; `apps/mobile` (Expo), `apps/backend` (Fastify); `packages/shared`, `packages/config`; lint/format/typecheck; theme foundation; navigation shell; backend health; README + ADRs.
- **Acceptance:** `pnpm install` and `pnpm run dev` (or equivalent) run mobile and backend; README describes setup.
- **Risks:** None major.
- **Demo value:** Repo and app shell run; professional first impression.
- **Criteria:** Maintainability, credibility.

## Phase 2 — Backend domain & auth

- **Goal:** Domain skeleton, DB schema, migrations, validation, auth strategy, consent model, notification-ready structure.
- **Deliverables:** Prisma schema (users, profiles, commitments, plans, plan_steps, reminders, notification_preferences, outreach_contacts, outreach_actions, consent_records); migrations; auth (OTP or placeholder); consent and notification modules stubbed.
- **Acceptance:** Migrations apply; health/ready work; at least one protected route with auth.
- **Risks:** Auth provider (OTP) dependency.
- **Demo value:** Backend is “real”; DB and auth in place.
- **Criteria:** Technical feasibility, scalability.

## Phase 3 — Core flows (mobile + API)

- **Goal:** Onboarding, commitment, plan builder, action checklist, reminder preferences, home/dashboard shell; backend persistence and API wiring.
- **Deliverables:** Onboarding screens; commitment flow; plan CRUD + steps; checklist UI; reminder preferences; dashboard shell; API integration; consent collection.
- **Acceptance:** User can complete commit → plan → steps → reminders in app with data in DB.
- **Risks:** Scope creep in onboarding.
- **Demo value:** Full core journey demo.
- **Criteria:** Usability, mobilization support, demo clarity.

## Phase 4 — Outreach & privacy

- **Goal:** Outreach helper (manual contacts, templates); progress tracking; privacy controls; backend support; audit-conscious events where justified.
- **Deliverables:** Contact list (manual add/delete); send template flow; progress view; consent center; notification preferences UI; backend outreach and consent endpoints.
- **Acceptance:** User can add contacts, send a template, see progress, and manage consent/preferences.
- **Risks:** Template content and consent wording.
- **Demo value:** Mobilization (outreach) and trust (privacy).
- **Criteria:** Mobilization, privacy, trust.

## Phase 5 — Notifications & polish

- **Goal:** Notifications (push or in-app); auth completion; settings; deletion/export; edge case hardening.
- **Deliverables:** Reminder delivery (job + Expo push or in-app); account deletion and export; settings screen; error and edge handling.
- **Acceptance:** Reminders fire; user can delete account and export data.
- **Risks:** Push delivery and permissions.
- **Demo value:** End-to-end reminder and trust (deletion/export).
- **Criteria:** Usability, privacy, credibility.

## Phase 6 — QA & release prep

- **Goal:** QA hardening; accessibility; performance; demo script; pitch readiness.
- **Deliverables:** Test coverage for critical paths; a11y pass; demo script; “implemented vs planned” doc; release checklist.
- **Acceptance:** Demo script runs; known issues documented; release checklist complete.
- **Risks:** Last-minute scope creep.
- **Demo value:** Evaluation-ready demo and story.
- **Criteria:** Demo clarity, credibility, maintainability.
