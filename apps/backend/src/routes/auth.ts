import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/db.js";
import { signToken } from "../lib/jwt.js";

const requestOtpSchema = z.object({
  phoneOrEmail: z.string().min(1).max(255),
});

const verifyOtpSchema = z.object({
  phoneOrEmail: z.string().min(1).max(255),
  code: z.string().length(6),
});

export async function authRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions,
): Promise<void> {
  app.post("/otp/request", async (request, reply) => {
    const body = requestOtpSchema.safeParse(request.body);
    if (!body.success) {
      return reply
        .status(400)
        .send({ error: "Invalid body", details: body.error.flatten() });
    }
    const { phoneOrEmail } = body.data;
    const externalId = Buffer.from(phoneOrEmail.toLowerCase().trim())
      .toString("base64url")
      .slice(0, 64);
    let user = await prisma.user.findUnique({ where: { externalId } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          externalId,
          phoneOrEmail: phoneOrEmail.trim(),
        },
      });
      await prisma.profile.create({
        data: { userId: user.id, locale: "hu" },
      });
      await prisma.notificationPreferences.create({
        data: { userId: user.id },
      });
    }
    app.log.info({ userId: user.id }, "OTP requested (mock: no actual send)");
    return reply.send({ ok: true, message: "Code sent (dev mock)" });
  });

  app.post("/otp/verify", async (request, reply) => {
    const body = verifyOtpSchema.safeParse(request.body);
    if (!body.success) {
      return reply
        .status(400)
        .send({ error: "Invalid body", details: body.error.flatten() });
    }
    const { phoneOrEmail, code } = body.data;
    if (process.env.NODE_ENV === "development" && code === "123456") {
      const externalId = Buffer.from(phoneOrEmail.toLowerCase().trim())
        .toString("base64url")
        .slice(0, 64);
      const user = await prisma.user.findUnique({ where: { externalId } });
      if (!user) {
        return reply.status(401).send({ error: "Invalid code" });
      }
      const token = signToken({ sub: user.id });
      return reply.send({ token, userId: user.id });
    }
    return reply.status(401).send({ error: "Invalid code" });
  });
}
