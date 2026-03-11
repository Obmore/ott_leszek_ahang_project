/**
 * OttLeszek Backend — Fastify API entry point.
 * Domain modules and plugins are registered here.
 */

import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { config } from "./lib/config.js";
import { healthRoutes } from "./routes/health.js";
import { authRoutes } from "./routes/auth.js";
import { usersRoutes } from "./routes/users.js";
import { commitmentsRoutes } from "./routes/commitments.js";
import { plansRoutes } from "./routes/plans.js";
import { remindersRoutes } from "./routes/reminders.js";
import { notificationPreferencesRoutes } from "./routes/notification-preferences.js";
import { consentsRoutes } from "./routes/consents.js";
import { outreachRoutes } from "./routes/outreach.js";
import { accountRoutes } from "./routes/account.js";

const app = Fastify({ logger: { level: config.logLevel } });

await app.register(helmet, { global: true });
await app.register(cors, {
  origin: config.corsOrigin,
  credentials: true,
});

app.register(healthRoutes);
app.register(authRoutes, { prefix: "/auth" });
app.register(usersRoutes, { prefix: "/users" });
app.register(commitmentsRoutes, { prefix: "/commitments" });
app.register(plansRoutes, { prefix: "/plans" });
app.register(remindersRoutes, { prefix: "/reminders" });
app.register(notificationPreferencesRoutes, {
  prefix: "/notification-preferences",
});
app.register(consentsRoutes, { prefix: "/consents" });
app.register(outreachRoutes, { prefix: "/outreach" });
app.register(accountRoutes, { prefix: "/account" });

const host = config.host;
const port = config.port;

try {
  await app.listen({ host, port });
  app.log.info(`OttLeszek backend listening at http://${host}:${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
