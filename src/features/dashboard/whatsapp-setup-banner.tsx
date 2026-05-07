"use client";

import { useQuery } from "@tanstack/react-query";
import { MessageCircle, X, ArrowRight } from "lucide-react";
import { apiClient } from "@/api/client";
import type { components } from "@/api/types";
import { useState, useEffect } from "react";
import { WhatsAppVerificationModal } from "@/features/settings/whatsapp-verification-modal";
import { dismiss, isDismissed } from "@/lib/dismissals";

type CurrentUser = components["schemas"]["UserOut"];

const DISMISSED_KEY = "whatsapp-setup-banner-dismissed";

/**
 * Banner to prompt new users to verify their WhatsApp number.
 * Shows prominently at the top of the dashboard for users who haven't
 * verified their phone yet, making it clear they need to verify to
 * create invoices via WhatsApp.
 */
export function WhatsAppSetupBanner() {
  const [dismissed, setDismissed] = useState(true); // Start hidden to prevent flash
  const [showModal, setShowModal] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    setDismissed(isDismissed(DISMISSED_KEY));
  }, []);

  // Fetch current user to check if phone is verified
  const { data: user, isLoading } = useQuery<CurrentUser>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get<CurrentUser>("/users/me");
      return response.data;
    },
    staleTime: 60000,
  });

  const hasVerifiedPhone = user?.phone_verified && user?.phone;

  // Don't show if:
  // - Still loading
  // - User has verified phone
  // - User dismissed the banner
  if (isLoading || hasVerifiedPhone || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    dismiss(DISMISSED_KEY);
    setDismissed(true);
  };

  return (
    <>
      <WhatsAppVerificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
      <div className="mb-6 rounded-xl border-2 border-emerald-400 bg-gradient-to-r from-emerald-50 to-green-50 p-4 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-emerald-900">
              📱 Create invoices via WhatsApp!
            </h3>
            <p className="mt-1 text-sm text-emerald-700">
              Verify your WhatsApp number to create invoices by simply texting our bot.
              Just send: <span className="font-semibold">&quot;Invoice John 50k for design&quot;</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-700"
              >
                Verify WhatsApp Number
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={handleDismiss}
                className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800 hover:underline"
              >
                Remind me later
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="shrink-0 rounded-lg p-1 text-emerald-400 hover:bg-emerald-100 hover:text-emerald-600"
            aria-label="Dismiss"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );
}
