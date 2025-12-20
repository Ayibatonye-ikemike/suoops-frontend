import Link from "next/link";

export function Features() {
  return (
    <>
      {/* How It Works */}
      <section id="features" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-jade">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold text-brand-evergreen sm:text-4xl">
              Create invoices your way
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Use WhatsApp or our web dashboard. Customers get invoices via WhatsApp + Email.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <StepCard
              number={1}
              title="Sign Up"
              description="Create your free SuoOps account and set up your business profile."
            />
            <StepCard
              number={2}
              title="Connect WhatsApp"
              description="Link your WhatsApp to start sending invoices from chat."
            />
            <StepCard
              number={3}
              title="Send a Message"
              description='Type: "Invoice Joy 08012345678, 2000 boxers, 5000 hair".'
            />
            <StepCard
              number={4}
              title="Get Paid"
              description="Customer receives invoice via WhatsApp + Email, pays, and you get notified."
            />
          </div>
        </div>
      </section>

      {/* Invoice Feature Section */}
      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-jade">
                Invoice
              </p>
              <h2 className="mt-3 text-3xl font-bold text-brand-evergreen sm:text-4xl">
                Invoice creation made simple
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Create invoices from WhatsApp or our web dashboard. Customers receive them via WhatsApp and Email automatically.
              </p>
              <ul className="mt-8 space-y-4">
                <FeatureItem text="WhatsApp: Text messages" />
                <FeatureItem text="Web dashboard: Create invoices online" />
                <FeatureItem text="Delivery: WhatsApp + Email to customers" />
                <FeatureItem text="QR code verification on every invoice" />
              </ul>
              <Link
                href="/register"
                className="mt-8 inline-flex items-center justify-center rounded-lg bg-brand-jade px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-brand-teal"
              >
                Get started
              </Link>
            </div>
            <div className="relative">
              <div className="rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-brand-jade/10 flex items-center justify-center">
                      <span className="text-xl">📄</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Invoice Created</p>
                      <p className="text-sm text-slate-500">Just now</p>
                    </div>
                  </div>
                  <span className="text-2xl">✅</span>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Invoice ID</span>
                    <span className="font-mono text-slate-800">INV-2024-001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Customer</span>
                    <span className="text-slate-800">Joy</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Amount</span>
                    <span className="font-semibold text-brand-evergreen">₦7,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status</span>
                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Track Feature Section */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="order-2 lg:order-1">
              <div className="rounded-2xl bg-slate-50 p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-brand-jade/10 flex items-center justify-center">
                    <span className="text-xl">📊</span>
                  </div>
                  <p className="font-semibold text-slate-800">Payment Tracking</p>
                </div>
                <div className="space-y-4">
                  <div className="rounded-xl bg-white p-4 border border-slate-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-slate-800">Jane Doe</p>
                        <p className="text-sm text-slate-500">INV-2024-001</p>
                      </div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">Paid</span>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-brand-evergreen">₦50,000</p>
                  </div>
                  <div className="rounded-xl bg-white p-4 border border-slate-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-slate-800">John Smith</p>
                        <p className="text-sm text-slate-500">INV-2024-002</p>
                      </div>
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">Pending</span>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-brand-evergreen">₦75,000</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-jade">
                Track
              </p>
              <h2 className="mt-3 text-3xl font-bold text-brand-evergreen sm:text-4xl">
                Seamless payment tracking
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Monitor payment streams with precision. Get real-time notifications when customers pay, and track your cash flow effortlessly.
              </p>
              <ul className="mt-8 space-y-4">
                <FeatureItem text="Real-time payment notifications" />
                <FeatureItem text="Daily and weekly reports" />
                <FeatureItem text="Customer payment confirmation via WhatsApp" />
              </ul>
              <Link
                href="/register"
                className="mt-8 inline-flex items-center justify-center rounded-lg bg-brand-jade px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-brand-teal"
              >
                Get started
              </Link>
            </div>
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
