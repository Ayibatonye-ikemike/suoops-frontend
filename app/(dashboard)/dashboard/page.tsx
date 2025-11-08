"use client";

import { Suspense } from "react";
import { InvoiceCreateForm } from "@/features/invoices/invoice-create-form";
import { InvoiceListWithDetail } from "@/features/invoices/invoice-list-with-detail";
import { InvoiceStatusCard } from "@/features/invoices/invoice-status-card";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-brand-background">
      <div className="mx-auto max-w-[1400px] px-6 py-10">
        <div className="mb-8">
          <h1>Dashboard</h1>
          <p className="mt-1 text-sm text-brand-textMuted">Create invoices and review activity</p>
        </div>

        <div className="space-y-6">
          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Create Invoice - Left side (6 columns) */}
            <div className="lg:col-span-6">
              <div className="rounded-lg border border-brand-border bg-white p-6 shadow-card">
                <InvoiceCreateForm />
              </div>
            </div>

            {/* Invoice Status - Middle (3 columns) */}
            <div className="lg:col-span-3">
              <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-brand-background" />}>
                <InvoiceStatusCard />
              </Suspense>
            </div>

            {/* Invoice List - Right side (3 columns) */}
            <div className="lg:col-span-3">
              <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-brand-background" />}>
                <InvoiceListWithDetail />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
