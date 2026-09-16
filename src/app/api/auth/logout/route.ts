import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearSessionByToken, getSessionCookieName } from "@/lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;

  if (token) {
    await clearSessionByToken(token);
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(getSessionCookieName(), "", { path: "/", expires: new Date(0) });
  return res;
}
