export type ABVariant = "a" | "b";

export const AB_COOKIE_NAME = "ab_hero";
export const AB_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

/**
 * Get the variant from a cookie value, or assign one randomly.
 * Returns [variant, isNew] where isNew indicates if the cookie needs to be set.
 */
export function getOrAssignVariant(
  cookieValue: string | undefined
): [ABVariant, boolean] {
  if (cookieValue === "a" || cookieValue === "b") {
    return [cookieValue, false];
  }
  const variant: ABVariant = Math.random() < 0.5 ? "a" : "b";
  return [variant, true];
}
