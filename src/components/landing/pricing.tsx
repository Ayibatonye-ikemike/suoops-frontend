"use client";

import Link from "next/link";
import { LANDING_PLANS, type Plan } from "../../constants/pricing";
import { useRegisterHref } from "@/hooks/use-tracking-params";

export function Pricing() {
  const registerHref = useRegisterHref();
  return (
    <section id="pricing" className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-brand-evergreen sm:text-4xl">
            Simple pricing that grows with you
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Start with <strong>2 free invoices</strong> — no credit card needed. Only pay as your business grows.
          </p>
        </div>

        {/* Free invoices callout */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-r from-brand-evergreen to-brand-jade p-6 text-center shadow-lg">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-bold text-white">Try SuoOps Free — 2 Invoices On Us!</h3>
            <p className="mt-2 text-green-100">
              Sign up and get <strong className="text-brand-chartreuse">2 free invoices</strong> to test everything out — no commitment.
            </p>
            <Link
              href={registerHref}
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand-chartreuse px-6 py-3 text-base font-semibold text-brand-evergreen shadow-lg transition-all hover:bg-white hover:scale-105"
            >
              Get Your Free Invoices →
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
          {LANDING_PLANS.map((plan: Plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Invoice Packs */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 border-2 border-brand-jade text-center">
            <h3 className="text-2xl font-bold text-brand-evergreen">📦 Need More Invoices?</h3>
            <p className="mt-2 text-lg text-slate-700">Sell more? Just add more invoices.</p>
            <div className="mt-6 flex items-center justify-center gap-6 flex-wrap">
              <div className="text-center">
                <span className="text-2xl font-bold text-blue-600">25 invoices</span>
                <span className="text-slate-400 mx-2">→</span>
                <span className="text-2xl font-bold text-blue-600">₦625</span>
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-brand-jade">50 invoices</span>
                <span className="text-slate-400 mx-2">→</span>
                <span className="text-2xl font-bold text-brand-jade">₦1,250</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600">
              💡 <strong>No forced upgrade.</strong> Buy invoice packs as you grow—scales with your success.
            </p>
          </div>
        </div>

        {/* Pro Features Subscription */}
        <div className="mt-8 max-w-3xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-8 border-2 border-brand-jade/40 text-center">
            <h3 className="text-2xl font-bold text-brand-evergreen">⭐ Want Pro Features Only?</h3>
            <p className="mt-2 text-lg text-slate-700">
              Subscribe to <strong>Pro Features</strong> for <strong>₦1,500/month</strong> — all premium features, no invoices included.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Custom branding, tax reports, inventory, team management, daily WhatsApp summary & more.
              Auto-renews monthly. Cancel anytime.
            </p>
            <p className="mt-2 text-xs text-slate-400">
              A small payment-processing fee is added at checkout.
            </p>
          </div>
        </div>

        {/* Closing reassurance */}
        <p className="mt-12 text-center text-lg font-semibold text-slate-700">
          👉 No forced banking. No accounting setup. No hidden stress.
        </p>
        <p className="mt-2 text-center text-xs text-slate-400">
          All prices exclude a small payment-processing fee added at checkout.
        </p>
      </div>
    </section>
  );
}

function PricingCard({ plan }: { plan: Plan }) {
  const isFree = plan.id === "FREE";
  
  return (
    <div
      className={`rounded-2xl bg-white p-6 border transition-all hover:shadow-lg ${
        plan.popular
          ? "border-brand-jade ring-2 ring-brand-jade shadow-lg"
          : "border-slate-200"
      }`}
    >
      {plan.popular && (
        <div className="mb-3 inline-block rounded-full bg-brand-jade/10 px-3 py-1 text-xs font-semibold text-brand-jade">
          MOST POPULAR
        </div>
      )}
      {isFree && (
        <div className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          2 FREE INVOICES
        </div>
      )}
      <h3 className="text-lg font-bold text-brand-evergreen">{plan.displayName}</h3>
      <div className="mt-3">
        <span className="text-3xl font-bold text-brand-evergreen">{plan.priceDisplay}</span>
        {plan.hasMonthlySubscription && <span className="text-slate-500">/mo</span>}
      </div>
      <p className="mt-2 text-sm font-medium text-brand-jade">
        {plan.invoicesDisplay}
      </p>
      {isFree && (
        <p className="mt-1 text-xs text-slate-500">No credit card required • Buy more anytime</p>
      )}
      <ul className="mt-6 space-y-3 text-sm text-slate-600">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <svg className="h-5 w-5 text-brand-jade flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
