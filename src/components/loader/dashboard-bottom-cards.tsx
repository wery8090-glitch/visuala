"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";
import type { AuthUser } from "@/lib/types";

export function DashboardBottomCards({ user }: { user: AuthUser }) {
  const { t } = useI18n();
  const isFree = user.subscription.plan === "FREE";

  return (
    <div className="mt-4 grid gap-3 xl:grid-cols-3">
      <Card>
        <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">{t("loader.nav.subscription")}</p>
        <p className="mt-3 text-sm text-zinc-300">{t("loader.currentPlan")}: {user.subscription.plan.replace("_", "+")}</p>
        <p className="text-sm text-zinc-300">{t("loader.status")}: {t("common.active")}</p>
        <p className="text-sm text-zinc-300">{t("loader.expires")}: {user.subscription.expiresAt ?? "—"}</p>
        <div className="mt-4">
          <Link href="/loader/subscription">
            <Button variant="secondary">{t("loader.manage")}</Button>
          </Link>
        </div>
      </Card>

      <Card>
        <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">{t("loader.latestNews")}</p>
        <p className="mt-3 text-sm text-zinc-200">Chroma Client Update</p>
        <p className="text-sm text-zinc-400">Version 1.0.0 is available</p>
        <p className="mt-2 text-xs text-zinc-500">2026-09-18</p>
        <div className="mt-4">
          <Link href="/loader/versions">
            <Button variant="secondary">{t("loader.readMore")}</Button>
          </Link>
        </div>
      </Card>

      <Card>
        <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">{t("loader.clientState")}</p>
        <p className="mt-3 text-sm text-zinc-300">{t("loader.server")}: {t("loader.connected")}</p>
        <p className="text-sm text-zinc-300">{t("loader.latest")}: 1.0.1</p>
        <p className="text-sm text-zinc-300">{t("loader.installation")}: {t("loader.ready")}</p>

        {isFree && (
          <div className="mt-4 rounded-lg border border-lime-400/30 bg-lime-500/10 p-3">
            <p className="text-sm text-lime-200">{t("loader.unlockMore")}</p>
            <p className="mt-1 text-xs text-zinc-300">BASE • PREMIUM • PREMIUM+BETA</p>
            <Link href="/loader/subscription" className="mt-3 inline-block">
              <Button>{t("loader.viewPlans")}</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
