"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

export interface InvoiceQuota {
  invoice_balance: number;
  current_plan: string;
  can_create: boolean;
  pack_price: number;
  pack_size: number;
  purchase_url: string | null;
}

async function fetchInvoiceQuota(): Promise<InvoiceQuota> {
  const { data } = await apiClient.get<InvoiceQuota>("/invoices/quota");
  return data;
}

export function useInvoiceQuota() {
  return useQuery({
    queryKey: ["invoice-quota"],
    queryFn: fetchInvoiceQuota,
    refetchInterval: 60_000, // refresh every minute for near-real-time usage
  });
}
