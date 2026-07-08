"use client";

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
}

/**
 * Legacy "upgrade" modal. Under the commission model there are no plans — every
 * feature is free and we take a flat 3% per invoice. Kept (with the same props)
 * because a few older gated views still render it; it now just explains billing.
 */
export function PlanSelectionModal({ isOpen, onClose }: PlanModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
      <div className="relative w-full max-w-md rounded-2xl border border-brand-border bg-white p-6 text-brand-text shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 hover:bg-brand-background transition-colors"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <div className="text-4xl">🎉</div>
          <h2 className="mt-2 text-2xl font-bold">Everything is free</h2>
          <p className="mt-2 text-brand-textMuted">
            All features are included — custom branding, inventory, team, tax
            reports and more. We simply take a flat 3% per invoice.
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-brand-border bg-brand-background p-4 text-sm text-brand-textMuted">
          Manual invoices use your prepaid wallet (3%, min ₦20, ₦2,000 cap up to ₦500k, at creation).
          Storefront orders pay 3% only when the customer pays online.
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-brand-border bg-white px-6 py-2.5 text-sm font-semibold text-brand-text hover:bg-brand-background transition-colors"
          >
            Got it
          </button>
          <button
            onClick={() => (window.location.href = "/dashboard/billing/purchase")}
            className="rounded-lg bg-brand-jade px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-jadeHover transition-colors"
          >
            Top up wallet
          </button>
        </div>
      </div>
    </div>
  );
}
