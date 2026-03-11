# OttLeszek — MVP feature matrix

For each feature: user value, evaluation impact, implementation complexity, privacy risk, MVP decision, reasoning.

| Feature                  | User value                | Eval impact | Complexity | Privacy risk | MVP decision    | Reasoning                                                      |
| ------------------------ | ------------------------- | ----------- | ---------- | ------------ | --------------- | -------------------------------------------------------------- |
| Guest mode               | Try without account       | Medium      | Medium     | Low          | **Not MVP**     | Minimal auth is simpler; avoids anonymous vs identified split. |
| Login                    | Identity, reminders, sync | High        | Medium     | Low          | **Should have** | Needed for reminders and progress; OTP or email link.          |
| OTP login                | Low-friction auth         | High        | Medium     | Low          | **Should have** | Good balance of security and simplicity.                       |
| Onboarding               | Clarity, consent          | High        | Low        | Low          | **Must have**   | First impression and consent collection.                       |
| Commitment / pledge      | Explicit intent           | High        | Low        | Low          | **Must have**   | Core product moment.                                           |
| Action checklist         | Progress, completion      | High        | Low        | Low          | **Must have**   | Core utility.                                                  |
| Reminder scheduling      | Utility                   | High        | Medium     | Low          | **Must have**   | Core value.                                                    |
| Push notifications       | Delivery                  | High        | Medium     | Low          | **Could have**  | If Expo push is ready; else in-app.                            |
| Contact import           | Scale outreach            | Medium      | High       | High         | **Not MVP**     | Manual entry only; minimize PII.                               |
| Manual contact entry     | Outreach                  | Medium      | Low        | Medium       | **Should have** | Controlled, consent-heavy.                                     |
| Outreach templates       | Messaging                 | Medium      | Low        | Low          | **Should have** | Neutral, non-pushy text.                                       |
| Progress dashboard       | Motivation                | High        | Low        | Low          | **Must have**   | Simple “done / left” view.                                     |
| Streaks / gamification   | Engagement                | Low         | Medium     | Low          | **Not MVP**     | Avoid pressure; calm product.                                  |
| Referral logic           | Growth                    | Low         | High       | Medium       | **Not MVP**     | Not core to evaluation.                                        |
| Calendar integration     | Convenience               | Low         | High       | Low          | **Not MVP**     | Post-MVP.                                                      |
| Admin dashboard          | Operations                | Low         | High       | Medium       | **Not MVP**     | Extension point only.                                          |
| Analytics                | Product insight           | Low         | Medium     | Medium       | **Not MVP**     | Minimal events only if any.                                    |
| Multilingual             | Reach                     | Low         | Medium     | Low          | **Not MVP**     | Hungarian only.                                                |
| Offline mode             | Resilience                | Medium      | High       | Low          | **Not MVP**     | Offline-ready model only.                                      |
| Anonymous mode           | Privacy                   | Medium      | High       | Medium       | **Not MVP**     | Pseudonymous is enough.                                        |
| Shareable plan card      | Social                    | Low         | Medium     | Low          | **Could have**  | Nice-to-have.                                                  |
| Consent center           | Trust, compliance         | High        | Low        | Low          | **Must have**   | Required for evaluation.                                       |
| Account deletion         | Trust, GDPR               | High        | Medium     | Low          | **Should have** | Export + delete flow.                                          |
| Notification preferences | Control                   | High        | Low        | Low          | **Must have**   | User control.                                                  |
| Event history timeline   | Transparency              | Low         | Medium     | Low          | **Not MVP**     | Post-MVP.                                                      |
