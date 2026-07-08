/**
 * Buyer-protection notice shown on the public storefront + marketplace.
 *
 * Deliberately non-technical: it reassures shoppers that paying online is safe
 * and tells them what to do if a paid order never arrives. Backed by support
 * today and by the automated hold-&-refund flow once that ships.
 */
export function BuyerProtectionNotice({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
      <div className="text-sm">
        <p className="font-semibold text-emerald-900">
          Shop safely — you&apos;re protected
        </p>
        <p className="mt-0.5 text-emerald-800">
          When you pay online here, your payment is protected until your order
          reaches you. If it doesn&apos;t arrive,{" "}
          <a
            href="mailto:support@suoops.com?subject=I%20didn%27t%20receive%20my%20order"
            className="font-semibold underline underline-offset-2 hover:text-emerald-900"
          >
            report it
          </a>{" "}
          and we&apos;ll help you get your money back.
        </p>
        <p className="mt-1 text-xs text-emerald-700">
          Report within about <span className="font-semibold">12 hours</span> for
          orders in your state, or <span className="font-semibold">3 days</span> for
          orders from another state.
        </p>
      </div>
    </div>
  );
}
