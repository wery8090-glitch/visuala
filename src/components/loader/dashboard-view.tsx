"use client";

import { useEffect, useState } from "react";
import { LoaderTabs } from "@/components/loader/loader-tabs";
import { PlayPanel } from "@/components/loader/play-panel";
import { DashboardBottomCards } from "@/components/loader/dashboard-bottom-cards";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/provider";
import type { AuthUser } from "@/lib/types";

const steps = ["loader.boot.account", "loader.boot.subscription", "loader.boot.version"] as const;

export function DashboardView({ user }: { user: AuthUser }) {
  const { t } = useI18n();
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const i1 = setTimeout(() => setStep(1), 350);
    const i2 = setTimeout(() => setStep(2), 780);
    const i3 = setTimeout(() => {
      setStep(3);
      setReady(true);
    }, 1250);

    return () => {
      clearTimeout(i1);
      clearTimeout(i2);
      clearTimeout(i3);
    };
  }, []);

  if (!ready) {
    return (
      <div>
        <LoaderTabs />
        <Card className="animate-pulse">
          <p className="text-sm text-zinc-300">{t(steps[Math.min(step, 2)])}</p>
          <div className="mt-4 h-2 rounded-full bg-zinc-800">
            <div className="h-full rounded-full bg-lime-400 transition-all" style={{ width: `${(step + 1) * 30}%` }} />
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="h-20 rounded-lg bg-zinc-800/80" />
            <div className="h-20 rounded-lg bg-zinc-800/80" />
            <div className="h-20 rounded-lg bg-zinc-800/80" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-[fadeIn_.25s_ease]">
      <LoaderTabs />
      <PlayPanel username={user.username} uid={user.id} plan={user.subscription.plan} />
      <DashboardBottomCards user={user} />
    </div>
  );
}
