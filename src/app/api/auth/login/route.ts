import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, getSessionCookieName, hashPassword, verifyPassword } from "@/lib/auth";
import { initUserRelatedData } from "@/lib/services";

export async function POST(req: Request) {
  try {
  const body = (await req.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
    remember?: boolean;
  };

  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "requiredFields" }, { status: 400 });
  }

  const userRows = await db.select().from(users).where(eq(users.email, email)).limit(1);
  const user = userRows[0];

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ ok: false, error: "invalidCredentials" }, { status: 401 });
  }

  await initUserRelatedData(user.id, "ru");
  const session = await createSession(user.id, !!body.remember);
  const res = NextResponse.json({ ok: true, redirectTo: "/loader" });

  res.cookies.set(getSessionCookieName(), session.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: session.expiresAt,
    path: "/",
  });

  return res;
  } catch (error) {
    console.error("[auth/login] database error", error);
    return NextResponse.json({ ok: false, error: "databaseUnavailable" }, { status: 503 });
  }
}
