import { NextResponse } from "next/server";
import { db } from "@/db";
import { clientVersions, planPrices, subscriptionKeys, subscriptions, users } from "@/db/schema";
import { count } from "drizzle-orm";
import { getCurrentUserFromCookies, hasAdminAccess } from "@/lib/auth";
import { listDownloadsCount } from "@/lib/services";

export async function GET() {
  const user = await getCurrentUserFromCookies();
  if (!user || !hasAdminAccess(user.role)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const [u, s, p, k, v] = await Promise.all([
    db.select({ value: count() }).from(users),
    db.select({ value: count() }).from(subscriptions),
    db.select({ value: count() }).from(planPrices),
    db.select({ value: count() }).from(subscriptionKeys),
    db.select({ value: count() }).from(clientVersions),
  ]);

  const downloads = await listDownloadsCount();

  return NextResponse.json({
    ok: true,
    stats: {
      users: u[0]?.value ?? 0,
      subscriptions: s[0]?.value ?? 0,
      plans: p[0]?.value ?? 0,
      keys: k[0]?.value ?? 0,
      versions: v[0]?.value ?? 0,
      downloads,
    },
  });
}
