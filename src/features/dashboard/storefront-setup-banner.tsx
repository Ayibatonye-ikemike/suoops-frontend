import { ArrowRight, Store } from "lucide-react";
import Link from "next/link";

interface StorefrontSetupBannerProps {
  suggestions: string[];
}

export function StorefrontSetupBanner({ suggestions }: StorefrontSetupBannerProps) {
  const nextTask = suggestions[0];

  return (
    <div className="mb-4 flex items-start gap-3 border-l-4 border-brand-jade bg-emerald-50/70 px-4 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700" aria-hidden>
        <Store className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-brand-text">Finish setting up your storefront</p>
        <p className="mt-0.5 text-xs leading-relaxed text-brand-textMuted">
          Next: {nextTask} {suggestions.length > 1 ? `Then complete ${suggestions.length - 1} more ${suggestions.length === 2 ? "step" : "steps"}.` : ""}
        </p>
        <Link href="/dashboard/settings#storefront" className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-jadeText hover:text-brand-jadeHover">
          Continue setup <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}