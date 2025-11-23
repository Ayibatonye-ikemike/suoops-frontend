"use client";

import { useState, useRef } from "react";

import { Button } from "@/components/ui/button";

import { useCreateInvoice, type InvoiceLineInput, type InvoiceCreatePayload } from "./use-create-invoice";
import { useInvoiceQuota } from "./use-invoice-quota";
import { parseFeatureGateError } from "@/lib/feature-gate";
import { PlanSelectionModal } from "../settings/plan-selection-modal";
import { apiClient } from "@/api/client";

type LineDraft = InvoiceLineInput & { id: string };

const makeId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 9);
};

const emptyLine = (): LineDraft => ({ id: makeId(), description: "", quantity: 1, unit_price: 0 });

export function InvoiceCreateForm() {
  const [invoiceType, setInvoiceType] = useState<"revenue" | "expense">("revenue");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [lines, setLines] = useState<LineDraft[]>([emptyLine()]);
  
  // Expense-specific fields
  const [vendorName, setVendorName] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  async function handleReceiptUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/bmp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Please upload JPEG, PNG, WebP, BMP, or PDF.");
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File too large. Maximum size is 10MB.");
      return;
    }

    setUploadingReceipt(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post("/invoices/upload-receipt", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setReceiptUrl(response.data.receipt_url);
      setReceiptFileName(response.data.filename);
    } catch (err) {
      console.error("Receipt upload failed:", err);
      setError("Failed to upload receipt. Please try again.");
    } finally {
      setUploadingReceipt(false);
    }
  }

  function handleRemoveReceipt() {
    setReceiptUrl(null);
    setReceiptFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLastPdfUrl(null);
    const parsedAmount = Number(amount);
    
    if (invoiceType === "revenue") {
      // Revenue validation
      if (!customerName || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
        setError("Customer name and a positive amount are required.");
        return;
      }
    } else {
      // Expense validation
      if (!vendorName || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
        setError("Vendor name and a positive amount are required.");
        return;
      }
    }
    
    const preparedLines = lines
      .filter((line) => line.description.trim())
      .map<InvoiceLineInput>((line) => ({
        description: line.description.trim(),
        quantity: Number(line.quantity) || 1,
        unit_price: Number(line.unit_price) || 0,
      }));

    try {
      const payload: InvoiceCreatePayload = {
        invoice_type: invoiceType,
        amount: parsedAmount,
        lines: preparedLines.length > 0 ? preparedLines : [{ description: "Item", quantity: 1, unit_price: parsedAmount }],
      };
      
      if (invoiceType === "revenue") {
        payload.customer_name = customerName;
        payload.customer_phone = customerPhone || undefined;
        payload.customer_email = customerEmail || undefined;
      } else {
        payload.vendor_name = vendorName;
        payload.category = category || undefined;
        payload.notes = notes || undefined;
        payload.receipt_url = receiptUrl || undefined;
      }
      
      const invoice = await mutation.mutateAsync(payload);
      setLastPdfUrl(invoice.pdf_url ?? null);
      
      // Reset form
      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      setVendorName("");
      setCategory("");
      setNotes("");
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
      setError(`Failed to create ${invoiceType} invoice. Check inputs and try again.`);
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <h2 className="text-[22px] font-semibold text-brand-text">Create Invoice</h2>
        <p className="text-sm text-brand-textMuted">
          {invoiceType === "revenue" 
            ? "Set customer details and line items to generate a payment-ready invoice." 
            : "Record business expenses for accurate tax reporting."}
        </p>
      </div>
      
      {/* Invoice Type Toggle */}
      <div className="flex gap-2 rounded-lg border border-brand-border bg-brand-background p-1">
        <button
          type="button"
          onClick={() => setInvoiceType("revenue")}
          className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold uppercase tracking-wide transition ${
            invoiceType === "revenue"
              ? "bg-brand-jade text-white shadow"
              : "text-brand-textMuted hover:text-brand-text"
          }`}
        >
          💰 Revenue
        </button>
        <button
          type="button"
          onClick={() => setInvoiceType("expense")}
          className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold uppercase tracking-wide transition ${
            invoiceType === "expense"
              ? "bg-brand-jade text-white shadow"
              : "text-brand-textMuted hover:text-brand-text"
          }`}
        >
          💸 Expense
        </button>
      </div>
      
      {/* OCR Photo Upload Option - Only for Revenue */}
      {invoiceType === "revenue" && (
        <div className="rounded-2xl border border-brand-jade/20 bg-brand-jade/5 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📸</span>
                <h3 className="text-base font-semibold text-brand-jade">Create from Photo</h3>
              </div>
              <p className="mt-1 text-sm text-brand-textMuted">
                Take a photo of a receipt and AI will extract the details automatically
              </p>
            </div>
            <a
              href="/dashboard/invoices/create-from-photo"
              className="whitespace-nowrap rounded-lg bg-brand-jade px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-jadeHover"
            >
              Upload Photo
            </a>
          </div>
        </div>
      )}
      
      {/* Conditional Form Fields */}
      {invoiceType === "revenue" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-semibold text-brand-text sm:col-span-2 md:col-span-1">
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
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-semibold text-brand-text sm:col-span-2 md:col-span-1">
            Vendor name
            <input
              value={vendorName}
              onChange={(event) => setVendorName(event.target.value)}
              required
              placeholder="e.g., Office Depot, MTN"
              className="rounded-lg border border-brand-border bg-white px-3 py-2 text-base font-normal text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-brand-text">
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-lg border border-brand-border bg-white px-3 py-2 text-base font-normal text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
            >
              <option value="">Select category</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Rent">Rent</option>
              <option value="Utilities">Utilities</option>
              <option value="Marketing">Marketing</option>
              <option value="Transportation">Transportation</option>
              <option value="Professional Fees">Professional Fees</option>
              <option value="Equipment">Equipment</option>
              <option value="Other">Other</option>
            </select>
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
          <label className="flex flex-col gap-2 text-sm font-semibold text-brand-text sm:col-span-2">
            Notes (optional)
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Additional details about this expense..."
              rows={2}
              className="w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-base font-normal text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
            />
          </label>

          {/* Receipt Upload */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-brand-text mb-2">
              Receipt / Proof of Purchase
            </label>
            
            {!receiptUrl ? (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/bmp,application/pdf"
                  onChange={handleReceiptUpload}
                  disabled={uploadingReceipt}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingReceipt}
                  className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-brand-border bg-brand-background p-6 transition-colors hover:border-brand-jade hover:bg-brand-jade/5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploadingReceipt ? (
                    <>
                      <svg className="mb-2 h-10 w-10 animate-spin text-brand-jade" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="text-sm font-medium text-brand-textMuted">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="mb-2 h-10 w-10 text-brand-textMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm font-medium text-brand-text">Upload Receipt</span>
                      <span className="mt-1 text-xs text-brand-textMuted">JPG, PNG, WebP, BMP, PDF • Max 10MB</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="flex items-center justify-between rounded-lg border border-brand-border bg-emerald-50 p-4">
                <div className="flex items-center gap-3">
                  <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-brand-text">{receiptFileName}</p>
                    <p className="text-xs text-brand-textMuted">Receipt uploaded successfully</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveReceipt}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                >
                  Remove
                </button>
              </div>
            )}
            <p className="mt-2 text-xs text-brand-textMuted">
              📎 Attach proof of purchase to verify this expense for tax compliance
            </p>
          </div>
        </div>
      )}
      <section className="rounded-lg border border-brand-border bg-white p-6 shadow-card">
        <header className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-brand-text">Line items</h3>
          <Button type="button" size="sm" onClick={() => setLines((current) => [...current, emptyLine()])}>
            Add line
          </Button>
        </header>
        <div className="space-y-3">
          {lines.map((line) => (
            <div key={line.id} className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-[1fr_auto] md:grid-cols-[2fr_repeat(2,_minmax(100px,_1fr))_auto]">
              <input
                value={line.description}
                onChange={(event) => updateLine(line.id, { description: event.target.value })}
                placeholder="Description"
                className="rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 sm:col-span-2 md:col-span-1"
              />
              <div className="grid grid-cols-2 gap-2 sm:col-span-2 md:col-span-2 md:grid-cols-2">
                <input
                  type="number"
                  min="1"
                  value={line.quantity}
                  onChange={(event) => updateLine(line.id, { quantity: Number(event.target.value) })}
                  placeholder="Qty"
                  className="rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={line.unit_price}
                  onChange={(event) => updateLine(line.id, { unit_price: Number(event.target.value) })}
                  placeholder="Price"
                  className="rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                />
              </div>
              <button
                type="button"
                onClick={() => removeLine(line.id)}
                disabled={lines.length === 1}
                className="justify-self-start sm:justify-self-end md:justify-self-start text-sm font-semibold text-brand-jade transition hover:text-brand-jade/80 disabled:cursor-not-allowed disabled:opacity-40 sm:col-span-2 md:col-span-1"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>
      <Button
        type="submit"
        disabled={mutation.isPending || quotaLoading || (invoiceType === "revenue" && quota && !quota.can_create)}
        className="w-full sm:w-fit"
      >
        {mutation.isPending 
          ? `Creating ${invoiceType}...` 
          : invoiceType === "revenue" && quota && !quota.can_create 
          ? "Limit Reached" 
          : `Create ${invoiceType === "revenue" ? "Invoice" : "Expense"}`}
      </Button>
      {invoiceType === "revenue" && quota && quota.limit !== null && (
        <p className="text-xs text-brand-textMuted">
          {quota.current_count}/{quota.limit} invoices used this month • Plan: {quota.current_plan}
        </p>
      )}
      {invoiceType === "expense" && (
        <p className="text-xs text-brand-textMuted">
          ✅ Expenses don&apos;t count against your invoice limit
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
          <div className="mt-3 flex flex-col sm:flex-row flex-wrap gap-3">
            <Button type="button" onClick={() => setShowUpgradeModal(true)} variant="secondary" className="w-full sm:w-auto">
              View Plans
            </Button>
            {upgradeUrl && (
              <a
                href={upgradeUrl}
                className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-700 transition w-full sm:w-auto"
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