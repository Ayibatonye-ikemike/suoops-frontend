import { Suspense } from "react";
import { DevelopmentLevyTile } from "@/features/tax/development-levy-tile";
import { InvoiceCreateForm } from "@/features/invoices/invoice-create-form";
import { InvoiceList } from "@/features/invoices/invoice-list";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-slate-600">Manage your invoices</p>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-white border border-slate-200 p-6">
            <InvoiceCreateForm />
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-6">
            <Suspense fallback={<div className="animate-pulse h-64 bg-slate-100 rounded-lg" />}>
              <InvoiceList />
            </Suspense>
          </div>
        </div>

        {/* Development Levy Section */}
        <div className="mt-6">
          <DevelopmentLevyTile />
        </div>
      </div>
    </main>
  );
}
