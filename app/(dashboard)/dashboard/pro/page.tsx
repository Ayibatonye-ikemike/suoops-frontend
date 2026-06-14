"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Landmark,
  Image as ImageIcon,
  Package,
  Users,
  BarChart3,
  Bell,
  Percent,
  MessageCircle,
  Sparkles,
  Crown,
  ArrowRight,
  ArrowLeft,
  LifeBuoy,
  CheckCircle2,
} from "lucide-react";

import { apiClient } from "@/api/client";

interface UserData {
  plan?: string;
  subscription_expires_at?: string | null;
}

interface ProFeature {
  id: string;
  title: string;
  icon: React.ReactNode;
  what: string;
  how: string[];
  tip: string;
  href?: string;
  cta?: string;
}

const PRO_FEATURES: ProFeature[] = [
  {
    id: "tax",
    title: "Tax reports (PIT + CIT)",
    icon: <Landmark className="h-5 w-5" />,
    what:
      "Auto-generated Personal Income Tax and Company Income Tax summaries built from your invoices and expenses — ready for filing.",
    how: [
      "Open Tax from the top menu.",
      "Pick the period (month, quarter or year).",
      "Download the PIT/CIT report and share it with your accountant or for filing.",
    ],
    tip: "Record expenses regularly so your taxable profit — and your tax bill — stays accurate.",
    href: "/dashboard/tax",
    cta: "Open Tax reports",
  },
  {
    id: "branding",
    title: "Custom logo branding",
    icon: <ImageIcon className="h-5 w-5" />,
    what:
      "Put your business logo on every invoice and receipt so customers instantly recognise and trust your brand.",
    how: [
      "Go to Settings → Business and upload a clear logo (PNG or JPG).",
      "It appears automatically on all new invoices and PDFs.",
    ],
    tip: "A logo is the single fastest way to look established — businesses with logos get taken more seriously and paid faster.",
    href: "/dashboard/settings#logo",
    cta: "Upload your logo",
  },
  {
    id: "inventory",
    title: "Inventory management",
    icon: <Package className="h-5 w-5" />,
    what:
      "Track stock levels, cost and selling price per item. Quantities update as you invoice, so you always know what you have.",
    how: [
      "Open Inventory and add your products with cost & price.",
      "Select items when creating invoices — stock adjusts automatically.",
      "Watch low-stock items so you never run out of a best-seller.",
    ],
    tip: "Knowing your cost per item unlocks accurate margins — see the Margin analysis feature below.",
    href: "/dashboard/inventory",
    cta: "Set up Inventory",
  },
  {
    id: "team",
    title: "Team management (3 members)",
    icon: <Users className="h-5 w-5" />,
    what:
      "Invite up to 3 teammates to help create invoices and manage operations without sharing your password.",
    how: [
      "Go to Settings → Team.",
      "Invite a teammate by email and they get their own secure login.",
      "Remove access any time.",
    ],
    tip: "Delegate invoicing to staff so you focus on growth — every action stays tracked under your business.",
    href: "/dashboard/settings#team",
    cta: "Manage your team",
  },
  {
    id: "insights",
    title: "Cash-first dashboard & insights",
    icon: <BarChart3 className="h-5 w-5" />,
    what:
      "A clear view of money in, money owed and what to chase next — built for cash flow, not vanity metrics.",
    how: [
      "Open Insights to see paid vs outstanding and trends over time.",
      "Use it weekly to decide who to follow up and what's selling.",
    ],
    tip: "Check Insights every Monday — a 5-minute review keeps your cash flow healthy.",
    href: "/dashboard/analytics",
    cta: "View Insights",
  },
  {
    id: "alerts",
    title: "Customer value & dormancy alerts",
    icon: <Bell className="h-5 w-5" />,
    what:
      "See your most valuable customers and get flagged when a regular goes quiet — so you can win them back.",
    how: [
      "Open Insights and review the customer value & dormancy section.",
      "Reach out to dormant customers with a friendly follow-up or offer.",
    ],
    tip: "Winning back an existing customer is far cheaper than finding a new one — act on dormancy alerts quickly.",
    href: "/dashboard/analytics",
    cta: "See customer insights",
  },
  {
    id: "margin",
    title: "Margin & discount analysis",
    icon: <Percent className="h-5 w-5" />,
    what:
      "Understand the real profit on every sale and how discounts affect your bottom line.",
    how: [
      "Add cost prices in Inventory so margins can be calculated.",
      "Open Insights to review margin and discount impact per product.",
    ],
    tip: "Spot low-margin items and adjust pricing — small changes compound into real profit.",
    href: "/dashboard/analytics",
    cta: "Analyse margins",
  },
  {
    id: "whatsapp-summary",
    title: "Daily WhatsApp business summary",
    icon: <MessageCircle className="h-5 w-5" />,
    what:
      "A short daily recap on WhatsApp — what you sold, what got paid and what's outstanding — without opening the app.",
    how: [
      "Make sure your WhatsApp number is connected and verified in Settings.",
      "Your summary arrives automatically each day — no action needed.",
    ],
    tip: "Read it with your morning coffee to start each day knowing exactly where your money stands.",
    href: "/dashboard/settings#profile",
    cta: "Check your number",
  },
  {
    id: "professionalism",
    title: "Professionalism score & tips",
    icon: <Sparkles className="h-5 w-5" />,
    what:
      "A score that grades how professional your business setup looks, with specific tips to improve it.",
    how: [
      "Find your Professionalism Score on the main dashboard.",
      "Complete each suggested step (logo, bank details, business name) to raise it.",
    ],
    tip: "Aim for a perfect score — every point makes customers trust you more and pay faster.",
    href: "/dashboard",
    cta: "View your score",
  },
  {
    id: "support",
    title: "Priority support",
    icon: <LifeBuoy className="h-5 w-5" />,
    what:
      "Your questions jump the queue. As a Pro user you get faster, prioritised help when you need it.",
    how: [
      "Reach out via WhatsApp or the support page any time.",
      "Mention you're on Pro and we'll prioritise your request.",
    ],
    tip: "Stuck on anything? Ask early — Pro support is here to help you get the most out of SuoOps.",
  },
];

