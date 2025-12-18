"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { apiClient } from "@/api/client";
import type { components } from "@/api/types";
import { hasPlanFeature, type PlanTier } from "@/constants/pricing";

type CurrentUser = components["schemas"]["UserOut"];

export function OcrPhotoPrompt() {
  // Fetch current user to check plan
  const { data: user } = useQuery<CurrentUser>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get<CurrentUser>("/users/me");
      return response.data;
    },
    staleTime: 60000,
  });

  const userPlan = (user?.plan?.toUpperCase() || "FREE") as PlanTier;
  const hasOcrAccess = hasPlanFeature(userPlan, "PHOTO_OCR");

  // User has OCR access - show normal prompt
  if (hasOcrAccess) {
    return (
      <div className="rounded-2xl border border-brand-jade/20 bg-brand-jade/5 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📸</span>
              <h3 className="text-base font-semibold text-brand-jade">
                Create from Photo
              </h3>
            </div>
            <p className="mt-1 text-sm text-brand-textMuted">
              Take a photo of a receipt and AI will extract the details
              automatically
            </p>
          </div>
          <Link
            href="/dashboard/invoices/create-from-photo"
            className="whitespace-nowrap rounded-lg bg-brand-jade px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-jadeHover"
          >
            Upload Photo
          </Link>
        </div>
      </div>
    );
  }

  // User doesn't have OCR access - show locked prompt (clicking goes to gated page)
  return (
    <Link href="/dashboard/invoices/create-from-photo">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20 p-4 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 transition">
        <div className="flex items-center gap-2">
          <span className="text-xl">📸</span>
          <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-400">
            Create from Photo
          </h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-800 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
            <Lock className="h-3 w-3" />
            Business
          </span>
        </div>
      </div>
    </Link>
  );
}

