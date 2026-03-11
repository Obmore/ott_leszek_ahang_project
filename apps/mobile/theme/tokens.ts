/**
 * OttLeszek — design tokens (foundation).
 * Use these instead of magic numbers for spacing, color, typography.
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const colors = {
  background: {
    primary: "#1a1a2e",
    secondary: "#252538",
  },
  text: {
    primary: "#e8e8ed",
    secondary: "#a0a0b0",
    muted: "#6c6c80",
  },
  accent: {
    primary: "#6c9eff",
    primaryPressed: "#5a8ae6",
  },
  border: "#3a3a4e",
  error: "#e06c75",
  success: "#98c379",
} as const;

export const typography = {
  title: { fontSize: 28, fontWeight: "700" as const },
  headline: { fontSize: 22, fontWeight: "600" as const },
  body: { fontSize: 16, fontWeight: "400" as const },
  bodySmall: { fontSize: 14, fontWeight: "400" as const },
  caption: { fontSize: 12, fontWeight: "400" as const },
} as const;
