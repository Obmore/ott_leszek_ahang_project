import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/db.js";
import { authHook } from "../lib/jwt.js";

const createPlanSchema = z.object({
  title: z.string().min(1).max(200).optional(),
});
const updatePlanSchema = z.object({
  title: z.string().min(1).max(200).optional(),
});
const createStepSchema = z.object({
  title: z.string().min(1).max(300),
  orderIndex: z.number().int().min(0),
  dueAt: z.string().datetime().optional().nullable(),
});
const updateStepSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  orderIndex: z.number().int().min(0).optional(),
  dueAt: z.string().datetime().optional().nullable(),
  completedAt: z.string().datetime().optional().nullable(),
});

export async function plansRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions,
): Promise<void> {
  app.addHook("preHandler", authHook);

  app.get("/", async (request, reply) => {
    const userId = (request as unknown as { userId: string }).userId;
    const plans = await prisma.plan.findMany({
      where: { userId },
      include: { steps: { orderBy: { orderIndex: "asc" } } },
    });
    return reply.send(plans);
  });

  app.post("/", async (request, reply) => {
    const userId = (request as unknown as { userId: string }).userId;
    const body = createPlanSchema.safeParse(request.body);
    if (!body.success) {
      return reply
        .status(400)
        .send({ error: "Invalid body", details: body.error.flatten() });
    }
    const plan = await prisma.plan.create({
      data: {
        userId,
        title: body.data.title ?? "Részvételi tervem",
      },
      include: { steps: true },
    });
    return reply.status(201).send(plan);
  });

  app.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const userId = (request as unknown as { userId: string }).userId;
    const plan = await prisma.plan.findFirst({
      where: { id: request.params.id, userId },
      include: { steps: { orderBy: { orderIndex: "asc" } } },
    });
    if (!plan) return reply.status(404).send({ error: "Plan not found" });
    return reply.send(plan);
  });

  app.patch<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const userId = (request as unknown as { userId: string }).userId;
    const body = updatePlanSchema.safeParse(request.body);
    if (!body.success) {
      return reply
        .status(400)
        .send({ error: "Invalid body", details: body.error.flatten() });
    }
    const plan = await prisma.plan.findFirst({
      where: { id: request.params.id, userId },
    });
    if (!plan) return reply.status(404).send({ error: "Plan not found" });
    const updated = await prisma.plan.update({
      where: { id: plan.id },
      data: body.data,
      include: { steps: { orderBy: { orderIndex: "asc" } } },
    });
    return reply.send(updated);
  });

  app.get<{ Params: { id: string } }>("/:id/steps", async (request, reply) => {
    const userId = (request as unknown as { userId: string }).userId;
    const plan = await prisma.plan.findFirst({
      where: { id: request.params.id, userId },
    });
    if (!plan) return reply.status(404).send({ error: "Plan not found" });
    const steps = await prisma.planStep.findMany({
      where: { planId: plan.id },
      orderBy: { orderIndex: "asc" },
    });
    return reply.send(steps);
  });

  app.post<{ Params: { id: string } }>("/:id/steps", async (request, reply) => {
    const userId = (request as unknown as { userId: string }).userId;
    const plan = await prisma.plan.findFirst({
      where: { id: request.params.id, userId },
    });
    if (!plan) return reply.status(404).send({ error: "Plan not found" });
    const body = createStepSchema.safeParse(request.body);
    if (!body.success) {
      return reply
        .status(400)
        .send({ error: "Invalid body", details: body.error.flatten() });
    }
    const step = await prisma.planStep.create({
      data: {
        planId: plan.id,
        title: body.data.title,
        orderIndex: body.data.orderIndex,
        dueAt: body.data.dueAt ? new Date(body.data.dueAt) : null,
      },
    });
    return reply.status(201).send(step);
  });

  app.patch<{ Params: { id: string; stepId: string } }>(
    "/:id/steps/:stepId",
    async (request, reply) => {
      const userId = (request as unknown as { userId: string }).userId;
      const plan = await prisma.plan.findFirst({
        where: { id: request.params.id, userId },
      });
      if (!plan) return reply.status(404).send({ error: "Plan not found" });
      const step = await prisma.planStep.findFirst({
        where: { id: request.params.stepId, planId: plan.id },
      });
      if (!step) return reply.status(404).send({ error: "Step not found" });
      const body = updateStepSchema.safeParse(request.body);
      if (!body.success) {
        return reply
          .status(400)
          .send({ error: "Invalid body", details: body.error.flatten() });
      }
      const updated = await prisma.planStep.update({
        where: { id: step.id },
        data: {
          ...(body.data.title !== undefined && { title: body.data.title }),
          ...(body.data.orderIndex !== undefined && {
            orderIndex: body.data.orderIndex,
          }),
          ...(body.data.dueAt !== undefined && {
            dueAt: body.data.dueAt ? new Date(body.data.dueAt) : null,
          }),
          ...(body.data.completedAt !== undefined && {
            completedAt: body.data.completedAt
              ? new Date(body.data.completedAt)
              : null,
          }),
        },
      });
      return reply.send(updated);
    },
  );

  app.delete<{ Params: { id: string; stepId: string } }>(
    "/:id/steps/:stepId",
    async (request, reply) => {
      const userId = (request as unknown as { userId: string }).userId;
      const plan = await prisma.plan.findFirst({
        where: { id: request.params.id, userId },
      });
      if (!plan) return reply.status(404).send({ error: "Plan not found" });
      const step = await prisma.planStep.findFirst({
        where: { id: request.params.stepId, planId: plan.id },
      });
      if (!step) return reply.status(404).send({ error: "Step not found" });
      await prisma.planStep.delete({ where: { id: step.id } });
      return reply.status(204).send();
    },
  );
}
