# OttLeszek — Skills library (playbooks)

## skill_mvp_scope_guard

- **When:** Before adding any feature or large change.
- **Inputs:** Current MVP list, evaluation criteria, phase goal.
- **Steps:** (1) Check if feature is in Must/Should have. (2) If not, document as post-MVP or reject. (3) If yes, confirm no gold-plating (minimal implementation). (4) Update backlog and demo script if needed.
- **Outputs:** Go/no-go, backlog update.
- **Checklist:** Feature in matrix; implementation minimal; demo impact clear.

## skill_evaluation_criteria_alignment

- **When:** When proposing a feature or design.
- **Inputs:** Feature description, evaluation criteria list.
- **Steps:** For each criterion (usability, mobilization, privacy, etc.), state how the feature supports it; flag gaps.
- **Outputs:** Short alignment note; gaps list.
- **Checklist:** Every criterion touched or explicitly deferred.

## skill_screen_blueprint

- **When:** Before implementing a new screen.
- **Inputs:** User story, design tokens, API contract (if any).
- **Steps:** (1) Name screen and route. (2) List components and state (local vs server). (3) Define loading/empty/error. (4) List primary action and secondary actions. (5) Note accessibility (labels, contrast).
- **Outputs:** Blueprint doc or checklist for implementation.
- **Checklist:** One primary action; states defined; a11y considered.

## skill_component_build

- **When:** Adding a reusable UI component.
- **Inputs:** Design spec or token list, usage context.
- **Steps:** (1) Use design tokens only. (2) Props typed; optional variants. (3) Accessibility: role, label, focus. (4) No business logic; presentational.
- **Outputs:** Component file(s), story or usage example.
- **Checklist:** Tokens; typed; a11y; no logic.

## skill_form_flow_build

- **When:** Multi-step or important form (e.g. onboarding, plan builder).
- **Inputs:** Fields, validation (Zod), API payload.
- **Steps:** (1) Map fields to schema. (2) React Hook Form + Zod. (3) Inline validation; clear errors. (4) Submit once; loading state. (5) Consent and explanation copy where needed.
- **Outputs:** Form screens, validation, submit handler.
- **Checklist:** Validation at boundary; no submit without required; consent where applicable.

## skill_navigation_addition

- **When:** Adding a new flow or tab.
- **Inputs:** Route name, parent (stack/tabs), deep link if any.
- **Steps:** (1) Add file under `app/` per Expo Router. (2) Update tabs or stack if needed. (3) Document in nav map. (4) Test deep link if applicable.
- **Outputs:** Route files, nav update.
- **Checklist:** Route works; back/stack correct; doc updated.

## skill_theme_consistency_review

- **When:** After adding UI or before release.
- **Inputs:** Theme tokens, changed screens.
- **Steps:** (1) Check spacing/color/typography use tokens. (2) Check light/dark if supported. (3) Check contrast and touch targets.
- **Outputs:** List of violations or OK.
- **Checklist:** No magic numbers; contrast pass; tokens used.

## skill_privacy_review

- **When:** New data collection, new endpoint, or new third-party.
- **Inputs:** Data flow description, schema or payload.
- **Steps:** (1) Classify data (anonymous/pseudonymous/personal/sensitive). (2) Check consent and purpose. (3) Check retention and deletion. (4) Flag PII in logs or responses.
- **Outputs:** Privacy note; recommendations.
- **Checklist:** Classification; consent; retention; no PII leak.

## skill_api_contract_design

- **When:** New or changed API surface.
- **Inputs:** User story, domain model.
- **Steps:** (1) Resource and method (GET/POST/PATCH/DELETE). (2) Path and path params. (3) Request body schema (Zod). (4) Response schema; error shape. (5) Auth required; idempotency if needed.
- **Outputs:** Route spec, Zod schemas, OpenAPI snippet.
- **Checklist:** Validated in/out; auth; errors.

## skill_backend_module_bootstrap

- **When:** New domain module (e.g. reminders).
- **Inputs:** Module name, entities, API spec.
- **Steps:** (1) Create folder under `src/<module>`. (2) Add routes, service, Prisma usage. (3) Register routes in app. (4) Add validation schemas. (5) Health or dependency if needed.
- **Outputs:** Module folder, routes registered, schemas.
- **Checklist:** Routes work; auth applied; validation on boundaries.

## skill_schema_change

- **When:** DB schema change.
- **Inputs:** Entity change (add/remove/rename column or table).
- **Steps:** (1) Update Prisma schema. (2) Generate migration; review SQL. (3) Check backward compatibility (e.g. nullable first). (4) Document in DATA_MODEL and retention.
- **Outputs:** Migration file, updated schema, doc.
- **Checklist:** Migration reversible or documented; no PII in new fields without consent.

## skill_notification_flow

- **When:** Adding or changing reminder/notification behavior.
- **Inputs:** Trigger (time, event), channel (push/in-app), user preferences.
- **Steps:** (1) Respect notification_preferences and quiet hours. (2) Store reminder in DB; job/cron reads due. (3) Send via Expo push or in-app; log sent_at. (4) No PII in payload.
- **Outputs:** Flow doc, code, tests.
- **Checklist:** Preferences respected; sent_at updated; no PII in push.

## skill_copywriting_trust_check

- **When:** Any user-facing copy (onboarding, consent, buttons).
- **Inputs:** Copy draft.
- **Steps:** (1) Calm tone; no urgency manipulation. (2) Explain why we ask for data. (3) Hungarian; clear and short. (4) No dark pattern (no misleading “Accept all”).
- **Outputs:** Approved or revised copy.
- **Checklist:** Tone; purpose explained; language; no dark pattern.

## skill_accessibility_review

- **When:** New screen or before release.
- **Inputs:** Screen or component.
- **Steps:** (1) Labels for interactive elements. (2) Contrast and text size. (3) Touch target size. (4) Focus order; screen reader flow. (5) Error and loading announced.
- **Outputs:** a11y report or OK.
- **Checklist:** Labels; contrast; targets; focus; errors.

## skill_test_for_new_feature

- **When:** Feature implementation done.
- **Inputs:** Feature scope, API contract, critical path.
- **Steps:** (1) Unit tests for validation and service logic. (2) API tests for new endpoints. (3) E2E or critical path for main flow. (4) Error and edge cases.
- **Outputs:** Test files, coverage note.
- **Checklist:** Validation tested; endpoints tested; one happy path e2e.

## skill_backend_endpoint_delivery

- **When:** Delivering a new API endpoint.
- **Inputs:** Contract (method, path, body, response).
- **Steps:** (1) Route + handler. (2) Zod validation. (3) Auth guard. (4) Service call; map to DTO. (5) Error handling; status codes. (6) OpenAPI or comment.
- **Outputs:** Working endpoint, tests.
- **Checklist:** Validated; authorized; errors; doc.

## skill_refactor_without_regression

- **When:** Refactoring existing code.
- **Inputs:** Scope of refactor, existing tests.
- **Steps:** (1) Run tests before. (2) Refactor in small steps. (3) Run tests after each step. (4) Update types and docs.
- **Outputs:** Refactored code, green tests.
- **Checklist:** Tests green before/after; behavior unchanged.

## skill_release_readiness_check

- **When:** Before demo or release.
- **Inputs:** Phase checklist, demo script, env template.
- **Steps:** (1) All phase acceptance criteria met. (2) Demo script runs end-to-end. (3) README and env documented. (4) No known PII leak or security bug. (5) “Implemented vs planned” list current.
- **Outputs:** Go/no-go; checklist signed off.
- **Checklist:** Criteria; demo; docs; security; list.
