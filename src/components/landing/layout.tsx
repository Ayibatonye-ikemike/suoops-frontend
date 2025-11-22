import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-brand-teal/20 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm text-2xl font-bold text-white shadow-lg border border-white/20">
                <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8">
                  <path d="M9 12h6M9 16h6M9 8h6M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 4v4M8 4v4" stroke="#2e7d4e" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-white">SuoOps</span>
            </div>
            <p className="mt-4 text-sm text-white/70">
              The easiest way for Nigerian businesses to create invoices and get paid.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Product</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><a href="#features" className="hover:text-brand-citrus transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-brand-citrus transition-colors">Pricing</a></li>
              <li><Link href="/dashboard" className="hover:text-brand-citrus transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white">Company</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><a href="mailto:info@suoops.com" className="hover:text-brand-citrus transition-colors">Contact</a></li>
              <li><a href="https://api.suoops.com/healthz" target="_blank" rel="noopener noreferrer" className="hover:text-brand-citrus transition-colors">Status</a></li>
              <li><Link href="/login" className="hover:text-brand-citrus transition-colors">Login</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white">Legal</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><Link href="/privacy" className="hover:text-brand-citrus transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-citrus transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-white/60">
          © 2025 SuoOps. All rights reserved. Made with ❤️ in Nigeria 🇳🇬
        </div>
      </div>
    </footer>
  );
}

export function PreLaunchBanner() {
  return (
    <div className="bg-brand-citrus px-4 py-3 text-center">
      <p className="text-sm font-semibold text-brand-evergreen">
        ⏳ <strong>Pre-Launch:</strong> Join our waitlist to get early access + exclusive 50% launch discount! 🚀
      </p>
    </div>
  );
}

export function Navigation() {
  return (
    <nav className="border-b border-brand-teal/20 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-evergreen text-2xl font-bold text-white shadow-lg">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                <path d="M9 12h6M9 16h6M9 8h6M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 4v4M8 4v4" stroke="#2e7d4e" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-brand-evergreen">SuoOps</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSc8s7K5WNC_6xDzg2IlUMJtxzvF4T18YwYlW_ruHMyC6IT5yg/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-brand-charcoal/70 hover:text-brand-jade transition-colors"
            >
              Join Waitlist
            </a>
            <Link
              href="/login"
              className="rounded-lg bg-brand-jade px-4 py-2 text-sm font-semibold text-white hover:bg-brand-teal transition-colors shadow-sm"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function WaitlistCounter() {
  return (
    <section className="border-y border-brand-teal/20 bg-brand-mint px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <div className="inline-flex items-center gap-4 rounded-2xl border-2 border-brand-jade/30 bg-white px-8 py-6 shadow-lg">
          <div className="text-left">
            <p className="text-4xl font-bold text-brand-jade">50+</p>
            <p className="text-sm font-medium text-brand-charcoal/70">Businesses Waiting</p>
          </div>
          <div className="h-16 w-px bg-brand-teal/30"></div>
          <div className="text-left">
            <p className="text-sm font-semibold text-white">Join the waitlist today</p>
            <p className="text-xs text-white/70">Limited early access spots</p>
          </div>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSc8s7K5WNC_6xDzg2IlUMJtxzvF4T18YwYlW_ruHMyC6IT5yg/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-brand-jade px-6 py-3 text-sm font-semibold text-white hover:bg-brand-teal transition-colors shadow-sm"
          >
            Join Now →
          </a>
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-evergreen to-brand-teal px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-bold text-white sm:text-5xl">
          Be the first to experience it
        </h2>
        <p className="mt-4 text-xl text-brand-mint">
          Join our waitlist and get exclusive early access when we launch!
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSc8s7K5WNC_6xDzg2IlUMJtxzvF4T18YwYlW_ruHMyC6IT5yg/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-jade px-8 py-4 text-center text-base font-semibold text-white shadow-lg hover:bg-white hover:text-brand-jade transition-all hover:scale-105"
          >
            🚀 Join Waitlist Now
          </a>
        </div>
        <p className="mt-6 text-sm text-brand-mint">
          ✓ 50% launch discount · ✓ Priority early access · ✓ Exclusive updates
        </p>
      </div>
    </section>
  );
}

export function VideoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
