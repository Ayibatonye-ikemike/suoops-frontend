import { Suspense } from "react";
import { InvoiceCreateForm } from "@/features/invoices/invoice-create-form";
import { InvoiceList } from "@/features/invoices/invoice-list";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-surface via-brand-primary to-brand-surface">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 text-brand-accent">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-brand-accent/80">Create invoices and review activity</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-brand-accentMuted/60 bg-brand-accent/95 p-6 shadow-md shadow-brand-surface/40">
            <InvoiceCreateForm />
          </div>
          <div className="rounded-2xl border border-brand-accentMuted/60 bg-brand-accent/95 p-6 shadow-md shadow-brand-surface/40">
            <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-brand-accentMuted/60" />}>
              <InvoiceList />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
