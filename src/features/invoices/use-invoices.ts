"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { apiClient } from "@/api/client";
import type { components } from "@/api/types";

export type Invoice = components["schemas"]["InvoiceOut"];

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
  has_more: boolean;
}

async function fetchInvoices(
  skip: number,
  limit: number
): Promise<PaginatedResponse<Invoice>> {
  // Only fetch revenue invoices for the main dashboard - expenses are tracked separately on Tax page
  const { data } = await apiClient.get<PaginatedResponse<Invoice>>(
    "/invoices/",
    {
      params: { invoice_type: "revenue", skip, limit },
    }
  );
  return data;
}

export function useInvoices(skip = 0, limit = 50) {
  return useQuery({
    queryKey: ["invoices", skip, limit],
    queryFn: () => fetchInvoices(skip, limit),
    placeholderData: keepPreviousData,
  });
}
