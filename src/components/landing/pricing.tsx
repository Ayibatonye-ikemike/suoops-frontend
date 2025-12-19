import { LANDING_PLANS, type Plan } from "../../constants/pricing";

export function Pricing() {
  return (
    <section id="pricing" className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-jade">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-bold text-brand-evergreen sm:text-4xl">
            Start free, upgrade as you grow
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Simple, transparent pricing. No hidden fees. Cancel anytime.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
          {LANDING_PLANS.map((plan: Plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSc8s7K5WNC_6xDzg2IlUMJtxzvF4T18YwYlW_ruHMyC6IT5yg/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-brand-jade px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-brand-teal hover:scale-105"
          >
            Join Waitlist
          </a>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 rounded-2xl bg-white p-8 border border-slate-200 shadow-sm">
          <div className="grid gap-8 sm:grid-cols-3 text-center">
            <div>
              <div className="text-3xl font-bold text-brand-jade">99.9%</div>
              <div className="mt-1 text-sm text-slate-600">Uptime SLA</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-jade">256-bit</div>
              <div className="mt-1 text-sm text-slate-600">Encryption</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-jade">FIRS</div>
              <div className="mt-1 text-sm text-slate-600">Tax Ready</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingCard({ plan }: { plan: Plan }) {
  const isStarter = plan.id === "STARTER";
  
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
      <h3 className="text-lg font-bold text-brand-evergreen">{plan.name}</h3>
      <div className="mt-3">
        <span className="text-3xl font-bold text-brand-evergreen">{plan.priceDisplay}</span>
        {plan.hasMonthlySubscription && <span className="text-slate-500">/mo</span>}
      </div>
      <p className="mt-2 text-sm font-medium text-brand-jade">
        {plan.invoicesDisplay}
      </p>
      {isStarter && (
        <p className="mt-1 text-xs text-slate-500">No monthly subscription</p>
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
