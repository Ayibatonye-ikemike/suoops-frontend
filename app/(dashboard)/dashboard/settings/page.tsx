"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import type { components } from "@/api/types";
import { BankDetailsForm } from "@/features/settings/bank-details-form";
import { SubscriptionSection } from "@/features/settings/subscription-section";
import { LogoUpload } from "@/features/settings/logo-upload";
import { PhoneNumberSection } from "@/features/settings/phone-number-section";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

type CurrentUser = components["schemas"]["UserOut"];

export default function SettingsPage() {
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
    <div className="min-h-screen bg-brand-background">
      <div className="mx-auto max-w-4xl px-6 py-10 text-brand-text">
        <div className="mb-10">
          <h1>Settings</h1>
          <p className="mt-1 text-sm text-brand-textMuted">Manage your account</p>
        </div>

        <div className="mb-8">
          <SubscriptionSection user={user} />
        </div>

        <Card className="mb-8">
          <CardHeader className="border-b border-brand-border/60">
            <h2 className="text-[22px] font-semibold text-brand-text">WhatsApp</h2>
          </CardHeader>
          <CardContent className="pt-6">
            <PhoneNumberSection currentPhone={user?.phone_verified && user?.phone ? user.phone : null} />
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader className="border-b border-brand-border/60">
            <h2 className="text-[22px] font-semibold text-brand-text">Logo</h2>
          </CardHeader>
          <CardContent className="pt-6">
            <LogoUpload />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-brand-border/60">
            <h2 className="text-[22px] font-semibold text-brand-text">Bank Account</h2>
          </CardHeader>
          <CardContent className="pt-6">
            <BankDetailsForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
