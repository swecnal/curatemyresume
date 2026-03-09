export const TIER_LIMITS: Record<string, number> = {
  free: 3,
  active: 25,
  beast: Infinity,
};

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
}

export function checkRateLimit(
  userId: string,
  tier: string,
  curationsThisMonth: number,
  periodStart: string
): RateLimitResult {
  const normalizedTier = tier.toLowerCase();
  const limit = TIER_LIMITS[normalizedTier] ?? TIER_LIMITS.free;

  if (limit === Infinity) {
    return {
      allowed: true,
      remaining: Infinity,
      limit: Infinity,
    };
  }

  const now = new Date();
  const periodDate = new Date(periodStart);

  // If the period start is in a previous month, the counter has effectively
  // reset, so we treat curationsThisMonth as 0 for the current billing cycle.
  const periodIsCurrentMonth =
    periodDate.getUTCFullYear() === now.getUTCFullYear() &&
    periodDate.getUTCMonth() === now.getUTCMonth();

  const effectiveUsage = periodIsCurrentMonth ? curationsThisMonth : 0;
  const remaining = Math.max(0, limit - effectiveUsage);

  return {
    allowed: effectiveUsage < limit,
    remaining,
    limit,
  };
}
