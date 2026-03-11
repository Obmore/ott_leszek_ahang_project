# OttLeszek — Privacy & security model

## Privacy rules

- **Consent first:** Collect consent at point of use; explain purpose in plain language (Hungarian).
- **Lawful defaults:** No pre-ticked marketing; no sharing with third parties for ads.
- **Minimal data:** Only collect what is required for plan, reminders, outreach (manual), and consent.
- **Local-first where possible:** Prefer on-device state for UI; sync only what’s needed.
- **Encrypted transport:** HTTPS only; certificate pinning optional for high-security builds.
- **Secrets:** No secrets in client bundle; env for API URL and public keys only.
- **PII classification:** Treat phone/email, contact list, and consent as PII; treat user_id as pseudonymous.
- **Retention:** Define per entity (see DATA_MODEL.md); configurable where possible.
- **Deletion/export:** Account deletion removes or anonymizes user data; export provides machine-readable copy (GDPR).
- **Abuse:** Rate limiting on auth and send endpoints; no opaque tracking; no dark patterns.

## Security rules

- **Backend validates all authorization:** Never trust client for “who can see what.”
- **Strict env separation:** Dev/staging/prod; no prod secrets in repo.
- **Token handling:** Short-lived JWT; refresh in secure storage; clear on logout.
- **Secure storage:** Expo SecureStore for tokens; MMKV for non-secret prefs.
- **Rate limiting:** On login, OTP, and outreach send; document limits.
- **Audit logging:** Where justified (e.g. consent change, deletion); no PII in logs.

## Outreach-specific

- **No contact import in MVP:** Manual entry only to minimize bulk PII.
- **Explain purpose:** “We use this only to send your chosen message; we do not store message content.”
- **Short retention:** Contacts and outreach_actions retained only as long as needed (e.g. 90 days).
- **User can delete contacts** at any time; cascade to outreach_actions.

## Consent center

- List what we collect, why, and how long.
- Allow withdrawal of optional consents (e.g. notifications).
- Link to deletion and export.
- No pre-ticked optional consent.
