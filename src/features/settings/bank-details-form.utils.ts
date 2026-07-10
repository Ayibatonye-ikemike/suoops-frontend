import type {
  BankDetailsOut,
  BankDetailsUpdate,
  BankFormState,
} from "./bank-details-form.types";

export const formatAccountNumber = (value: string) =>
  value.replace(/(\d{4})(?=\d)/g, "$1 ").trim();

export const toPayload = (state: BankFormState): BankDetailsUpdate => ({
  business_name: state.businessName || null,
  bank_name: state.bankName || null,
  account_number: state.accountNumber || null,
  account_name: state.accountName || null,
});

export const toFormState = (
  details: BankDetailsOut | undefined,
): BankFormState => ({
  businessName: details?.business_name ?? "",
  bankName: details?.bank_name ?? "",
  accountNumber: details?.account_number ?? "",
  accountName: details?.account_name ?? "",
});

export const getErrorMessage = (err: unknown) => {
  // Prefer the API's friendly message (axios error shape: response.data.detail).
  const detail = (err as { response?: { data?: { detail?: unknown } } })?.response?.data
    ?.detail;
  if (typeof detail === "string" && detail.trim()) return detail;
  if (err instanceof Error) {
    // Never surface raw transport messages like "Request failed with status code 400".
    if (/request failed with status code|network error|timeout/i.test(err.message)) {
      return "Something went wrong. Please try again.";
    }
    return err.message;
  }
  if (typeof err === "string") return err;
  return "Something went wrong. Please try again.";
};
