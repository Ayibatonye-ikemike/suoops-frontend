import { apiClient } from "./client";
import type { components } from "./types";

type BankDetailsOut = components["schemas"]["BankDetailsOut"];
type BankDetailsUpdate = components["schemas"]["BankDetailsUpdate"];
type MessageOut = components["schemas"]["MessageOut"];

export async function getBankDetails(): Promise<BankDetailsOut> {
  const response = await apiClient.get<BankDetailsOut>("/users/me/bank-details");
  return response.data;
}

export async function updateBankDetails(data: BankDetailsUpdate): Promise<BankDetailsOut> {
  const response = await apiClient.patch<BankDetailsOut>("/users/me/bank-details", data);
  return response.data;
}

export async function deleteBankDetails(): Promise<MessageOut> {
  const response = await apiClient.delete<MessageOut>("/users/me/bank-details");
  return response.data;
}

export interface ResolvedAccount {
  account_name: string;
}

/** Resolve the account holder's name from the bank + account number (Paystack). */
export async function resolveBankAccount(
  bankName: string,
  accountNumber: string,
): Promise<ResolvedAccount> {
  const response = await apiClient.post<ResolvedAccount>(
    "/users/me/resolve-bank-account",
    { bank_name: bankName, account_number: accountNumber },
  );
  return response.data;
}
