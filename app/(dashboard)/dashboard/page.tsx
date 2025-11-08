import { Suspense } from "react";
import { InvoiceCreateForm } from "@/features/invoices/invoice-create-form";
import { InvoiceList } from "@/features/invoices/invoice-list";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-brand-background">
      <div className="mx-auto max-w-[1400px] px-6 py-10">
        <div className="mb-8">
          <h1>Dashboard</h1>
          <p className="mt-1 text-sm text-brand-textMuted">Create invoices and review activity</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Create Invoice - Left side (6 columns on desktop) */}
          <div className="lg:col-span-6">
            <div className="rounded-xl border border-brand-border bg-white p-6 shadow-sm">
              <InvoiceCreateForm />
            </div>
          </div>

          {/* Invoice List & Details - Right side (6 columns on desktop) */}
          <div className="lg:col-span-6">
            <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-brand-background" />}>
              <InvoiceList />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
