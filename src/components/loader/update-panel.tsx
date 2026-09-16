"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/provider";
import { useLoader } from "@/components/loader/loader-provider";

export function UpdatePanel() {
  const { t } = useI18n();
  const { updateState, startUpdate } = useLoader();

  const stateLabel =
    updateState.status === "idle"
      ? t("loader.update.idle")
      : updateState.status === "checking"
        ? t("loader.update.checking")
        : updateState.status === "downloading"
          ? t("loader.update.downloading")
          : updateState.status === "installing"
            ? t("loader.update.installing")
            : t("loader.update.upToDate");

  return (
    <Card>
      <h3 className="text-lg font-semibold">{t("loader.updates")}</h3>
      <div className="mt-3 space-y-1 text-sm text-zinc-300">
        <p>{t("loader.current")}: {updateState.currentVersion}</p>
        <p>{t("loader.latest")}: {updateState.latestVersion}</p>
      </div>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
        <div className="h-full bg-lime-400 transition-all" style={{ width: `${updateState.progress}%` }} />
      </div>
      <p className="mt-2 text-xs text-zinc-400">{stateLabel}</p>
      <Button className="mt-4" onClick={() => void startUpdate()}>
        {t("loader.update.action")}
      </Button>
    </Card>
  );
}
