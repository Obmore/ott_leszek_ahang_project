import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { prisma } from "../lib/db.js";
import { authHook } from "../lib/jwt.js";

export async function accountRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions,
): Promise<void> {
  app.addHook("preHandler", authHook);

  app.get("/export", async (request, reply) => {
    const userId = (request as unknown as { userId: string }).userId;
    const [
      user,
      profile,
      plans,
      commitments,
      reminders,
      prefs,
      consents,
      contacts,
    ] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, phoneOrEmail: true, createdAt: true },
      }),
      prisma.profile.findUnique({ where: { userId } }),
      prisma.plan.findMany({
        where: { userId },
        include: { steps: true },
      }),
      prisma.commitment.findMany({ where: { userId } }),
      prisma.reminder.findMany({ where: { userId } }),
      prisma.notificationPreferences.findUnique({ where: { userId } }),
      prisma.consentRecord.findMany({ where: { userId } }),
      prisma.outreachContact.findMany({
        where: { userId },
        select: { id: true, name: true, createdAt: true },
      }),
    ]);
    if (!user) return reply.status(404).send({ error: "User not found" });
    const exportData = {
      exportedAt: new Date().toISOString(),
      user,
      profile: profile ?? null,
      plans,
      commitments,
      reminders,
      notificationPreferences: prefs ?? null,
      consentRecords: consents,
      outreachContacts: contacts,
    };
    return reply.send(exportData);
  });

  app.delete("/", async (request, reply) => {
    const userId = (request as unknown as { userId: string }).userId;
    await prisma.user.delete({ where: { id: userId } });
    return reply.status(204).send();
  });
}
