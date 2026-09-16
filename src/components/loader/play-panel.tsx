"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/provider";
import type { Plan } from "@/lib/types";
import { useLoader } from "@/components/loader/loader-provider";
import { VersionService } from "@/services/version-service";
import { VersionSelector } from "@/components/loader/version-selector";
import { useToast } from "@/components/ui/toast";
import { playUiTone } from "@/lib/sound";

type Props = {
  username: string;
  uid: string;
  plan: Plan;
};

export function PlayPanel({ username, uid, plan }: Props) {
  const { t } = useI18n();
  const { push } = useToast();
  const { selectedVersionId, playStatus, playProgress, playLabel, playMeta, startPlayFlow, updateState, startUpdate, settings } = useLoader();

  const selected = useMemo(() => VersionService.getVersionById(selectedVersionId), [selectedVersionId]);

  const stateText = t(`loader.playStates.${playStatus}`);
  const updateLine =
    updateState.currentVersion === updateState.latestVersion
      ? t("loader.update.upToDate")
      : `${t("loader.updateAvailable")} ${updateState.currentVersion} → ${updateState.latestVersion}`;

  const activeCardLabel = plan === "FREE" ? t("loader.getSubscription") : plan.replace("_", "+");

  const onPlay = async () => {
    playUiTone("click", settings.uiSounds);
    await startPlayFlow();
    playUiTone("success", settings.uiSounds);
    push(t("loader.readyToPlay"));
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="relative min-h-[320px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/loader-banner.png')" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/65 to-black/40" />

          <div className="relative z-10 p-6 md:p-7">
            <p className="text-xs text-zinc-400">UID: {uid}</p>
            <h2 className="mt-2 text-3xl font-bold text-zinc-100">CHROMA CLIENT</h2>
            <p className="mt-1 text-sm text-zinc-300">{t("hero.subtitle")}</p>
            <p className="mt-1 text-sm text-zinc-300">{t("loader.currentBuild")}: v{selected?.chromaVersion ?? "1.0.0"}</p>
            <p className="mt-1 text-sm text-zinc-300">{t("loader.status")}: {playStatus === "PLAY" ? t("loader.ready") : stateText}</p>
            <p className="mt-1 text-sm text-zinc-400">{t("loader.welcome")}, {username}</p>
            <p className="text-sm text-zinc-400">{t("loader.readyLaunch")}</p>

            <div className="mt-6 max-w-xl">
              <VersionSelector plan={plan} uiSounds={settings.uiSounds} />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button className="min-w-48 py-3 text-base" onClick={() => void onPlay()}>
                ▶ {stateText}
              </Button>
              <p className="text-xs text-zinc-400">{t("loader.installation")}: C:\\ChromaVisual\\</p>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <p className="text-sm text-zinc-300">{playLabel}</p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
          <div className="h-full bg-lime-400 transition-all" style={{ width: `${playProgress}%` }} />
        </div>
        <p className="mt-2 text-xs text-zinc-400">{playProgress}%</p>
        <p className="text-xs text-zinc-500">{playMeta}</p>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div>
            <p className="text-sm text-zinc-300">{t("loader.clientStatus")}: {updateLine}</p>
            <p className="mt-1 text-xs text-zinc-500">
              {t("loader.installed")}: {updateState.currentVersion} • {t("loader.latest")}: {updateState.latestVersion}
            </p>
          </div>
          <div className="flex lg:justify-end">
            <Button variant="secondary" onClick={() => void startUpdate()}>
              {t("loader.update.action")}
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">FREE</p>
          <p className="mt-1 text-sm text-zinc-300">Minecraft 1.21.4 • 1.21.11</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">{t("loader.activePlan")}</p>
          <p className="mt-1 text-sm text-lime-300">{activeCardLabel}</p>
        </Card>
      </div>
    </div>
  );
}
