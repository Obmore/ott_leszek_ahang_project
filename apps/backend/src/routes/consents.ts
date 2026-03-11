import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/db.js";
import { authHook } from "../lib/jwt.js";

const recordConsentSchema = z.object({
  consentType: z.string().min(1).max(100),
  version: z.string().min(1).max(20),
});

export async function consentsRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions,
): Promise<void> {
  app.addHook("preHandler", authHook);

  app.get("/summary", async (request, reply) => {
    const userId = (request as unknown as { userId: string }).userId;
    const records = await prisma.consentRecord.findMany({
      where: { userId },
      orderBy: { acceptedAt: "desc" },
    });
    const summary = records.reduce<
      Record<string, { version: string; acceptedAt: string }>
    >((acc, r) => {
      if (!acc[r.consentType]) {
        acc[r.consentType] = {
          version: r.version,
          acceptedAt: r.acceptedAt.toISOString(),
        };
      }
      return acc;
    }, {});
    return reply.send(summary);
  });

  app.post("/", async (request, reply) => {
    const userId = (request as unknown as { userId: string }).userId;
    const body = recordConsentSchema.safeParse(request.body);
    if (!body.success) {
      return reply
        .status(400)
        .send({ error: "Invalid body", details: body.error.flatten() });
    }
    await prisma.consentRecord.create({
      data: {
        userId,
        consentType: body.data.consentType,
        version: body.data.version,
      },
    });
    return reply.status(201).send({ ok: true });
  });
}
