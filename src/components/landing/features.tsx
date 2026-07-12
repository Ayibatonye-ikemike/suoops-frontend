export function Features() {
  return (
    <>
      {/* How It Works */}
      <section id="features" className="bg-brand-mint px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-brand-evergreen sm:text-4xl">
              Built for WhatsApp-first businesses
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-charcoal/70">
              Text an invoice, send it instantly, and know exactly where your money stands.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <StepCard
              number={1}
              title="Create by texting"
              description='Message "Invoice John ₦50k for design" — or use the dashboard. We turn it into a payment-ready invoice instantly.'
            />
            <StepCard
              number={2}
              title="Send instantly"
              description="Send on WhatsApp or download a PDF, with clear transfer details for any Nigerian bank."
            />
            <StepCard
              number={3}
              title="Customers order & pay online"
              description="Share your storefront link — customers pay by transfer (held under buyer protection) and pick a courier for delivery right at checkout."
            />
            <StepCard
              number={4}
              title="Ship & track everything"
              description="Mark the order sent and we book the rider. See who's paid, what stock is low, and whether you're tax-safe — all in one dashboard."
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brand-evergreen sm:text-4xl">
              Everything you need to run your business
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <FeatureCard
              title="✅ Invoicing, without complexity"
              features={[
                "Create and send invoices in seconds",
                "Track paid, pending, and overdue invoices",
                "Works with any Nigerian bank — no forced lock-in",
                "Custom branding and team access — included, no plans",
              ]}
              highlight="Every feature included — just a flat 3% per invoice."
            />
            <FeatureCard
              title="🛒 Storefront & online payments"
              features={[
                "Share a public shop link on WhatsApp, Instagram or your bio",
                "Customers browse, pay by bank transfer, and pick a courier at checkout",
                "Every order is held under buyer protection until it's delivered",
                "You just mark it sent — we settle you after delivery",
              ]}
              highlight="Your own online storefront, live in minutes."
            />
            <FeatureCard
              title="🚚 Delivery, handled for you"
              features={[
                "Customers pick a courier and pay for delivery right at checkout",
                "Nationwide couriers — GIG, Fez, Sendbox, Gokada and more",
                "Just mark the order sent and we book the rider automatically",
                "You're paid after it's delivered, so buyers order with confidence",
              ]}
              highlight="Sell to anyone in Nigeria — delivery is built in."
            />
            <FeatureCard
              title="📦 Inventory that actually helps you sell"
              features={[
                "Manage products and categories",
                "Automatic stock updates when invoicing",
                "Low-stock alerts before you run out"
              ]}
            />
            <FeatureCard
              title="🧾 Simple tax insight (Nigeria-focused)"
              features={[
                "See your tax band clearly",
                "Know when you're exempt",
                "Understand your obligations without accounting jargon"
              ]}
              note="Small businesses under ₦100M annual turnover are exempt from Company Income Tax (NTA 2025)."
            />
            <FeatureCard
              title="💬 WhatsApp Bot (your unfair advantage)"
              features={[
                "Create invoices by chat",
                "Receive invoice notifications",
                "Follow up where conversations already happen"
              ]}
              highlight="This is not an add-on. This is the core workflow."
            />
          </div>
        </div>
      </section>
    </>
  );
}

interface StepCardProps {
  number: number;
  title: string;
  description: string;
}

function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="relative text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-jade text-lg font-bold text-white shadow-lg">
        {number}
      </div>
      <h3 className="mt-4 text-lg font-bold text-brand-evergreen">{title}</h3>
      <p className="mt-2 text-sm text-brand-charcoal/70">{description}</p>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  features: string[];
  note?: string;
  highlight?: string;
}

function FeatureCard({ title, features, note, highlight }: FeatureCardProps) {
  return (
    <div className="p-6 bg-brand-mint rounded-xl">
      <h3 className="text-xl font-bold text-brand-evergreen mb-4">{title}</h3>
      <ul className="space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-brand-charcoal/80">
            <span className="text-brand-jade mt-1">•</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {note && (
        <div className="mt-4 p-3 bg-brand-jade/10 rounded-lg text-sm text-brand-charcoal/80">
          {note}
        </div>
      )}
      {highlight && (
        <p className="mt-4 font-semibold text-brand-jade">
          {highlight}
        </p>
      )}
    </div>
  );
}
