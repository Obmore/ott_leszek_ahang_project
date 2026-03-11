import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { prisma } from "../lib/db.js";

export async function healthRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions,
): Promise<void> {
  app.get("/health", async (_request, reply) => {
    return reply.send({ status: "ok", service: "ottleszek-backend" });
  });

  app.get("/health/ready", async (_request, reply) => {
    try {
      await prisma.$queryRawUnsafe("SELECT 1");
      return reply.send({ status: "ok", ready: true });
    } catch (err) {
      app.log.warn(err, "Health ready check failed");
      return reply.status(503).send({ status: "error", ready: false });
    }
  });
}
