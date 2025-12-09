"use client";

interface HeroProps {
  onWatchDemo: () => void;
}

export function Hero({ onWatchDemo }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-brand-evergreen px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-citrus/80 bg-brand-citrus/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-evergreen w-fit shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-jade opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-jade"></span>
              </span>
              Coming Soon • Join Waitlist 🚀
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-brand-textMuted/80">
              Smart invoicing, simplified
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Invoice via
              {/* <span className="bg-gradient-to-r from-brand-jade to-brand-citrus bg-clip-text text-transparent"> */}
              <span className="inline-block bg-gradient-to-r to-[#14B56A] from-[#BFF74A] bg-clip-text text-transparent">
                {" "}
                WhatsApp or Email
              </span>
              <br />
              Get Paid Faster
            </h1>
            <p className="mt-6 text-lg text-white/85 sm:text-xl">
              Create professional invoices by sending a voice note or text
              message on WhatsApp. AI-powered invoice creation, automatic tax
              compliance, and multi-channel delivery (WhatsApp + Email). No apps
              to download, no complex software—just speak or type and get paid.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSc8s7K5WNC_6xDzg2IlUMJtxzvF4T18YwYlW_ruHMyC6IT5yg/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-jade px-8 py-4 text-center text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-brand-teal"
              >
                Join Waitlist - Get Early Access 🚀
              </a>
              <button
                onClick={onWatchDemo}
                className="rounded-lg border border-white/30 bg-white/5 backdrop-blur-sm px-8 py-4 text-center text-base font-semibold text-white transition-all hover:bg-white/15"
              >
                Watch Demo →
              </button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-brand-jade"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                50% launch discount
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-brand-jade"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Priority early access
              </div>
            </div>
          </div>
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <div className="relative lg:mt-0">
      <div className="relative mx-auto max-w-md">
        {/* Phone Mockup */}
        <div className="relative rounded-[3rem] border-[14px] border-slate-900 bg-slate-900 shadow-2xl">
          <div className="overflow-hidden rounded-[2.3rem] bg-white">
            {/* Status Bar */}
            <div className="bg-gradient-to-b from-emerald-500 to-emerald-600 px-6 py-3">
              <div className="flex items-center justify-between text-white">
                <span className="text-xs font-medium">9:41</span>
                <div className="flex gap-1">
                  <div className="h-3 w-3 rounded-full border border-white"></div>
                  <div className="h-3 w-3 rounded-full border border-white"></div>
                  <div className="h-3 w-3 rounded-full border border-white"></div>
                </div>
              </div>
            </div>
            {/* WhatsApp Header */}
            <div className="bg-emerald-600 px-6 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-300"></div>
                <div>
                  <p className="font-semibold">SuoOps Bot</p>
                  <p className="text-xs opacity-90">online</p>
                </div>
              </div>
            </div>
            {/* Chat Messages */}
            <div className="bg-[#efeae2] px-4 py-6 space-y-3 min-h-[400px]">
              {/* Incoming Message */}
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg bg-white px-4 py-2 shadow-sm">
                  <p className="text-sm text-slate-800">
                    👋 Hi! Send me a voice note to create an invoice.
                  </p>
                  <p className="mt-1 text-xs text-brand-charcoal/60">9:40 AM</p>
                </div>
              </div>
              {/* Voice Note */}
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-lg bg-emerald-100 px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="h-1 w-full rounded-full bg-emerald-300">
                        <div className="h-1 w-3/4 rounded-full bg-emerald-600"></div>
                      </div>
                      <p className="mt-1 text-xs text-brand-charcoal/70">
                        0:15
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-brand-charcoal/70 italic">
                    &quot;Invoice Jane fifty thousand naira for logo
                    design&quot;
                  </p>
                </div>
              </div>
              {/* Bot Response */}
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg bg-white px-4 py-3 shadow-sm">
                  <p className="text-sm font-semibold text-slate-800">
                    ✅ Invoice Created!
                  </p>
                  <div className="mt-2 space-y-1 text-sm text-brand-charcoal/70">
                    <p>📄 ID: INV-2024-001</p>
                    <p>👤 Customer: Jane</p>
                    <p>💰 Amount: ₦50,000</p>
                  </div>
                  <button className="mt-3 w-full rounded-lg bg-brand-jade py-2 text-sm font-semibold text-white">
                    View Invoice →
                  </button>
                  <p className="mt-2 text-xs text-brand-charcoal/60">9:41 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-brand-textMuted opacity-50 blur-2xl"></div>
        <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-purple-100 opacity-50 blur-2xl"></div>
      </div>
    </div>
  );
}
