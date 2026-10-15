import { createHash, randomBytes } from "node:crypto";
import { getDb } from "./db";
import { isStaffRole, type StaffRole } from "./staff-paths";

export const SESSION_COOKIE = "fixflow_session";
export const SESSION_MAX_AGE_SECONDS = 12 * 60 * 60;

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function findStaffByEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  if (!normalized) {
    return null;
  }
  return getDb().staffUser.findUnique({ where: { email: normalized } });
}

export async function createSession(staffUserId: string) {
  const token = randomBytes(32).toString("base64url");
  await getDb().session.create({
    data: {
      id: crypto.randomUUID(),
      tokenHash: hashSessionToken(token),
      staffUserId,
      expiresAt: new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000),
    },
  });
  return token;
}

export async function getStaffBySession(token: string | null) {
  if (!token) {
    return null;
  }
  const session = await getDb().session.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    include: { staffUser: true },
  });
  if (!session) {
    return null;
  }
  if (session.expiresAt.getTime() <= Date.now()) {
    await getDb().session.delete({ where: { id: session.id } });
    return null;
  }
  if (!isStaffRole(session.staffUser.role)) {
    return null;
  }
  return {
    id: session.staffUser.id,
    name: session.staffUser.name,
    role: session.staffUser.role as StaffRole,
  };
}

export async function deleteSession(token: string | null) {
  if (!token) {
    return;
  }
  await getDb().session.deleteMany({
    where: { tokenHash: hashSessionToken(token) },
  });
}
