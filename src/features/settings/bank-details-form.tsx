"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteBankDetails,
  getBankDetails,
  updateBankDetails,
} from "@/api/bank-details";
import {
  DEFAULT_FORM,
  NIGERIAN_BANKS,
} from "./bank-details-form.constants";
import {
  formatAccountNumber,
  getErrorMessage,
  toFormState,
  toPayload,
} from "./bank-details-form.utils";
import type {
  BankDetailsUpdate,
  BankFormState,
} from "./bank-details-form.types";
import { Button } from "@/components/ui/button";

export function BankDetailsForm() {
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState<BankFormState>(DEFAULT_FORM);
  const [initialValues, setInitialValues] = useState<BankFormState>(DEFAULT_FORM);
  const [successMessage, setSuccessMessage] = useState("");
  const [copiedField, setCopiedField] = useState<keyof BankFormState | null>(null);

  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: bankDetails, isLoading, isError, error } = useQuery({
    queryKey: ["bankDetails"],
    queryFn: getBankDetails,
  });

  const showSuccess = useCallback((message: string) => {
    setSuccessMessage(message);
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }
    successTimeoutRef.current = setTimeout(() => setSuccessMessage(""), 4000);
  }, []);

  const updateMutation = useMutation({
    mutationFn: (payload: BankDetailsUpdate) => updateBankDetails(payload),
    onSuccess: (updated) => {
      const nextState = toFormState(updated);
      setInitialValues(nextState);
      setFormState(nextState);
      queryClient.setQueryData(["bankDetails"], updated);
      showSuccess("Bank details saved.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBankDetails,
    onSuccess: () => {
      setInitialValues(DEFAULT_FORM);
      setFormState(DEFAULT_FORM);
      queryClient.invalidateQueries({ queryKey: ["bankDetails"] });
      showSuccess("Bank details cleared.");
    },
  });

  useEffect(() => {
    if (updateMutation.isPending || deleteMutation.isPending) {
      return;
    }
    const nextState = toFormState(bankDetails);
    setInitialValues(nextState);
    setFormState((prev) => ({
      businessName: prev.businessName && bankDetails === undefined ? prev.businessName : nextState.businessName,
      bankName: prev.bankName && bankDetails === undefined ? prev.bankName : nextState.bankName,
      accountNumber: prev.accountNumber && bankDetails === undefined ? prev.accountNumber : nextState.accountNumber,
      accountName: prev.accountName && bankDetails === undefined ? prev.accountName : nextState.accountName,
    }));
  }, [bankDetails, updateMutation.isPending, deleteMutation.isPending]);

  useEffect(() => () => {
    if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
    if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
  }, []);

  const handleFieldChange = useCallback(
    (field: keyof BankFormState, value: string) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
      if (updateMutation.isError) updateMutation.reset();
      if (deleteMutation.isError) deleteMutation.reset();
    },
    [deleteMutation, updateMutation],
  );

  const handleAccountNumberChange = useCallback(
    (value: string) => {
      const numeric = value.replace(/\D/g, "").slice(0, 10);
      handleFieldChange("accountNumber", numeric);
    },
    [handleFieldChange],
  );

  const isConfigured = bankDetails?.is_configured ?? false;
  const hasChanges = useMemo(
    () =>
      ["businessName", "bankName", "accountNumber", "accountName"].some(
        (key) => formState[key as keyof BankFormState] !== initialValues[key as keyof BankFormState],
      ),
    [formState, initialValues],
  );

  const isFormValid = useMemo(() => {
    // All required fields must be filled
    const hasAllFields = formState.bankName && formState.accountNumber && formState.accountName;
    // Account number must be exactly 10 digits
    const isAccountNumberValid = formState.accountNumber.length === 10 && /^\d{10}$/.test(formState.accountNumber);
    return hasAllFields && isAccountNumberValid;
  }, [formState]);

  const canClear = useMemo(
    () => Object.values(initialValues).some((value) => value.length > 0),
    [initialValues],
  );

  const formattedAccountNumber = useMemo(() => (
    formState.accountNumber ? formatAccountNumber(formState.accountNumber) : ""
  ), [formState.accountNumber]);

  const updateError = updateMutation.isError ? getErrorMessage(updateMutation.error) : null;
  const deleteError = deleteMutation.isError ? getErrorMessage(deleteMutation.error) : null;
  const fetchError = isError ? getErrorMessage(error) : null;

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!hasChanges) return;
      updateMutation.mutate(toPayload(formState));
    },
    [formState, hasChanges, updateMutation],
  );

  const handleClear = useCallback(() => {
    if (!canClear || deleteMutation.isPending) {
      return;
    }
    const confirmed =
      typeof window === "undefined" ||
      window.confirm("Remove saved bank details? Invoices will no longer show payment instructions.");
    if (!confirmed) return;
    deleteMutation.mutate();
  }, [canClear, deleteMutation]);

  const handleCopy = useCallback(
    async (field: "accountNumber" | "accountName") => {
      const value = field === "accountNumber" ? formState.accountNumber : formState.accountName;
      if (!value || typeof navigator === "undefined" || !navigator.clipboard) {
        return;
      }
      try {
        await navigator.clipboard.writeText(value);
        setCopiedField(field);
        if (copiedTimeoutRef.current) {
          clearTimeout(copiedTimeoutRef.current);
        }
        copiedTimeoutRef.current = setTimeout(() => setCopiedField(null), 2000);
      } catch (copyError) {
        console.error("Failed to copy bank detail", copyError);
      }
    },
    [formState.accountName, formState.accountNumber],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-brand-textMuted">Loading bank details...</div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        {fetchError}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div
        className={`rounded-xl border px-4 py-4 ${
          isConfigured ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
        }`}
      >
        <div className="flex items-start gap-3">
          <span className="text-xl" aria-hidden>
            {isConfigured ? "✅" : "⚠️"}
          </span>
          <div>
            <p className="text-sm font-semibold text-brand-text">
              {isConfigured ? "Bank details configured" : "Bank details incomplete"}
            </p>
            <p className="mt-1 text-xs text-brand-textMuted">
              {isConfigured
                ? "New invoices already include your transfer instructions."
                : "Fill out every field and save to show transfer instructions on invoices."}
            </p>
            {hasChanges && !updateMutation.isPending && !deleteMutation.isPending && (
              <p className="mt-2 text-xs font-medium text-amber-700">You have unsaved changes.</p>
            )}
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {successMessage}
        </div>
      )}

      {updateError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {updateError}
        </div>
      )}

      {deleteError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {deleteError}
        </div>
      )}

      <div>
        <label htmlFor="businessName" className="block text-xs font-semibold uppercase tracking-wide text-brand-textMuted">
          Business Name <span className="text-brand-textMuted/70 normal-case">(optional)</span>
        </label>
        <input
          id="businessName"
          type="text"
          value={formState.businessName}
          onChange={(event) => handleFieldChange("businessName", event.target.value)}
          placeholder="Lagos Ventures Ltd"
          autoComplete="organization"
          className="mt-2 block w-full rounded-lg border border-brand-border bg-white px-3 py-3 text-sm text-brand-text focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
        />
        <p className="mt-2 text-xs text-brand-textMuted">
          Appears on invoices and receipts sent to customers.
        </p>
      </div>

      <div>
        <label htmlFor="bankName" className="block text-xs font-semibold uppercase tracking-wide text-brand-textMuted">
          Bank Name <span className="text-red-500">*</span>
        </label>
        <select
          id="bankName"
          value={formState.bankName}
          onChange={(event) => handleFieldChange("bankName", event.target.value)}
          required
          className="mt-2 block w-full rounded-lg border border-brand-border bg-white px-3 py-3 text-sm text-brand-text focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
        >
          <option value="">Select your bank</option>
          {NIGERIAN_BANKS.map((bank) => (
            <option key={bank} value={bank}>
              {bank}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-brand-textMuted">Where customers will send their transfers.</p>
      </div>

      <div>
        <label htmlFor="accountNumber" className="block text-xs font-semibold uppercase tracking-wide text-brand-textMuted">
          Account Number <span className="text-red-500">*</span>
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="accountNumber"
            type="text"
            value={formattedAccountNumber}
            onChange={(event) => handleAccountNumberChange(event.target.value)}
            placeholder="0123 4567 89"
            inputMode="numeric"
            required
            className="flex-1 rounded-lg border border-brand-border bg-white px-3 py-3 text-sm tracking-[0.2em] text-brand-text focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleCopy("accountNumber")}
            disabled={formState.accountNumber.length !== 10}
            className="min-w-[96px]"
          >
            {copiedField === "accountNumber" ? "Copied!" : "Copy"}
          </Button>
        </div>
        <p className="mt-2 text-xs text-brand-textMuted">
          Nigerian NUBAN numbers are exactly 10 digits. Customers see it with spaces for readability.
        </p>
        {formState.accountNumber && formState.accountNumber.length !== 10 && (
          <p className="mt-1 text-xs text-red-600">
            Account number must be exactly 10 digits (currently {formState.accountNumber.length})
          </p>
        )}
      </div>

      <div>
        <label htmlFor="accountName" className="block text-xs font-semibold uppercase tracking-wide text-brand-textMuted">
          Account Name <span className="text-red-500">*</span>
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="accountName"
            type="text"
            value={formState.accountName}
            onChange={(event) => handleFieldChange("accountName", event.target.value)}
            placeholder="Lagos Ventures Ltd"
            autoComplete="name"
            required
            className="flex-1 rounded-lg border border-brand-border bg-white px-3 py-3 text-sm text-brand-text focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleCopy("accountName")}
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

      <div className="rounded-xl border border-brand-border bg-brand-background px-4 py-5 text-brand-text">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-textMuted">Invoice Preview</h3>
        <p className="mt-2 text-xs text-brand-textMuted">
          Customers receive these instructions on the PDF and WhatsApp message once you save.
        </p>
        <dl className="mt-4 space-y-2 text-sm text-brand-text">
          <div className="flex items-center justify-between">
            <dt className="font-medium text-brand-textMuted">Bank Name</dt>
            <dd>{formState.bankName || <span className="text-brand-textMuted/50">Not set</span>}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="font-medium text-brand-textMuted">Account Number</dt>
            <dd>
              {formState.accountNumber ? formatAccountNumber(formState.accountNumber) : (
                <span className="text-brand-textMuted/50">Not set</span>
              )}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="font-medium text-brand-textMuted">Account Name</dt>
            <dd>{formState.accountName || <span className="text-brand-textMuted/50">Not set</span>}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="font-medium text-brand-textMuted">Business Name</dt>
            <dd>{formState.businessName || <span className="text-brand-textMuted/50">Not set</span>}</dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-col gap-3 border-t border-brand-border/60 pt-6 text-brand-text sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-brand-textMuted">
          <span className="text-red-500">*</span> Required fields
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleClear}
            disabled={!canClear || deleteMutation.isPending}
            className="min-w-[160px]"
          >
            {deleteMutation.isPending ? "Clearing" : "Clear Bank Details"}
          </Button>
          <Button
            type="submit"
            disabled={!hasChanges || !isFormValid || updateMutation.isPending}
            className="min-w-[160px]"
          >
            {updateMutation.isPending ? "Saving" : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
