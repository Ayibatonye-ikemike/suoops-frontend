/**
 * Helpers for firing Google Ads / GA4 conversion events via gtag.
 *
 * The gtag snippet is loaded globally in app/layout.tsx with tag ID AW-17976378572.
 * These helpers centralise conversion labels so they're easy to add/update
 * without hunting through component code.
 */

type GtagFn = (...args: unknown[]) => void;

function getGtag(): GtagFn | null {
  if (typeof window === "undefined") return null;
  const g = (window as unknown as Record<string, unknown>).gtag;
  return typeof g === "function" ? (g as GtagFn) : null;
}

/** Signup completed (OTP verified, account created). */
export function trackSignupConversion() {
  getGtag()?.("event", "conversion", {
    send_to: "AW-17976378572/AascCOePmqMcEMyJ5_tC",
  });
}

/** First invoice created (or any invoice — useful as a micro-conversion). */
export function trackInvoiceCreated() {
  getGtag()?.("event", "invoice_created", {
    send_to: "AW-17976378572",
  });
}

/** Subscription or invoice pack purchase completed (Paystack success). */
export function trackPurchaseConversion(value?: number, currency = "NGN") {
  getGtag()?.("event", "purchase", {
    send_to: "AW-17976378572",
    value,
    currency,
    transaction_id: undefined, // filled by Google from the page URL reference param
  });
}
