"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PLAN_DISPLAY, PLAN_ORDER } from "@/lib/constants";
import { useI18n } from "@/lib/i18n/provider";
import { useToast } from "@/components/ui/toast";
import { SubscriptionService } from "@/services/subscription-service";
import type { AuthUser } from "@/lib/types";

export function SubscriptionPanel({ user }: { user: AuthUser }) {
  const { t } = useI18n();
  const { push } = useToast();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const activate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = await SubscriptionService.activateKey(code.trim().toUpperCase());
    setLoading(false);

    if (!data.ok) {
      push(t(`messages.${data.error ?? "unknown"}`));
      return;
    }

    push(t("messages.keyActivated"));
    setCode("");
    location.reload();
  };

  return (
    <div className="space-y-4">
      <Card>
        <h3 className="text-lg font-semibold">{t("loader.nav.subscription")}</h3>
        <div className="mt-3 space-y-1 text-sm text-zinc-300">
          <p>{t("loader.currentPlan")}: {user.subscription.plan.replace("_", "+")}</p>
          <p>{t("loader.status")}: {t("common.active")}</p>
          <p>{t("loader.expires")}: {user.subscription.expiresAt ?? "—"}</p>
        </div>
      </Card>

      <Card>
        <h4 className="text-base font-semibold">{t("loader.availablePlans")}</h4>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {PLAN_ORDER.map((plan) => (
            <div key={plan} className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200">
              {PLAN_DISPLAY[plan]}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h4 className="text-base font-semibold">{t("loader.activateKey")}</h4>
        <form className="mt-3 flex flex-col gap-3 sm:flex-row" onSubmit={activate}>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="CHROMA-XXXXXX-XXXXXX-XXXXXX"
          />
          <Button disabled={loading}>{t("common.activate")}</Button>
        </form>
      </Card>
    </div>
  );
}
