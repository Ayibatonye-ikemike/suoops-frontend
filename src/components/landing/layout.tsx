import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-2xl font-bold text-white">
                S
              </div>
              <span className="text-xl font-bold text-slate-900">SuoOps</span>
            </div>
            <p className="mt-4 text-sm text-slate-600">
              The easiest way for Nigerian businesses to create invoices and get paid.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Product</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li><a href="#features" className="hover:text-slate-900">Features</a></li>
              <li><a href="#pricing" className="hover:text-slate-900">Pricing</a></li>
              <li><Link href="/dashboard" className="hover:text-slate-900">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Company</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li><a href="mailto:info@suoops.com" className="hover:text-slate-900">Contact</a></li>
              <li><a href="https://api.suoops.com/healthz" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900">Status</a></li>
              <li><Link href="/login" className="hover:text-slate-900">Login</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Legal</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li><Link href="/privacy" className="hover:text-slate-900">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-slate-900">Terms of Service</Link></li>
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

export function PreLaunchBanner() {
  return (
    <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 px-4 py-3 text-center">
      <p className="text-sm font-semibold text-slate-900">
        ⏳ <strong>Pre-Launch:</strong> Join our waitlist to get early access + exclusive 50% launch discount! 🚀
      </p>
    </div>
  );
}

export function Navigation() {
  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-2xl font-bold text-white shadow-lg">
              S
            </div>
            <span className="text-xl font-bold text-slate-900">SuoOps</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSc8s7K5WNC_6xDzg2IlUMJtxzvF4T18YwYlW_ruHMyC6IT5yg/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Join Waitlist
            </a>
            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
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
    <section className="border-y border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <div className="inline-flex items-center gap-4 rounded-2xl border-2 border-blue-200 bg-blue-50 px-8 py-6">
          <div className="text-left">
            <p className="text-4xl font-bold text-blue-600">50+</p>
            <p className="text-sm font-medium text-slate-600">Businesses Waiting</p>
          </div>
          <div className="h-16 w-px bg-blue-200"></div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-900">Join the waitlist today</p>
            <p className="text-xs text-slate-600">Limited early access spots</p>
          </div>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSc8s7K5WNC_6xDzg2IlUMJtxzvF4T18YwYlW_ruHMyC6IT5yg/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
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
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-bold text-white sm:text-5xl">
          Be the first to experience it
        </h2>
        <p className="mt-4 text-xl text-blue-100">
          Join our waitlist and get exclusive early access when we launch!
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSc8s7K5WNC_6xDzg2IlUMJtxzvF4T18YwYlW_ruHMyC6IT5yg/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-center text-base font-semibold text-blue-600 shadow-lg hover:bg-blue-50 transition-all hover:scale-105"
          >
            🚀 Join Waitlist Now
          </a>
        </div>
        <p className="mt-6 text-sm text-blue-100">
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
