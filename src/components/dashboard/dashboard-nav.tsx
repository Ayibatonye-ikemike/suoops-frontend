"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useLogout } from "@/features/auth/use-auth-session";
import { apiClient } from "@/api/client";
import { components } from "@/api/types.generated";
import { hasPlanFeature, type PlanTier } from "@/constants/pricing";

type CurrentUser = components["schemas"]["UserOut"];

const allNavItems = [
  { href: "/dashboard", label: "Invoices", icon: "📄", gate: null, tip: "Create & track payments" },
  { href: "/dashboard/analytics", label: "Insights", icon: "📊", gate: "CASH_DASHBOARD" as const, tip: "Revenue analytics" },
  { href: "/dashboard/inventory", label: "Inventory", icon: "📦", gate: "INVENTORY" as const, tip: "Manage products & stock" },
  { href: "/dashboard/expenses", label: "Expenses", icon: "💸", gate: null, tip: "Track your spending" },
  { href: "/dashboard/tax", label: "Tax", icon: "💼", gate: "TAX_REPORTS" as const, tip: "Generate tax reports" },
  { href: "/dashboard/referrals", label: "Referrals", icon: "🎁", gate: null, tip: "Earn free invoices" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️", gate: null, tip: "Business profile & account" },
];

export function DashboardNav() {
  const pathname = usePathname();
  const logout = useLogout();

  const { data: user } = useQuery<CurrentUser>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get<CurrentUser>("/users/me");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const currentPlan = (user?.plan?.toUpperCase() || "FREE") as PlanTier;

  // Filter nav items based on plan
  const navItems = allNavItems.filter((item) => {
    if (!item.gate) return true;
    return hasPlanFeature(currentPlan, item.gate);
  });

  return (
    <nav className="border-b border-brand-teal/30 bg-brand-evergreen text-white shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-2xl shadow-lg">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                <path d="M9 12h6M9 16h6M9 8h6M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="#1e4d2b" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 4v4M8 4v4" stroke="#2e7d4e" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-xl font-semibold tracking-tight sm:text-2xl">SuoOps</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  title={item.tip}
                  className={`group relative flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide transition sm:px-4 sm:text-sm ${
                    isActive
                      ? "bg-brand-jade text-white shadow-md"
                      : "text-white/80 hover:bg-brand-teal hover:text-white"
                  }`}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  <span>{item.label}</span>
                  {/* Tooltip */}
                  <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-brand-text px-2.5 py-1 text-[10px] font-normal normal-case tracking-normal text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    {item.tip}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full rounded-lg border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-brand-jade hover:border-brand-jade sm:w-auto sm:text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