export default function ProGuidePage() {
  const { data: user } = useQuery<UserData>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get<UserData>("/users/me");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const isPro = (user?.plan || "free").toLowerCase() === "pro";
  const expiresAt = user?.subscription_expires_at
    ? new Date(user.subscription_expires_at).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-white shadow">
              <Crown className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-brand-text sm:text-3xl">
                Your Pro features
              </h1>
              <p className="text-sm text-brand-textMuted">
                {isPro
                  ? expiresAt
                    ? `Active — premium features available until ${expiresAt}.`
                    : "Active — all premium features unlocked."
                  : "Unlock these with the Pro Pack or a Pro Features subscription."}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-brand-text">
            Here&apos;s exactly what each Pro feature does and how to use it to run a more
            professional, more profitable business. Work through them one at a time.
          </p>
          {!isPro && (
            <Link
              href="/dashboard/billing/purchase?pack=pro_pack"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-amber-500"
            >
              <Crown className="h-4 w-4" />
              Get Pro
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {/* Feature list */}
        <div className="mt-6 space-y-4">
          {PRO_FEATURES.map((f) => (
            <div
              key={f.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-brand-jade">
                  {f.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-bold text-brand-text sm:text-lg">
                    {f.title}
                  </h2>
                  <p className="mt-1 text-sm text-brand-textMuted">{f.what}</p>

                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-text">
                      How to use it
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {f.how.map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-jade" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    <span className="font-semibold">Pro tip:</span> {f.tip}
                  </div>

                  {f.href && f.cta && (
                    <Link
                      href={f.href}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-jade transition hover:text-emerald-700"
                    >
                      {f.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-brand-textMuted transition hover:text-brand-text"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          {isPro && (
            <Link
              href="/dashboard/settings#subscription"
              className="text-sm text-brand-textMuted transition hover:text-brand-text"
            >
              Manage subscription
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
