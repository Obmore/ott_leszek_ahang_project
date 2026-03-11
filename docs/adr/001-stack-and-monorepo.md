# ADR 001: Stack and monorepo

## Status

Accepted

## Context

We need a single, credible stack for OttLeszek MVP: mobile app + custom backend, evaluator-friendly, maintainable, and deliverable.

## Decision

- **Monorepo** with pnpm workspaces: `apps/mobile`, `apps/backend`, `packages/shared`, `packages/config`, `docs`.
- **Mobile:** Expo, TypeScript, Expo Router, Zustand, TanStack Query, React Hook Form, Zod, NativeWind (or token-based styling).
- **Backend:** Node.js, TypeScript, Fastify, PostgreSQL, Prisma. No BaaS (Supabase/Firebase).
- **Auth:** JWT in `Authorization` header; OTP or email-link for MVP login.

## Rationale

- Monorepo: single clone, shared types, aligned releases.
- Fastify over NestJS: lower overhead, faster iteration, sufficient structure via explicit modules.
- Prisma: strong DX and migrations; PostgreSQL is primary DB.
- Custom backend: full control for consent, retention, and evaluation credibility; no vendor lock-in.

## Consequences

- Backend must be implemented from day one; no placeholder.
- Shared package stays minimal (types, schemas, constants only).
