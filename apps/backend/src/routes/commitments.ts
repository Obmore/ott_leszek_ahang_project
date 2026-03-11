import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { prisma } from "../lib/db.js";
import { authHook } from "../lib/jwt.js";

export async function commitmentsRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions,
): Promise<void> {
  app.addHook("preHandler", authHook);

  app.get("/", async (request, reply) => {
    const userId = (request as unknown as { userId: string }).userId;
    const list = await prisma.commitment.findMany({
      where: { userId },
      orderBy: { committedAt: "desc" },
    });
    return reply.send(list);
  });

  app.post("/", async (request, reply) => {
    const userId = (request as unknown as { userId: string }).userId;
    const commitment = await prisma.commitment.create({
      data: { userId },
    });
    return reply.status(201).send(commitment);
  });
}
