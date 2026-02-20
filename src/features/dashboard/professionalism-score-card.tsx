"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfessionalismScore } from "@/api/analytics";
import { apiClient } from "@/api/client";
import { hasPlanFeature, type PlanTier } from "@/constants/pricing";

const CHECK_LABELS: Record<string, string> = {
  has_logo: "Business logo",
  has_bank_details: "Bank details",
  uses_due_dates: "Due dates on invoices",
  sends_receipts: "Receipts on payment",
  has_payment_instructions: "Payment instructions",
};

export function ProfessionalismScoreCard() {
  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get("/users/me");
      return response.data as { plan?: string };
    },
    staleTime: 5 * 60 * 1000,
  });

  const currentPlan = (user?.plan?.toUpperCase() || "FREE") as PlanTier;
  const hasAccess = hasPlanFeature(currentPlan, "PROFESSIONALISM_SCORE");

  const { data, isLoading, error } = useQuery({
    queryKey: ["professionalism-score"],
    queryFn: getProfessionalismScore,
    enabled: hasAccess,
  });

  // Don't show at all for non-PRO users (cash card already has upgrade CTA)
  if (!hasAccess) return null;

  if (isLoading) {
    return (
      <div className="h-36 animate-pulse rounded-lg bg-brand-background" />
    );
  }

  if (error || !data) return null;

  // Don't show if score is already perfect
  if (data.score === 100) return null;

  const ringPercent = data.score;
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (ringPercent / 100) * circumference;

  const levelColor =
    data.level === "Excellent"
      ? "text-emerald-500"
      : data.level === "Good"
        ? "text-blue-500"
        : data.level === "Fair"
          ? "text-amber-500"
          : "text-red-500";

  return (
    <div className="rounded-lg border border-brand-border bg-white p-4 shadow-card sm:p-5">
      <div className="flex items-start gap-4">
        {/* Score ring */}
        <div className="relative flex-shrink-0">
          <svg width="80" height="80" className="-rotate-90">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="#e5e7eb"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={levelColor}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-brand-dark">
              {data.score}
            </span>
          </div>
        </div>

        {/* Checklist */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-brand-dark">
            Professionalism Score
          </h3>
          <p className={`text-xs font-medium ${levelColor}`}>{data.level}</p>

          <ul className="mt-2 space-y-1">
            {Object.entries(data.checks).map(([key, passed]) => (
              <li key={key} className="flex items-center gap-1.5 text-xs">
                <span>{passed ? "✅" : "⬜"}</span>
                <span
                  className={
                    passed ? "text-brand-muted" : "text-brand-dark font-medium"
                  }
                >
                  {CHECK_LABELS[key] || key}
                </span>
              </li>
            ))}
          </ul>

          {data.tips.length > 0 && (
            <p className="mt-2 text-[11px] text-brand-accent leading-snug">
              💡 {data.tips[0]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
