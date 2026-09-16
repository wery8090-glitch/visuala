import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userSettings } from "@/db/schema";
import { getCurrentUserFromCookies } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUserFromCookies();
  if (!user) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 401 });

  const rows = await db.select().from(userSettings).where(eq(userSettings.userId, user.id)).limit(1);
  return NextResponse.json({ ok: true, settings: rows[0] ?? user.settings });
}

export async function POST(req: Request) {
  const user = await getCurrentUserFromCookies();
  if (!user) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as {
    language?: "en" | "ru";
    theme?: string;
    animations?: boolean;
    uiSounds?: boolean;
    background?: string;
    notifications?: boolean;
  };

  await db
    .insert(userSettings)
    .values({
      userId: user.id,
      language: body.language ?? user.settings.language,
      theme: body.theme ?? user.settings.theme,
      animations: body.animations ?? user.settings.animations,
      uiSounds: body.uiSounds ?? user.settings.uiSounds,
      background: body.background ?? user.settings.background,
      notifications: body.notifications ?? user.settings.notifications,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: userSettings.userId,
      set: {
        language: body.language ?? user.settings.language,
        theme: body.theme ?? user.settings.theme,
        animations: body.animations ?? user.settings.animations,
        uiSounds: body.uiSounds ?? user.settings.uiSounds,
        background: body.background ?? user.settings.background,
        notifications: body.notifications ?? user.settings.notifications,
        updatedAt: new Date(),
      },
    });

  return NextResponse.json({ ok: true });
}
