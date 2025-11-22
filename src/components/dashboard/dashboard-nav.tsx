"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLogout } from "@/features/auth/use-auth-session";

const navItems = [
  { href: "/dashboard", label: "Invoices", icon: "📄" },
  { href: "/dashboard/tax", label: "Tax", icon: "💼" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

export function DashboardNav() {
  const pathname = usePathname();
  const logout = useLogout();

  return (
    <nav className="border-b border-brand-border bg-brand-primary text-white shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <span className="text-xl font-semibold tracking-tight sm:text-2xl">SuoOps</span>
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide transition sm:px-4 sm:text-sm ${
                    isActive
                      ? "bg-white text-brand-primary shadow-md"
                      : "text-white/80 hover:bg-brand-primaryHover/80 hover:text-white"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full rounded-lg border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white hover:text-brand-primary sm:w-auto sm:text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
