"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useCreateInvoice,
  type InvoiceLineInput,
  type InvoiceCreatePayload,
} from "./use-create-invoice";
import { useInvoiceQuota } from "./use-invoice-quota";
import { parseFeatureGateError } from "@/lib/feature-gate";
import { PlanSelectionModal } from "../settings/plan-selection-modal";
import { apiClient } from "@/api/client";

// Components
import { InvoiceTypeToggle } from "./invoice-type-toggle";
import { OcrPhotoPrompt } from "./ocr-photo-prompt";
import { RevenueFields } from "./revenue-fields";
import { ExpenseFields } from "./expense-fields";
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
  // Invoice Type
  const [invoiceType, setInvoiceType] = useState<"revenue" | "expense">(
    "revenue"
  );

  // Revenue Fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  // Expense Fields
  const [vendorName, setVendorName] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);

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

  async function handleReceiptUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/bmp",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError(
        "Invalid file type. Please upload JPEG, PNG, WebP, BMP, or PDF."
      );
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

      const response = await apiClient.post(
        "/invoices/upload-receipt",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

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
  }

  function resetForm() {
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setVendorName("");
    setCategory("");
    setNotes("");
    setAmount("");
    setLines([emptyLine()]);
    setReceiptUrl(null);
    setReceiptFileName(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLastPdfUrl(null);
    const parsedAmount = Number(amount);

    // Validation
    if (invoiceType === "revenue") {
      if (!customerName || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
        setError("Customer name and a positive amount are required.");
        return;
      }
    } else {
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
      resetForm();
    } catch (submitError) {
      console.error(submitError);

      // Handle feature gate errors (403)
      const gate = parseFeatureGateError(submitError);
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
      setError(
        `Failed to create ${invoiceType} invoice. Check inputs and try again.`
      );
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
          {invoiceType === "revenue"
            ? "Set customer details and line items to generate a payment-ready invoice."
            : "Record business expenses for accurate tax reporting."}
        </p>
      </div>

      {/* Invoice Type Toggle */}
      <InvoiceTypeToggle
        invoiceType={invoiceType}
        onTypeChange={setInvoiceType}
      />

      {/* OCR Photo Upload (Revenue Only) */}
      {invoiceType === "revenue" && <OcrPhotoPrompt />}

      {/* Conditional Form Fields */}
      {invoiceType === "revenue" ? (
        <RevenueFields
          customerName={customerName}
          customerPhone={customerPhone}
          customerEmail={customerEmail}
          amount={amount}
          onCustomerNameChange={setCustomerName}
          onCustomerPhoneChange={setCustomerPhone}
          onCustomerEmailChange={setCustomerEmail}
          onAmountChange={setAmount}
        />
      ) : (
        <ExpenseFields
          vendorName={vendorName}
          category={category}
          notes={notes}
          amount={amount}
          receiptUrl={receiptUrl}
          receiptFileName={receiptFileName}
          uploadingReceipt={uploadingReceipt}
          onVendorNameChange={setVendorName}
          onCategoryChange={setCategory}
          onNotesChange={setNotes}
          onAmountChange={setAmount}
          onReceiptUpload={handleReceiptUpload}
          onRemoveReceipt={handleRemoveReceipt}
        />
      )}

      {/* Line Items */}
      <InvoiceLineItems
        lines={lines}
        onUpdateLine={updateLine}
        onRemoveLine={removeLine}
        onAddLine={addLine}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={
          mutation.isPending ||
          quotaLoading ||
          (invoiceType === "revenue" && quota && !quota.can_create)
        }
        className="w-full sm:w-fit"
      >
        {mutation.isPending
          ? `Creating ${invoiceType}...`
          : invoiceType === "revenue" && quota && !quota.can_create
          ? "Limit Reached"
          : `Create ${invoiceType === "revenue" ? "Invoice" : "Expense"}`}
      </Button>

      {/* Messages (Quota, Errors, Success) */}
      <InvoiceFormMessages
        invoiceType={invoiceType}
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
