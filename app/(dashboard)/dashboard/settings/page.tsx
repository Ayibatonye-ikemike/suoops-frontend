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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="mt-1 text-slate-600">Manage your account</p>
        </div>

        {/* Subscription */}
        <div className="mb-6">
          <SubscriptionSection />
        </div>

        {/* WhatsApp */}
        <Card className="mb-6">
          <CardHeader className="border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">WhatsApp</h2>
          </CardHeader>
          <CardContent className="pt-6">
            <PhoneNumberSection currentPhone={user?.phone_verified && user?.phone ? user.phone : null} />
          </CardContent>
        </Card>

        {/* Logo */}
        <Card className="mb-6">
          <CardHeader className="border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Logo</h2>
          </CardHeader>
          <CardContent className="pt-6">
            <LogoUpload />
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card>
          <CardHeader className="border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Bank Account</h2>
          </CardHeader>
          <CardContent className="pt-6">
            <BankDetailsForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
