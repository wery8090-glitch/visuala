import { randomBytes } from "crypto";
import { and, count, desc, eq, ilike, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  clientVersions,
  downloadEvents,
  keyActivations,
  planPrices,
  sessions,
  subscriptionKeys,
  subscriptions,
  userSettings,
  users,
} from "@/db/schema";
import type { Duration, Plan, Role } from "@/lib/types";

export async function initUserRelatedData(userId: string, language: "en" | "ru") {
  await db.insert(subscriptions).values({ userId, plan: "FREE", expiresAt: null }).onConflictDoNothing();
  await db
    .insert(userSettings)
    .values({ userId, language, theme: "dark", animations: true, uiSounds: false, background: "minecraft" })
    .onConflictDoNothing();
}

export async function getUsersCount() {
  const rows = await db.select({ value: count() }).from(users);
  return rows[0]?.value ?? 0;
}

export async function setSubscriptionForUser(userId: string, plan: Plan, months: Duration) {
  const now = new Date();
  const current = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  const base = current[0]?.expiresAt && current[0].expiresAt > now ? current[0].expiresAt : now;
  const next = new Date(base);
  next.setMonth(next.getMonth() + months);

  await db
    .insert(subscriptions)
    .values({ userId, plan, expiresAt: next, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: subscriptions.userId,
      set: { plan, expiresAt: next, updatedAt: new Date() },
    });
}

export function generateSubscriptionKeyCode() {
  const part = () => randomBytes(3).toString("hex").toUpperCase();
  return `CHROMA-${part()}-${part()}-${part()}`;
}

export async function activateSubscriptionKey(userId: string, code: string) {
  const keys = await db.select().from(subscriptionKeys).where(eq(subscriptionKeys.code, code)).limit(1);
  const key = keys[0];
  if (!key) return { ok: false as const, error: "notFound" };

  if (key.expiresAt && key.expiresAt < new Date()) return { ok: false as const, error: "expired" };
  if (key.activationCount >= key.activationLimit) return { ok: false as const, error: "limit" };

  await setSubscriptionForUser(userId, key.plan as Plan, key.durationMonths as Duration);

  await db.insert(keyActivations).values({ keyId: key.id, userId });
  await db
    .update(subscriptionKeys)
    .set({ activationCount: key.activationCount + 1 })
    .where(eq(subscriptionKeys.id, key.id));

  return { ok: true as const };
}

export async function getLatestVersion() {
  const rows = await db
    .select()
    .from(clientVersions)
    .orderBy(desc(clientVersions.isLatest), desc(clientVersions.createdAt))
    .limit(1);
  return rows[0] ?? null;
}

export async function getVersionById(versionId: string | null | undefined) {
  if (!versionId) return getLatestVersion();
  const rows = await db.select().from(clientVersions).where(eq(clientVersions.id, versionId)).limit(1);
  return rows[0] ?? null;
}

export async function listVersions() {
  return db.select().from(clientVersions).orderBy(desc(clientVersions.createdAt));
}

export async function listPlanPrices() {
  return db.select().from(planPrices);
}

export async function trackDownload(userId: string | null, versionId: string | null) {
  await db.insert(downloadEvents).values({ userId, versionId });
}

export async function listAdminUsers(search: string) {
  return db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      plan: subscriptions.plan,
      expiresAt: subscriptions.expiresAt,
    })
    .from(users)
    .leftJoin(subscriptions, eq(subscriptions.userId, users.id))
    .where(
      search
        ? sql`${users.username} ILIKE ${`%${search}%`} OR ${users.email} ILIKE ${`%${search}%`}`
        : undefined,
    )
    .orderBy(desc(users.createdAt));
}

export async function listAdminKeys() {
  return db.select().from(subscriptionKeys).orderBy(desc(subscriptionKeys.createdAt));
}

export async function createAdminKey(input: {
  plan: Plan;
  durationMonths: Duration;
  activationLimit: number;
  expiresAt: Date | null;
  createdByUserId: string;
}) {
  const code = generateSubscriptionKeyCode();
  await db.insert(subscriptionKeys).values({
    code,
    plan: input.plan,
    durationMonths: input.durationMonths,
    activationLimit: input.activationLimit,
    expiresAt: input.expiresAt,
    createdByUserId: input.createdByUserId,
  });
  return code;
}

export async function listDownloadsCount() {
  const rows = await db.select({ value: count() }).from(downloadEvents);
  return rows[0]?.value ?? 0;
}

export async function getUserRoleById(userId: string): Promise<Role | null> {
  const rows = await db.select({ role: users.role }).from(users).where(eq(users.id, userId)).limit(1);
  return (rows[0]?.role as Role | undefined) ?? null;
}

export async function cleanupExpiredSessions() {
  await db.delete(sessions).where(sql`${sessions.expiresAt} < now()`);
}
