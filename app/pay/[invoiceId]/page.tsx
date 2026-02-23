import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getConfig } from "@/lib/config";
import { InvoiceClient } from "./invoice-client";
import type { components } from "@/api/types";

type InvoicePublic = components["schemas"]["InvoicePublicOut"];
type RouteParams = { invoiceId: string };
type RouteProps = { params: Promise<RouteParams> };

export const dynamic = "force-dynamic";

async function fetchInvoice(invoiceId: string, apiBaseUrl: string): Promise<InvoicePublic | null> {
  const response = await fetch(`${apiBaseUrl}/public/invoices/${invoiceId}`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Unable to load invoice. Please try again later.");
  }

  return (await response.json()) as InvoicePublic;
}

/* ── Dynamic OG metadata for rich link previews in WhatsApp / iMessage ── */
function formatOgAmount(amount: string | null | undefined, currency = "NGN") {
  if (!amount) return "";
  const n = Number(amount);
  if (Number.isNaN(n)) return amount;
  const cur = currency === "USD" ? "USD" : "NGN";
  const locale = cur === "USD" ? "en-US" : "en-NG";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: cur,
    minimumFractionDigits: cur === "USD" ? 2 : 0,
  }).format(n);
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { invoiceId } = await params;
  const { apiBaseUrl } = getConfig();

  try {
    const invoice = await fetchInvoice(invoiceId, apiBaseUrl);
    if (!invoice) {
      return { title: "Invoice Not Found — Suoops" };
    }

    const business = invoice.business_name || "a business";
    const amount = formatOgAmount(invoice.amount, invoice.currency);
    const title = amount
      ? `Invoice for ${amount} from ${business}`
      : `Invoice from ${business}`;
    const description = `You have an invoice${amount ? ` of ${amount}` : ""} from ${business}. View details and pay securely via Suoops.`;

    return {
      title: `${title} — Suoops`,
      description,
      openGraph: {
        title,
        description,
        siteName: "Suoops",
        type: "website",
        url: `https://suoops.com/pay/${invoiceId}`,
      },
      twitter: {
        card: "summary",
        title,
        description,
      },
    };
  } catch {
    return { title: "Invoice — Suoops" };
  }
}

export default async function PayInvoicePage({ params }: RouteProps) {
  const { invoiceId } = await params;
  const { apiBaseUrl } = getConfig();
  const invoice = await fetchInvoice(invoiceId, apiBaseUrl);

  if (!invoice) {
    notFound();
  }

  return <InvoiceClient initialInvoice={invoice} invoiceId={invoiceId} apiBaseUrl={apiBaseUrl} />;
}
