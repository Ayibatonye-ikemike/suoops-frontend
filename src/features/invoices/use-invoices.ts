"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/api/client";
import type { components } from "@/api/types";

export type Invoice = components["schemas"]["InvoiceOut"];

async function fetchInvoices(): Promise<Invoice[]> {
  // Only fetch revenue invoices for the main dashboard - expenses are tracked separately on Tax page
  const { data } = await apiClient.get<Invoice[]>("/invoices/", {
    params: { invoice_type: "revenue" },
  });
  return data;
}

export function useInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: fetchInvoices,
  });
}
