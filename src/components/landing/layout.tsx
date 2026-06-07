"use client";

import Image from "next/image";
import Link from "next/link";

import { MobileMenu } from "./mobile-menu";
import { useRegisterHref } from "@/hooks/use-tracking-params";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-brand-evergreen/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 shadow-lg ring-1 ring-white/20">
              <Image
                src="/icon.png"
                alt="SuoOps"
                width={40}
                height={40}
                className="h-8 w-8 object-contain"
                priority
              />
            </div>
            <span className="text-lg font-bold text-white">SuoOps</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="#features"
              className="hidden sm:block text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="hidden sm:block text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              Pricing
            </a>
            <a
              href="https://support.suoops.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              Support
            </a>
            <Link
              href="/login"
              className="hidden sm:block rounded-lg bg-brand-jade px-4 py-2 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-brand-teal"
            >
              Login
            </Link>
            {/* Mobile hamburger menu */}
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}

// PreLaunchBanner removed - product is now live

export function CTASection() {
  const registerHref = useRegisterHref();
  return (
    <section className="relative bg-brand-evergreen px-4 py-20 sm:px-6 lg:px-8 text-white">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Ready to simplify your invoicing?
        </h2>
        <p className="mt-4 text-lg text-white/80">
          Start creating professional invoices in seconds via WhatsApp or dashboard.
        </p>
        <Link
          href={registerHref}
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-brand-jade px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-brand-teal"
        >
          Get Started Free
        </Link>
        <p className="mt-6 text-sm text-white/60">
          ✓ Free to start · ✓ No credit card required
        </p>
      </div>
    </section>
  );
}

export function SupportEscalation() {
  const tiers = [
    {
      step: "1",
      title: "Self-Service",
      icon: "📚",
      description: "Browse our Help Center for guides, FAQs, and how-to articles.",
      action: { label: "Visit Help Center", href: "https://support.suoops.com", external: true },
      hint: "Most questions answered instantly",
    },
    {
      step: "2",
      title: "WhatsApp Bot",
      icon: "🤖",
      description: "Message our bot anytime — type \"help\" to see what it can do.",
      action: { label: "Message on WhatsApp", href: "https://wa.me/2348106865807?text=help", external: true },
      hint: "Available 24/7",
    },
    {
      step: "3",
      title: "Email Support",
      icon: "✉️",
      description: "Send us a detailed message and we'll get back to you within 24 hours.",
      action: { label: "support@suoops.com", href: "mailto:support@suoops.com", external: false },
      hint: "Response within 24 hrs",
    },
    {
      step: "4",
      title: "Urgent Escalation",
      icon: "🚨",
      description: "Payment issues or account locked? Reach our team directly for priority help.",
      action: { label: "Contact Support", href: "https://support.suoops.com/contact", external: true },
      hint: "Priority response",
    },
  ];

  return (
    <section id="support" className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-brand-evergreen sm:text-4xl">
            Need Help? We&apos;ve Got You.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Get the right support at every level — from instant self-service to priority escalation.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
            <div
              key={tier.step}
              className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Step badge */}
              <span className="absolute -top-3 left-6 inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-jade text-xs font-bold text-white shadow">
                {tier.step}
              </span>

              <span className="text-3xl" aria-hidden="true">{tier.icon}</span>
              <h3 className="mt-3 text-lg font-semibold text-brand-evergreen">
                {tier.title}
              </h3>
              <p className="mt-2 flex-1 text-sm text-slate-600">
                {tier.description}
              </p>

              <a
                href={tier.action.href}
                {...(tier.action.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand-evergreen/5 px-4 py-2.5 text-sm font-medium text-brand-evergreen transition-colors hover:bg-brand-evergreen/10"
              >
                {tier.action.label}
                {tier.action.external && (
                  <svg
                    className="ml-1.5 h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-4.5-6H18m0 0v4.5m0-4.5L10.5 13.5"
                    />
                  </svg>
                )}
              </a>

              <p className="mt-3 text-center text-xs font-medium text-brand-jade">
                {tier.hint}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function li>
              <li>
                <a
                  href="https://support.suoops.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-jade transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="https://api.suoops.com/healthz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-jade transition-colors"
                >
                  Status
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-brand-jade transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-brand-evergreen">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/privacy" className="hover:text-brand-jade transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-jade transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
          © 2025–2026 SuoOps. All rights reserved. Made with <span aria-hidden="true">❤️</span> in Nigeria <span aria-hidden="true">🇳🇬</span>
        </div>
      </div>
    </footer>
  );
}

// WaitlistCounter removed - product is now live

export function VideoModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-slate-300 text-4xl font-light"
          aria-label="Close video"
        >
          ×
        </button>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl">
          <iframe
            src="https://www.youtube.com/embed/l5VocoSn7yc?autoplay=1"
            title="SuoOps Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}
