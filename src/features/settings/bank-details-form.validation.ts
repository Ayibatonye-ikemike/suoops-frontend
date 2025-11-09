import type { BankFormState } from "./bank-details-form.types";

export const isValidAccountNumber = (accountNumber: string): boolean => {
  return accountNumber.length === 10 && /^\d{10}$/.test(accountNumber);
};

export const isFormComplete = (formState: BankFormState): boolean => {
  const hasAllFields =
    formState.bankName && formState.accountNumber && formState.accountName;
  const isAccountNumberValid = isValidAccountNumber(formState.accountNumber);
  return Boolean(hasAllFields && isAccountNumberValid);
};

export const hasFormChanges = (
  formState: BankFormState,
  initialValues: BankFormState,
): boolean => {
  return ["businessName", "bankName", "accountNumber", "accountName"].some(
    (key) =>
      formState[key as keyof BankFormState] !== initialValues[key as keyof BankFormState],
  );
};

export const canClearForm = (initialValues: BankFormState): boolean => {
  return Object.values(initialValues).some((value) => value.length > 0);
};
