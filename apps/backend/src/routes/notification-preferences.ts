import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/db.js";
import { authHook } from "../lib/jwt.js";

const updatePrefsSchema = z.object({
  channelPush: z.boolean().optional(),
  channelInApp: z.boolean().optional(),
  quietHoursStart: z.string().max(10).optional().nullable(),
  quietHoursEnd: z.string().max(10).optional().nullable(),
});

export async function notificationPreferencesRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions,
): Promise<void> {
  app.addHook("preHandler", authHook);

  app.get("/", async (request, reply) => {
    const userId = (request as unknown as { userId: string }).userId;
    let prefs = await prisma.notificationPreferences.findUnique({
      where: { userId },
    });
    if (!prefs) {
      prefs = await prisma.notificationPreferences.create({
        data: { userId },
      });
    }
    return reply.send(prefs);
  });

  app.patch("/", async (request, reply) => {
    const userId = (request as unknown as { userId: string }).userId;
    const body = updatePrefsSchema.safeParse(request.body);
    if (!body.success) {
      return reply
        .status(400)
        .send({ error: "Invalid body", details: body.error.flatten() });
    }
    const prefs = await prisma.notificationPreferences.upsert({
      where: { userId },
      create: {
        userId,
        channelPush: body.data.channelPush ?? true,
        channelInApp: body.data.channelInApp ?? true,
        quietHoursStart: body.data.quietHoursStart ?? null,
        quietHoursEnd: body.data.quietHoursEnd ?? null,
      },
      update: {
        ...(body.data.channelPush !== undefined && {
          channelPush: body.data.channelPush,
        }),
        ...(body.data.channelInApp !== undefined && {
          channelInApp: body.data.channelInApp,
        }),
        ...(body.data.quietHoursStart !== undefined && {
          quietHoursStart: body.data.quietHoursStart,
        }),
        ...(body.data.quietHoursEnd !== undefined && {
          quietHoursEnd: body.data.quietHoursEnd,
        }),
      },
    });
    return reply.send(prefs);
  });
}
