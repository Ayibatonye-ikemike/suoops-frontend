"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Mail, MessageCircle, User, Image, Building2, CreditCard, Users } from "lucide-react";

import { apiClient } from "@/api/client";
import { getBankDetails } from "@/api/bank-details";
import type { components } from "@/api/types";
import { BankDetailsForm } from "@/features/settings/bank-details-form";
import { SubscriptionSection } from "@/features/settings/subscription-section";
import { TeamManagementSection } from "@/features/settings/team-management-section";
import { LogoUpload } from "@/features/settings/logo-upload";
import { PhoneNumberSection } from "@/features/settings/phone-number-section";
import { ProfileSection } from "@/features/settings/profile-section";
import { SetupProgress } from "@/features/settings/setup-progress";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { type PlanTier } from "@/constants/pricing";

type CurrentUser = components["schemas"]["UserOut"];

type TabKey = "profile" | "business" | "billing" | "team" | "advanced";

const TABS: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "profile", label: "Profile", icon: User },
  { key: "business", label: "Business", icon: Building2 },
  { key: "billing", label: "Billing & Plan", icon: CreditCard },
  { key: "team", label: "Team", icon: Users },
  { key: "advanced", label: "Advanced", icon: AlertTriangle },
];

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabKey>("profile");

  // Sync active tab with URL hash so deep-links keep working
  useEffect(() => {
    const map: Record<string, TabKey> = {
      profile: "profile",
      logo: "business",
      "bank-details": "business",
      "business-name": "business",
      subscription: "billing",
      team: "team",
    };
    const apply = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && map[hash]) setActiveTab(map[hash]);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const { data: user } = useQuery<CurrentUser>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get<CurrentUser>("/users/me");
      return response.data;
    },
    retry: false,
    staleTime: 60000,
  });

  const { data: bankDetails } = useQuery({
    queryKey: ["bankDetails"],
    queryFn: getBankDetails,
    retry: false,
    staleTime: 60000,
  });

  const hasPhone = Boolean(user?.phone);
  const phoneVerified = Boolean(user?.phone_verified);
  const hasBankDetails = Boolean(
    bankDetails && (bankDetails as { bank_name?: string })?.bank_name
  );

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10 text-brand-text">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-brand-text">Settings</h1>
          <p className="mt-1 text-sm text-brand-textMuted">
            Manage your account, billing, and business profile
          </p>
        </div>

        {/* Setup Progress */}
        <div className="mb-6 sm:mb-8">
          <SetupProgress
            userName={user?.name}
            phoneVerified={phoneVerified}
            hasPhone={hasPhone}
            hasLogo={Boolean(user?.logo_url)}
            hasBankDetails={hasBankDetails}
          />
        </div>

        {/* Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex min-w-max gap-1 rounded-xl border border-brand-border/60 bg-white p-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition sm:px-4 ${
                    isActive
                      ? "bg-brand-jade text-white shadow-sm"
                      : "text-brand-textMuted hover:bg-slate-100 hover:text-brand-text"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Profile Tab ─── */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <Card className={!phoneVerified ? "ring-2 ring-emerald-400 ring-offset-2" : ""}>
              <CardHeader className="border-b border-brand-border/60 px-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      phoneVerified
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-amber-100 text-amber-600"
                    }`}>
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-[22px] font-semibold text-brand-text">WhatsApp</h2>
                      <p className="text-xs text-brand-textMuted">
                        Create invoices by texting our bot — it&apos;s 10x faster
                      </p>
                    </div>
                  </div>
                  {phoneVerified ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Connected
                    </span>
                  ) : hasPhone ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Unverified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                      Not connected
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                <PhoneNumberSection
                  currentPhone={phoneVerified && user?.phone ? user.phone : null}
                  pendingPhone={!phoneVerified && hasPhone ? user?.phone : undefined}
                  onPhoneVerified={() => {
                    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
                  }}
                />
              </CardContent>
            </Card>

            <Card id="profile" className="scroll-mt-20">
              <CardHeader className="border-b border-brand-border/60 px-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-[22px] font-semibold text-brand-text">Profile</h2>
                    <p className="text-xs text-brand-textMuted">
                      Your name appears on invoices you send
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                <ProfileSection currentName={user?.name} />
                {user?.email && (
                  <div className="mt-4 pt-4 border-t border-brand-border/40">
                    <label className="block text-sm font-medium text-brand-textMuted mb-1">Email</label>
                    <p className="text-sm text-brand-text">{user.email}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ─── Business Tab ─── */}
        {activeTab === "business" && (
          <div className="space-y-6">
            <Card id="logo" className="scroll-mt-20">
              <CardHeader className="border-b border-brand-border/60 px-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                    <Image className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-[22px] font-semibold text-brand-text">Business Logo</h2>
                    <p className="text-xs text-brand-textMuted">
                      Shows on your invoices — customers trust branded invoices more
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                <LogoUpload />
              </CardContent>
            </Card>

            <Card id="bank-details" className="scroll-mt-20">
              <CardHeader className="border-b border-brand-border/60 px-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-[22px] font-semibold text-brand-text">Bank Account</h2>
                    <p className="text-xs text-brand-textMuted">
                      Your bank details appear on invoices so customers can pay you
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                <BankDetailsForm />
              </CardContent>
            </Card>
          </div>
        )}

        {/* ─── Billing Tab ─── */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            <SubscriptionSection user={user} />
          </div>
        )}

        {/* ─── Team Tab ─── */}
        {activeTab === "team" && (
          <div className="space-y-6">
            <TeamManagementSection userPlan={(user?.plan?.toUpperCase() || "FREE") as PlanTier} />
          </div>
        )}

        {/* ─── Advanced Tab ─── */}
        {activeTab === "advanced" && (
          <Card className="border border-rose-200/60">
            <CardHeader className="border-b border-rose-200/60 px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h2 className="text-lg sm:text-[22px] font-semibold text-brand-text">Delete Account</h2>
              </div>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-brand-textMuted">
                  To delete your account and all associated data, please contact our support team.
                  We&apos;ll verify your identity and process your request within 48 hours.
                </p>
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
        )}
      </div>
    </div>
  );
}
