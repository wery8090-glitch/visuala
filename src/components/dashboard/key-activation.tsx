"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/provider";
import { useToast } from "@/components/ui/toast";

export function KeyActivation() {
  const { t } = useI18n();
  const { push } = useToast();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const activate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/keys/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string };
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
    <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={activate}>
      <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder={t("dashboard.keyPlaceholder")} />
      <Button disabled={loading}>{t("common.activate")}</Button>
    </form>
  );
}
