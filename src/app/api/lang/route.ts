import { NextResponse } from "next/server";
import { LANG_COOKIE, normalizeLang } from "@/lib/lang";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { lang?: string };
  const lang = normalizeLang(body.lang);
  const res = NextResponse.json({ ok: true, lang });
  res.cookies.set(LANG_COOKIE, lang, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return res;
}
