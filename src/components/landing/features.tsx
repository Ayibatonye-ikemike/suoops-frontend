export function Features() {
  return (
    <>
      {/* How It Works */}
      <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-citrus">How it works</p>
            <p className="mt-3 font-heading text-4xl font-bold text-white sm:text-5xl">
              Simple as sending a message
            </p>
            <p className="mt-4 text-lg text-white/80">
              No apps, no training, no hassle. Just WhatsApp—use voice notes or text messages.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <StepCard
              number={1}
              emoji="🎤"
              title="Send Voice or Text"
              description='Open WhatsApp and send a voice note or text: "Invoice John 25,000 naira for consultation"'
            />
            <StepCard
              number={2}
              emoji="⚡"
              title="AI Creates Invoice"
              description="Our AI instantly understands your voice and generates a professional invoice with payment details"
            />
            <StepCard
              number={3}
              emoji="💸"
              title="Get Paid"
              description="Customer receives invoice via WhatsApp, pays via bank transfer, and you get notified instantly"
            />
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-citrus">Features</p>
            <p className="mt-3 font-heading text-4xl font-bold text-white sm:text-5xl">
              Create Invoices Your Way
            </p>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
              Free WhatsApp text + voice. Upgrade for photo OCR. Every invoice includes QR verification.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            <FeatureCard
              emoji="💬"
              title="WhatsApp Text"
              description="Type and send. No forms, no calculations, just simple text."
              speed="5 seconds"
              example='"Invoice Jane 50k for logo"'
              color="blue"
              benefits={[
                { text: "Perfect for: When you're at your desk or prefer typing", bold: true },
                { text: "AI understands Nigerian English and currency" },
                { text: "Works offline - sends when you're back online" },
              ]}
            />
            <FeatureCard
              emoji="🎤"
              title="Voice Notes"
              description="Speak naturally. AI transcribes and creates invoice instantly."
              speed="10 seconds"
              example='"Invoice Jane fifty thousand for logo"'
              exampleType="voice"
              color="purple"
              benefits={[
                { text: "Perfect for: When you're driving, busy, or prefer talking", bold: true },
                { text: "Truly hands-free - no typing required" },
                { text: "AI-powered transcription with Nigerian English support" },
              ]}
            />
            <FeatureCard
              emoji="📸"
              title="Photo OCR"
              description="Snap a receipt photo. AI reads it and creates your invoice."
              speed="8 seconds"
              exampleType="photo"
              color="orange"
              benefits={[
                { text: "Perfect for: Converting handwritten receipts to digital invoices", bold: true },
                { text: "No retyping - AI reads customer name, amount, items" },
                { text: "Available on Starter plan and above" },
              ]}
            />
            <FeatureCard
              emoji="🔐"
              title="QR Verification"
              description="Every invoice includes a QR code. Customers scan it to verify authenticity instantly."
              speed="2 seconds"
              exampleType="qr"
              color="green"
              benefits={[
                { text: "Perfect for: Building customer trust - prove invoices are legitimate", bold: true },
                { text: "Stop impersonation - only your real invoices have valid QR codes" },
                { text: "Works with any phone camera - no special app needed" },
              ]}
            />
          </div>

          <BeforeAfter />
          <QuickStats />
        </div>
      </section>
    </>
  );
}

interface StepCardProps {
  number: number;
  emoji: string;
  title: string;
  description: string;
}

function StepCard({ number, emoji, title, description }: StepCardProps) {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/95 p-8 text-brand-charcoal shadow-lg">
      <div className="absolute -top-4 left-8 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-evergreen text-xl font-heading font-bold text-white shadow-xl">
        {number}
      </div>
      <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-mint text-3xl">
        {emoji}
      </div>
      <h3 className="mt-6 font-heading text-xl font-bold text-brand-evergreen">{title}</h3>
      <p className="mt-3 text-sm text-brand-charcoal/80">{description}</p>
    </div>
  );
}

interface Benefit {
  text: string;
  bold?: boolean;
}

interface FeatureCardProps {
  emoji: string;
  title: string;
  description: string;
  speed: string;
  example?: string;
  exampleType?: "text" | "voice" | "photo" | "qr";
  color: "blue" | "purple" | "orange" | "green";
  benefits: Benefit[];
}

