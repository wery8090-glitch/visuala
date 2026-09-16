"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { DownloadService, type DownloadState } from "@/services/download-service";
import { SettingsService, type LoaderUiSettings } from "@/services/settings-service";
import { UpdateService, type UpdateState } from "@/services/update-service";
import type { LoaderTier } from "@/services/version-service";

type PlayStatus = "PLAY" | "LOADING" | "DOWNLOADING" | "UPDATING" | "LAUNCHING" | "READY" | "ERROR";

type LoaderContextType = {
  selectedTier: LoaderTier;
  setSelectedTier: (tier: LoaderTier) => void;
  selectedVersionId: string;
  setSelectedVersionId: (id: string) => void;
  playStatus: PlayStatus;
  playProgress: number;
  playLabel: string;
  playMeta: string;
  startPlayFlow: () => Promise<void>;
  downloadState: DownloadState;
  startDownload: () => void;
  updateState: UpdateState;
  startUpdate: () => Promise<void>;
  settings: LoaderUiSettings;
  setSettings: (next: LoaderUiSettings) => void;
};

const LoaderContext = createContext<LoaderContextType | null>(null);

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function LoaderProvider({
  children,
  defaultTier,
  defaultVersionId,
}: {
  children: React.ReactNode;
  defaultTier: LoaderTier;
  defaultVersionId: string;
}) {
  const [selectedTier, setSelectedTier] = useState<LoaderTier>(defaultTier);
  const [selectedVersionId, setSelectedVersionId] = useState(defaultVersionId);
  const [playStatus, setPlayStatus] = useState<PlayStatus>("PLAY");
  const [playProgress, setPlayProgress] = useState(0);
  const [playLabel, setPlayLabel] = useState("Ready to play");
  const [playMeta, setPlayMeta] = useState("0 MB / 0 MB");
  const [downloadState, setDownloadState] = useState<DownloadState>({ status: "ready", progress: 0 });
  const [updateState, setUpdateState] = useState<UpdateState>({
    status: "idle",
    progress: 0,
    currentVersion: "1.0.0",
    latestVersion: "1.0.1",
  });
  const [settings, setSettingsState] = useState<LoaderUiSettings>(() => SettingsService.getLocal());

  const setSettings = (next: LoaderUiSettings) => {
    setSettingsState(next);
    SettingsService.setLocal(next);
  };

  const startPlayFlow = async () => {
    if (playStatus !== "PLAY" && playStatus !== "READY" && playStatus !== "ERROR") return;

    setPlayStatus("LOADING");
    setPlayLabel("Checking files...");
    setPlayMeta("Scanning local installation");
    setPlayProgress(12);
    await wait(700);

    setPlayStatus("DOWNLOADING");
    for (let p = 18; p <= 68; p += 10) {
      setPlayProgress(p);
      setPlayLabel("Downloading Chroma Client...");
      setPlayMeta(`${Math.round((p / 100) * 32)} MB / 32 MB • ${(6 + Math.random() * 5).toFixed(1)} MB/s`);
      await wait(360);
    }

    setPlayStatus("UPDATING");
    for (let p = 72; p <= 92; p += 10) {
      setPlayProgress(p);
      setPlayLabel("Installing updates...");
      setPlayMeta("Applying patched files");
      await wait(360);
    }

    setPlayStatus("LAUNCHING");
    setPlayProgress(98);
    setPlayLabel("Launching client...");
    setPlayMeta("Preparing runtime");
    await wait(650);

    setPlayStatus("READY");
    setPlayProgress(100);
    setPlayLabel("Ready to play");
    setPlayMeta("All checks passed");
    await wait(900);

    setPlayStatus("PLAY");
    setPlayProgress(0);
    setPlayLabel("Ready to launch Chroma Client");
    setPlayMeta("Idle");
  };

  const startDownload = () => {
    if (downloadState.status === "downloading") return;
    DownloadService.simulate((state) => setDownloadState(state));
  };

  const startUpdate = async () => {
    await UpdateService.simulate((state) => setUpdateState((prev) => ({ ...prev, ...state })));
  };

  const value = useMemo(
    () => ({
      selectedTier,
      setSelectedTier,
      selectedVersionId,
      setSelectedVersionId,
      playStatus,
      playProgress,
      playLabel,
      playMeta,
      startPlayFlow,
      downloadState,
      startDownload,
      updateState,
      startUpdate,
      settings,
      setSettings,
    }),
    [selectedTier, selectedVersionId, playStatus, playProgress, playLabel, playMeta, downloadState, updateState, settings],
  );

  return <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>;
}

export function useLoader() {
  const ctx = useContext(LoaderContext);
  if (!ctx) throw new Error("useLoader must be used within LoaderProvider");
  return ctx;
}
