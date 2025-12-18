"use client";

import Image from "next/image";

interface HeroProps {
  onWatchDemo: () => void;
}

export function Hero({ onWatchDemo }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-brand-evergreen px-4 py-16 sm:py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="flex flex-col justify-center">
            <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Invoice via WhatsApp
              <br />
              <span className="text-brand-citrus">or Email. Get paid faster.</span>
            </h1>
            <p className="mt-6 text-lg text-white/80 max-w-lg">
              Create invoices via WhatsApp (voice or text) or from our web dashboard. Customers receive invoices via WhatsApp and Email—wherever they prefer.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSc8s7K5WNC_6xDzg2IlUMJtxzvF4T18YwYlW_ruHMyC6IT5yg/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-brand-jade px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-brand-teal"
              >
                Get started
              </a>
              <button
                onClick={onWatchDemo}
                className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/5 backdrop-blur-sm px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/15"
              >
                Watch demo
              </button>
            </div>
          </div>

          {/* Right: Phone Mockup */}
          <div className="relative lg:mt-0">
            <div className="relative mx-auto max-w-sm">
              {/* Phone Frame */}
              <div className="relative rounded-[3rem] border-[14px] border-slate-900 bg-slate-900 shadow-2xl">
                <div className="overflow-hidden rounded-[2.3rem] bg-white">
                  {/* WhatsApp Header */}
                  <div className="bg-emerald-600 px-5 py-4 text-white">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                        <Image
                          src="/icon.png"
                          alt="SuoOps"
                          width={24}
                          height={24}
                          className="h-6 w-6 object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">SuoOps</p>
                        <p className="text-xs opacity-90">online</p>
                      </div>
                    </div>
                  </div>
                  {/* Chat Messages */}
                  <div className="bg-[#efeae2] px-4 py-6 space-y-3 min-h-[340px]">
                    {/* User Voice Note */}
                    <div className="flex justify-end">
                      <div className="max-w-[85%] rounded-lg bg-emerald-100 px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="h-1 w-24 rounded-full bg-emerald-300">
                              <div className="h-1 w-3/4 rounded-full bg-emerald-600"></div>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">0:08</p>
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-slate-500 italic">
                          &quot;Invoice Jane 50k for logo design&quot;
                        </p>
                      </div>
                    </div>
                    {/* Bot Response */}
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-lg bg-white px-4 py-3 shadow-sm">
                        <p className="text-sm font-semibold text-slate-800">✅ Invoice Created!</p>
                        <div className="mt-2 space-y-1 text-sm text-slate-600">
                          <p>📄 INV-2024-001</p>
                          <p>👤 Jane</p>
                          <p>💰 ₦50,000</p>
                        </div>
                        <button className="mt-3 w-full rounded-lg bg-brand-jade py-2 text-sm font-semibold text-white">
                          View Invoice →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative blurs */}
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-brand-citrus/30 blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-brand-jade/20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling Feature Pills */}
      <FeaturePills />
    </section>
  );
}

function FeaturePills() {
  const features = [
    { emoji: "🎤", text: "Voice invoices" },
    { emoji: "💬", text: "Text invoices" },
    { emoji: "📸", text: "Photo OCR" },
    { emoji: "🔐", text: "QR verification" },
    { emoji: "📱", text: "Mobile-first" },
    { emoji: "⚡", text: "Fast setup" },
    { emoji: "🎤", text: "Voice invoices" },
    { emoji: "💬", text: "Text invoices" },
    { emoji: "📸", text: "Photo OCR" },
    { emoji: "🔐", text: "QR verification" },
  ];

  return (
    <div className="mt-16 overflow-hidden">
      <div className="flex animate-scroll gap-4">
        {features.map((feature, i) => (
          <div
            key={i}
            className="flex-shrink-0 flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-white border border-white/20"
          >
            <span>{feature.emoji}</span>
            <span>{feature.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
