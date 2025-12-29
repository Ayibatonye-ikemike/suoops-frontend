import Link from "next/link";

export function Features() {
  return (
    <>
      {/* Problem Section */}
      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-brand-evergreen sm:text-4xl">
              Invoicing shouldn&apos;t slow your business down
            </h2>
          </div>
          <div className="mt-8 space-y-4">
            <p className="text-lg text-slate-700">
              Most small businesses already sell, negotiate, and follow up with customers on WhatsApp. 
              But invoicing tools still force you into dashboards, emails, and accounting complexity.
            </p>
            <p className="font-semibold text-slate-900">That leads to:</p>
            <ul className="space-y-3">
              <ProblemItem text="Late payments" />
              <ProblemItem text="Lost invoice records" />
              <ProblemItem text="Unclear stock levels" />
              <ProblemItem text="Confusion about taxes" />
              <ProblemItem text="Too much time spent &quot;just admin&quot;" />
            </ul>
            <p className="mt-6 text-lg font-semibold text-brand-jade">
              Suoops fixes this by bringing invoicing to where your business already runs.
            </p>
          </div>
        </div>
      </section>

      {/* Core Value Proposition */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-brand-evergreen sm:text-4xl">
              Built for WhatsApp-first businesses
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <ValueCard
              icon="💬"
              title="Create invoices by texting"
              description="Send a message like:"
              codeExample="Invoice John ₦50k for design"
              footer="Suoops turns it into a professional, payment-ready invoice instantly."
            />
            <ValueCard
              icon="🏦"
              title="Works with any Nigerian bank"
              description="Add your existing bank account once. Invoices include clear transfer instructions—no forced bank lock-in."
            />
            <ValueCard
              icon="📊"
              title="Know where your money stands"
              description="See who has paid, who hasn't, what stock is low, and whether you're tax-safe—all in one dashboard."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="features" className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-brand-evergreen sm:text-4xl">
              How it works
            </h2>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            <StepCard
              number={1}
              title="Create an invoice"
              description="From WhatsApp or the dashboard. Add line items, customers, or products."
            />
            <StepCard
              number={2}
              title="Send instantly"
              description="Send invoices directly on WhatsApp or download a PDF."
            />
            <StepCard
              number={3}
              title="Get paid & track"
              description="Get notified when customers pay. Track pending invoices and follow up easily."
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
                "Custom branding with your logo",
                "Team access for small teams"
              ]}
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
              note="Small businesses under ₦25M annual revenue are exempt from Company Income Tax."
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
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}

function ProblemItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 p-4 bg-white rounded-lg border-l-4 border-red-500">
      <span className="font-medium text-slate-700">{text}</span>
    </li>
  );
}

interface ValueCardProps {
  icon: string;
  title: string;
  description: string;
  codeExample?: string;
  footer?: string;
}

function ValueCard({ icon, title, description, codeExample, footer }: ValueCardProps) {
  return (
    <div className="p-6 bg-white border-2 border-slate-200 rounded-xl hover:border-brand-jade transition-all hover:shadow-lg">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-brand-evergreen mb-3">{title}</h3>
      <p className="text-slate-600 mb-3">{description}</p>
      {codeExample && (
        <div className="bg-slate-900 text-green-400 p-3 rounded-lg font-mono text-sm my-3">
          &quot;{codeExample}&quot;
        </div>
      )}
      {footer && <p className="text-slate-600 mt-3">{footer}</p>}
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
    <div className="p-6 bg-slate-50 rounded-xl">
      <h3 className="text-xl font-bold text-brand-evergreen mb-4">{title}</h3>
      <ul className="space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-slate-700">
            <span className="text-brand-jade mt-1">•</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {note && (
        <div className="mt-4 p-3 bg-brand-jade/10 rounded-lg text-sm text-slate-700">
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

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-jade/10">
        <svg className="h-4 w-4 text-brand-jade" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      <span className="text-slate-700">{text}</span>
    </li>
  );
}
