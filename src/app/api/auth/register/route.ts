import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, getSessionCookieName, hashPassword } from "@/lib/auth";
import { normalizeLang } from "@/lib/lang";
import { getUsersCount, initUserRelatedData } from "@/lib/services";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    remember?: boolean;
    lang?: string;
  };

  const username = body.username?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!username || !email || !password || !body.confirmPassword) {
    return NextResponse.json({ ok: false, error: "requiredFields" }, { status: 400 });
  }
  if (password !== body.confirmPassword) {
    return NextResponse.json({ ok: false, error: "passwordMismatch" }, { status: 400 });
  }

  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing[0]) {
    return NextResponse.json({ ok: false, error: "emailExists" }, { status: 400 });
  }

  const total = await getUsersCount();
  const role = total === 0 ? "OWNER" : "USER";

  const inserted = await db
    .insert(users)
    .values({ username, email, passwordHash: hashPassword(password), role })
    .returning({ id: users.id });

  const userId = inserted[0]?.id;
  if (!userId) {
    return NextResponse.json({ ok: false, error: "unknown" }, { status: 500 });
  }

  await initUserRelatedData(userId, normalizeLang(body.lang));

  const session = await createSession(userId, !!body.remember);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(getSessionCookieName(), session.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: session.expiresAt,
    path: "/",
  });
  return res;
}
