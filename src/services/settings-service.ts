"use client";

const KEY = "chroma_loader_settings";

export type LoaderUiSettings = {
  animations: boolean;
  uiSounds: boolean;
  lowGpuMode: boolean;
  backgroundQuality: "LOW" | "MEDIUM" | "HIGH";
  background: "bg1" | "bg2" | "bg3";
};

const defaults: LoaderUiSettings = {
  animations: true,
  uiSounds: true,
  lowGpuMode: false,
  backgroundQuality: "HIGH",
  background: "bg1",
};

export class SettingsService {
  static getLocal(): LoaderUiSettings {
    if (typeof window === "undefined") return defaults;
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaults;
      return { ...defaults, ...(JSON.parse(raw) as Partial<LoaderUiSettings>) };
    } catch {
      return defaults;
    }
  }

  static setLocal(settings: LoaderUiSettings) {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify(settings));
  }
}
