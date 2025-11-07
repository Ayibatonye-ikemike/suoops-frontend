import { Suspense } from "react";
import { DevelopmentLevyTile } from "@/features/tax/development-levy-tile";

import { InvoiceCreateForm } from "@/features/invoices/invoice-create-form";
import { InvoiceList } from "@/features/invoices/invoice-list";

export default function DashboardPage() {
  return (
    <main className="p-8 space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100">
        <h1 className="mb-6 text-2xl font-semibold text-slate-900">Invoices</h1>
        <div className="grid gap-8 lg:grid-cols-2">
          <InvoiceCreateForm />
          <Suspense fallback={<p>Loading invoices...</p>}>
            <InvoiceList />
          </Suspense>
        </div>
      </section>
      <DevelopmentLevyTile />
    </main>
  );
}
