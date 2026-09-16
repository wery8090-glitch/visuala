import { NextResponse } from "next/server";
import { ensureSeedData } from "@/lib/bootstrap";
import { listVersions } from "@/lib/services";

export async function GET() {
  await ensureSeedData();
  const versions = await listVersions();
  return NextResponse.json({ ok: true, versions });
}
