import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/db.js";
import { authHook } from "../lib/jwt.js";

const createContactSchema = z.object({
  name: z.string().min(1).max(100),
  contactValue: z.string().min(1).max(255),
});

const sendTemplateSchema = z.object({
  contactId: z.string(),
  templateId: z.string().min(1).max(50),
});

export async function outreachRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions,
): Promise<void> {
  app.addHook("preHandler", authHook);

  app.get("/contacts", async (request, reply) => {
    const userId = (request as unknown as { userId: string }).userId;
    const contacts = await prisma.outreachContact.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return reply.send(contacts);
  });

  app.post("/contacts", async (request, reply) => {
    const userId = (request as unknown as { userId: string }).userId;
    const body = createContactSchema.safeParse(request.body);
    if (!body.success) {
      return reply
        .status(400)
        .send({ error: "Invalid body", details: body.error.flatten() });
    }
    const contact = await prisma.outreachContact.create({
      data: {
        userId,
        name: body.data.name,
        contactValue: body.data.contactValue,
      },
    });
    return reply.status(201).send(contact);
  });

  app.delete<{ Params: { id: string } }>(
    "/contacts/:id",
    async (request, reply) => {
      const userId = (request as unknown as { userId: string }).userId;
      const contact = await prisma.outreachContact.findFirst({
        where: { id: request.params.id, userId },
      });
      if (!contact)
        return reply.status(404).send({ error: "Contact not found" });
      await prisma.outreachContact.delete({ where: { id: contact.id } });
      return reply.status(204).send();
    },
  );

  app.post("/send", async (request, reply) => {
    const userId = (request as unknown as { userId: string }).userId;
    const body = sendTemplateSchema.safeParse(request.body);
    if (!body.success) {
      return reply
        .status(400)
        .send({ error: "Invalid body", details: body.error.flatten() });
    }
    const contact = await prisma.outreachContact.findFirst({
      where: { id: body.data.contactId, userId },
    });
    if (!contact) return reply.status(404).send({ error: "Contact not found" });
    const action = await prisma.outreachAction.create({
      data: {
        userId,
        contactId: contact.id,
        templateId: body.data.templateId,
      },
    });
    return reply.status(201).send(action);
  });
}
