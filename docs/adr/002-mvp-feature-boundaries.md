# ADR 002: MVP feature boundaries

## Status

Accepted

## Context

Scope must support evaluation success without overbuilding. Need clear must-have vs out-of-scope.

## Decision

- **Must have:** Onboarding, commitment, plan (3–5 steps), action checklist, reminder scheduling, progress view, consent center, notification preferences, minimal account, real backend.
- **Should have:** Simple login (OTP), outreach (manual contacts + templates), deletion/export.
- **Not MVP:** Guest mode, contact import, streaks/gamification, referral, calendar, admin UI, full analytics, multilingual, full offline, anonymous mode.

## Rationale

- Core value is plan + reminders + checklist; outreach is secondary and consent-heavy.
- Guest and anonymous add identity complexity; minimal auth is simpler.
- Gamification and referral can undermine trust and calm tone.

## Consequences

- Demo script focuses on commit → plan → reminders → checklist and consent.
- Outreach is optional in demo; manual-only to minimize privacy risk.
