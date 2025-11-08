import type { ReactNode } from "react";

import { RequireAuth } from "@/components/common/require-auth";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-brand-background">
        <DashboardNav />
        {children}
      </div>
    </RequireAuth>
  );
}
