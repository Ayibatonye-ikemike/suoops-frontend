/**
 * Helpers for firing GA4 analytics events via gtag.
 *
 * The gtag snippet is loaded globally in app/layout.tsx with the GA4
 * measurement ID G-DB7HG9NZNN and the Google Ads ID AW-17976378572. GA4
 * events fire automatically; Google Ads conversions fire when the matching
 * conversion label env var is set (see GADS_* below). Mark the GA4 events
 * (sign_up, purchase, invoice_created) as "key events" in the GA4 UI.
 */

/**
 * Google Ads account ID for conversion tracking (matches app/layout.tsx).
 * Conversion labels come from the conversion actions you create in Google
 * Ads; set them as Vercel env vars so no code change is needed when they
 * change. A conversion fires only when its label is present.
 */
const GADS_ID = "AW-17976378572";
const GADS_SIGNUP_LABEL = process.env.NEXT_PUBLIC_GADS_SIGNUP_LABEL;
const GADS_PURCHASE_LABEL = process.env.NEXT_PUBLIC_GADS_PURCHASE_LABEL;
const GADS_INVOICE_LABEL = process.env.NEXT_PUBLIC_GADS_INVOICE_LABEL;

type GtagFn = (...args: unknown[]) => void;

function getGtag(): GtagFn | null {
  if (typeof window === "undefined") return null;
  const g = (window as unknown as Record<string, unknown>).gtag;
  return typeof g === "function" ? (g as GtagFn) : null;
}

/** Fire a Google Ads conversion for the given label (no-op if unset). */
function trackAdsConversion(
  label: string | undefined,
  params: Record<string, unknown> = {},
) {
  if (!label) return;
  getGtag()?.("event", "conversion", {
    send_to: `${GADS_ID}/${label}`,
    ...params,
  });
}

/** Signup completed (OTP verified, account created). GA4 recommended event. */
export function trackSignupConversion() {
  getGtag()?.("event", "sign_up");
  trackAdsConversion(GADS_SIGNUP_LABEL);
}

/** First invoice created (or any invoice — useful as a micro-conversion). */
export function trackInvoiceCreated() {
  getGtag()?.("event", "invoice_created");
  trackAdsConversion(GADS_INVOICE_LABEL);
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
  trackAdsConversion(GADS_PURCHASE_LABEL, params);
}