function FeatureCard({ emoji, title, description, speed, example, exampleType = "text", color, benefits }: FeatureCardProps) {
  const accentClass = "bg-brand-mint";

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/95 p-8 text-brand-charcoal shadow-xl">
      <div className="absolute inset-x-12 top-0 h-24 rounded-full bg-white/30 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-evergreen text-3xl text-white shadow-lg">
            {emoji}
          </div>
          <span className="rounded-full bg-brand-mint px-3 py-1 text-xs font-semibold text-brand-evergreen">
            ⚡ {speed}
          </span>
        </div>
        <h3 className="mt-6 font-heading text-2xl font-bold text-brand-evergreen">{title}</h3>
        <p className="mt-2 text-brand-charcoal/80">{description}</p>

        <ExamplePreview type={exampleType} example={example} accentClass={accentClass} />

        <ul className="mt-6 space-y-3">
          {benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-brand-charcoal/70">
              <svg className="h-5 w-5 text-brand-jade mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{benefit.bold ? <strong>{benefit.text}</strong> : benefit.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ExamplePreview({ type, example, accentClass }: { type: string; example?: string; accentClass: string }) {
  if (type === "text" && example) {
    return (
      <div className={`mt-6 rounded-xl ${accentClass} p-4 border border-brand-teal/20`}>
        <p className="text-sm font-mono text-slate-700">{example}</p>
        <div className="mt-3 flex items-center gap-2 text-xs text-brand-charcoal/60">
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Invoice created
          </span>
          <span>→</span>
          <span>5 sec</span>
        </div>
      </div>
    );
  }

  if (type === "voice" && example) {
    return (
      <div className={`mt-6 rounded-xl ${accentClass} p-4 border border-brand-teal/20`}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 text-white">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-700">0:15 audio</p>
            <p className="text-xs text-brand-charcoal/60 italic">{example}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-brand-charcoal/60">
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Transcribed + Invoice created
          </span>
          <span>→</span>
          <span>10 sec</span>
        </div>
      </div>
    );
  }

  if (type === "photo") {
    return (
      <div className={`mt-6 rounded-xl ${accentClass} p-4 border border-brand-teal/20`}>
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-16 rounded-lg bg-slate-200 flex items-center justify-center text-2xl overflow-hidden">
            📄
            <div className="absolute inset-0 border-2 border-dashed border-slate-400 rounded-lg"></div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-700">Receipt uploaded</p>
            <p className="text-xs text-brand-charcoal/60">AI extracting data...</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-brand-charcoal/60">
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Data extracted + Invoice created
          </span>
          <span>→</span>
          <span>8 sec</span>
        </div>
      </div>
    );
  }

  if (type === "qr") {
    return (
      <div className={`mt-6 rounded-xl ${accentClass} p-4 border border-brand-teal/20`}>
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center">
            <div className="grid grid-cols-4 gap-0.5">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 bg-white rounded-sm"></div>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-700">Customer scanning QR...</p>
            <p className="text-xs text-brand-charcoal/60">Verifying invoice...</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 rounded-lg bg-green-100 px-3 py-2 text-center">
            <p className="text-lg font-bold text-green-700">✅ VERIFIED</p>
            <p className="text-xs text-green-600">Invoice is authentic</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function BeforeAfter() {
  return (
    <div className="mt-20 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 lg:p-12 shadow-2xl">
      <h3 className="text-center text-3xl font-bold text-white sm:text-4xl">
        The Problem We Solve
      </h3>
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {/* Before */}
        <div className="rounded-2xl bg-red-900/30 border-2 border-red-500/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">😓</span>
            <h4 className="text-xl font-bold text-red-200">Without SuoOps</h4>
          </div>
          <ul className="space-y-3 text-slate-300">
            {[
              "Spend 10+ minutes creating each invoice manually",
              "Customers can't verify if invoices are legitimate",
              "Manually calculate VAT and development levy for tax compliance",
              "Risk missing tax filing deadlines - no reminders or tracking",
              "Manually retype receipt details (slow & error-prone)",
              "Need computer access to create invoices",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-red-400 mt-1">✗</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* After */}
        <div className="rounded-2xl bg-green-900/30 border-2 border-green-500/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🚀</span>
            <h4 className="text-xl font-bold text-green-200">With SuoOps</h4>
          </div>
          <ul className="space-y-3 text-slate-300">
            {[
              "Create invoices in 5-10 seconds via WhatsApp or Email",
              "Every invoice has a QR code for authenticity verification",
              "Automated monthly tax reports with VAT & development levy calculations",
              "Stay FIRS-compliant effortlessly - never miss a deadline",
              "Snap receipt photos - AI extracts all details automatically",
              "Work from anywhere - just use your phone",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function QuickStats() {
  const stats = [
    { value: "5s", label: "Text Invoice" },
    { value: "10s", label: "Voice Invoice" },
    { value: "8s", label: "Photo OCR" },
    { value: "2s", label: "QR Verify" },
  ];

  return (
    <div className="mt-16 grid gap-6 sm:grid-cols-4">
      {stats.map((stat, i) => (
        <div key={i} className="rounded-2xl border border-white/10 bg-white/10 p-6 text-center text-white">
          <div className="text-4xl font-heading font-bold">{stat.value}</div>
          <div className="mt-2 text-sm text-white/80">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
