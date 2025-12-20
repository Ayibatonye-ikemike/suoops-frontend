import { useState, useRef, useEffect } from "react";
import { NIGERIAN_BANKS } from "./bank-details-form.constants";
import { formatAccountNumber } from "./bank-details-form.utils";
import type { BankFormState } from "./bank-details-form.types";
import { Button } from "@/components/ui/button";

interface FormFieldsProps {
  formState: BankFormState;
  onFieldChange: (field: keyof BankFormState, value: string) => void;
  onAccountNumberChange: (value: string) => void;
  onCopy: (field: "accountNumber" | "accountName") => Promise<void>;
  copiedField: keyof BankFormState | null;
}

export function BankDetailsFormFields({
  formState,
  onFieldChange,
  onAccountNumberChange,
  onCopy,
  copiedField,
}: FormFieldsProps) {
  const formattedAccountNumber = formState.accountNumber
    ? formatAccountNumber(formState.accountNumber)
    : "";

  // Bank search state
  const [bankSearch, setBankSearch] = useState("");
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const bankInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter banks based on search
  const filteredBanks = NIGERIAN_BANKS.filter((bank) =>
    bank.toLowerCase().includes(bankSearch.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        bankInputRef.current &&
        !bankInputRef.current.contains(event.target as Node)
      ) {
        setShowBankDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBankSelect = (bank: string) => {
    onFieldChange("bankName", bank);
    setBankSearch("");
    setShowBankDropdown(false);
  };

  return (
    <>
      <div>
        <label
          htmlFor="businessName"
          className="block text-xs font-semibold uppercase tracking-wide text-brand-textMuted"
        >
          Business Name{" "}
          <span className="text-brand-textMuted/70 normal-case">
            (optional)
          </span>
        </label>
        <input
          id="businessName"
          type="text"
          value={formState.businessName}
          onChange={(event) =>
            onFieldChange("businessName", event.target.value)
          }
          placeholder="Lagos Ventures Ltd"
          autoComplete="organization"
          className="mt-2 block w-full rounded-lg border border-brand-border bg-white px-3 py-3 text-sm text-brand-text focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
        />
        <p className="mt-2 text-xs text-brand-textMuted">
          Appears on invoices and receipts sent to customers.
        </p>
      </div>

      <div>
        <label
          htmlFor="bankName"
          className="block text-xs font-semibold uppercase tracking-wide text-brand-textMuted"
        >
          Bank Name <span className="text-red-500">*</span>
        </label>
        <div className="relative mt-2">
          <input
            ref={bankInputRef}
            type="text"
            id="bankName"
            value={showBankDropdown ? bankSearch : formState.bankName}
            onChange={(e) => {
              setBankSearch(e.target.value);
              if (!showBankDropdown) setShowBankDropdown(true);
            }}
            onFocus={() => setShowBankDropdown(true)}
            placeholder="Search for your bank..."
            autoComplete="off"
            className="block w-full rounded-lg border border-brand-border bg-white px-3 py-3 text-sm text-brand-text focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
          {formState.bankName && !showBankDropdown && (
            <button
              type="button"
              onClick={() => {
                onFieldChange("bankName", "");
                setBankSearch("");
                setShowBankDropdown(true);
                bankInputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-textMuted hover:text-brand-text"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {showBankDropdown && (
            <div
              ref={dropdownRef}
              className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-brand-border bg-white shadow-lg"
            >
              {filteredBanks.length === 0 ? (
                <div className="px-3 py-2 text-sm text-brand-textMuted">
                  No banks found
                </div>
              ) : (
                filteredBanks.map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => handleBankSelect(bank)}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-brand-jade/10 ${
                      formState.bankName === bank
                        ? "bg-brand-jade/5 font-medium text-brand-jade"
                        : "text-brand-text"
                    }`}
                  >
                    {bank}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        <p className="mt-2 text-xs text-brand-textMuted">
          Where customers will send their transfers.
        </p>
      </div>

      <div>
        <label
          htmlFor="accountNumber"
          className="block text-xs font-semibold uppercase tracking-wide text-brand-textMuted"
        >
          Account Number <span className="text-red-500">*</span>
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="accountNumber"
            type="text"
            value={formattedAccountNumber}
            onChange={(event) => onAccountNumberChange(event.target.value)}
            placeholder="0123 4567 89"
            inputMode="numeric"
            required
            className="flex-1 rounded-lg border border-brand-border bg-white px-3 py-3 text-sm tracking-[0.2em] text-brand-text focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onCopy("accountNumber")}
            disabled={formState.accountNumber.length !== 10}
            className="min-w-[96px]"
          >
            {copiedField === "accountNumber" ? "Copied!" : "Copy"}
          </Button>
        </div>
        <p className="mt-2 text-xs text-brand-textMuted">
          Nigerian NUBAN numbers are exactly 10 digits. Customers see it with
          spaces for readability.
        </p>
        {formState.accountNumber && formState.accountNumber.length !== 10 && (
          <p className="mt-1 text-xs text-red-600">
            Account number must be exactly 10 digits (currently{" "}
            {formState.accountNumber.length})
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="accountName"
          className="block text-xs font-semibold uppercase tracking-wide text-brand-textMuted"
        >
          Account Name <span className="text-red-500">*</span>
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="accountName"
            type="text"
            value={formState.accountName}
            onChange={(event) =>
              onFieldChange("accountName", event.target.value)
            }
            placeholder="Lagos Ventures Ltd"
            autoComplete="name"
            required
            className="flex-1 rounded-lg border border-brand-border bg-white px-3 py-3 text-sm text-brand-text focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onCopy("accountName")}
            disabled={!formState.accountName}
            className="min-w-[96px]"
          >
            {copiedField === "accountName" ? "Copied!" : "Copy"}
          </Button>
        </div>
        <p className="mt-2 text-xs text-brand-textMuted">
          Must match your bank records so customers recognise the beneficiary.
        </p>
      </div>
    </>
  );
}
