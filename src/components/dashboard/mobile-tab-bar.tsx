"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  FileText,
  Landmark,
  Menu as MenuIcon,
  MessageCircle,
  Package,
  Plus,
  Receipt,
  Settings as SettingsIcon,
  Store,
  TrendingUp,
  X,
} from "lucide-react";

import { apiClient } from "@/api/client";
import { components } from "@/api/types.generated";
import { useNewInvoiceDrawer } from "@/features/dashboard/new-invoice-provider";
import { WhatsAppQuickCreate } from "@/features/dashboard/whatsapp-quick-create";

type CurrentUser = components["schemas"]["UserOut"];

interface TabItem {
  href: string;
  label: string;
  Icon: typeof FileText;
  gate: "CASH_DASHBOARD" | "INVENTORY" | "TAX_REPORTS" | "INFLUENCER" | null;
}

const PRIMARY_TABS: TabItem[] = [
  { href: "/dashboard/invoices", label: "Invoices", Icon: FileText, gate: null },
  { href: "/dashboard/inventory", label: "Inventory", Icon: Package, gate: "INVENTORY" },
  { href: "/dashboard/expenses", label: "Expenses", Icon: Receipt, gate: null },
  { href: "/dashboard/settings#business", label: "Business", Icon: Store, gate: null },
];

const MORE_TABS: TabItem[] = [
  { href: "/dashboard/analytics", label: "Insights", Icon: BarChart3, gate: "CASH_DASHBOARD" },
  { href: "/dashboard/tax", label: "Tax", Icon: Landmark, gate: "TAX_REPORTS" },
  { href: "/dashboard/earnings", label: "Earnings", Icon: TrendingUp, gate: "INFLUENCER" },
  { href: "/dashboard/settings", label: "Settings", Icon: SettingsIcon, gate: null },
];

/**
 * Mobile-only bottom tab bar.
 *
 * Phones are the dominant device for our SMB users, so we mirror the
 * top-down navigation pattern they already use in WhatsApp / banking apps:
 * a fixed bar pinned to the bottom with the four most-used destinations,
 * a centered "+" action, and a "More" sheet that catches the long tail.
 */
export function MobileTabBar() {
  const pathname = usePathname();
  const newInvoice = useNewInvoiceDrawer();
  const [moreOpen, setMoreOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const { data: user } = useQuery<CurrentUser>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get<CurrentUser>("/users/me");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const tabsToShow = PRIMARY_TABS.filter(
    (t) => t.gate !== "INFLUENCER" || Boolean(user?.is_influencer),
  );

  const moreTabsToShow = MORE_TABS.filter(
    (t) => t.gate !== "INFLUENCER" || Boolean(user?.is_influencer),
  );

  const isActive = (href: string) => {
    const base = href.split("#")[0];
    return base === "/dashboard" ? pathname === base : pathname.startsWith(base);
  };

  // Render only on small screens
  return (
    <>
      {/* Spacer so floating bar doesn't cover content */}
      <div aria-hidden className="h-20 md:hidden" />

      <nav
        aria-label="Primary"
        className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur shadow-[0_-4px_16px_rgba(15,118,110,0.08)] md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="grid grid-cols-5 items-end">
          {tabsToShow.slice(0, 2).map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-medium transition ${
                    active ? "text-brand-jade" : "text-slate-500"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? "text-brand-jade" : ""}`} />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}

          {/* Centered "+" action */}
          <li>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              aria-label="Create invoice"
              className="-mt-6 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-jade text-white shadow-lg ring-4 ring-white transition active:scale-95"
            >
              <Plus className="h-6 w-6" />
            </button>
          </li>

          {tabsToShow.slice(2, 4).map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-medium transition ${
                    active ? "text-brand-jade" : "text-slate-500"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? "text-brand-jade" : ""}`} />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}

          {/* Replace the 5th slot only when we have a Tax/Insights overflow */}
          {tabsToShow.length < 4 && (
            <li>
              <button
                type="button"
                onClick={() => setMoreOpen(true)}
                className="flex w-full flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-medium text-slate-500"
              >
                <MenuIcon className="h-5 w-5" />
                <span>More</span>
              </button>
            </li>
          )}
        </ul>

        {/* Always-available "More" launcher in the corner of the bar */}
        {tabsToShow.length >= 4 && (
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            aria-label="More"
            className="absolute right-3 top-2 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600 shadow-sm"
          >
            <MenuIcon className="h-3.5 w-3.5" /> More
          </button>
        )}
      </nav>

      {/* "More" sheet */}
      {moreOpen && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMoreOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">More</p>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                aria-label="Close"
                className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="grid grid-cols-3 gap-3">
              {moreTabsToShow.map(({ href, label, Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMoreOpen(false)}
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-700 transition active:bg-slate-50"
                  >
                    <Icon className="h-5 w-5 text-brand-jade" />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Create-invoice chooser sheet — WhatsApp first, web form second */}
      {createOpen && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close create menu"
            onClick={() => setCreateOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Create invoice</p>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                aria-label="Close"
                className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2">
              <WhatsAppQuickCreate>
                {({ onClick, href, target, rel }) => {
                  const inner = (
                    <>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white">
                        <MessageCircle className="h-5 w-5" />
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-semibold text-slate-900">
                          Create on WhatsApp
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-500">
                          Recommended — text the bot, done in seconds
                        </span>
                      </span>
                    </>
                  );
                  const cls =
                    "flex w-full items-center gap-3 rounded-xl border-2 border-emerald-300 bg-emerald-50 p-3 text-left transition active:bg-emerald-100";
                  return href ? (
                    <a
                      href={href}
                      target={target}
                      rel={rel}
                      onClick={() => setCreateOpen(false)}
                      className={cls}
                    >
                      {inner}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        onClick();
                        setCreateOpen(false);
                      }}
                      className={cls}
                    >
                      {inner}
                    </button>
                  );
                }}
              </WhatsAppQuickCreate>
              <button
                type="button"
                onClick={() => {
                  setCreateOpen(false);
                  newInvoice.open();
                }}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition active:bg-slate-50"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <Plus className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-slate-900">
                    Use the web form
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    Fill in customer details by hand
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

