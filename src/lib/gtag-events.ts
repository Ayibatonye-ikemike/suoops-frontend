/**
 * Helpers for firing GA4 analytics events via gtag.
 *
 * The gtag snippet is loaded globally in app/layout.tsx with the GA4
 * measurement ID G-DB7HG9NZNN. Events fire to GA4 automatically. Mark the
 * ones that matter (sign_up, purchase, invoice_created) as "key events" in
 * the GA4 UI, and link Google Ads to GA4 if you later want ad-conversion import.
 */

type GtagFn = (...args: unknown[]) => void;

function getGtag(): GtagFn | null {
  if (typeof window === "undefined") return null;
  const g = (window as unknown as Record<string, unknown>).gtag;
  return typeof g === "function" ? (g as GtagFn) : null;
}

/** Signup completed (OTP verified, account created). GA4 recommended event. */
export function trackSignupConversion() {
  getGtag()?.("event", "sign_up");
}

/** First invoice created (or any invoice — useful as a micro-conversion). */
export function trackInvoiceCreated() {
  getGtag()?.("event", "invoice_created");
}

/** Subscription or invoice pack purchase completed (Paystack success). */
export function trackPurchaseConversion(
  value?: number,
  currency = "NGN",
  transactionId?: string,
) {
  const params: Record<string, unknown> = {
    value: value ?? 1.0,
    currency,
  };
  if (transactionId) params.transaction_id = transactionId;
  getGtag()?.("event", "purchase", params);
}
