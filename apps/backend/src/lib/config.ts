/**
 * Centralized config from env. No secrets in code.
 */

function env(key: string, defaultValue?: string): string {
  const v = process.env[key];
  if (v !== undefined && v !== "") return v;
  if (defaultValue !== undefined) return defaultValue;
  throw new Error(`Missing required env: ${key}`);
}

function envNumber(key: string, defaultValue: number): number {
  const v = process.env[key];
  if (v === undefined || v === "") return defaultValue;
  const n = Number(v);
  if (Number.isNaN(n)) throw new Error(`Invalid number for env: ${key}`);
  return n;
}

export const config = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  host: env("HOST", "0.0.0.0"),
  port: envNumber("PORT", 3000),
  logLevel: process.env.LOG_LEVEL ?? "info",
  corsOrigin: process.env.CORS_ORIGIN ?? "*",

  database: {
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  },
} as const;
