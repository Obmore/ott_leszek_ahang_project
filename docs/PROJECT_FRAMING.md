# OttLeszek — Project Framing & Discovery

## 1. Project understanding

### Problem

Civic participation (e.g. voting, planned actions) often fails because people forget, don’t plan, or feel alone. There is no simple, trustworthy, privacy-respecting tool that helps Hungarian users commit, plan, get reminders, and optionally support outreach to people they know—without manipulation or dark patterns.

### Why it matters

- **User value:** Reduces forgetfulness and friction; makes participation concrete and trackable.
- **Civic value:** Supports lawful, neutral mobilization (planning + reminders + light outreach).
- **Trust value:** Privacy-by-design and clear consent make the product credible and evaluator-friendly.

### Successful MVP

An MVP succeeds when:

- A user can complete a **commitment → plan → reminders → checklist** flow in under 2 minutes.
- Reminders are **scheduled and delivered** (or demonstrably ready).
- **Outreach** (contacts + templates) is usable but minimal and consent-first.
- **Privacy** (consent, preferences, deletion/export) is visible and functional.
- The app feels **calm, clear, and trustworthy**—not noisy or pushy.

### Highest-value user journeys

1. **Commit → Plan → Remind:** “I commit to participate → I set my plan (3–5 steps) → I get reminders.”
2. **Check progress:** “I see what I’ve done and what’s left.”
3. **Light outreach:** “I add a few people I know and send a gentle nudge (template).”

### Best flows for evaluation/demo

- **Commitment + plan creation** (shows intent and structure).
- **Reminder scheduling** (shows utility).
- **Action checklist completion** (shows progress).
- **Consent center / privacy controls** (shows trust and compliance).
- **Outreach flow** (optional; shows mobilization support without manipulation).

---

## 2. Evaluation criteria alignment

| Criterion                   | How we support it                                                              |
| --------------------------- | ------------------------------------------------------------------------------ |
| **Usability**               | Single primary action per screen, low friction, Hungarian UX, clear copy.      |
| **Mobilization support**    | Plan, reminders, checklist, optional outreach with templates.                  |
| **Technical feasibility**   | Custom backend from day one, clear MVP scope, no BaaS dependency.              |
| **Privacy/security**        | Consent-first, minimal data, retention/deletion/export, no dark patterns.      |
| **Scalability**             | Modular backend, clear domain boundaries, migration strategy.                  |
| **Maintainability**         | Monorepo, shared types, documented architecture, rules and agents.             |
| **Credibility of delivery** | Real backend + mobile app, phased roadmap, demo script.                        |
| **Demo clarity**            | Shortest-path happy flow, one primary persona, clear “implemented vs planned.” |

---

## 3. Open assumptions

### Safe assumptions

- Hungarian-language primary; no multi-language in MVP.
- Mobile-first; no web app in MVP.
- Users have smartphones and can receive push (or in-app) reminders.
- Backend is self-hosted or single-tenant; no multi-tenant requirement in MVP.
- “Participation” is lawful civic participation (e.g. voting, planned actions).

### Risky assumptions

- Push notification delivery and opt-in rates (mitigation: in-app reminders as fallback).
- Willingness to add contacts for outreach (mitigation: optional, consent-heavy, minimal).

### Configurable

- Reminder channels (push vs in-app vs email later).
- Number of plan steps (e.g. 3–5).
- Outreach limits (e.g. max contacts per user).
- Retention periods (config-driven).

### Legal / privacy / adoption risks

- **Legal:** Tool must remain neutral; no voter persuasion or targeting—**design and copy must reflect this.**
- **Privacy:** Contact data is sensitive—**minimize, encrypt, consent, short retention.**
- **Adoption:** Over-complexity kills usage—**MVP must be completable in under 2 minutes for core flow.**

---

## 4. User personas and JTBD

### First-time, low-friction user

- **Goals:** Commit quickly, get reminders, not think too much.
- **Fears:** Spam, complexity, commitment overload.
- **Barriers:** Long forms, unclear value.
- **Motivation:** “I want to participate but might forget.”
- **Outcome:** Plan created, reminders set, one-tap progress.

