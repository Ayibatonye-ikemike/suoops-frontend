"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { apiClient } from "@/api/client";
import type { components } from "@/api/types";

export type InvoiceDetail = components["schemas"]["InvoiceOutDetailed"] & {
  receipt_pdf_url?: string | null;
  paid_at?: string | null;
};

async function fetchInvoiceDetail(invoiceId: string): Promise<InvoiceDetail> {
  const { data } = await apiClient.get<InvoiceDetail>(`/invoices/${invoiceId}`);
  return data;
}

export function useInvoiceDetail(invoiceId: string | null) {
  const [poll, setPoll] = useState(false);
  return useQuery<InvoiceDetail>({
    queryKey: ["invoice", invoiceId],
    queryFn: () => fetchInvoiceDetail(invoiceId as string),
    enabled: Boolean(invoiceId),
    refetchInterval: poll ? 5000 : false,
    refetchIntervalInBackground: poll,
    select: (data) => {
      // Update polling flag side-effect (allowed but eslint may warn; acceptable for small hook)
      const shouldPoll = data.status === "pending" || data.status === "awaiting_confirmation";
      if (shouldPoll !== poll) {
        // Schedule after render tick to avoid state update during select (microtask)
        queueMicrotask(() => setPoll(shouldPoll));
      }
      return data;
    },
  });
}
