import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-evergreen px-6 py-12 text-white">
      <div className="max-w-md text-center">
        <p className="text-6xl font-bold text-brand-citrus">404</p>
        <h1 className="mt-4 font-heading text-3xl font-semibold">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-white/80">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-full bg-brand-jade px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-teal"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/30 px-6 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
