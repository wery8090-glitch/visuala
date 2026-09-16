import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { sessions, subscriptions, userSettings, users } from "@/db/schema";
import type { AuthUser, Role } from "@/lib/types";

const SESSION_COOKIE = "chroma_session";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;
  const derived = scryptSync(password, salt, 64);
  const actual = Buffer.from(hash, "hex");
  if (derived.length !== actual.length) return false;
  return timingSafeEqual(derived, actual);
}

export async function createSession(userId: string, remember: boolean) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + (remember ? 30 : 1) * 24 * 60 * 60 * 1000);

  await db.insert(sessions).values({ token, userId, expiresAt });
  return { token, expiresAt };
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}

export async function getCurrentUserByToken(token: string): Promise<AuthUser | null> {
  const sessionRows = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
    .limit(1);

  const session = sessionRows[0];
  if (!session) return null;

  const rows = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      plan: subscriptions.plan,
      expiresAt: subscriptions.expiresAt,
      language: userSettings.language,
      theme: userSettings.theme,
      animations: userSettings.animations,
      uiSounds: userSettings.uiSounds,
      background: userSettings.background,
      notifications: userSettings.notifications,
    })
    .from(users)
    .leftJoin(subscriptions, eq(subscriptions.userId, users.id))
    .leftJoin(userSettings, eq(userSettings.userId, users.id))
    .where(eq(users.id, session.userId))
    .limit(1);

  const user = rows[0];
  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role as Role,
    createdAt: user.createdAt.toISOString(),
    subscription: {
      plan: (user.plan ?? "FREE") as AuthUser["subscription"]["plan"],
      expiresAt: user.expiresAt ? user.expiresAt.toISOString() : null,
    },
    settings: {
      language: user.language ?? "ru",
      theme: user.theme ?? "dark",
      animations: user.animations ?? true,
      uiSounds: user.uiSounds ?? false,
      background: user.background ?? "minecraft",
      notifications: user.notifications ?? true,
    },
  };
}

export async function getCurrentUserFromCookies(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return getCurrentUserByToken(token);
}

export async function clearSessionByToken(token: string) {
  await db.delete(sessions).where(eq(sessions.token, token));
}

export function hasAdminAccess(role: Role): boolean {
  return role === "ADMIN" || role === "OWNER";
}
