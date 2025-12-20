import Image from "next/image";
import Link from "next/link";

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
            <Link
              href="/login"
              className="rounded-lg bg-brand-jade px-4 py-2 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-brand-teal"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

// PreLaunchBanner removed - product is now live

export function CTASection() {
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
          href="/register"
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

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-evergreen">
                <Image
                  src="/icon.png"
                  alt="SuoOps"
                  width={32}
                  height={32}
                  className="h-6 w-6 object-contain"
                  priority
                />
              </div>
              <span className="text-lg font-bold text-brand-evergreen">SuoOps</span>
            </div>
            <p className="mt-4 text-sm text-slate-600">
              The easiest way for Nigerian businesses to create invoices and get paid.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-brand-evergreen">Product</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                <a href="#features" className="hover:text-brand-jade transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-brand-jade transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-brand-jade transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-brand-evergreen">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                <a href="mailto:info@suoops.com" className="hover:text-brand-jade transition-colors">
                  Contact
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
          © 2025 SuoOps. All rights reserved. Made with ❤️ in Nigeria 🇳🇬
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
