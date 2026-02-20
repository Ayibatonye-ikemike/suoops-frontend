"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getCashPosition } from "@/api/analytics";
import { apiClient } from "@/api/client";
import { hasPlanFeature, type PlanTier } from "@/constants/pricing";

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}k`;
  return `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

export function CashPositionCard() {
  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get("/users/me");
      return response.data as { plan?: string };
    },
    staleTime: 5 * 60 * 1000,
  });

  const currentPlan = (user?.plan?.toUpperCase() || "FREE") as PlanTier;
  const hasAccess = hasPlanFeature(currentPlan, "CASH_DASHBOARD");

  const { data, isLoading, error } = useQuery({
    queryKey: ["cash-position"],
    queryFn: getCashPosition,
    refetchInterval: 60_000,
    enabled: hasAccess,
  });

  if (!hasAccess) {
    return (
      <div className="rounded-lg border border-brand-border bg-white p-4 shadow-card sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-brand-dark">
              💰 Cash Dashboard
            </h3>
            <p className="mt-1 text-xs text-brand-muted">
              See real-time cash flow, overdue invoices, and expected inflow — upgrade to Pro.
            </p>
          </div>
          <Link
            href="/dashboard/upgrade/pro"
            className="whitespace-nowrap rounded-lg bg-brand-jade px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-brand-teal"
          >
            Upgrade →
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-lg bg-brand-background"
          />
        ))}
      </div>
    );
  }

  if (error || !data) return null;

  const cards = [
    {
      label: "Cash In Today",
      value: formatMoney(data.cash_collected_today),
      sub: `This week: ${formatMoney(data.cash_collected_this_week)}`,
      icon: "💰",
      color: "text-emerald-400",
    },
    {
      label: "Outstanding",
      value: formatMoney(data.total_outstanding),
      sub: `${data.overdue_count} overdue`,
      icon: "⏳",
      color: data.total_outstanding > 0 ? "text-amber-400" : "text-emerald-400",
    },
    {
      label: "Overdue",
      value: formatMoney(data.total_overdue),
      sub: data.overdue_count > 0 ? "Send reminders →" : "All clear ✓",
      icon: "⚠️",
      color: data.total_overdue > 0 ? "text-red-400" : "text-emerald-400",
    },
    {
      label: "Expected (7 days)",
      value: formatMoney(data.expected_inflow_7_days),
      sub: `${data.invoices_created_today} invoices today`,
      icon: "📈",
      color: "text-blue-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-lg border border-brand-border bg-white p-3 shadow-card sm:p-4"
        >
          <div className="mb-1 flex items-center gap-1.5">
            <span className="text-lg">{card.icon}</span>
            <span className="text-[11px] font-medium text-brand-muted sm:text-xs">
              {card.label}
            </span>
          </div>
          <p className={`text-lg font-bold sm:text-xl ${card.color}`}>
            {card.value}
          </p>
          <p className="mt-0.5 text-[10px] text-brand-muted sm:text-xs">
            {card.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
