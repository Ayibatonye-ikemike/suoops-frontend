"use client";

import { Suspense } from "react";
import { InvoiceCreateForm } from "@/features/invoices/invoice-create-form";
import { InvoiceListWithDetail } from "@/features/invoices/invoice-list-with-detail";
import { InvoiceStatusCard } from "@/features/invoices/invoice-status-card";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-brand-background">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl font-bold sm:text-2xl">Dashboard</h1>
          <p className="mt-1 text-xs text-brand-textMuted sm:text-sm">Create invoices and review activity</p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12">
            {/* Create Invoice - Left side (6 columns) */}
            <div className="lg:col-span-6">
              <div className="rounded-lg border border-brand-border bg-white p-4 shadow-card sm:p-6">
                <InvoiceCreateForm />
              </div>
            </div>

            {/* Invoice Status - Middle (3 columns) */}
            <div className="lg:col-span-3">
              <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-brand-background sm:h-64" />}>
                <InvoiceStatusCard />
              </Suspense>
            </div>

            {/* Invoice List - Right side (3 columns) */}
            <div className="lg:col-span-3">
              <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-brand-background sm:h-64" />}>
                <InvoiceListWithDetail />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
