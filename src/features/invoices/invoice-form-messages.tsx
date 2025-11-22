import { Button } from "@/components/ui/button";

interface InvoiceFormMessagesProps {
  invoiceType: "revenue" | "expense";
  quota: { current_count: number; limit: number | null; current_plan: string; can_create: boolean } | undefined;
  quotaError: boolean;
  error: string | null;
  quotaErrorMessage: string | null;
  lastPdfUrl: string | null;
  upgradeUrl: string | null;
  onShowUpgradeModal: () => void;
}

export function InvoiceFormMessages({
  invoiceType,
  quota,
  quotaError,
  error,
  quotaErrorMessage,
  lastPdfUrl,
  upgradeUrl,
  onShowUpgradeModal,
}: InvoiceFormMessagesProps) {
  return (
    <>
      {/* Quota Display */}
      {invoiceType === "revenue" && quota && quota.limit !== null && (
        <p className="text-xs text-brand-textMuted">
          {quota.current_count}/{quota.limit} invoices used this month • Plan: {quota.current_plan}
        </p>
      )}
      
      {invoiceType === "expense" && (
        <p className="text-xs text-brand-textMuted">
          ✅ Expenses don&apos;t count against your invoice limit
        </p>
      )}
      
      {quotaError && (
        <p className="text-xs text-rose-600">Failed to load quota info</p>
      )}

      {/* Error Messages */}
      {error && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
          {error}
        </p>
      )}

      {/* Quota Error with Upgrade CTA */}
      {quotaErrorMessage && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">⚠️ Invoice Limit Reached</p>
          <p className="mt-1 text-sm text-amber-800 whitespace-pre-line">{quotaErrorMessage}</p>
          <div className="mt-3 flex flex-col sm:flex-row flex-wrap gap-3">
            <Button
              type="button"
              onClick={onShowUpgradeModal}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              View Plans
            </Button>
            {upgradeUrl && (
              <a
                href={upgradeUrl}
                className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-700 transition w-full sm:w-auto"
              >
                Upgrade Now
              </a>
            )}
          </div>
        </div>
      )}

      {/* Success Message */}
      {lastPdfUrl && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Invoice ready.{" "}
          <a href={lastPdfUrl} target="_blank" rel="noreferrer" className="underline">
            View PDF
          </a>
        </p>
      )}
    </>
  );
}
