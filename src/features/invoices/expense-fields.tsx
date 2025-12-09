import { useRef } from "react";

interface ExpenseFieldsProps {
  vendorName: string;
  category: string;
  notes: string;
  amount: string;
  receiptUrl: string | null;
  receiptFileName: string | null;
  uploadingReceipt: boolean;
  onVendorNameChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onReceiptUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveReceipt: () => void;
}

const EXPENSE_CATEGORIES = [
  "Office Supplies",
  "Rent",
  "Utilities",
  "Marketing",
  "Transportation",
  "Professional Fees",
  "Equipment",
  "Other",
];

export function ExpenseFields({
  vendorName,
  category,
  notes,
  amount,
  receiptUrl,
  receiptFileName,
  uploadingReceipt,
  onVendorNameChange,
  onCategoryChange,
  onNotesChange,
  onAmountChange,
  onReceiptUpload,
  onRemoveReceipt,
}: ExpenseFieldsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="flex flex-col gap-2 text-sm font-semibold text-brand-text sm:col-span-2 md:col-span-1">
        Vendor name
        <input
          value={vendorName}
          onChange={(e) => onVendorNameChange(e.target.value)}
          required
          placeholder="e.g., Office Depot, MTN"
          className="rounded-lg border border-brand-border bg-white px-3 py-2 text-base font-normal text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-semibold text-brand-text">
        Category
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="rounded-lg border border-brand-border bg-white px-3 py-2 text-base font-normal text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        >
          <option value="">Select category</option>
          {EXPENSE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm font-semibold text-brand-text">
        Total amount
        <input
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          type="number"
          min="0"
          step="0.01"
          required
          className="w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-base font-normal text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-semibold text-brand-text sm:col-span-2">
        Notes (optional)
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Additional details about this expense..."
          rows={2}
          className="w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-base font-normal text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        />
      </label>

      {/* Receipt Upload */}
      <div className="sm:col-span-2">
        <label className="block text-sm font-semibold text-brand-text mb-2">
          Receipt / Proof of Purchase
        </label>

        {!receiptUrl ? (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/bmp,application/pdf"
              onChange={onReceiptUpload}
              disabled={uploadingReceipt}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingReceipt}
              className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-brand-border bg-brand-background p-6 transition-colors hover:border-brand-jade hover:bg-brand-jade/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploadingReceipt ? (
                <>
                  <svg
                    className="mb-2 h-10 w-10 animate-spin text-brand-jade"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-brand-textMuted">
                    Uploading...
                  </span>
                </>
              ) : (
                <>
                  <svg
                    className="mb-2 h-10 w-10 text-brand-textMuted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="text-sm font-medium text-brand-text">
                    Upload Receipt
                  </span>
                  <span className="mt-1 text-xs text-brand-textMuted">
                    JPG, PNG, WebP, BMP, PDF • Max 10MB
                  </span>
                </>
              )}
            </button>
          </>
        ) : (
          <div className="flex items-center justify-between rounded-lg border border-brand-border bg-emerald-50 p-4">
            <div className="flex items-center gap-3">
              <svg
                className="h-8 w-8 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-brand-text">
                  {receiptFileName}
                </p>
                <p className="text-xs text-brand-textMuted">
                  Receipt uploaded successfully
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onRemoveReceipt}
              className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
            >
              Remove
            </button>
          </div>
        )}
        <p className="mt-2 text-xs text-brand-textMuted">
          📎 Attach proof of purchase to verify this expense for tax compliance
        </p>
      </div>
    </div>
  );
}
