import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY ?? "";

function createStripeClient(): Stripe {
  if (!stripeSecretKey) {
    // Return a proxy that throws on method access to avoid crashing at import time
    return new Proxy({} as Stripe, {
      get(_target, prop) {
        if (prop === "webhooks") {
          return {
            constructEvent: () => {
              throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY.");
            },
          };
        }
        if (typeof prop === "string") {
          return () => {
            throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY.");
          };
        }
        return undefined;
      },
    });
  }
  return new Stripe(stripeSecretKey);
}

export const stripe = createStripeClient();

interface TierConfig {
  name: string;
  priceId: string;
  monthlyPrice: number;
  curationsPerMonth: number | null; // null = unlimited
}

export const TIER_CONFIG: Record<string, TierConfig> = {
  free: {
    name: "Free",
    priceId: "",
    monthlyPrice: 0,
    curationsPerMonth: 3,
  },
  job_hunting: {
    name: "Job Hunting",
    priceId: process.env.STRIPE_PRICE_JOB_HUNTING ?? "price_job_hunting_placeholder",
    monthlyPrice: 6,
    curationsPerMonth: 25,
  },
  beast: {
    name: "Beast Mode",
    priceId: process.env.STRIPE_PRICE_BEAST ?? "price_beast_placeholder",
    monthlyPrice: 24,
    curationsPerMonth: null,
  },
};

export function getTierFromPriceId(priceId: string): string {
  for (const [tier, config] of Object.entries(TIER_CONFIG)) {
    if (config.priceId === priceId) {
      return tier;
    }
  }
  return "free";
}
