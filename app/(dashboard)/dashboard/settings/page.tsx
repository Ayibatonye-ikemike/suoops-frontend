"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AlertTriangle, Mail } from "lucide-react";

import { apiClient } from "@/api/client";
import type { components } from "@/api/types";
import { BankDetailsForm } from "@/features/settings/bank-details-form";
import { SubscriptionSection } from "@/features/settings/subscription-section";
import { TeamManagementSection } from "@/features/settings/team-management-section";
import { LogoUpload } from "@/features/settings/logo-upload";
import { PhoneNumberSection } from "@/features/settings/phone-number-section";
import { ProfileSection } from "@/features/settings/profile-section";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { type PlanTier } from "@/constants/pricing";
import { useAuthStore } from "@/features/auth/auth-store";

type CurrentUser = components["schemas"]["UserOut"];

export default function SettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearTokens = useAuthStore((state) => state.clearTokens);

  const { data: user } = useQuery<CurrentUser>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get<CurrentUser>("/users/me");
      return response.data;
    },
    retry: false,
    staleTime: 60000,
  });

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10 text-brand-text">
        <div className="mb-6 sm:mb-10">
          <h1 className="text-2xl font-bold text-brand-text">
            Settings
          </h1>
          <p className="mt-1 text-sm text-brand-textMuted">
            Manage your account
          </p>
        </div>

        <div className="mb-6 sm:mb-8">
          <SubscriptionSection user={user} />
        </div>

        <div className="mb-6 sm:mb-8">
          <TeamManagementSection userPlan={(user?.plan?.toUpperCase() || "FREE") as PlanTier} />
        </div>

        <Card className="mb-6 sm:mb-8">
          <CardHeader className="border-b border-brand-border/60 px-4 sm:px-6">
            <h2 className="text-lg sm:text-[22px] font-semibold text-brand-text">
              Profile
            </h2>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            <ProfileSection currentName={user?.name} />
          </CardContent>
        </Card>

        <Card className="mb-6 sm:mb-8">
          <CardHeader className="border-b border-brand-border/60 px-4 sm:px-6">
            <h2 className="text-lg sm:text-[22px] font-semibold text-brand-text">
              WhatsApp
            </h2>
            <p className="mt-1 text-xs text-brand-textMuted">
              This is where Suoops works best. You&apos;ll receive payment updates here.
            </p>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            <PhoneNumberSection
              currentPhone={
                user?.phone_verified && user?.phone ? user.phone : null
              }
              onPhoneVerified={() => {
                // Refetch user data to persist verified state
                queryClient.invalidateQueries({ queryKey: ["currentUser"] });
              }}
            />
          </CardContent>
        </Card>

        <Card className="mb-6 sm:mb-8">
          <CardHeader className="border-b border-brand-border/60 px-4 sm:px-6">
            <h2 className="text-lg sm:text-[22px] font-semibold text-brand-text">
              Logo
            </h2>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            <LogoUpload />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-brand-border/60 px-4 sm:px-6">
            <h2 className="text-lg sm:text-[22px] font-semibold text-brand-text">
              Bank Account
            </h2>
            <p className="mt-1 text-xs text-brand-textMuted">
              Your bank stays yours. We just help customers pay you faster.
            </p>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            <BankDetailsForm />
          </CardContent>
        </Card>

        {/* Account Deletion - Contact Support */}
        <Card className="mt-6 sm:mt-8 border border-brand-border/60">
          <CardHeader className="border-b border-brand-border/60 px-4 sm:px-6">
            <h2 className="flex items-center gap-2 text-lg sm:text-[22px] font-semibold text-brand-text">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Delete Account
            </h2>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-brand-textMuted">
                  To delete your account and all associated data, please contact our support team. 
                  We&apos;ll verify your identity and process your request within 48 hours.
                </p>
              </div>
              <a
                href="mailto:support@suoops.com?subject=Account Deletion Request"
                className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-primary/90"
              >
                <Mail className="h-4 w-4" />
                Contact Support
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
