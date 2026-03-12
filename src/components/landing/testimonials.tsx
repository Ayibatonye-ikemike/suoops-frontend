"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { PublicTestimonial } from "@/api/public";
import { getPublicTestimonials } from "@/api/public";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? "text-amber-400" : "text-slate-300"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: PublicTestimonial }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <StarRating rating={t.rating} />
      <p className="mt-3 text-sm text-slate-700 leading-relaxed">
        &ldquo;{t.text}&rdquo;
      </p>
      <div className="mt-4 flex items-center gap-3">
        {t.logo_url ? (
          <Image
            src={t.logo_url}
            alt={t.business_name || t.user_name}
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-jade/10 text-sm font-bold text-brand-jade">
            {(t.user_name || "U")[0].toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-slate-900">{t.user_name}</p>
          {t.business_name && (
            <p className="text-xs text-slate-500">{t.business_name}</p>
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
    <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-brand-evergreen sm:text-4xl">
            Trusted by businesses across Nigeria
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            Hear from real business owners using SuoOps every day
          </p>
        </div>

        {loading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-xl bg-slate-200"
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
