"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  ChevronDown,
  FileText,
  Gift,
  Landmark,
  LogOut,
  Package,
  Plus,
  Receipt,
  Settings as SettingsIcon,
  User as UserIcon,
} from "lucide-react";

import { useLogout } from "@/features/auth/use-auth-session";
import { apiClient } from "@/api/client";
import { components } from "@/api/types.generated";
import { hasPlanFeature, type PlanTier } from "@/constants/pricing";
import { useNewInvoiceDrawer } from "@/features/dashboard/new-invoice-provider";

type CurrentUser = components["schemas"]["UserOut"];

interface NavItem {
  href: string;
  label: string;
  Icon: typeof FileText;
  gate: "CASH_DASHBOARD" | "INVENTORY" | "TAX_REPORTS" | null;
}

const allNavItems: NavItem[] = [
  { href: "/dashboard", label: "Invoices", Icon: FileText, gate: null },
  { href: "/dashboard/analytics", label: "Insights", Icon: BarChart3, gate: "CASH_DASHBOARD" },
  { href: "/dashboard/inventory", label: "Inventory", Icon: Package, gate: "INVENTORY" },
  { href: "/dashboard/expenses", label: "Expenses", Icon: Receipt, gate: null },
  { href: "/dashboard/tax", label: "Tax", Icon: Landmark, gate: "TAX_REPORTS" },
  { href: "/dashboard/referrals", label: "Referrals", Icon: Gift, gate: null },
  { href: "/dashboard/settings", label: "Settings", Icon: SettingsIcon, gate: null },
];

export function DashboardNav() {
  const pathname = usePathname();
  const logout = useLogout();
  const newInvoice = useNewInvoiceDrawer();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { data: user } = useQuery<CurrentUser>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get<CurrentUser>("/users/me");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Close menu on outside click or Escape
  useEffect(() => {
    if (!menuOpen) return;
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Global ⌘N / Ctrl+N → open new invoice drawer (Mac & Windows users alike)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && (e.key === "n" || e.key === "N")) {
        e.preventDefault();
        newInvoice.open();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [newInvoice]);

  const initial = (user?.name || user?.email || "U").trim().charAt(0).toUpperCase();
  const currentPlan = (user?.plan?.toUpperCase() || "FREE") as PlanTier;

  // Filter nav items based on plan
  const navItems = allNavItems.filter((item) => {
    if (!item.gate) return true;
    return hasPlanFeature(currentPlan, item.gate);
  });

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="sticky top-0 z-30 border-b border-brand-teal/30 bg-brand-evergreen text-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand + desktop nav */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex shrink-0 items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-lg">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M9 12h6M9 16h6M9 8h6M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  stroke="#1e4d2b"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path d="M16 4v4M8 4v4" stroke="#2e7d4e" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight sm:text-xl">SuoOps</span>
          </Link>

          {/* Desktop tabs — hidden on small screens (mobile uses bottom bar) */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map(({ href, label, Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-brand-jade text-white shadow-sm"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right cluster: New Invoice + profile */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => newInvoice.open()}
            className="hidden items-center gap-1.5 rounded-lg bg-brand-jade px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-jadeHover sm:inline-flex"
            title="Create invoice (⌘N)"
          >
            <Plus className="h-4 w-4" />
            <span>New invoice</span>
          </button>
          {/* Mobile: icon-only "+" — full button lives in the bottom bar */}
          <button
            type="button"
            onClick={() => newInvoice.open()}
            aria-label="Create invoice"
            className="inline-flex items-center justify-center rounded-lg bg-brand-jade p-2 text-white shadow-sm transition hover:bg-brand-jadeHover sm:hidden"
          >
            <Plus className="h-5 w-5" />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-2 py-1 text-sm font-semibold text-white transition hover:bg-white/10 sm:px-2.5 sm:py-1.5"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-jade text-xs font-bold uppercase">
                {initial}
              </span>
              <span className="hidden max-w-[140px] truncate sm:inline">
                {user?.name || "Account"}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
            </button>
            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
              >
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {user?.name || "Your account"}
                  </p>
                  {user?.email && (
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                  )}
                </div>
                <Link
                  href="/dashboard/settings"
                  role="menuitem"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <UserIcon className="h-4 w-4 text-slate-500" />
                  Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  role="menuitem"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <SettingsIcon className="h-4 w-4 text-slate-500" />
                  Settings
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
