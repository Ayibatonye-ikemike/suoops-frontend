"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteBankDetails,
  getBankDetails,
  resolveBankAccount,
  updateBankDetails,
} from "@/api/bank-details";
import { DEFAULT_FORM } from "./bank-details-form.constants";
import {
  getErrorMessage,
  toFormState,
  toPayload,
} from "./bank-details-form.utils";
import {
  canClearForm,
  hasFormChanges,
  isFormComplete,
} from "./bank-details-form.validation";
import type {
  BankDetailsUpdate,
  BankFormState,
} from "./bank-details-form.types";
import { StatusBanner } from "./bank-details-status-banner";
import { MessageDisplay } from "./bank-details-message-display";
import { BankDetailsFormFields } from "./bank-details-form-fields";
import { InvoicePreview } from "./bank-details-invoice-preview";
import { BankDetailsActions } from "./bank-details-actions";

export function BankDetailsForm() {
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState<BankFormState>(DEFAULT_FORM);
  const [initialValues, setInitialValues] =
    useState<BankFormState>(DEFAULT_FORM);
  const [successMessage, setSuccessMessage] = useState("");
  const [resolveStatus, setResolveStatus] = useState<
    "idle" | "resolving" | "resolved" | "error"
  >("idle");
  const [resolveError, setResolveError] = useState("");
  // Only auto-resolve after the user edits the form, never on initial hydration.
  const userEditedRef = useRef(false);

  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    data: bankDetails,
    isLoading,
    isError,
    error,
  } = useQuery({
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
      // Bank details gate the "Enable online payments" button on the same
      // page; refresh its status so the button unlocks immediately.
      queryClient.invalidateQueries({ queryKey: ["onlinePaymentsStatus"] });
      showSuccess("Bank details saved.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBankDetails,
    onSuccess: () => {
      setInitialValues(DEFAULT_FORM);
      setFormState(DEFAULT_FORM);
      queryClient.invalidateQueries({ queryKey: ["bankDetails"] });
      queryClient.invalidateQueries({ queryKey: ["onlinePaymentsStatus"] });
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
      businessName:
        prev.businessName && bankDetails === undefined
          ? prev.businessName
          : nextState.businessName,
      bankName:
        prev.bankName && bankDetails === undefined
          ? prev.bankName
          : nextState.bankName,
      accountNumber:
        prev.accountNumber && bankDetails === undefined
          ? prev.accountNumber
          : nextState.accountNumber,
      accountName:
        prev.accountName && bankDetails === undefined
          ? prev.accountName
          : nextState.accountName,
    }));
  }, [bankDetails, updateMutation.isPending, deleteMutation.isPending]);

  useEffect(
    () => () => {
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    },
    []
  );

  // Live account-name resolution: once a bank + 10-digit number are entered,
  // verify the holder's name via Paystack and auto-fill it so the saved name
  // always matches the bank exactly.
  useEffect(() => {
    if (!userEditedRef.current) return;
    const bank = formState.bankName.trim();
    const acct = formState.accountNumber.trim();
    if (!bank || acct.length !== 10) {
      setResolveStatus("idle");
      setResolveError("");
      return;
    }
    let cancelled = false;
    setResolveStatus("resolving");
    setResolveError("");
    const timer = setTimeout(async () => {
      try {
        const { account_name } = await resolveBankAccount(bank, acct);
        if (cancelled) return;
        setFormState((prev) => ({ ...prev, accountName: account_name }));
        setResolveStatus("resolved");
      } catch (err) {
        if (cancelled) return;
        setResolveStatus("error");
        setResolveError(
          getErrorMessage(err) ||
            "Couldn't verify this account. Check the number and bank, or type the name manually."
        );
      }
    }, 600);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [formState.bankName, formState.accountNumber]);

  const handleFieldChange = useCallback(
    (field: keyof BankFormState, value: string) => {
      userEditedRef.current = true;
      setFormState((prev) => ({ ...prev, [field]: value }));
      if (field === "accountName") {
        // User is overriding the resolved name manually.
        setResolveStatus("idle");
        setResolveError("");
      }
      if (updateMutation.isError) updateMutation.reset();
      if (deleteMutation.isError) deleteMutation.reset();
    },
    [deleteMutation, updateMutation]
  );

  const handleAccountNumberChange = useCallback(
    (value: string) => {
      const numeric = value.replace(/\D/g, "").slice(0, 10);
      handleFieldChange("accountNumber", numeric);
    },
    [handleFieldChange]
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const hasChanges = hasFormChanges(formState, initialValues);
      if (!hasChanges) return;
      updateMutation.mutate(toPayload(formState));
    },
    [formState, initialValues, updateMutation]
  );

  const handleClear = useCallback(() => {
    const canClear = canClearForm(initialValues);
    if (!canClear || deleteMutation.isPending) {
      return;
    }
    const confirmed =
      typeof window === "undefined" ||
      window.confirm(
        "Remove saved bank details? Invoices will no longer show payment instructions."
      );
    if (!confirmed) return;
    deleteMutation.mutate();
  }, [initialValues, deleteMutation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-brand-textMuted">
          Loading bank details...
        </div>
      </div>
    );
  }

  const fetchError = isError ? getErrorMessage(error) : null;

  if (fetchError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        {fetchError}
      </div>
    );
  }

  const isConfigured = bankDetails?.is_configured ?? false;
  const hasChanges = hasFormChanges(formState, initialValues);
  const isFormValid = isFormComplete(formState);
  const canClear = canClearForm(initialValues);
  const isPending = updateMutation.isPending || deleteMutation.isPending;
  const updateError = updateMutation.isError
    ? getErrorMessage(updateMutation.error)
    : null;
  const deleteError = deleteMutation.isError
    ? getErrorMessage(deleteMutation.error)
    : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <StatusBanner
        isConfigured={isConfigured}
        hasChanges={hasChanges}
        isPending={isPending}
      />

      <MessageDisplay
        successMessage={successMessage}
        updateError={updateError}
        deleteError={deleteError}
      />

      <BankDetailsFormFields
        formState={formState}
        onFieldChange={handleFieldChange}
        onAccountNumberChange={handleAccountNumberChange}
        resolveStatus={resolveStatus}
        resolveError={resolveError}
      />

      <InvoicePreview formState={formState} />

      <BankDetailsActions
        canClear={canClear}
        hasChanges={hasChanges}
        isFormValid={isFormValid}
        isDeleting={deleteMutation.isPending}
        isSaving={updateMutation.isPending}
        onClear={handleClear}
      />
    </form>
  );
}
