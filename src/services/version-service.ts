import type { Plan } from "@/lib/types";
import { SubscriptionService } from "@/services/subscription-service";

export type LoaderTier = Plan;

export type LoaderVersionItem = {
  id: string;
  tier: LoaderTier;
  clientChannel: "stable" | "beta";
  minecraftVersion: string;
  chromaVersion: string;
  required: Plan;
};

export const LOADER_VERSION_CATALOG: LoaderVersionItem[] = [
  {
    id: "free-1214",
    tier: "FREE",
    clientChannel: "stable",
    minecraftVersion: "1.21.4",
    chromaVersion: "1.0.0",
    required: "FREE",
  },
  {
    id: "free-12111",
    tier: "FREE",
    clientChannel: "stable",
    minecraftVersion: "1.21.11",
    chromaVersion: "1.0.1",
    required: "FREE",
  },
  {
    id: "base-1214",
    tier: "BASE",
    clientChannel: "stable",
    minecraftVersion: "1.21.4",
    chromaVersion: "1.1.0",
    required: "BASE",
  },
  {
    id: "base-12111",
    tier: "BASE",
    clientChannel: "stable",
    minecraftVersion: "1.21.11",
    chromaVersion: "1.1.1",
    required: "BASE",
  },
  {
    id: "premium-1214",
    tier: "PREMIUM",
    clientChannel: "stable",
    minecraftVersion: "1.21.4",
    chromaVersion: "1.2.0",
    required: "PREMIUM",
  },
  {
    id: "premium-12111",
    tier: "PREMIUM",
    clientChannel: "stable",
    minecraftVersion: "1.21.11",
    chromaVersion: "1.2.1",
    required: "PREMIUM",
  },
  {
    id: "premium-beta-12111",
    tier: "PREMIUM_BETA",
    clientChannel: "beta",
    minecraftVersion: "1.21.11",
    chromaVersion: "1.3.0-beta",
    required: "PREMIUM_BETA",
  },
  {
    id: "premium-beta-12112",
    tier: "PREMIUM_BETA",
    clientChannel: "beta",
    minecraftVersion: "1.21.12",
    chromaVersion: "1.3.1-beta",
    required: "PREMIUM_BETA",
  },
];

export class VersionService {
  static canUseTier(userPlan: Plan, tier: LoaderTier) {
    const allowed = SubscriptionService.getAllowedVersionTypes(userPlan);
    return allowed.includes(tier);
  }

  static listTiersForUser(userPlan: Plan) {
    return ["FREE", "BASE", "PREMIUM", "PREMIUM_BETA"].map((tier) => ({
      tier: tier as LoaderTier,
      locked: !this.canUseTier(userPlan, tier as LoaderTier),
    }));
  }

  static listVersionsByTier(userPlan: Plan, tier: LoaderTier) {
    const locked = !this.canUseTier(userPlan, tier);
    return LOADER_VERSION_CATALOG.filter((v) => v.tier === tier).map((item) => ({
      ...item,
      locked,
    }));
  }

  static getVersionById(id: string) {
    return LOADER_VERSION_CATALOG.find((v) => v.id === id) ?? null;
  }

  static getDefaultTier(userPlan: Plan): LoaderTier {
    if (userPlan === "BASE") return "BASE";
    if (userPlan === "PREMIUM") return "PREMIUM";
    if (userPlan === "PREMIUM_BETA") return "PREMIUM_BETA";
    return "FREE";
  }

  static getDefaultVersionId(userPlan: Plan): string {
    const tier = this.getDefaultTier(userPlan);
    const first = this.listVersionsByTier(userPlan, tier).find((item) => !item.locked);
    return first?.id ?? "free-1214";
  }
}
