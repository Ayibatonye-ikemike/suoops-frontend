"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { initializeSubscription } from "@/api/subscription";
import { apiClient } from "@/api/client";

/**
 * Direct Pro upgrade page - for email campaigns and marketing links
 * URL: /dashboard/upgrade/pro
 * 
 * Automatically initiates Pro plan subscription payment
 */
export default function UpgradeToProPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // Fetch current user to check plan
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get("/users/me");
      return response.data;
    },
  });

  const initializeMutation = useMutation({
    mutationFn: () => initializeSubscription("PRO"),
    onSuccess: (data) => {
      // Redirect to Paystack checkout
      window.location.href = data.authorization_url;
    },
    onError: (err: unknown) => {
      const message = isAxiosError(err)
        ? err.response?.data?.detail || err.message
        : err instanceof Error
        ? err.message
        : "Failed to initialize payment";
      setError(message);
    },
  });

  // Auto-initiate payment once user is loaded
  useEffect(() => {
    if (userLoading || !user) return;

    // Already on Pro?
    if (user.plan?.toUpperCase() === "PRO") {
      router.replace("/dashboard/settings?already_pro=1");
      return;
    }

    // Initiate Pro subscription payment
    initializeMutation.mutate();
  }, [user, userLoading]);

  if (userLoading || initializeMutation.isPending) {
    return (
      <div className="min-h-screen bg-brand-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-brand-jade border-t-transparent" />
          <p className="mt-4 text-lg text-brand-text">Preparing your Pro upgrade...</p>
          <p className="mt-2 text-sm text-brand-textMuted">Redirecting to payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-background flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-brand-text mb-2">Upgrade Failed</h1>
          <p className="text-brand-textMuted mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => initializeMutation.mutate()}
              className="w-full bg-brand-jade text-white py-3 px-6 rounded-lg font-semibold hover:bg-brand-jade/90 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/dashboard/settings")}
              className="w-full bg-brand-background text-brand-text py-3 px-6 rounded-lg font-semibold hover:bg-brand-border transition-colors"
            >
              Go to Settings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
