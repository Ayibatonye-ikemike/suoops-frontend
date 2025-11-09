"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { apiClient } from "@/api/client";
import type { components } from "@/api/types";

type InvoiceDetail = components["schemas"]["InvoiceOutDetailed"];
type InvoiceStatusUpdate = components["schemas"]["InvoiceStatusUpdate"];

async function updateInvoiceStatus(
  invoiceId: string,
  status: InvoiceStatusUpdate["status"],
): Promise<InvoiceDetail> {
  const { data } = await apiClient.patch<InvoiceDetail>(`/invoices/${invoiceId}`, { status });
  return data;
}

export function useUpdateInvoiceStatus(invoiceId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: InvoiceStatusUpdate["status"]) => updateInvoiceStatus(invoiceId as string, status),
    onMutate: async (nextStatus) => {
      if (!invoiceId) return;
      await queryClient.cancelQueries({ queryKey: ["invoice", invoiceId] });
      const previous = queryClient.getQueryData<InvoiceDetail>(["invoice", invoiceId]);
      if (previous) {
        queryClient.setQueryData(["invoice", invoiceId], { ...previous, status: nextStatus });
      }
      return { previous };
    },
    onError: (error, _vars, context) => {
      if (context?.previous && invoiceId) {
        queryClient.setQueryData(["invoice", invoiceId], context.previous);
      }
      toast.error("Failed to update status. Please try again.");
    },
    onSuccess: (data) => {
      if (!invoiceId) return;
      queryClient.setQueryData(["invoice", invoiceId], data);
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success(`Status updated to ${data.status}`);
    },
    onSettled: () => {
      if (invoiceId) {
        queryClient.invalidateQueries({ queryKey: ["invoice", invoiceId] });
      }
    },
  });
}
