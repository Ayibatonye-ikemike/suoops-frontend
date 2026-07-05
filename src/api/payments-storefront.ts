import { apiClient } from "./client";

export interface OnlinePaymentsStatus {
  enabled: boolean;
  has_bank_details: boolean;
}

export interface EnableOnlinePaymentsResult {
  enabled: boolean;
  subaccount_code: string;
  message: string;
}

export interface StorefrontStatus {
  enabled: boolean;
  slug: string | null;
  link: string | null;
  description: string | null;
}

export async function getOnlinePaymentsStatus(): Promise<OnlinePaymentsStatus> {
  const res = await apiClient.get<OnlinePaymentsStatus>(
    "/invoices/online-payments-status",
  );
  return res.data;
}

export async function enableOnlinePayments(): Promise<EnableOnlinePaymentsResult> {
  const res = await apiClient.post<EnableOnlinePaymentsResult>(
    "/invoices/enable-online-payments",
  );
  return res.data;
}

export async function getStorefront(): Promise<StorefrontStatus> {
  const res = await apiClient.get<StorefrontStatus>("/inventory/storefront");
  return res.data;
}

export async function enableStorefront(slug?: string): Promise<StorefrontStatus> {
  const res = await apiClient.post<StorefrontStatus>(
    "/inventory/storefront/enable",
    { slug: slug ?? null },
  );
  return res.data;
}

export async function disableStorefront(): Promise<StorefrontStatus> {
  const res = await apiClient.post<StorefrontStatus>(
    "/inventory/storefront/disable",
  );
  return res.data;
}

export async function updateStorefront(description: string): Promise<StorefrontStatus> {
  const res = await apiClient.patch<StorefrontStatus>(
    "/inventory/storefront",
    { description },
  );
  return res.data;
}
