import { NextResponse } from "next/server";
import { getCurrentUserFromCookies, hasAdminAccess } from "@/lib/auth";
import { listAdminUsers } from "@/lib/services";

export async function GET(req: Request) {
  const user = await getCurrentUserFromCookies();
  if (!user || !hasAdminAccess(user.role)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const search = new URL(req.url).searchParams.get("search") ?? "";
  const users = await listAdminUsers(search);
  return NextResponse.json({ ok: true, users });
}