### Motivated returning user

- **Goals:** See progress, complete steps, maybe nudge contacts.
- **Fears:** Losing streak pressure, guilt.
- **Motivation:** “I already decided; I need structure and reminders.”
- **Outcome:** Checklist and optional outreach without gamification pressure.

### Privacy-sensitive user

- **Goals:** Minimal data, clear consent, export/delete.
- **Fears:** Leaks, tracking, opaque use of data.
- **Outcome:** Consent center, preferences, deletion/export visible and working.

### User who wants to remind/support known contacts

- **Goals:** Add a few people, send a simple message (template).
- **Fears:** Being pushy, contact data misuse.
- **Outcome:** Manual entry or minimal import, templates, clear consent.

### Optional future: organizer/admin-adjacent

- **Goals:** (Post-MVP) See aggregate, non-PII stats; manage content.
- **Outcome:** Admin-ready backend extension points; no PII in admin views.

---

## 5. Product direction

- **Positioning:** Neutral, lawful, privacy-first civic participation and reminder tool for Hungary.
- **Tone:** Calm, clear, respectful, lightly motivating; no urgency manipulation or activist noise.
- **Scope:** Plan, reminders, checklist, optional outreach; no persuasion engine, no targeting, no gamification beyond simple progress.
- **Principles:** Data minimization, consent at point of use, deletion/export by design, mobile-first, low cognitive load.

---

## 6. MVP feature set

### Must have

- **Onboarding** (short, value + consent).
- **Commitment / pledge flow** (explicit “I will participate”).
- **Personal plan builder** (3–5 steps).
- **Action checklist** (mark steps done).
- **Reminder scheduling** (when to remind).
- **Progress view** (what’s done / left).
- **Consent center** (what we collect, why).
- **Notification preferences** (channels, frequency).
- **Account/identity** (minimal: identifier + notification target; guest or simple auth).
- **Backend** (real API, DB, auth boundary, consent-aware).

### Should have

- **Login** (simple: OTP or email link for MVP).
- **Outreach helper** (manual contact entry + 1–2 templates).
- **Message templates** (neutral, non-pushy).
- **Deletion/export readiness** (account delete + data export flow).

### Could have (if time)

- **Push notifications** (Expo; if delivery is proven).
- **Shareable plan card** (e.g. “I’m participating” image/link).

### Not for MVP

- Guest mode (adds complexity; we can use minimal auth instead).
- Contact import (privacy risk; manual entry only in MVP).
- Streaks / gamification.
- Referral logic.
- Calendar integration.
- Admin dashboard.
- Analytics beyond minimal, privacy-safe events.
- Multilingual (Hungarian only in MVP).
- Full offline mode (offline-ready data model is fine; full sync later).
- Anonymous mode (pseudonymous minimal identity is enough).
- Event history timeline (post-MVP).

---

## 7. Post-MVP feature candidates

- Guest mode.
- Contact import with strict consent and minimization.
- Calendar integration.
- Admin/aggregate reporting (no PII).
- Multilingual.
- Offline sync.
- Richer notification channels (e.g. email).
- Shareable plan card / social proof (neutral).

---

## 8. Recommended architecture (summary)

- **Monorepo:** `apps/mobile`, `apps/backend`, `packages/shared`, `packages/ui`, `packages/config`, `docs`.
- **Mobile:** Expo, TypeScript, Expo Router, Zustand, TanStack Query, React Hook Form, Zod, NativeWind (or Expo-compatible utility CSS), MMKV/secure storage, Expo Notifications.
- **Backend:** Node.js, TypeScript, **Fastify**, PostgreSQL, **Prisma**, OpenAPI, migrations, structured logging, domain modules, validation at boundaries, rate limiting, healthcheck.
- **Rationale:** Fastify chosen for lower overhead, faster iteration, and lean surface; Prisma for strong DX and migrations. Full rationale in `docs/ARCHITECTURE.md` and `docs/adr/`.
