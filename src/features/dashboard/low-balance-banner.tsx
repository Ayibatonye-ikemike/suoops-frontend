"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, X, ShoppingCart } from "lucide-react";
import { apiClient } from "@/api/client";
import { components } from "@/api/types.generated";
import Link from "next/link";
import { useState, useEffect } from "react";

type CurrentUser = components["schemas"]["UserOut"];

const DISMISSED_KEY = "low-balance-banner-dismissed";
const DISMISS_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Banner to prompt users with low invoice balance to purchase more.
 * Shows when FREE users have 2 or fewer invoices remaining.
 * 
 * Conversion target: Get users to buy invoice packs or upgrade.
 */
export function LowBalanceBanner() {
  const [dismissed, setDismissed] = useState(true); // Start hidden to prevent flash

  // Check localStorage on mount
  useEffect(() => {
    const dismissedTime = localStorage.getItem(DISMISSED_KEY);
    if (dismissedTime) {
      const timeSinceDismiss = Date.now() - parseInt(dismissedTime, 10);
      setDismissed(timeSinceDismiss < DISMISS_DURATION);
    } else {
      setDismissed(false);
    }
  }, []);

  // Fetch current user to check invoice balance
  const { data: user, isLoading } = useQuery<CurrentUser>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get<CurrentUser>("/users/me");
      return response.data;
    },
    staleTime: 60000,
  });

  const invoiceBalance = user?.invoice_balance ?? 5;
  const plan = user?.plan?.toUpperCase() || "FREE";
  const isLowBalance = invoiceBalance <= 2 && invoiceBalance > 0;
  const isZeroBalance = invoiceBalance === 0;
  const isFreeOrStarter = plan === "FREE" || plan === "STARTER";

  // Don't show if:
  // - Still loading
  // - User has healthy balance (>2)
  // - User is PRO (gets monthly invoices)
  // - User dismissed the banner (within 24h)
  if (isLoading || (!isLowBalance && !isZeroBalance) || !isFreeOrStarter || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, Date.now().toString());
    setDismissed(true);
  };

  // Different messaging for zero vs low balance
  const isUrgent = isZeroBalance;
  const bgColor = isUrgent 
    ? "from-red-50 to-orange-50 border-red-400" 
    : "from-amber-50 to-yellow-50 border-amber-400";
  const iconBg = isUrgent ? "bg-red-500" : "bg-amber-500";

  return (
    <div className={`mb-6 rounded-xl border-2 ${bgColor} p-4 shadow-sm`}>
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${iconBg} text-white shadow-md`}>
          {isUrgent ? <AlertTriangle className="h-6 w-6" /> : <ShoppingCart className="h-6 w-6" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900">
                {isZeroBalance 
                  ? "No invoices remaining!" 
                  : `Only ${invoiceBalance} invoice${invoiceBalance === 1 ? '' : 's'} left!`
                }
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {isZeroBalance 
                  ? "Purchase more to continue creating invoices for your customers."
                  : "Running low? Stock up now so you never miss a sale."
                }
              </p>
            </div>
            {!isZeroBalance && (
              <button
                onClick={handleDismiss}
                className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Dismiss"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <div className="mt-3 flex flex-wrap gap-3">
            <Link
              href="/dashboard/billing/purchase"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-jade px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-brand-teal"
            >
              <ShoppingCart className="h-4 w-4" />
              Buy 100 for ₦2,500
            </Link>
            {plan === "FREE" && (
              <Link
                href="/dashboard/settings"
                className="inline-flex items-center gap-2 rounded-lg border border-brand-jade bg-white px-4 py-2 text-sm font-semibold text-brand-jade transition hover:bg-brand-jade/5"
              >
                Upgrade to Pro →
              </Link>
            )}
          </div>
          
          {isZeroBalance && (
            <p className="mt-2 text-xs text-gray-500">
              💡 Pro tip: Pro users get 100 invoices/month included!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
