"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { useLoader } from "@/components/loader/loader-provider";
import { useI18n } from "@/lib/i18n/provider";
import { useToast } from "@/components/ui/toast";

export function LoaderSettingsPanel() {
  const { t, setLang, lang } = useI18n();
  const { settings, setSettings } = useLoader();
  const { push } = useToast();
  const [pending, setPending] = useState(settings);
  const [language, setLanguage] = useState<"ru" | "en">(lang);

  const save = async () => {
    setSettings(pending);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        animations: pending.animations,
        uiSounds: pending.uiSounds,
        background: pending.background,
        notifications: true,
      }),
    });
    await setLang(language);
    push(t("messages.saveSuccess"));
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <p className="mb-2 text-sm text-zinc-400">{t("loader.animations")}</p>
        <Select
          value={String(pending.animations)}
          onChange={(e) => setPending((p) => ({ ...p, animations: e.target.value === "true" }))}
        >
          <option value="true">ON</option>
          <option value="false">OFF</option>
        </Select>
      </Card>

      <Card>
        <p className="mb-2 text-sm text-zinc-400">{t("loader.uiSounds")}</p>
        <Select value={String(pending.uiSounds)} onChange={(e) => setPending((p) => ({ ...p, uiSounds: e.target.value === "true" }))}>
          <option value="true">ON</option>
          <option value="false">OFF</option>
        </Select>
      </Card>

      <Card>
        <p className="mb-2 text-sm text-zinc-400">{t("loader.lowGpu")}</p>
        <Select
          value={String(pending.lowGpuMode)}
          onChange={(e) => setPending((p) => ({ ...p, lowGpuMode: e.target.value === "true" }))}
        >
          <option value="true">ON</option>
          <option value="false">OFF</option>
        </Select>
      </Card>

      <Card>
        <p className="mb-2 text-sm text-zinc-400">{t("loader.backgroundQuality")}</p>
        <Select
          value={pending.backgroundQuality}
          onChange={(e) =>
            setPending((p) => ({ ...p, backgroundQuality: e.target.value as "LOW" | "MEDIUM" | "HIGH" }))
          }
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </Select>
      </Card>

      <Card>
        <p className="mb-2 text-sm text-zinc-400">{t("loader.language")}</p>
        <Select value={language} onChange={(e) => setLanguage(e.target.value as "ru" | "en")}> 
          <option value="ru">RU</option>
          <option value="en">EN</option>
        </Select>
      </Card>

      <Card>
        <p className="mb-2 text-sm text-zinc-400">{t("loader.background")}</p>
        <Select
          value={pending.background}
          onChange={(e) => setPending((p) => ({ ...p, background: e.target.value as "bg1" | "bg2" | "bg3" }))}
        >
          <option value="bg1">{t("loader.backgrounds.bg1")}</option>
          <option value="bg2">{t("loader.backgrounds.bg2")}</option>
          <option value="bg3">{t("loader.backgrounds.bg3")}</option>
        </Select>
      </Card>

      <div className="md:col-span-2">
        <Button onClick={() => void save()}>{t("settings.save")}</Button>
      </div>
    </div>
  );
}
