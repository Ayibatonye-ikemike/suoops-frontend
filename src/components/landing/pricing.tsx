import { LANDING_PLANS, type Plan } from "../../constants/pricing";

export function Pricing() {
  return (
    <>
      {/* Premium Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600">UPGRADE BENEFITS</h2>
            <p className="mt-2 text-4xl font-bold text-slate-900 sm:text-5xl">
              Unlock Premium Features
            </p>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Start with free manual invoicing. Upgrade for tax automation (Starter), custom branding (Pro), or voice+OCR (Business).
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <PremiumFeature
              emoji="🎤"
              title="Voice Invoices"
              description="Speak naturally on WhatsApp. AI transcribes and creates invoices - truly hands-free."
              benefits={[
                "Nigerian English support",
                "Works while driving/busy",
                "10 second invoices",
              ]}
              badge="Business plan (15/mo)"
              badgeColor="purple"
            />
            <PremiumFeature
              emoji="📸"
              title="Photo OCR"
              description="Snap a photo of any receipt and AI extracts customer name, amount, and items automatically."
              benefits={[
                "Upload receipt photos",
                "AI data extraction",
                "No manual typing",
              ]}
              badge="Business plan (15/mo)"
              badgeColor="orange"
            />
            <PremiumFeature
              emoji="🎨"
              title="Custom Logo Branding"
              description="Upload your business logo to appear on all invoices. Build brand recognition with every invoice."
              benefits={[
                "Custom logo on PDFs",
                "Branded invoices",
                "Professional appearance",
              ]}
              badge="Pro plan & above"
              badgeColor="blue"
            />
          </div>

          <TrustIndicators />
        </div>
      </section>

      {/* Pricing Table */}
      <section id="pricing" className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-base font-semibold text-blue-600">PRICING</h2>
          <p className="mt-2 text-4xl font-bold text-slate-900">
            Start free, upgrade as you grow
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {LANDING_PLANS.map((plan: Plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSc8s7K5WNC_6xDzg2IlUMJtxzvF4T18YwYlW_ruHMyC6IT5yg/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Join Waitlist →
          </a>
        </div>
      </section>
    </>
  );
}

interface PremiumFeatureProps {
  emoji: string;
  title: string;
  description: string;
  benefits: string[];
  badge: string;
  badgeColor: "purple" | "orange" | "blue";
}

function PremiumFeature({ emoji, title, description, benefits, badge, badgeColor }: PremiumFeatureProps) {
  const badgeColors = {
    purple: "bg-purple-50 text-purple-700",
    orange: "bg-orange-50 text-orange-700",
    blue: "bg-blue-50 text-blue-700",
  };

  const gradients = {
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
    blue: "from-blue-500 to-blue-600",
  };

  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-sm hover:shadow-lg transition-all">
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradients[badgeColor]} text-3xl shadow-lg`}>
        {emoji}
      </div>
      <h3 className="mt-6 text-xl font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-slate-600">{description}</p>
      <ul className="mt-4 space-y-2 text-sm text-slate-600">
        {benefits.map((benefit, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
      <div className={`mt-6 rounded-lg ${badgeColors[badgeColor]} px-3 py-2 text-center`}>
        <p className="text-sm font-semibold">{badge}</p>
      </div>
    </div>
  );
}

function TrustIndicators() {
  return (
    <div className="mt-16 rounded-3xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-8 lg:p-12">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-900">Built with Enterprise-Grade Technology</h3>
        <p className="mt-2 text-sm text-slate-600">Security and reliability you can trust</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600">99.9%</div>
          <div className="mt-2 text-sm font-medium text-slate-600">Uptime SLA</div>
          <div className="mt-1 text-xs text-slate-500">Always available</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600">256-bit</div>
          <div className="mt-2 text-sm font-medium text-slate-600">Encryption</div>
          <div className="mt-1 text-xs text-slate-500">Bank-grade security</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600">FIRS</div>
          <div className="mt-2 text-sm font-medium text-slate-600">Tax Ready</div>
          <div className="mt-1 text-xs text-slate-500">Compliance built-in</div>
        </div>
      </div>
    </div>
  );
}

function PricingCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={`rounded-2xl border bg-white p-6 ${
        plan.popular ? "border-blue-500 ring-2 ring-blue-500" : "border-slate-200"
      }`}
    >
      {plan.popular && (
        <div className="mb-2 text-xs font-semibold text-blue-600">MOST POPULAR</div>
      )}
      <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
      <div className="mt-2">
        <span className="text-3xl font-bold">{plan.priceDisplay}</span>
        <span className="text-slate-600">/mo</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-900">{plan.invoiceLimitDisplay}</p>
      <ul className="mt-4 space-y-2 text-left text-xs text-slate-600">
        {plan.features.map((feature, j) => (
          <li key={j} className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
