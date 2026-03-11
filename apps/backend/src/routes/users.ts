import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/db.js";
import { authHook } from "../lib/jwt.js";

const updateProfileSchema = z.object({
  displayName: z.string().max(100).optional().nullable(),
  locale: z.string().max(10).optional(),
});

export async function usersRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions,
): Promise<void> {
  app.addHook("preHandler", authHook);

  app.get("/me", async (request, reply) => {
    const userId = (request as unknown as { userId: string }).userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phoneOrEmail: true,
        pushToken: true,
        createdAt: true,
        profile: true,
      },
    });
    if (!user) return reply.status(404).send({ error: "User not found" });
    return reply.send(user);
  });

  app.patch("/me/profile", async (request, reply) => {
    const userId = (request as unknown as { userId: string }).userId;
    const body = updateProfileSchema.safeParse(request.body);
    if (!body.success) {
      return reply
        .status(400)
        .send({ error: "Invalid body", details: body.error.flatten() });
    }
    await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        displayName: body.data.displayName ?? null,
        locale: body.data.locale ?? "hu",
      },
      update: {
        ...(body.data.displayName !== undefined && {
          displayName: body.data.displayName,
        }),
        ...(body.data.locale !== undefined && {
          locale: body.data.locale ?? "hu",
        }),
      },
    });
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, phoneOrEmail: true, profile: true },
    });
    return reply.send(user);
  });
}
