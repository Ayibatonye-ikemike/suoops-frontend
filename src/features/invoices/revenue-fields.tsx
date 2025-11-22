interface RevenueFieldsProps {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  amount: string;
  onCustomerNameChange: (value: string) => void;
  onCustomerPhoneChange: (value: string) => void;
  onCustomerEmailChange: (value: string) => void;
  onAmountChange: (value: string) => void;
}

export function RevenueFields({
  customerName,
  customerPhone,
  customerEmail,
  amount,
  onCustomerNameChange,
  onCustomerPhoneChange,
  onCustomerEmailChange,
  onAmountChange,
}: RevenueFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="flex flex-col gap-2 text-sm font-semibold text-brand-text sm:col-span-2 md:col-span-1">
        Customer name
        <input
          value={customerName}
          onChange={(e) => onCustomerNameChange(e.target.value)}
          required
          className="rounded-lg border border-brand-border bg-white px-3 py-2 text-base font-normal text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm font-semibold text-brand-text">
        Customer phone
        <input
          value={customerPhone}
          onChange={(e) => onCustomerPhoneChange(e.target.value)}
          placeholder="Optional (e.g., +2348012345678)"
          className="rounded-lg border border-brand-border bg-white px-3 py-2 text-base font-normal text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm font-semibold text-brand-text">
        Customer email
        <input
          type="email"
          value={customerEmail}
          onChange={(e) => onCustomerEmailChange(e.target.value)}
          placeholder="Optional (e.g., customer@example.com)"
          className="rounded-lg border border-brand-border bg-white px-3 py-2 text-base font-normal text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        />
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
    </div>
  );
}
