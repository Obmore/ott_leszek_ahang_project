# OttLeszek — Data model & sensitivity

## Classification

- **Anonymous:** No identifier (e.g. pre-auth analytics—we avoid in MVP).
- **Pseudonymous:** User ID only, no direct contact data in logs.
- **Personal:** Name, email, phone (for OTP and push); stored only when needed.
- **Sensitive / high-risk:** Contact list for outreach; consent records; any free text that could identify others.

## Per-entity (MVP)

### users

- **Purpose:** Identity and delivery (OTP, push).
- **Data:** id, external_id (e.g. phone hash or email), phone_or_email, push_token, created_at, updated_at.
- **Sensitivity:** Personal.
- **Required:** Yes. Minimal for auth and reminders.
- **Retention:** Until account deletion.
- **Deletion:** Hard delete or anonymize on request; cascade to plans, reminders, outreach.

### profiles

- **Purpose:** Display name, locale.
- **Data:** user_id, display_name, locale, updated_at.
- **Sensitivity:** Personal.
- **Required:** Optional (display_name can be empty).
- **Retention:** Same as user.

### commitments

- **Purpose:** Record “I will participate.”
- **Data:** id, user_id, committed_at, optional campaign_id (for future).
- **Sensitivity:** Pseudonymous (user_id).
- **Retention:** Until user deletion; or configurable (e.g. 1 year).

### plans

- **Purpose:** One participation plan per user.
- **Data:** id, user_id, title, created_at, updated_at.
- **Sensitivity:** Pseudonymous.

### plan_steps

- **Purpose:** 3–5 steps per plan.
- **Data:** id, plan_id, order_index, title, due_at (optional), completed_at (optional).
- **Sensitivity:** Low (no PII in step content if title is generic).

### reminders

- **Purpose:** When to remind the user.
- **Data:** id, user_id, plan_id (optional), remind_at, channel (push/in_app), sent_at (nullable), created_at.
- **Sensitivity:** Pseudonymous; remind_at is personal (schedule).

### notification_preferences

- **Purpose:** User preferences for channels and frequency.
- **Data:** user_id, channel_push, channel_in_app, quiet_hours_start, quiet_hours_end, updated_at.
- **Sensitivity:** Personal (preferences).

### outreach_contacts

- **Purpose:** Manually entered contacts for outreach.
- **Data:** id, user_id, name, contact_value (phone or email), created_at.
- **Sensitivity:** Sensitive (third-party data); minimize and encrypt at rest.
- **Retention:** Short (e.g. 90 days) or until user deletes; document in consent.

### outreach_actions

- **Purpose:** Log that user sent a template to a contact (idempotent).
- **Data:** id, user_id, contact_id, template_id, sent_at.
- **Sensitivity:** Pseudonymous; no message content stored.

### consent_records

- **Purpose:** Consent type, version, timestamp.
- **Data:** id, user_id, consent_type, version, accepted_at, ip_or_agent (optional, minimal).
- **Sensitivity:** Personal (linked to user).
- **Retention:** Legal minimum; e.g. 3 years for consent proof.

### audit_events (optional in MVP)

- **Purpose:** Non-PII events for debugging and future admin.
- **Data:** id, event_type, user_id (nullable), payload (no PII), created_at.
- **Sensitivity:** Pseudonymous; no PII in payload.

---

## Data minimization rules

- Do not collect contacts by default; manual entry only in MVP.
- Do not store message body for outreach; only “template X sent to contact Y at Z.”
- Do not log PII in application logs.
- Store only what is needed for reminders, plan, consent, and deletion/export.
