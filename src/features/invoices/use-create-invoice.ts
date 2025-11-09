"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { parseFeatureGateError } from "@/lib/feature-gate";

import { apiClient } from "@/api/client";
import type { components } from "@/api/types";

import { type Invoice } from "./use-invoices";

export type InvoiceLineInput = components["schemas"]["InvoiceLineIn"];
export type InvoiceCreatePayload = components["schemas"]["InvoiceCreate"];

async function createInvoice(payload: InvoiceCreatePayload): Promise<Invoice> {
  try {
    const { data } = await apiClient.post<Invoice>("/invoices/", payload);
    return data;
  } catch (err) {
    const gate = parseFeatureGateError(err);
    if (gate) {
      // Re-throw enriched Error for UI consumption
      const enriched = new Error(gate.message);
      (enriched as any).featureGate = gate;
      throw enriched;
    }
    throw err;
  }
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["invoices"] });
      void queryClient.invalidateQueries({ queryKey: ["invoice-quota"] });
    },
  });
}
