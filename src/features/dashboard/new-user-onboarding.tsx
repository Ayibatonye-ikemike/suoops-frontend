"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

interface InvoiceQuota {
  invoice_balance: number;
  total_invoices: number;
}

interface CurrentUser {
  id: number;
}

/**
 * localStorage key marking that a specific user has passed onboarding.
 * Scoped per user id so the flag is never shared across accounts on the same
 * device (a fresh signup must not inherit a previous user's "completed" flag).
 */
export function onboardingCompleteKey(userId: number): string {
  return `onboarding-complete:${userId}`;
}

/**
 * NewUserOnboarding — gate that redirects brand-new users (0 invoices, no
 * onboarding flag) to the standalone `/dashboard/welcome` pricing/onboarding
 * page so the dashboard itself never gets visually replaced by pricing.
 *
 * Once a user has either created an invoice or clicked through the welcome
 * screen (which sets the per-user `onboarding-complete` flag), this is a no-op.
 */
export function NewUserOnboarding({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { data: quota, isLoading: quotaLoading } = useQuery<InvoiceQuota>({
    queryKey: ["invoice-quota"],
    queryFn: async () => (await apiClient.get<InvoiceQuota>("/invoices/quota")).data,
    staleTime: 60_000,
  });

  const { data: user, isLoading: userLoading } = useQuery<CurrentUser>({
    queryKey: ["currentUser"],
    queryFn: async () => (await apiClient.get<CurrentUser>("/users/me")).data,
    staleTime: 5 * 60 * 1000,
  });

  const hasInvoices = !!quota && quota.total_invoices > 0;

  useEffect(() => {
    if (quotaLoading || userLoading) return;
    if (hasInvoices) return;
    if (!user) return;
    if (typeof window === "undefined") return;

    let onboarded = false;
    try {
      onboarded = localStorage.getItem(onboardingCompleteKey(user.id)) === "true";
    } catch {
      onboarded = false;
    }
    if (!onboarded) {
      router.replace("/dashboard/welcome");
    }
  }, [quotaLoading, userLoading, hasInvoices, user, router]);

  return <>{children}</>;
}
