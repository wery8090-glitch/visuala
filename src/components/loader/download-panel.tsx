"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLoader } from "@/components/loader/loader-provider";
import { useI18n } from "@/lib/i18n/provider";

export function DownloadPanel() {
  const { t } = useI18n();
  const { downloadState, startDownload } = useLoader();

  const statusLabel =
    downloadState.status === "ready"
      ? t("loader.ready")
      : downloadState.status === "downloading"
        ? t("loader.downloading")
        : t("loader.downloaded");

  return (
    <Card>
      <h3 className="text-lg font-semibold">Chroma Client</h3>
      <p className="mt-1 text-sm text-zinc-400">{t("loader.version")}: 1.0.0</p>
      <p className="mt-2 text-sm text-zinc-300">{t("loader.status")}: {statusLabel}</p>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
        <div className="h-full bg-lime-400 transition-all" style={{ width: `${downloadState.progress}%` }} />
      </div>
      <p className="mt-2 text-xs text-zinc-400">{downloadState.progress}%</p>

      <Button className="mt-4" onClick={startDownload} disabled={downloadState.status === "downloading"}>
        {downloadState.status === "ready" ? t("loader.download") : t("loader.downloading")}
      </Button>
    </Card>
  );
}
