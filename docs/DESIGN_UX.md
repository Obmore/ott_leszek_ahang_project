# OttLeszek — Design & UX

## Principles

- **Modern, minimal, trustworthy** — no childish or activist visual noise.
- **Calm, clear** — light and dark themes; highly legible; low cognitive load.
- **One primary action per screen** — reduce friction and decision fatigue.
- **Progressive disclosure** — optional steps skippable; explain why we ask for data.
- **No manipulative urgency** — reminders feel useful, not invasive.

## Design tokens (foundation)

Defined in `apps/mobile/theme/tokens.ts`:

- **Spacing:** xs(4), sm(8), md(16), lg(24), xl(32) — use these instead of magic numbers.
- **Colors:** background primary/secondary; text primary/secondary/muted; accent primary; border; error; success.
- **Typography:** title (28/700), headline (22/600), body (16/400), bodySmall (14), caption (12).

## Color roles

- **Background primary:** main screen background (e.g. #1a1a2e dark).
- **Text primary:** headings and main copy.
- **Text secondary:** supporting copy.
- **Accent:** primary actions, links.
- **Error/success:** feedback only; use sparingly.

## Component states

- Default, pressed, disabled, loading, error.
- Buttons: primary (main CTA), secondary (cancel/back), destructive (delete only).

## Trust-building copy

- Hungarian; short sentences.
- Explain purpose at point of use (e.g. “Ezt csak az emlékeztetésekhez használjuk”).
- No pre-ticked optional consent; no “Accept all” that hides choices.

## Accessibility

- Color contrast (WCAG AA minimum).
- Touch targets ≥ 44pt.
- Screen reader labels for interactive elements.
- Clear error and loading states; avoid motion for critical info when reduced-motion is set.
