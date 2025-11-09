"use client";

import { useState } from "react";
import { isAxiosError } from "axios";

import { Button } from "@/components/ui/button";

import { useCreateInvoice, type InvoiceLineInput } from "./use-create-invoice";
import { useInvoiceQuota } from "./use-invoice-quota";
import { parseFeatureGateError } from "@/lib/feature-gate";
import { PlanSelectionModal } from "../settings/plan-selection-modal";

type LineDraft = InvoiceLineInput & { id: string };

const makeId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 9);
};

const emptyLine = (): LineDraft => ({ id: makeId(), description: "", quantity: 1, unit_price: 0 });

export function InvoiceCreateForm() {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [lines, setLines] = useState<LineDraft[]>([emptyLine()]);
  const [lastPdfUrl, setLastPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [quotaError, setQuotaError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string>("FREE");
  const [upgradeUrl, setUpgradeUrl] = useState<string | null>(null);

  const mutation = useCreateInvoice();
  const { data: quota, isLoading: quotaLoading, isError: quotaErrorState } = useInvoiceQuota();

  function updateLine(id: string, patch: Partial<LineDraft>) {
    setLines((current) => current.map((line) => (line.id === id ? { ...line, ...patch } : line)));
  }

  function removeLine(id: string) {
    setLines((current) => (current.length === 1 ? current : current.filter((line) => line.id !== id)));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLastPdfUrl(null);
    const parsedAmount = Number(amount);
    if (!customerName || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Customer name and a positive amount are required.");
      return;
    }
    const preparedLines = lines
      .filter((line) => line.description.trim())
      .map<InvoiceLineInput>((line) => ({
        description: line.description.trim(),
        quantity: Number(line.quantity) || 1,
        unit_price: Number(line.unit_price) || 0,
      }));

    try {
      const invoice = await mutation.mutateAsync({
        customer_name: customerName,
        customer_phone: customerPhone || undefined,
        customer_email: customerEmail || undefined,
        amount: parsedAmount,
        lines: preparedLines.length > 0 ? preparedLines : [{ description: "Item", quantity: 1, unit_price: parsedAmount }],
      });
      setLastPdfUrl(invoice.pdf_url ?? null);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      setAmount("");
      setLines([emptyLine()]);
    } catch (submitError) {
      console.error(submitError);

      // Robust handling for structured feature gate errors (403)
      const gate = parseFeatureGateError(submitError);
      if (gate?.type === "invoice_limit") {
        const composed = [
          gate.message,
          gate.currentCount != null && gate.limit != null ? `You have used ${gate.currentCount} of ${gate.limit}.` : null,
          "Upgrade now to unlock more invoices and premium automation."
        ].filter(Boolean).join(" ");
        setQuotaError(composed);
        setCurrentPlan(gate.currentPlan || currentPlan);
        setUpgradeUrl(gate.upgradeUrl || "/dashboard/upgrade");
        setShowUpgradeModal(true);
        return;
      }

      // Fallback generic error
      setError("Failed to create invoice. Check inputs and try again.");
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <h2 className="text-[22px] font-semibold text-brand-text">Create Invoice</h2>
        <p className="text-sm text-brand-textMuted">Set customer details and line items to generate a payment-ready invoice.</p>
      </div>
      
      {/* OCR Photo Upload Option */}
      <div className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📸</span>
              <h3 className="text-base font-semibold text-brand-primary">Create from Photo</h3>
            </div>
            <p className="mt-1 text-sm text-brand-textMuted">
              Take a photo of a receipt and AI will extract the details automatically
            </p>
          </div>
          <a
            href="/dashboard/invoices/create-from-photo"
            className="whitespace-nowrap rounded-lg bg-brand-primary px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-primaryHover"
          >
            Upload Photo
          </a>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-semibold text-brand-text">
          Customer name
          <input
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            required
            className="rounded-lg border border-brand-border bg-white px-3 py-2 text-base font-normal text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-brand-text">
          Customer phone
          <input
            value={customerPhone}
            onChange={(event) => setCustomerPhone(event.target.value)}
            placeholder="Optional (e.g., +2348012345678)"
            className="rounded-lg border border-brand-border bg-white px-3 py-2 text-base font-normal text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-brand-text">
          Customer email
          <input
            type="email"
            value={customerEmail}
            onChange={(event) => setCustomerEmail(event.target.value)}
            placeholder="Optional (e.g., customer@example.com)"
            className="rounded-lg border border-brand-border bg-white px-3 py-2 text-base font-normal text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-brand-text">
          Total amount
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            type="number"
            min="0"
            step="0.01"
            required
            className="w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-base font-normal text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
          />
        </label>
      </div>
      <section className="rounded-lg border border-brand-border bg-white p-6 shadow-card">
        <header className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-brand-text">Line items</h3>
          <Button type="button" size="sm" onClick={() => setLines((current) => [...current, emptyLine()])}>
            Add line
          </Button>
        </header>
        <div className="space-y-3">
          {lines.map((line) => (
            <div key={line.id} className="grid gap-3 md:grid-cols-[2fr_repeat(2,_minmax(120px,_1fr))_auto]">
              <input
                value={line.description}
                onChange={(event) => updateLine(line.id, { description: event.target.value })}
                placeholder="Description"
                className="rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
              />
              <input
                type="number"
                min="1"
                value={line.quantity}
                onChange={(event) => updateLine(line.id, { quantity: Number(event.target.value) })}
                className="rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={line.unit_price}
                onChange={(event) => updateLine(line.id, { unit_price: Number(event.target.value) })}
                className="rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
              />
              <button
                type="button"
                onClick={() => removeLine(line.id)}
                disabled={lines.length === 1}
                className="justify-self-start text-sm font-semibold text-brand-text transition hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>
      <Button
        type="submit"
        disabled={mutation.isPending || quotaLoading || (quota && !quota.can_create)}
        className="w-fit"
      >
        {mutation.isPending ? "Creating…" : quota && !quota.can_create ? "Limit Reached" : "Create Invoice"}
      </Button>
      {quota && quota.limit !== null && (
        <p className="text-xs text-brand-textMuted">
          {quota.current_count}/{quota.limit} invoices used this month • Plan: {quota.current_plan}
        </p>
      )}
      {quotaErrorState && (
        <p className="text-xs text-rose-600">Failed to load quota info</p>
      )}
      {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p> : null}
      {quotaError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">⚠️ Invoice Limit Reached</p>
          <p className="mt-1 text-sm text-amber-800 whitespace-pre-line">{quotaError}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button type="button" onClick={() => setShowUpgradeModal(true)} variant="secondary">
              View Plans
            </Button>
            {upgradeUrl && (
              <a
                href={upgradeUrl}
                className="inline-flex items-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-700 transition"
              >
                Upgrade Now
              </a>
            )}
          </div>
        </div>
      ) : null}
      {lastPdfUrl ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Invoice ready. {""}
          <a href={lastPdfUrl} target="_blank" rel="noreferrer" className="underline">
            View PDF
          </a>
        </p>
      ) : null}
      
      {/* Upgrade Modal */}
      <PlanSelectionModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPlan={currentPlan}
      />
    </form>
  );
}