"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Download, Copy, Check } from "lucide-react";
import { apiClient } from "@/api/client";
import { copyText, downloadDataUrl } from "@/lib/download";

interface ScanToPay {
  pay_url: string;
  qr_png: string;
  barcode: string;
}

interface ScanToPayModalProps {
  productId: number;
  productName: string;
  onClose: () => void;
}

/**
 * Scan-to-pay QR for a product. Customers scan it to open the product on the
 * business's storefront and pay online. The barcode is auto-generated on the
 * server the first time this is opened.
 */
export function ScanToPayModal({ productId, productName, onClose }: ScanToPayModalProps) {
  const [copied, setCopied] = useState(false);

  const { data, isLoading, error } = useQuery<ScanToPay>({
    queryKey: ["scan-to-pay", productId],
    queryFn: async () =>
      (await apiClient.get<ScanToPay>(`/inventory/products/${productId}/scan-to-pay`)).data,
    retry: false,
  });

  const errorDetail =
    (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail;

  const copyLink = async () => {
    if (!data?.pay_url) return;
    if (await copyText(data.pay_url)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadQr = () => {
    if (!data?.qr_png) return;
    void downloadDataUrl(data.qr_png, `scan-to-pay-${productId}.png`, productName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-5 py-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Scan to pay</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 text-center">
          {isLoading ? (
            <div className="mx-auto h-52 w-52 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-700" />
          ) : error ? (
            <p className="py-8 text-sm text-amber-700 dark:text-amber-400">
              {errorDetail || "Could not generate the code. Turn on your storefront first."}
            </p>
          ) : data ? (
            <>
              <p className="mb-3 text-sm text-gray-500">
                Customers scan this to buy{" "}
                <span className="font-semibold text-gray-900 dark:text-white">{productName}</span>{" "}
                and pay online.
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.qr_png} alt="Scan to pay QR code" className="mx-auto h-52 w-52" />
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={downloadQr}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-jade px-3 py-2 text-sm font-semibold text-white hover:bg-brand-jadeHover transition-colors"
                >
                  <Download className="h-4 w-4" /> Download
                </button>
                <button
                  onClick={copyLink}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy link"}
                </button>
              </div>
              <p className="mt-3 text-xs text-gray-400">
                Print it, put it on your shelf or shop, or share the image.
              </p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
