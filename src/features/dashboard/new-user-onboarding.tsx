"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

interface InvoiceQuota {
  invoice_balance: number;
  total_invoices: number;
}

const ONBOARDING_COMPLETE_KEY = "onboarding-complete";

/**
 * NewUserOnboarding — gate that redirects brand-new users (0 invoices, no
 * onboarding flag) to the standalone `/dashboard/welcome` pricing/onboarding
 * page so the dashboard itself never gets visually replaced by pricing.
 *
 * Once a user has either created an invoice or clicked through the welcome
 * screen (which sets `onboarding-complete`), this component is a no-op.
 */
export function NewUserOnboarding({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { data: quota, isLoading } = useQuery<InvoiceQuota>({
    queryKey: ["invoice-quota"],
    queryFn: async () => (await apiClient.get<InvoiceQuota>("/invoices/quota")).data,
    staleTime: 60_000,
  });

  const hasInvoices = !!quota && quota.total_invoices > 0;

  useEffect(() => {
    if (isLoading) return;
    if (hasInvoices) return;
    if (typeof window === "undefined") return;

    let onboarded = false;
    try {
      onboarded = localStorage.getItem(ONBOARDING_COMPLETE_KEY) === "true";
    } catch {
      onboarded = false;
    }
    if (!onboarded) {
      router.replace("/dashboard/welcome");
    }
  }, [isLoading, hasInvoices, router]);

  return <>{children}</>;
}
