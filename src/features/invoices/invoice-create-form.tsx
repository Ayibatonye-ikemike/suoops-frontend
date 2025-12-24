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
  const [lines, setLines] = useState<LineDraft[]>([emptyLine()]);

  // UI State
  const [lastPdfUrl, setLastPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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
    setLines([emptyLine()]);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
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
      const gate = parseFeatureGateError(submitError);
      
      // Handle missing bank details error
      if (gate?.type === "missing_bank_details") {
        setError(
          "Please add your bank details in Settings before creating revenue invoices. " +
          "Your customers need to know where to pay!"
        );
        return;
      }
      
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

      // Fallback generic error
      setError("Failed to create invoice. Check inputs and try again.");
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-[22px] font-semibold text-brand-text">
          Create Invoice
        </h2>
        <p className="text-sm text-brand-textMuted">
          Set customer details and line items to generate a payment-ready invoice.
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
          : "Create Invoice"}
      </Button>

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
