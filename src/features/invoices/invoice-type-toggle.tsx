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
        className={`flex-1 rounded-md border px-4 py-2.5 text-sm font-semibold uppercase tracking-wide transition ${
          invoiceType === "revenue"
            ? "border-brand-jade bg-brand-jade text-white shadow"
            : "border-brand-jade/50 bg-brand-jade/10 text-brand-evergreen"
        }`}
      >
        💰 Revenue
      </button>
      <button
        type="button"
        onClick={() => onTypeChange("expense")}
        className={`flex-1 rounded-md border px-4 py-2.5 text-sm font-semibold uppercase tracking-wide transition ${
          invoiceType === "expense"
            ? "border-brand-jade bg-brand-jade text-white shadow"
            : "border-brand-jade/50 bg-brand-jade/10 text-brand-evergreen"
        }`}
      >
        💸 Expense
      </button>
    </div>
  );
}
