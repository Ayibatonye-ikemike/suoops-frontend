interface InvoiceTypeToggleProps {
  invoiceType: "revenue" | "expense";
  onTypeChange: (type: "revenue" | "expense") => void;
}

export function InvoiceTypeToggle({ invoiceType, onTypeChange }: InvoiceTypeToggleProps) {
  return (
    <div className="flex gap-2 rounded-lg border border-brand-border bg-brand-background p-1">
      <button
        type="button"
        onClick={() => onTypeChange("revenue")}
        className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold uppercase tracking-wide transition ${
          invoiceType === "revenue"
            ? "bg-brand-primary text-white shadow"
            : "text-brand-textMuted hover:text-brand-text"
        }`}
      >
        💰 Revenue
      </button>
      <button
        type="button"
        onClick={() => onTypeChange("expense")}
        className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold uppercase tracking-wide transition ${
          invoiceType === "expense"
            ? "bg-brand-primary text-white shadow"
            : "text-brand-textMuted hover:text-brand-text"
        }`}
      >
        💸 Expense
      </button>
    </div>
  );
}
