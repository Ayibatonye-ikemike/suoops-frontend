"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { PublicTestimonial } from "@/api/public";
import { getPublicTestimonials } from "@/api/public";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? "text-amber-400" : "text-brand-charcoal/20"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: PublicTestimonial }) {
  const [imgError, setImgError] = useState(false);
  const initial = (t.user_name || "U")[0].toUpperCase();

  const showAvatar = !t.logo_url || imgError;

  return (
    <div className="rounded-xl border border-brand-teal/10 bg-white p-6 shadow-sm transition hover:shadow-md">
      <StarRating rating={t.rating} />
      <p className="mt-3 text-sm text-brand-charcoal/80 leading-relaxed">
        &ldquo;{t.text}&rdquo;
      </p>
      <div className="mt-4 flex items-center gap-3">
        {showAvatar ? (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-jade/10 text-sm font-bold text-brand-jade">
            {initial}
          </div>
        ) : (
          <Image
            unoptimized
            src={t.logo_url!}
            alt={t.business_name || t.user_name}
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
        <div>
          <p className="text-sm font-semibold text-brand-evergreen">{t.user_name}</p>
          {t.business_name && (
            <p className="text-xs text-brand-charcoal/50">{t.business_name}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<PublicTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicTestimonials()
      .then(setTestimonials)
      .finally(() => setLoading(false));
  }, []);

  // Don't render the section at all if there are no testimonials yet
  if (!loading && testimonials.length === 0) return null;

  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-brand-evergreen sm:text-4xl">
            Trusted by businesses across Nigeria
          </h2>
          <p className="mt-3 text-lg text-brand-charcoal/70">
            Hear from real business owners using SuoOps every day
          </p>
        </div>

        {loading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-xl bg-brand-textMuted"
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} t={t} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
