"use client";

import { useMemo, useState } from "react";
import { VersionService, type LoaderTier } from "@/services/version-service";
import type { Plan } from "@/lib/types";
import { useLoader } from "@/components/loader/loader-provider";
import { useI18n } from "@/lib/i18n/provider";
import { useToast } from "@/components/ui/toast";
import { playUiTone } from "@/lib/sound";

export function VersionSelector({ plan, uiSounds }: { plan: Plan; uiSounds: boolean }) {
  const { t } = useI18n();
  const { push } = useToast();
  const { selectedVersionId, setSelectedVersionId } = useLoader();
  const [open, setOpen] = useState(false);

  const allTiers: LoaderTier[] = ["FREE", "BASE", "PREMIUM", "PREMIUM_BETA"];

  const available = useMemo(
    () =>
      allTiers
        .flatMap((tier) => VersionService.listVersionsByTier(plan, tier))
        .filter((item) => !item.locked),
    [plan],
  );

  const locked = useMemo(
    () =>
      allTiers
        .flatMap((tier) => VersionService.listVersionsByTier(plan, tier))
        .filter((item) => item.locked),
    [plan],
  );

  const selected = available.find((v) => v.id === selectedVersionId) ?? available[0] ?? null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((p) => !p);
          playUiTone("click", uiSounds);
        }}
        className="flex w-full items-center justify-between rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-left transition hover:border-zinc-500"
      >
        <div>
          <p className="text-xs text-zinc-500">{t("loader.selectedVersion")}</p>
          <p className="text-sm font-medium text-zinc-100">
            {selected ? `${selected.tier.replace("_", "+")} • Minecraft ${selected.minecraftVersion}` : "—"}
          </p>
        </div>
        <span className="text-zinc-400">▾</span>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-2 shadow-2xl">
          <p className="px-2 pb-2 text-xs uppercase tracking-[0.14em] text-zinc-500">{t("loader.available")}</p>
          <div className="space-y-1">
            {available.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedVersionId(item.id);
                  setOpen(false);
                  push(t("loader.versionSelected"));
                  playUiTone("success", uiSounds);
                }}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                  selectedVersionId === item.id
                    ? "border-lime-400/50 bg-lime-500/15 text-lime-200"
                    : "border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
                }`}
              >
                {item.tier.replace("_", "+")} · Minecraft {item.minecraftVersion} · Chroma {item.chromaVersion}
              </button>
            ))}
          </div>

          {locked.length > 0 && (
            <>
              <p className="mt-3 px-2 pb-2 text-xs uppercase tracking-[0.14em] text-zinc-500">{t("loader.locked")}</p>
              <div className="space-y-1">
                {locked.slice(0, 6).map((item) => (
                  <div key={item.id} className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-500">
                    🔒 {item.tier.replace("_", "+")} · Minecraft {item.minecraftVersion} ({t("loader.requires")} {item.required.replace("_", "+")})
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
