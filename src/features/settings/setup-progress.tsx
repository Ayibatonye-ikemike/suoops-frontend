"use client";

import { CheckCircle2, Circle, MessageCircle, User, Image, Building2, CreditCard } from "lucide-react";

interface SetupStep {
  label: string;
  done: boolean;
  icon: React.ReactNode;
  href?: string;
}

interface SetupProgressProps {
  userName?: string | null;
  phoneVerified?: boolean;
  hasPhone?: boolean;
  hasLogo?: boolean;
  hasBankDetails?: boolean;
  hasOnlinePayments?: boolean;
}

export function SetupProgress({
  userName,
  phoneVerified,
  hasPhone,
  hasLogo,
  hasBankDetails,
  hasOnlinePayments,
}: SetupProgressProps) {
  const steps: SetupStep[] = [
    {
      label: "Add your name",
      done: Boolean(userName && userName.trim().length > 0),
      icon: <User className="h-4 w-4" />,
    },
    {
      label: "Connect WhatsApp",
      done: Boolean(phoneVerified && hasPhone),
      icon: <MessageCircle className="h-4 w-4" />,
    },
    {
      label: "Upload logo",
      done: Boolean(hasLogo),
      icon: <Image className="h-4 w-4" />,
    },
    {
      label: "Add bank details",
      done: Boolean(hasBankDetails),
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      label: "Get paid online",
      done: Boolean(hasOnlinePayments),
      icon: <CreditCard className="h-4 w-4" />,
      href: "/dashboard/settings#online-payments",
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const totalSteps = steps.length;
  const percentage = Math.round((completedCount / totalSteps) * 100);
  const allDone = completedCount === totalSteps;

  if (allDone) return null; // Don't show when setup is complete

  return (
    <div className="rounded-xl border border-brand-border bg-gradient-to-r from-brand-background to-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-brand-text">
            Complete your setup
          </h3>
          <p className="text-xs text-brand-textMuted mt-0.5">
            {completedCount} of {totalSteps} steps done — finish to look professional
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-brand-primary">{percentage}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full rounded-full bg-brand-border/40 mb-4">
        <div
          className="h-2 rounded-full bg-brand-primary transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Steps */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {steps.map((step) => (
          <div
            key={step.label}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition ${
              step.done
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {step.done ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            ) : (
              <Circle className="h-4 w-4 shrink-0 text-amber-400" />
            )}
            <span className="truncate">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
