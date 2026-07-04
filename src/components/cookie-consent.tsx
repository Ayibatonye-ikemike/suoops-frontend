"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "suoops_cookie_consent";
type Choice = "granted" | "denied";

/** Push a Google Consent Mode v2 update to gtag. */
function applyConsent(choice: Choice) {
  const gtag = (window as unknown as Record<string, unknown>).gtag as
    | ((...args: unknown[]) => void)
    | undefined;
  if (typeof gtag !== "function") return;
  gtag("consent", "update", {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  });
}

/**
 * Cookie-consent banner wired to Google Consent Mode v2.
 *
 * Analytics is granted by default in app/layout.tsx (NDPA / non-EEA audience);
 * this banner lets the user opt out (or back in), persists the choice in
 * localStorage, and re-applies a prior "denied" choice on return visits so the
 * opt-out sticks.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      // localStorage unavailable (e.g. private mode) — fall through to show banner
    }
    if (stored === "granted") {
      applyConsent("granted");
    } else if (stored === "denied") {
      // Analytics is granted by default, so honor a prior opt-out on load.
      applyConsent("denied");
    } else {
      setVisible(true);
    }
  }, []);

  const choose = (choice: Choice) => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* ignore persistence failure */
    }
    applyConsent(choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-brand-border bg-white p-4 shadow-card-hover sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="text-sm text-brand-text">
          We use cookies to understand how SuoOps is used and to improve it. See our{" "}
          <Link href="/privacy" className="font-medium text-brand-teal underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="rounded-xl border border-brand-border px-4 py-2 text-sm font-medium text-brand-text transition-colors hover:bg-brand-surface"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="rounded-xl bg-brand-jade px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-jadeHover"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
