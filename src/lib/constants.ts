import type { Duration, Plan } from "@/lib/types";

export const PLAN_ORDER: Plan[] = ["FREE", "BASE", "PREMIUM", "PREMIUM_BETA"];

export const DURATIONS: Duration[] = [1, 3, 6];

export const PLAN_FEATURES: Record<Plan, string[]> = {
  FREE: ["planFeatures.free1", "planFeatures.free2", "planFeatures.free3"],
  BASE: ["planFeatures.base1", "planFeatures.base2", "planFeatures.base3"],
  PREMIUM: ["planFeatures.premium1", "planFeatures.premium2", "planFeatures.premium3"],
  PREMIUM_BETA: ["planFeatures.beta1", "planFeatures.beta2", "planFeatures.beta3"],
};

export const PLAN_DESCRIPTIONS: Record<Plan, string> = {
  FREE: "planDescriptions.free",
  BASE: "planDescriptions.base",
  PREMIUM: "planDescriptions.premium",
  PREMIUM_BETA: "planDescriptions.beta",
};

export const PLAN_DISPLAY: Record<Plan, string> = {
  FREE: "FREE",
  BASE: "BASE",
  PREMIUM: "PREMIUM",
  PREMIUM_BETA: "PREMIUM+BETA",
};

export const FUNPAY_LINKS: Record<Exclude<Plan, "FREE">, Record<Duration, string>> = {
  BASE: {
    1: "https://funpay.com/lots/offer?id=77351057",
    3: "https://funpay.com/lots/offer?id=77351126",
    6: "https://funpay.com/lots/offer?id=77351273",
  },
  PREMIUM: {
    1: "https://funpay.com/lots/offer?id=77351346",
    3: "https://funpay.com/lots/offer?id=77351406",
    6: "https://funpay.com/lots/offer?id=77351477",
  },
  PREMIUM_BETA: {
    1: "https://funpay.com/lots/offer?id=77351602",
    3: "https://funpay.com/lots/offer?id=77351651",
    6: "https://funpay.com/lots/offer?id=77351694",
  },
};

export const PLAN_PRICES_PLACEHOLDER: Record<Exclude<Plan, "FREE">, Record<Duration, string>> = {
  BASE: { 1: "TBD", 3: "TBD", 6: "TBD" },
  PREMIUM: { 1: "TBD", 3: "TBD", 6: "TBD" },
  PREMIUM_BETA: { 1: "TBD", 3: "TBD", 6: "TBD" },
};
