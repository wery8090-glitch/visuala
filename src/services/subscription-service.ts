import type { Plan } from "@/lib/types";

export class SubscriptionService {
  static getAllowedVersionTypes(plan: Plan): Plan[] {
    if (plan === "FREE") return ["FREE"];
    if (plan === "BASE") return ["FREE", "BASE"];
    if (plan === "PREMIUM") return ["FREE", "PREMIUM"];
    return ["FREE", "PREMIUM", "PREMIUM_BETA"];
  }

  static async activateKey(code: string) {
    const res = await fetch("/api/keys/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    return (await res.json()) as { ok: boolean; error?: string };
  }
}
