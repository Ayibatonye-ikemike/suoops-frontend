"use client";

import Link from 'next/link';
import { getPremiumFeatureInfo } from '@/features/invoices/errors';

interface PremiumUpsellProps {
  error: unknown;
  onClose?: () => void;
}

export function PremiumUpsell({ error, onClose }: PremiumUpsellProps) {
  const info = getPremiumFeatureInfo(error);
  if (!info.required) return null;
  return (
    <div className="rounded-lg border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50 p-6">
      <div className="flex items-start gap-3">
        <svg
          className="mt-0.5 h-6 w-6 flex-shrink-0 text-yellow-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <div className="flex-1">
          <p className="text-lg font-bold text-yellow-900">🔒 Premium Feature Required</p>
          <p className="mt-1 text-sm text-yellow-800">{info.message}</p>
          <div className="mt-4 rounded-lg bg-white/60 p-4">
            <p className="text-sm font-semibold text-slate-900 mb-2">✨ Upgrade to unlock:</p>
            <ul className="space-y-1 text-sm text-slate-700">
              <li>📸 Photo invoice OCR</li>
              <li>🎙️ Voice message invoices</li>
              <li>🎨 Custom branding</li>
              <li>📊 Higher monthly limits</li>
              <li>💬 Priority support</li>
            </ul>
          </div>
          <div className="mt-4 flex gap-3">
            <Link
              href="/dashboard/subscription"
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              🚀 Upgrade Now
            </Link>
            <button
              onClick={onClose}
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PremiumUpsell;
