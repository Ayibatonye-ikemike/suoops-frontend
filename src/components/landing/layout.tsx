import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-brand-teal/20 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm shadow-lg border border-white/20">
                <Image src="/icon.png" alt="SuoOps logo" width={48} height={48} className="h-10 w-10 object-contain" priority />
              </div>
              <span className="text-xl font-heading font-bold text-white">SuoOps</span>
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
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-brand-evergreen/95 backdrop-blur-md text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 shadow-lg ring-1 ring-white/20">
              <Image src="/icon.png" alt="SuoOps icon" width={40} height={40} className="h-8 w-8 object-contain" priority />
            </div>
            <div>
              <span className="block text-base uppercase tracking-[0.3em] text-white/80">SuoOps</span>
              <p className="text-xs text-brand-mint">Smart invoicing, simplified.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSc8s7K5WNC_6xDzg2IlUMJtxzvF4T18YwYlW_ruHMyC6IT5yg/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-white/80 hover:text-white transition-colors"
            >
              Join Waitlist
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

export function WaitlistCounter() {
  return (
    <section className="border-y border-brand-teal/10 bg-brand-mint px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <div className="inline-flex items-center gap-4 rounded-2xl border-2 border-brand-jade/30 bg-white px-8 py-6 shadow-lg">
          <div className="text-left">
            <p className="text-4xl font-bold text-brand-jade">50+</p>
            <p className="text-sm font-medium text-brand-charcoal/70">Businesses Waiting</p>
          </div>
          <div className="h-16 w-px bg-brand-teal/30"></div>
          <div className="text-left">
            <p className="text-sm font-semibold text-brand-evergreen">Join the waitlist today</p>
            <p className="text-xs text-brand-charcoal/60">Limited early access spots</p>
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
