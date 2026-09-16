"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/provider";
import { useLoader } from "@/components/loader/loader-provider";
import { VersionService, type LoaderTier } from "@/services/version-service";
import type { Plan } from "@/lib/types";

export function VersionsPanel({ plan }: { plan: Plan }) {
  const { t } = useI18n();
  const { selectedTier, setSelectedTier, selectedVersionId, setSelectedVersionId } = useLoader();

  const tiers = useMemo(() => VersionService.listTiersForUser(plan), [plan]);
  const versions = useMemo(() => VersionService.listVersionsByTier(plan, selectedTier), [plan, selectedTier]);

  const selectTier = (tier: LoaderTier) => {
    if (!VersionService.canUseTier(plan, tier)) return;
    setSelectedTier(tier);
    const first = VersionService.listVersionsByTier(plan, tier).find((v) => !v.locked);
    if (first) setSelectedVersionId(first.id);
  };

  return (
    <div className="space-y-4">
      <Card>
        <p className="mb-2 text-sm text-zinc-400">{t("loader.tier")}</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((item) => (
            <button
              key={item.tier}
              type="button"
              disabled={item.locked}
              onClick={() => selectTier(item.tier)}
              className={`rounded-lg border px-3 py-2 text-sm transition ${
                item.locked
                  ? "cursor-not-allowed border-zinc-800 bg-zinc-900 text-zinc-500"
                  : selectedTier === item.tier
                    ? "border-lime-400/50 bg-lime-400/15 text-lime-200"
                    : "border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              {item.tier.replace("_", "+")}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {versions.map((item) => (
          <Card key={item.id} className={selectedVersionId === item.id ? "border-lime-400/50" : ""}>
            <p className="text-base font-semibold text-zinc-100">{item.tier.replace("_", "+")}</p>
            <p className="mt-1 text-sm text-zinc-400">Minecraft {item.minecraftVersion}</p>
            <p className="text-sm text-zinc-400">Chroma {item.chromaVersion}</p>
            <p className="text-sm text-zinc-300">
              {item.locked ? `🔒 ${t("loader.requires")} ${item.required.replace("_", "+")}` : t("loader.available")}
            </p>

            <button
              type="button"
              disabled={item.locked}
              onClick={() => setSelectedVersionId(item.id)}
              className={`mt-4 w-full rounded-lg border px-3 py-2 text-sm transition ${
                item.locked
                  ? "cursor-not-allowed border-zinc-800 bg-zinc-900 text-zinc-500"
                  : selectedVersionId === item.id
                    ? "border-lime-400/50 bg-lime-400/15 text-lime-200"
                    : "border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              {item.locked ? t("loader.locked") : t("loader.select")}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
