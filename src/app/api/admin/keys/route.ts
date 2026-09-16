import { NextResponse } from "next/server";
import { getCurrentUserFromCookies, hasAdminAccess } from "@/lib/auth";
import { createAdminKey, listAdminKeys } from "@/lib/services";
import type { Duration, Plan } from "@/lib/types";

export async function GET() {
  const user = await getCurrentUserFromCookies();
  if (!user || !hasAdminAccess(user.role)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const keys = await listAdminKeys();
  return NextResponse.json({ ok: true, keys });
}

export async function POST(req: Request) {
  const user = await getCurrentUserFromCookies();
  if (!user || !hasAdminAccess(user.role)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    plan?: Plan;
    durationMonths?: Duration;
    activationLimit?: number;
    expiresAt?: string;
  };

  if (!body.plan || !body.durationMonths || !body.activationLimit) {
    return NextResponse.json({ ok: false, error: "requiredFields" }, { status: 400 });
  }

  const code = await createAdminKey({
    plan: body.plan,
    durationMonths: body.durationMonths,
    activationLimit: body.activationLimit,
    expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
    createdByUserId: user.id,
  });

  return NextResponse.json({ ok: true, code });
}
