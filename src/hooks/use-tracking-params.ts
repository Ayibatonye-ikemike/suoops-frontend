"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

/** Query params that indicate traffic source — must be forwarded to /register. */
const TRACKING_KEYS = [
  "gclid",
  "fbclid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "source",
  "ref",
] as const;

/**
 * Build a /register URL that preserves any tracking query params present on the
 * current page.  Google Ads, for example, appends `gclid` to the landing-page
 * URL — this hook makes sure it reaches the register form.
 */
export function useRegisterHref(): string {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const params = new URLSearchParams();
    for (const key of TRACKING_KEYS) {
      const value = searchParams.get(key);
      if (value) params.set(key, value);
    }
    const qs = params.toString();
    return qs ? `/register?${qs}` : "/register";
  }, [searchParams]);
}
