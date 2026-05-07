import type { ReactNode } from "react";

import { RequireAuth } from "@/components/common/require-auth";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { MobileTabBar } from "@/components/dashboard/mobile-tab-bar";
import { NewInvoiceProvider } from "@/features/dashboard/new-invoice-provider";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <NewInvoiceProvider>
        <div className="min-h-screen bg-brand-evergreen">
          <DashboardNav />
          {children}
          <MobileTabBar />
        </div>
      </NewInvoiceProvider>
    </RequireAuth>
  );
}
