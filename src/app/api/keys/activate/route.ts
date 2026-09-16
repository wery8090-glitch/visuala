import { NextResponse } from "next/server";
import { activateSubscriptionKey } from "@/lib/services";
import { getCurrentUserFromCookies } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getCurrentUserFromCookies();
  if (!user) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { code?: string };
  const code = body.code?.trim().toUpperCase();
  if (!code) {
    return NextResponse.json({ ok: false, error: "requiredFields" }, { status: 400 });
  }

  const result = await activateSubscriptionKey(user.id, code);
  if (!result.ok) return NextResponse.json({ ok: false, error: result.error }, { status: 400 });

  return NextResponse.json({ ok: true });
}
