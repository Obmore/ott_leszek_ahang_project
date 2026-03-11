# OttLeszek — Demo script

## Shortest-path happy flow (implemented)

1. Open app → **Onboarding** (welcome → consent → login).
2. Enter e-mail/phone (e.g. `teszt@example.com`) → Request code → Enter **123456** (dev) → Belépés.
3. **Főoldal** → "Részveszek" → Elköteleződés rögzítve.
4. **Terv** fül → "Terv létrehozása" → Add 3–5 lépést (pl. "Regisztrálok", "Megnézem az időpontot", "Elmegyek szavazni").
5. **Emlékeztetők** fül → "Emlékeztető hozzáadása (holnap 9:00)".
6. **Főoldal** → Látható a terv és a checklist → Kattints egy lépésre → megjelölés késznek.
7. **Kapcsolat** fül → Add meg egy nevet és e-mailt/telefont → "Emlékeztető" gomb (sablon küldése).
8. **Beállítások** → Hozzájárulások, értesítési beállítások, Export, Kijelentkezés, Fiók törlése.

## Primary persona

First-time, low-friction user: wants to commit and get reminders without complexity.

## Implemented (MVP)

- Onboarding: welcome, consent, login (OTP mock 123456).
- Commitment: POST /commitments, megjelenítés a főoldalon.
- Plan: create plan, add steps (max 5), checklist a főoldalon (toggle completed).
- Reminders: add (holnap 9:00), list, delete.
- Outreach: add contact (name + value), send template, delete contact.
- Settings: consent summary, notification prefs (push / in-app), export, logout, delete account.
- Backend: auth (OTP request/verify), users/me, plans + steps, reminders, consents, notification-preferences, outreach, account export/delete, health.

## Not implemented / later

- Real OTP sending (SMS/e-mail).
- Push notification delivery (Expo Push).
- Calendar picker for reminder date/time.
- Multilingual.

## Demo talking points

- Privacy-first: consent at point of use; minimal data; deletion/export.
- Neutral, lawful civic tool: no persuasion or targeting.
- Real backend: custom Fastify + Prisma, no BaaS.
