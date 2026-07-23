import type { Metadata } from "next";

import { getConfig } from "@/lib/config";

type Verification = {
  invoice_id: string;
  status: string;
  amount: string;
  customer_name: string;
  business_name: string;
  verification_code: string;
  items: { description: string; quantity: number }[];
  fulfilment_status: string | null;
  fulfilment_label: string | null;
  created_at: string;
  verified_at: string;
  authentic: boolean;
};

type RouteProps = { params: Promise<{ invoiceId: string }> };

async function fetchVerification(
  invoiceId: string,
  apiBaseUrl: string,
): Promise<Verification | null> {
  const res = await fetch(
    `${apiBaseUrl}/invoices/${encodeURIComponent(invoiceId)}/verify`,
    { cache: "no-store", headers: { "Content-Type": "application/json" } },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Unable to verify this invoice right now.");
  return (await res.json()) as Verification;
}

export const metadata: Metadata = {
  title: "Verify invoice — SuoOps",
  robots: { index: false, follow: false },
};

function formatAmount(raw: string): string {
  const n = Number(raw);
  if (Number.isFinite(n)) return `₦${n.toLocaleString("en-US")}`;
  return raw?.startsWith("₦") ? raw : `₦${raw ?? "0"}`;
}

// Date + time in the business's timezone (WAT), e.g. "23 Jul 2026, 14:21".
function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Lagos",
  });
}

const STATUS_STYLE: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  awaiting_confirmation: "bg-amber-100 text-amber-700",
  cancelled: "bg-rose-100 text-rose-700",
  failed: "bg-rose-100 text-rose-700",
};

// Fulfilment banner styling — did the seller render the service / deliver the goods?
const FULFILMENT: Record<string, { box: string; icon: string }> = {
  delivered: { box: "border-emerald-200 bg-emerald-50 text-emerald-800", icon: "✓" },
  rendered: { box: "border-emerald-200 bg-emerald-50 text-emerald-800", icon: "✓" },
  confirmed: { box: "border-emerald-200 bg-emerald-50 text-emerald-800", icon: "✓" },
  released: { box: "border-emerald-200 bg-emerald-50 text-emerald-800", icon: "✓" },
  sent: { box: "border-sky-200 bg-sky-50 text-sky-800", icon: "🚚" },
  preparing: { box: "border-amber-200 bg-amber-50 text-amber-800", icon: "⏳" },
  in_progress: { box: "border-amber-200 bg-amber-50 text-amber-800", icon: "⏳" },
  unpaid: { box: "border-amber-200 bg-amber-50 text-amber-800", icon: "⏳" },
  disputed: { box: "border-rose-200 bg-rose-50 text-rose-800", icon: "⚠️" },
  refunded: { box: "border-slate-200 bg-slate-50 text-slate-700", icon: "↩️" },
  canceled: { box: "border-slate-200 bg-slate-50 text-slate-700", icon: "✕" },
};

export default async function VerifyInvoicePage({ params }: RouteProps) {
  const { invoiceId } = await params;
  const { apiBaseUrl } = getConfig();

  let data: Verification | null = null;
  let errored = false;
  try {
    data = await fetchVerification(invoiceId, apiBaseUrl);
  } catch {
    errored = true;
  }

  // Not found or errored — a forged/expired code lands here.
  if (!data || !data.authentic) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-3xl">
          ⚠️
        </div>
        <h1 className="mt-5 text-xl font-bold text-slate-800">
          {errored ? "Couldn’t verify right now" : "Invoice not found"}
        </h1>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          {errored
            ? "We couldn’t reach verification. Please check your connection and try again."
            : "We couldn’t find this invoice. It may be a forged or mistyped code — do not pay until you can verify it."}
        </p>
        <p className="mt-6 text-xs text-slate-400">Verified by SuoOps</p>
      </div>
    );
  }

  const statusStyle =
    STATUS_STYLE[data.status] ?? "bg-slate-100 text-slate-600";
  const prettyStatus = data.status.replace(/_/g, " ");

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-brand-evergreen to-[#08260f] px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Verified badge */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-jade text-3xl text-white shadow-lg">
            ✓
          </div>
          <h1 className="mt-3 text-xl font-bold text-white">Verified invoice</h1>
          <p className="mt-1 text-xs text-brand-citrus">
            This invoice is genuine and issued through SuoOps.
          </p>
        </div>

        {/* Details card */}
        <div className="mt-6 rounded-2xl bg-white p-5 shadow-xl">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Issued by
            </p>
            <p className="text-lg font-bold text-slate-900">
              {data.business_name}
            </p>
          </div>

          {/* Fulfilment — has the seller rendered/delivered? (storefront orders) */}
          {data.fulfilment_label && (
            <div
              className={`mt-4 flex items-center gap-2 rounded-xl border px-3 py-2.5 ${
                (FULFILMENT[data.fulfilment_status ?? ""] ?? FULFILMENT.preparing).box
              }`}
            >
              <span className="text-base">
                {(FULFILMENT[data.fulfilment_status ?? ""] ?? FULFILMENT.preparing).icon}
              </span>
              <span className="text-sm font-semibold">{data.fulfilment_label}</span>
            </div>
          )}

          <dl className="mt-4 space-y-3 border-t border-dashed border-slate-200 pt-4 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Amount</dt>
              <dd className="text-base font-bold text-slate-900">
                {formatAmount(data.amount)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Status</dt>
              <dd>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyle}`}
                >
                  {prettyStatus}
                </span>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Billed to</dt>
              <dd className="font-medium text-slate-800">{data.customer_name}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Issued</dt>
              <dd className="font-medium text-slate-800">
                {formatDateTime(data.created_at)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Invoice</dt>
              <dd className="font-mono text-xs text-slate-600">
                {data.invoice_id}
              </dd>
            </div>
          </dl>

          {/* What was bought */}
          {data.items && data.items.length > 0 && (
            <div className="mt-4 border-t border-dashed border-slate-200 pt-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Items
              </p>
              <ul className="space-y-1.5 text-sm">
                {data.items.map((it, i) => (
                  <li
                    key={`${it.description}-${i}`}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="truncate text-slate-700">{it.description}</span>
                    <span className="shrink-0 font-medium text-slate-500">
                      × {it.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Unique authenticity code */}
          <div className="mt-4 rounded-xl bg-brand-background p-3 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-jadeText">
              Verification code
            </p>
            <p className="mt-0.5 font-mono text-lg font-bold tracking-widest text-brand-evergreen">
              {data.verification_code}
            </p>
            <p className="mt-1 text-[10px] text-slate-400">
              Unique to this invoice — a forged receipt can’t reproduce it.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-brand-citrus/80">
          🔐 Verified by SuoOps · {formatDateTime(data.verified_at)}
        </p>
      </div>
    </div>
  );
}
