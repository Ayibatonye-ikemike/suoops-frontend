import { formatAccountNumber } from "./bank-details-form.utils";
import type { BankFormState } from "./bank-details-form.types";

interface InvoicePreviewProps {
  formState: BankFormState;
}

export function InvoicePreview({ formState }: InvoicePreviewProps) {
  return (
    <div className="rounded-xl border border-brand-border bg-brand-background px-4 py-5 text-brand-text">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-textMuted">
        Invoice Preview
      </h3>
      <p className="mt-2 text-xs text-brand-textMuted">
        Customers receive these instructions on the PDF and WhatsApp message
        once you save.
      </p>
      <dl className="mt-4 space-y-2 text-sm text-brand-text">
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
