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
    <div className="min-h-screen bg-gradient-to-br from-brand-surface via-brand-primary to-brand-surface">
      <div className="mx-auto max-w-4xl px-6 py-10 text-brand-accent">
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="mt-1 text-sm text-brand-accent/80">Manage your account</p>
        </div>

        <div className="mb-8">
          <SubscriptionSection />
        </div>

        <Card className="mb-8 bg-brand-accent/95 text-brand-primary shadow-md shadow-brand-surface/30">
          <CardHeader className="border-b border-brand-accentMuted/60">
            <h2 className="text-lg font-semibold">WhatsApp</h2>
          </CardHeader>
          <CardContent className="pt-6">
            <PhoneNumberSection currentPhone={user?.phone_verified && user?.phone ? user.phone : null} />
          </CardContent>
        </Card>

        <Card className="mb-8 bg-brand-accent/95 text-brand-primary shadow-md shadow-brand-surface/30">
          <CardHeader className="border-b border-brand-accentMuted/60">
            <h2 className="text-lg font-semibold">Logo</h2>
          </CardHeader>
          <CardContent className="pt-6">
            <LogoUpload />
          </CardContent>
        </Card>

        <Card className="bg-brand-accent/95 text-brand-primary shadow-md shadow-brand-surface/30">
          <CardHeader className="border-b border-brand-accentMuted/60">
            <h2 className="text-lg font-semibold">Bank Account</h2>
          </CardHeader>
          <CardContent className="pt-6">
            <BankDetailsForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
