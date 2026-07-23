"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Download, Copy, Check } from "lucide-react";
import { apiClient } from "@/api/client";
import { copyText, downloadDataUrl } from "@/lib/download";

interface CategoryQr {
  link: string;
  qr_png: string;
}

interface CategoryQrModalProps {
  categoryId: number;
  categoryName: string;
  onClose: () => void;
}

/**
 * Shareable QR for a category. Customers scan it to open the storefront
 * filtered to just that category (e.g. print it next to a shelf/section).
 */
export function CategoryQrModal({ categoryId, categoryName, onClose }: CategoryQrModalProps) {
  const [copied, setCopied] = useState(false);

  const { data, isLoading, error } = useQuery<CategoryQr>({
    queryKey: ["category-qr", categoryId],
    queryFn: async () =>
      (await apiClient.get<CategoryQr>(`/inventory/categories/${categoryId}/qr`)).data,
    retry: false,
  });

  const errorDetail =
    (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail;

  const copyLink = async () => {
    if (!data?.link) return;
    if (await copyText(data.link)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadQr = () => {
    if (!data?.qr_png) return;
    void downloadDataUrl(data.qr_png, `category-${categoryId}.png`, categoryName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-5 py-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Category QR</h2>
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
                Customers scan this to browse{" "}
                <span className="font-semibold text-gray-900 dark:text-white">{categoryName}</span>{" "}
                on your storefront.
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.qr_png} alt="Category QR code" className="mx-auto h-52 w-52" />
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
                Print it, put it on your shelf or section, or share the image.
              </p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
