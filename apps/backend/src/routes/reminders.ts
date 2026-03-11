import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/db.js";
import { authHook } from "../lib/jwt.js";

const createReminderSchema = z.object({
  planId: z.string().optional().nullable(),
  remindAt: z.string().datetime(),
  channel: z.enum(["push", "in_app"]).optional(),
});

const updateReminderSchema = z.object({
  remindAt: z.string().datetime().optional(),
  channel: z.enum(["push", "in_app"]).optional(),
});

export async function remindersRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions,
): Promise<void> {
  app.addHook("preHandler", authHook);

  app.get("/", async (request, reply) => {
    const userId = (request as unknown as { userId: string }).userId;
    const reminders = await prisma.reminder.findMany({
      where: { userId },
      orderBy: { remindAt: "asc" },
    });
    return reply.send(reminders);
  });

  app.post("/", async (request, reply) => {
    const userId = (request as unknown as { userId: string }).userId;
    const body = createReminderSchema.safeParse(request.body);
    if (!body.success) {
      return reply
        .status(400)
        .send({ error: "Invalid body", details: body.error.flatten() });
    }
    const reminder = await prisma.reminder.create({
      data: {
        userId,
        planId: body.data.planId ?? null,
        remindAt: new Date(body.data.remindAt),
        channel: body.data.channel ?? "push",
      },
    });
    return reply.status(201).send(reminder);
  });

  app.patch<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const userId = (request as unknown as { userId: string }).userId;
    const existing = await prisma.reminder.findFirst({
      where: { id: request.params.id, userId },
    });
    if (!existing)
      return reply.status(404).send({ error: "Reminder not found" });
    const body = updateReminderSchema.safeParse(request.body);
    if (!body.success) {
      return reply
        .status(400)
        .send({ error: "Invalid body", details: body.error.flatten() });
    }
    const updated = await prisma.reminder.update({
      where: { id: existing.id },
      data: {
        ...(body.data.remindAt && { remindAt: new Date(body.data.remindAt) }),
        ...(body.data.channel && { channel: body.data.channel }),
      },
    });
    return reply.send(updated);
  });

  app.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const userId = (request as unknown as { userId: string }).userId;
    const existing = await prisma.reminder.findFirst({
      where: { id: request.params.id, userId },
    });
    if (!existing)
      return reply.status(404).send({ error: "Reminder not found" });
    await prisma.reminder.delete({ where: { id: existing.id } });
    return reply.status(204).send();
  });
}
