"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteBankDetails,
  getBankDetails,
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
  const [copiedField, setCopiedField] = useState<keyof BankFormState | null>(
    null
  );

  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
      if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    },
    []
  );

  const handleFieldChange = useCallback(
    (field: keyof BankFormState, value: string) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
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

  const handleCopy = useCallback(
    async (field: "accountNumber" | "accountName") => {
      const value =
        field === "accountNumber"
          ? formState.accountNumber
          : formState.accountName;
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
    [formState.accountName, formState.accountNumber]
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
    <form onSubmit={handleSubmit} className="space-y-6">
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
        onCopy={handleCopy}
        copiedField={copiedField}
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
