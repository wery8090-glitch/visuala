import { NextResponse } from "next/server";
import { ensureSeedData } from "@/lib/bootstrap";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { getVersionById, trackDownload } from "@/lib/services";

export async function POST(req: Request) {
  await ensureSeedData();
  const user = await getCurrentUserFromCookies();
  const body = (await req.json().catch(() => ({}))) as { versionId?: string };
  const latest = await getVersionById(body.versionId);

  await trackDownload(user?.id ?? null, latest?.id ?? null);

  return NextResponse.json({
    ok: true,
    url: latest?.downloadUrl ?? "#",
    version: latest?.tag ?? "v1.0.0",
  });
}
