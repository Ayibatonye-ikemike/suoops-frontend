"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getProfessionalismScore } from "@/api/analytics";

const CHECK_LABELS: Record<string, string> = {
  has_business_name: "Business name",
  has_logo: "Business logo",
  has_bank_details: "Bank details & payment info",
  uses_due_dates: "Due dates on invoices",
  sends_receipts: "Receipts on payment",
  has_inventory: "Products in your catalog",
  has_online_payments: "Online payments enabled",
  has_storefront: "Public storefront live",
};

const CHECK_LINKS: Record<string, string> = {
  has_business_name: "/dashboard/settings#profile",
  has_logo: "/dashboard/settings#logo",
  has_bank_details: "/dashboard/settings#bank-details",
  uses_due_dates: "/dashboard/invoices",
  sends_receipts: "/dashboard/invoices",
  has_inventory: "/dashboard/inventory",
  has_online_payments: "/dashboard/settings#bank-details",
  has_storefront: "/dashboard/settings#bank-details",
};

export function ProfessionalismScoreCard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["professionalism-score"],
    queryFn: getProfessionalismScore,
  });

  if (isLoading) {
    return (
      <div className="h-36 animate-pulse rounded-lg bg-brand-background" />
    );
  }

  if (error || !data) return null;

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

  // Perfect score — show a compact celebration instead of hiding
  if (data.score === 100) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 shadow-card sm:p-5">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          <div>
            <h3 className="text-sm font-semibold text-emerald-800">
              Perfect Professionalism Score!
            </h3>
            <p className="text-xs text-emerald-600">
              Your invoices look fully professional — great job.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
            {Object.entries(data.checks).map(([key, passed]) => {
              const label = CHECK_LABELS[key] || key;
              const link = CHECK_LINKS[key];

              if (passed) {
                return (
                  <li key={key} className="flex items-center gap-1.5 text-xs">
                    <span>✅</span>
                    <span className="text-brand-muted">{label}</span>
                  </li>
                );
              }

              return (
                <li key={key} className="flex items-center gap-1.5 text-xs">
                  <span>⬜</span>
                  {link ? (
                    <Link
                      href={link}
                      className="text-brand-dark font-medium underline decoration-brand-accent/40 underline-offset-2 hover:text-brand-accent transition-colors"
                    >
                      {label} →
                    </Link>
                  ) : (
                    <span className="text-brand-dark font-medium">{label}</span>
                  )}
                </li>
              );
            })}
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
