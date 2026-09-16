import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { clientVersions, planPrices } from "@/db/schema";
import { FUNPAY_LINKS, PLAN_PRICES_PLACEHOLDER } from "@/lib/constants";

let seeded = false;

export async function ensureSeedData() {
  if (seeded) return;

  const priceCount = await db.select({ value: count() }).from(planPrices);
  if ((priceCount[0]?.value ?? 0) === 0) {
    await db.insert(planPrices).values([
      {
        plan: "FREE",
        durationMonths: 1,
        priceRub: "0",
        purchaseUrl: null,
      },
      {
        plan: "BASE",
        durationMonths: 1,
        priceRub: PLAN_PRICES_PLACEHOLDER.BASE[1],
        purchaseUrl: FUNPAY_LINKS.BASE[1],
      },
      {
        plan: "BASE",
        durationMonths: 3,
        priceRub: PLAN_PRICES_PLACEHOLDER.BASE[3],
        purchaseUrl: FUNPAY_LINKS.BASE[3],
      },
      {
        plan: "BASE",
        durationMonths: 6,
        priceRub: PLAN_PRICES_PLACEHOLDER.BASE[6],
        purchaseUrl: FUNPAY_LINKS.BASE[6],
      },
      {
        plan: "PREMIUM",
        durationMonths: 1,
        priceRub: PLAN_PRICES_PLACEHOLDER.PREMIUM[1],
        purchaseUrl: FUNPAY_LINKS.PREMIUM[1],
      },
      {
        plan: "PREMIUM",
        durationMonths: 3,
        priceRub: PLAN_PRICES_PLACEHOLDER.PREMIUM[3],
        purchaseUrl: FUNPAY_LINKS.PREMIUM[3],
      },
      {
        plan: "PREMIUM",
        durationMonths: 6,
        priceRub: PLAN_PRICES_PLACEHOLDER.PREMIUM[6],
        purchaseUrl: FUNPAY_LINKS.PREMIUM[6],
      },
      {
        plan: "PREMIUM_BETA",
        durationMonths: 1,
        priceRub: PLAN_PRICES_PLACEHOLDER.PREMIUM_BETA[1],
        purchaseUrl: FUNPAY_LINKS.PREMIUM_BETA[1],
      },
      {
        plan: "PREMIUM_BETA",
        durationMonths: 3,
        priceRub: PLAN_PRICES_PLACEHOLDER.PREMIUM_BETA[3],
        purchaseUrl: FUNPAY_LINKS.PREMIUM_BETA[3],
      },
      {
        plan: "PREMIUM_BETA",
        durationMonths: 6,
        priceRub: PLAN_PRICES_PLACEHOLDER.PREMIUM_BETA[6],
        purchaseUrl: FUNPAY_LINKS.PREMIUM_BETA[6],
      },
    ]);
  }

  const versionsCount = await db.select({ value: count() }).from(clientVersions);
  if ((versionsCount[0]?.value ?? 0) === 0) {
    await db.insert(clientVersions).values({
      name: "Chroma Stable",
      tag: "v1.0.0",
      description: "Initial stable release for all active users.",
      downloadUrl: "#",
      isLatest: true,
    });
  } else {
    const latest = await db.select().from(clientVersions).where(eq(clientVersions.isLatest, true));
    if (latest.length === 0) {
      const first = await db.select().from(clientVersions).limit(1);
      if (first[0]) {
        await db.update(clientVersions).set({ isLatest: true }).where(eq(clientVersions.id, first[0].id));
      }
    }
  }

  seeded = true;
}
