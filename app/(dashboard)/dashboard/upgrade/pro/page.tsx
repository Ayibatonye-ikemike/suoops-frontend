"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

/**
 * Direct Pro upgrade entry point - for email campaigns and marketing links.
 * URL: /dashboard/upgrade/pro
 *
 * Pro is now prepaid (no recurring subscription), so this routes to the
 * Pro Pack checkout: 20 invoices + 30 days of Pro features for ₦2,000.
 */
export default function UpgradeToProPage() {
  const router = useRouter();

  // Fetch current user to check plan
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get("/users/me");
      return response.data;
    },
  });

  useEffect(() => {
    if (userLoading) return;

    // Already on Pro?
    if (user?.plan?.toUpperCase() === "PRO") {
      router.replace("/dashboard/settings?already_pro=1");
      return;
    }

    // Prepaid model: route to the Pro Pack checkout (no recurring subscription).
    router.replace("/dashboard/billing/purchase?pack=pro_pack");
  }, [user, userLoading, router]);

  return (
    <div className="min-h-screen bg-brand-background flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-brand-jade border-t-transparent" />
        <p className="mt-4 text-lg text-brand-text">Preparing your Pro upgrade...</p>
        <p className="mt-2 text-sm text-brand-textMuted">Redirecting to checkout...</p>
      </div>
    </div>
  );
}
