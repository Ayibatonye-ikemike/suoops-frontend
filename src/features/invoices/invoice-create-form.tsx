"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  useCreateInvoice,
  type InvoiceLineInput,
  type InvoiceCreatePayload,
} from "./use-create-invoice";
import { useInvoiceQuota } from "./use-invoice-quota";
import { parseFeatureGateError } from "@/lib/feature-gate";
import { PlanSelectionModal } from "../settings/plan-selection-modal";

// Components
import { WhatsAppTip } from "./whatsapp-tip";
import { RevenueFields } from "./revenue-fields";
import { InvoiceLineItems, type LineDraft } from "./invoice-line-items";
import { InvoiceFormMessages } from "./invoice-form-messages";

const makeId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 9);
};

const emptyLine = (): LineDraft => ({
  id: makeId(),
  description: "",
  quantity: 1,
  unit_price: 0,
});

export function InvoiceCreateForm() {
  // Customer Fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  // Shared Fields
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [lines, setLines] = useState<LineDraft[]>([emptyLine()]);

  // UI State
  const [lastPdfUrl, setLastPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showBankDetailsError, setShowBankDetailsError] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [quotaError, setQuotaError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string>("FREE");
  const [upgradeUrl, setUpgradeUrl] = useState<string | null>(null);

  const mutation = useCreateInvoice();
  const {
    data: quota,
    isLoading: quotaLoading,
    isError: quotaErrorState,
  } = useInvoiceQuota();

  function updateLine(id: string, patch: Partial<LineDraft>) {
    setLines((current) =>
      current.map((line) => (line.id === id ? { ...line, ...patch } : line))
    );
  }

  function removeLine(id: string) {
    setLines((current) =>
      current.length === 1 ? current : current.filter((line) => line.id !== id)
    );
  }

  function addLine() {
    setLines((current) => [...current, emptyLine()]);
  }

  // Auto-calculate total amount from line items
  useEffect(() => {
    const total = lines.reduce((sum, line) => {
      const lineTotal = (Number(line.quantity) || 0) * (Number(line.unit_price) || 0);
      return sum + lineTotal;
    }, 0);
    setAmount(total.toString());
  }, [lines]);

  function resetForm() {
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setAmount("");
    setDueDate("");
    setLines([emptyLine()]);
    setShowBankDetailsError(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setShowBankDetailsError(false);
    setLastPdfUrl(null);
    const parsedAmount = Number(amount);

    // Validation
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
        product_id: line.product_id || null,  // Include product_id for inventory tracking
      }));

    try {
      const payload: InvoiceCreatePayload = {
        invoice_type: "revenue",
        amount: parsedAmount,
        customer_name: customerName,
        customer_phone: customerPhone || undefined,
        customer_email: customerEmail || undefined,
        due_date: dueDate || undefined,
        lines:
          preparedLines.length > 0
            ? preparedLines
            : [
                {
                  description: "Item",
                  quantity: 1,
                  unit_price: parsedAmount,
                },
              ],
      };

      const invoice = await mutation.mutateAsync(payload);
      setLastPdfUrl(invoice.pdf_url ?? null);
      resetForm();
    } catch (submitError) {
      console.error(submitError);

      // Handle feature gate errors (403) and invoice errors (400)
      // First check for enriched error from use-create-invoice mutation
      const enrichedGate = (submitError as { featureGate?: ReturnType<typeof parseFeatureGateError> })?.featureGate;
      const gate = enrichedGate || parseFeatureGateError(submitError);
      
      // Handle missing bank details error with special UI
      if (gate?.type === "missing_bank_details") {
        setShowBankDetailsError(true);
        setError(null);
        return;
      }
      
      setShowBankDetailsError(false);
      
      if (gate?.type === "invoice_limit") {
        const composed = [
          gate.message,
          gate.currentCount != null && gate.limit != null
            ? `You have used ${gate.currentCount} of ${gate.limit}.`
            : null,
          "Upgrade now to unlock more invoices and premium automation.",
        ]
          .filter(Boolean)
          .join(" ");
        setQuotaError(composed);
        setCurrentPlan(gate.currentPlan || currentPlan);
        setUpgradeUrl(gate.upgradeUrl || "/dashboard/upgrade");
        setShowUpgradeModal(true);
        return;
      }

      // Fallback - try to extract specific error message from response
      const errorData = (submitError as { response?: { data?: { detail?: string } } })?.response?.data;
      if (errorData?.detail && typeof errorData.detail === "string") {
        setError(errorData.detail);
        return;
      }
      
      // Network error
      if (submitError instanceof Error && submitError.message.includes("Network")) {
        setError("Connection error. Please check your internet and try again.");
        return;
      }

      // Generic fallback with helpful guidance
      setError(
        "Unable to create invoice. Please check that all fields are filled correctly. " +
        "If the problem persists, try refreshing the page."
      );
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-[22px] font-semibold text-brand-text">
          Create an invoice & get paid
        </h2>
        <p className="text-sm text-brand-textMuted">
          Enter customer details and what they&apos;re paying for — we&apos;ll handle the rest.
        </p>
      </div>

      {/* WhatsApp Tip */}
      <WhatsAppTip />

      {/* Customer Fields */}
      <RevenueFields
        customerName={customerName}
        customerPhone={customerPhone}
        customerEmail={customerEmail}
        onCustomerNameChange={setCustomerName}
        onCustomerPhoneChange={setCustomerPhone}
        onCustomerEmailChange={setCustomerEmail}
      />

      {/* Line Items with Inventory Product Picker (Pro/Business only) */}
      <InvoiceLineItems
        lines={lines}
        onUpdateLine={updateLine}
        onRemoveLine={removeLine}
        onAddLine={addLine}
        showProductPicker={["pro", "business"].includes(quota?.current_plan?.toLowerCase() || "")}
      />

      {/* Due Date */}
      <div className="space-y-1">
        <label
          htmlFor="due-date"
          className="text-sm font-medium text-brand-text"
        >
          Due Date{" "}
          <span className="text-xs font-normal text-brand-textMuted">
            (optional — defaults to 3 days)
          </span>
        </label>
        <input
          id="due-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text shadow-sm transition focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 sm:w-48"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={
          mutation.isPending ||
          quotaLoading ||
          (quota && !quota.can_create)
        }
        className="w-full sm:w-fit"
      >
        {mutation.isPending
          ? "Creating..."
          : quota && !quota.can_create
          ? "Limit Reached"
          : "Create invoice & send for payment"}
      </Button>

      {/* Bank Details Error - Special Treatment */}
      {showBankDetailsError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">
            🏦 Bank Details Required
          </p>
          <p className="mt-1 text-sm text-amber-800">
            Please add your bank account details before creating invoices. 
            Your customers need to know where to send payment!
          </p>
          <div className="mt-3">
            <a
              href="/dashboard/settings"
              className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-700 transition"
            >
              Add Bank Details →
            </a>
          </div>
        </div>
      )}

      {/* Messages (Quota, Errors, Success) */}
      <InvoiceFormMessages
        invoiceType="revenue"
        quota={quota}
        quotaError={quotaErrorState}
        error={error}
        quotaErrorMessage={quotaError}
        lastPdfUrl={lastPdfUrl}
        upgradeUrl={upgradeUrl}
        onShowUpgradeModal={() => setShowUpgradeModal(true)}
      />

      {/* Upgrade Modal */}
      <PlanSelectionModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPlan={currentPlan}
      />
    </form>
  );
}
