import { NextResponse } from "next/server";
import { ensureSeedData } from "@/lib/bootstrap";
import { listPlanPrices } from "@/lib/services";

export async function GET() {
  await ensureSeedData();
  const prices = await listPlanPrices();
  return NextResponse.json({ ok: true, prices });
}
