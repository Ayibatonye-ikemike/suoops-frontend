import { formatAccountNumber } from "./bank-details-form.utils";
import type { BankFormState } from "./bank-details-form.types";

interface InvoicePreviewProps {
  formState: BankFormState;
}

export function InvoicePreview({ formState }: InvoicePreviewProps) {
  return (
    <div className="rounded-xl border border-brand-border bg-brand-background px-4 py-4 text-brand-text">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-brand-textMuted">
        Invoice Preview
      </h3>
      <p className="mt-1 text-xs text-brand-textMuted">
        What customers see on the PDF &amp; WhatsApp once you save.
      </p>
      <dl className="mt-3 space-y-1.5 text-sm text-brand-text">
        <div className="flex items-center justify-between">
          <dt className="font-medium text-brand-textMuted">Bank Name</dt>
          <dd>
            {formState.bankName || (
              <span className="text-brand-textMuted/50">Not set</span>
            )}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="font-medium text-brand-textMuted">Account Number</dt>
          <dd>
            {formState.accountNumber ? (
              formatAccountNumber(formState.accountNumber)
            ) : (
              <span className="text-brand-textMuted/50">Not set</span>
            )}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="font-medium text-brand-textMuted">Account Name</dt>
          <dd>
            {formState.accountName || (
              <span className="text-brand-textMuted/50">Not set</span>
            )}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="font-medium text-brand-textMuted">Business Name</dt>
          <dd>
            {formState.businessName || (
              <span className="text-brand-textMuted/50">Not set</span>
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
}
