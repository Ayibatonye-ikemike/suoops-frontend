"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AlertTriangle, Trash2 } from "lucide-react";

import { apiClient } from "@/api/client";
import type { components } from "@/api/types";
import { BankDetailsForm } from "@/features/settings/bank-details-form";
import { SubscriptionSection } from "@/features/settings/subscription-section";
import { TeamManagementSection } from "@/features/settings/team-management-section";
import { LogoUpload } from "@/features/settings/logo-upload";
import { PhoneNumberSection } from "@/features/settings/phone-number-section";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { type PlanTier } from "@/constants/pricing";
import { useAuthStore } from "@/features/auth/auth-store";

type CurrentUser = components["schemas"]["UserOut"];

export default function SettingsPage() {
  const router = useRouter();
  const clearTokens = useAuthStore((state) => state.clearTokens);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: user } = useQuery<CurrentUser>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get<CurrentUser>("/users/me");
      return response.data;
    },
    retry: false,
    staleTime: 60000,
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete("/users/me", {
        data: { confirmation: deleteConfirmation },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Your account has been permanently deleted.");
      clearTokens();
      router.replace("/");
    },
    onError: (error: Error & { response?: { data?: { detail?: string } } }) => {
      const message = error.response?.data?.detail || error.message || "Failed to delete account";
      toast.error(message);
    },
  });

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE MY ACCOUNT") {
      toast.error("Please type 'DELETE MY ACCOUNT' exactly to confirm.");
      return;
    }
    
    setIsDeleting(true);
    try {
      await deleteAccountMutation.mutateAsync();
    } finally {
      setIsDeleting(false);
    }
  };

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
              WhatsApp
            </h2>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            <PhoneNumberSection
              currentPhone={
                user?.phone_verified && user?.phone ? user.phone : null
              }
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
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            <BankDetailsForm />
          </CardContent>
        </Card>

        {/* Danger Zone - Account Deletion */}
        <Card className="mt-6 sm:mt-8 border-2 border-red-500/30 bg-red-950/20">
          <CardHeader className="border-b border-red-500/30 px-4 sm:px-6">
            <h2 className="flex items-center gap-2 text-lg sm:text-[22px] font-semibold text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </h2>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-red-400">Delete Account</h3>
                <p className="mt-1 text-sm text-red-300/80">
                  Permanently delete your account and all data including invoices, 
                  customers, inventory, and settings. This cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Delete Account
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl bg-brand-surface border border-brand-border p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-500">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-text">Delete Account</h3>
                <p className="text-sm text-brand-textMuted">This action is permanent</p>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-300">
                <p className="font-semibold">Warning: This will permanently delete:</p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-red-300/80">
                  <li>Your account and profile</li>
                  <li>All invoices and receipts</li>
                  <li>Customer records</li>
                  <li>Inventory and products</li>
                  <li>All business data</li>
                </ul>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-brand-text">
                  Type <span className="font-mono font-bold text-red-400">DELETE MY ACCOUNT</span> to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="DELETE MY ACCOUNT"
                  className="mt-2 w-full rounded-lg border border-brand-border bg-brand-bg px-4 py-2.5 text-sm text-brand-text placeholder-brand-textMuted focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation("");
                }}
                disabled={isDeleting}
                className="flex-1 rounded-lg border border-brand-border bg-brand-surface px-4 py-2.5 text-sm font-medium text-brand-text transition hover:bg-brand-bg disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== "DELETE MY ACCOUNT" || isDeleting}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete My Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
