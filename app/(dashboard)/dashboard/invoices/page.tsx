"use client";

import { Suspense } from "react";
import { Plus } from "lucide-react";

import { InvoiceListWithDetail } from "@/features/invoices/invoice-list-with-detail";
import { PhoneRequiredGate } from "@/features/dashboard/phone-required-gate";
import { BankDetailsRequiredGate } from "@/features/dashboard/bank-details-required-gate";
import { useNewInvoiceDrawer } from "@/features/dashboard/new-invoice-provider";

function NewInvoiceButton() {
  const newInvoice = useNewInvoiceDrawer();
  return (
    <button
      type="button"
      onClick={() => newInvoice.open()}
      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primary/90"
    >
      <Plus className="h-4 w-4" />
      New invoice
    </button>
  );
}

/**
 * Dedicated Invoices page — a reliable, always-available list/detail view of
 * every invoice. Unlike the dashboard home it is NOT behind the new-user
 * onboarding redirect, so the "Invoices" nav tab always lands on the list.
 */
export default function InvoicesPage() {
  return (
    <PhoneRequiredGate>
      <BankDetailsRequiredGate>
        <main className="min-h-screen">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-brand-text sm:text-3xl">Invoices</h1>
                <p className="mt-1 text-xs text-brand-textMuted sm:text-sm">
                  Every invoice you&apos;ve created, with status and payment details.
                </p>
              </div>
              <NewInvoiceButton />
            </div>

            <Suspense
              fallback={<div className="h-48 animate-pulse rounded-lg bg-brand-background sm:h-64" />}
            >
              <InvoiceListWithDetail />
            </Suspense>
          </div>
        </main>
      </BankDetailsRequiredGate>
    </PhoneRequiredGate>
  );
}
