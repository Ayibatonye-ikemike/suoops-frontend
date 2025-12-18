"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { InvoiceDetailPanel } from "@/features/invoices/invoice-detail";

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;

  return (
    <main className="min-h-screen bg-brand-background">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {/* Header with back button */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-textMuted hover:text-brand-text transition"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
            Invoice Details
          </h1>
          <p className="mt-1 text-sm text-brand-mint">
            Review and manage this invoice
          </p>
        </div>

        {/* Invoice Detail - Full Width */}
        <InvoiceDetailPanel invoiceId={invoiceId} />
      </div>
    </main>
  );
}
