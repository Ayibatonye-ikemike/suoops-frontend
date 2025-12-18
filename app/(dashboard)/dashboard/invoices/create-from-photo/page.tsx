/**
 * OCR Invoice Creation Page
 * Complete flow: Upload photo → Parse OCR → Review data → Create invoice
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Lock, Camera } from "lucide-react";
import { OcrPhotoUpload } from "@/features/invoices/ocr-photo-upload";
import { OcrReviewModal } from "@/features/invoices/ocr-review-modal";
import { useParseReceipt } from "@/features/invoices/use-ocr";
import { useCreateInvoice } from "@/features/invoices/use-create-invoice";
import { isPremiumFeatureError } from "@/features/invoices/errors";
import { parseFeatureGateError } from "@/lib/feature-gate";
import PremiumUpsell from "@/components/premium-upsell";
import { logFeatureEvent } from "@/lib/telemetry";
import toast from "react-hot-toast";
import Link from "next/link";
import { OCRParseResult } from "@/features/invoices/use-ocr";
import { apiClient } from "@/api/client";
import type { components } from "@/api/types";
import { hasPlanFeature, PLANS, type PlanTier } from "@/constants/pricing";
import { Button } from "@/components/ui/button";

type CurrentUser = components["schemas"]["UserOut"];

export default function OcrInvoicePage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [context, setContext] = useState<string>("");
  const [ocrData, setOcrData] = useState<OCRParseResult | null>(null);
  const [showReview, setShowReview] = useState(false);

  const parseReceipt = useParseReceipt();
  const createInvoice = useCreateInvoice();

  // Fetch current user to check plan
  const { data: user, isLoading: userLoading } = useQuery<CurrentUser>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get<CurrentUser>("/users/me");
      return response.data;
    },
    staleTime: 60000,
  });

  const userPlan = (user?.plan?.toUpperCase() || "FREE") as PlanTier;
  const hasOcrAccess = hasPlanFeature(userPlan, "PHOTO_OCR");

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setOcrData(null);
  };

  const handleProcess = async () => {
    if (!selectedFile) return;
    try {
      const result = await parseReceipt.mutateAsync({
        file: selectedFile,
        context: context || undefined,
      });
      setOcrData(result);
      setShowReview(true);
      logFeatureEvent({ feature: "ocr", action: "parse_success" });
      toast.success("OCR data extracted");
    } catch {
      // Error handled by parseReceipt mutation state
      logFeatureEvent({ feature: "ocr", action: "parse_error" });
      toast.error("Failed to process image");
    }
  };

  // Determine if the current parse error is a premium gating error
  const premiumError = parseReceipt.isError && isPremiumFeatureError(parseReceipt.error);
  if (premiumError) {
    logFeatureEvent({ feature: "ocr", action: "premium_block" });
  }

  const handleConfirmInvoice = async (data: {
    customerName: string;
    customerPhone: string;
    amount: string;
    lines: Array<{
      description: string;
      quantity: number;
      unit_price: string;
    }>;
  }) => {
    try {
      const invoice = await createInvoice.mutateAsync({
        invoice_type: "revenue",
        customer_name: data.customerName,
        customer_phone: data.customerPhone || undefined,
        amount: parseFloat(data.amount),
        lines: data.lines.map((line) => ({
          description: line.description,
          quantity: line.quantity,
          unit_price: parseFloat(line.unit_price),
        })),
      });

      // Success! Navigate to invoice detail
      router.push(`/dashboard/invoices/${invoice.invoice_id}`);
    } catch (err) {
      const gate = parseFeatureGateError(err);
      if (gate?.type === "invoice_limit") {
        toast.error("Invoice limit reached – upgrade to continue.");
      } else if (gate?.type === "premium_required") {
        toast.error("Premium feature – upgrade required.");
      }
      // Other errors already reflected in mutation state
    }
  };

  const handleCloseReview = () => {
    setShowReview(false);
  };

  // Show loading state
  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-jade" />
      </div>
    );
  }

  // Show upgrade prompt for users without OCR access
  if (!hasOcrAccess) {
    return (
      <div className="px-4 py-4">
        {/* Breadcrumb */}
        <div className="mb-3 flex items-center space-x-2 text-xs text-slate-500">
          <Link href="/dashboard/invoices" className="hover:text-blue-600">
            Invoices
          </Link>
          <span>›</span>
          <span>Photo OCR</span>
        </div>

        {/* Compact Upgrade Card */}
        <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="h-4 w-4 text-amber-600 shrink-0" />
            <span className="font-semibold text-gray-900 dark:text-white text-sm">
              Business plan required
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            Upgrade to scan receipts with AI. 15 OCR invoices/month included.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/settings">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 py-1.5 h-auto">
                Upgrade - {PLANS.BUSINESS.priceDisplay}/mo
              </Button>
            </Link>
            <Link 
              href="/dashboard/invoices/create"
              className="text-xs text-brand-jade hover:underline"
            >
              Manual instead
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center space-x-2 text-sm text-slate-600">
            <Link
              href="/dashboard/invoices"
              className="hover:text-blue-600"
            >
              Invoices
            </Link>
            <span>›</span>
            <span className="text-slate-900">Create from Photo</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            📸 Create Invoice from Photo
          </h1>
          <p className="mt-2 text-slate-600">
            Upload a receipt or invoice photo, and we&apos;ll extract the details automatically
          </p>
        </div>

        {/* How it works */}
        <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h2 className="mb-3 text-lg font-semibold text-blue-900">
            🎯 How it works
          </h2>
          <ol className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start space-x-2">
              <span className="font-bold">1.</span>
              <span>Take a photo or upload an existing receipt image</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-bold">2.</span>
              <span>AI extracts customer name, amount, and line items (5-10 seconds)</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-bold">3.</span>
              <span>Review and edit the extracted data if needed</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-bold">4.</span>
              <span>Confirm to create professional invoice instantly</span>
            </li>
          </ol>
        </div>

        {/* Main content */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          {/* Upload section */}
          <OcrPhotoUpload
            onFileSelect={handleFileSelect}
            onContextChange={setContext}
            isProcessing={parseReceipt.isPending}
          />

          {/* Process button */}
          {selectedFile && !parseReceipt.isPending && (
            <div className="mt-6">
              <button
                onClick={handleProcess}
                disabled={!selectedFile}
                className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Process Photo with AI
              </button>
            </div>
          )}

          {/* Processing state */}
          {parseReceipt.isPending && (
            <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-6">
              <div className="flex items-center space-x-4">
                <svg
                  className="h-8 w-8 animate-spin text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-blue-900">
                    Processing your photo...
                  </p>
                  <p className="text-sm text-blue-700">
                    AI is reading the receipt and extracting invoice data
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error state - Premium Feature Required */}
          {parseReceipt.isError && premiumError && (
            <div className="mt-6">
              <PremiumUpsell error={parseReceipt.error} onClose={() => {}} />
            </div>
          )}

          {/* Error state - Other Errors */}
          {parseReceipt.isError && !premiumError && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-start space-x-3">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-red-900">
                    Failed to process photo
                  </p>
                  <p className="mt-1 text-sm text-red-700">
                    {parseReceipt.error?.message || "Please try again with a clearer image"}
                  </p>
                  <button
                    onClick={handleProcess}
                    className="mt-3 text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Invoice creation & gating errors */}
          {createInvoice.isError && (
            (() => {
              const gate = parseFeatureGateError(createInvoice.error);
              if (gate?.type === "invoice_limit") {
                return (
                  <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-semibold text-amber-900">⚠️ Invoice Limit Reached</p>
                    <p className="mt-1 text-sm text-amber-800">{gate.message}</p>
                    <div className="mt-3 flex gap-3">
                      <a
                        href={gate.upgradeUrl || "/dashboard/upgrade"}
                        className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                      >
                        Upgrade Plan
                      </a>
                    </div>
                  </div>
                );
              }
              if (gate?.type === "premium_required") {
                return (
                  <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <p className="text-sm font-semibold text-blue-900">🔒 Premium Feature</p>
                    <p className="mt-1 text-sm text-blue-800">{gate.message}</p>
                    <a
                      href={gate.upgradeUrl || "/dashboard/upgrade"}
                      className="mt-3 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      View Plans
                    </a>
                  </div>
                );
              }
              return (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start space-x-3">
                    <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-red-900">Failed to create invoice</p>
                      <p className="mt-1 text-sm text-red-700">{createInvoice.error?.message || "Please try again"}</p>
                    </div>
                  </div>
                </div>
              );
            })()
          )}
        </div>

        {/* Tips section */}
        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">
            💡 Tips for Best Results
          </h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start space-x-2">
              <span className="text-green-600">✓</span>
              <span>Use good lighting - natural light works best</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-600">✓</span>
              <span>Keep receipt flat and in focus</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-600">✓</span>
              <span>Ensure all text is clearly visible</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-600">✓</span>
              <span>Works best with printed receipts (handwritten may vary)</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-red-600">✗</span>
              <span>Avoid shadows, glare, or blurry images</span>
            </li>
          </ul>

          <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-xs text-blue-800">
              <strong>🔒 Premium Feature:</strong> Photo invoice OCR requires a paid subscription plan. <strong>Speed:</strong> 5-10 seconds • <strong>Accuracy:</strong> 85-95% for clear images
            </p>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {ocrData && (
        <OcrReviewModal
          ocrData={ocrData}
          isOpen={showReview}
          onClose={handleCloseReview}
          onConfirm={handleConfirmInvoice}
          isCreating={createInvoice.isPending}
        />
      )}
    </div>
  );
}
