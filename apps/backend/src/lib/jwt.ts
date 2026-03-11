import jwt from "jsonwebtoken";
import type { FastifyRequest, FastifyReply } from "fastify";

const SECRET = process.env.JWT_SECRET ?? "dev-secret-change-in-production";

export interface JwtPayload {
  sub: string;
  iat?: number;
  exp?: number;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign({ sub: payload.sub }, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
}

export async function authHook(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const authHeader = request.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return reply
      .status(401)
      .send({ error: "Unauthorized", code: "MISSING_TOKEN" });
  }
  const payload = verifyToken(token);
  if (!payload) {
    return reply
      .status(401)
      .send({ error: "Unauthorized", code: "INVALID_TOKEN" });
  }
  (request as FastifyRequest & { userId: string }).userId = payload.sub;
}
