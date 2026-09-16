"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AccountShell } from "@/components/layout/account-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { useI18n } from "@/lib/i18n/provider";
import { useToast } from "@/components/ui/toast";
import type { AuthUser } from "@/lib/types";

export default function SettingsPageClient({ user }: { user: AuthUser }) {
  const { t, setLang } = useI18n();
  const { push } = useToast();
  const router = useRouter();
  const [form, setForm] = useState(user.settings);

  useEffect(() => {
    setForm(user.settings);
  }, [user.settings]);

  const save = async () => {
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = (await res.json()) as { ok: boolean };
    if (data.ok) {
      await setLang(form.language);
      push(t("messages.saveSuccess"));
      router.refresh();
    }
  };

  return (
    <AccountShell user={user}>
      <Card>
        <h1 className="text-2xl font-semibold">{t("settings.title")}</h1>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Card>
            <p className="text-sm text-zinc-400">{t("settings.theme")}</p>
            <Select value={form.theme} onChange={(e) => setForm((p) => ({ ...p, theme: e.target.value }))}>
              <option value="dark">{t("settings.dark")}</option>
            </Select>
          </Card>
          <Card>
            <p className="text-sm text-zinc-400">{t("settings.language")}</p>
            <Select
              value={form.language}
              onChange={(e) => setForm((p) => ({ ...p, language: e.target.value as "ru" | "en" }))}
            >
              <option value="ru">{t("common.russian")}</option>
              <option value="en">{t("common.english")}</option>
            </Select>
          </Card>
          <Card>
            <p className="text-sm text-zinc-400">{t("settings.animations")}</p>
            <Select
              value={String(form.animations)}
              onChange={(e) => setForm((p) => ({ ...p, animations: e.target.value === "true" }))}
            >
              <option value="true">{t("settings.on")}</option>
              <option value="false">{t("settings.off")}</option>
            </Select>
          </Card>
          <Card>
            <p className="text-sm text-zinc-400">{t("settings.sounds")}</p>
            <Select
              value={String(form.uiSounds)}
              onChange={(e) => setForm((p) => ({ ...p, uiSounds: e.target.value === "true" }))}
            >
              <option value="true">{t("settings.on")}</option>
              <option value="false">{t("settings.off")}</option>
            </Select>
          </Card>
          <Card>
            <p className="text-sm text-zinc-400">{t("settings.background")}</p>
            <Select value={form.background} onChange={(e) => setForm((p) => ({ ...p, background: e.target.value }))}>
              <option value="minecraft">{t("settings.minecraft")}</option>
              <option value="abstract">{t("settings.abstract")}</option>
            </Select>
          </Card>
          <Card>
            <p className="text-sm text-zinc-400">{t("settings.notifications")}</p>
            <Select
              value={String(form.notifications)}
              onChange={(e) => setForm((p) => ({ ...p, notifications: e.target.value === "true" }))}
            >
              <option value="true">{t("settings.on")}</option>
              <option value="false">{t("settings.off")}</option>
            </Select>
          </Card>
        </div>
        <div className="mt-5">
          <Button onClick={() => void save()}>{t("settings.save")}</Button>
        </div>
      </Card>
    </AccountShell>
  );
}
