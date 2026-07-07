"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type StoreCard = {
  slug: string;
  business_name: string | null;
  logo_url: string | null;
  description: string | null;
  location?: string | null;
  matched_products?: string[];
};

/**
 * Global marketplace search across every store on Suoops. Searches business
 * name, description, location and product names/categories — so a shopper can
 * find an item and pick which store to buy it from.
 */
export function StoreDirectory({
  apiBaseUrl,
  initialStores,
}: {
  apiBaseUrl: string;
  initialStores: StoreCard[];
}) {
  const [query, setQuery] = useState("");
  const [stores, setStores] = useState<StoreCard[]>(initialStores);
  const [loading, setLoading] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      const q = query.trim();
      setLoading(true);
      try {
        const url = q
          ? `${apiBaseUrl}/public/stores?q=${encodeURIComponent(q)}`
          : `${apiBaseUrl}/public/stores`;
        const res = await fetch(url, { cache: "no-store" });
        const data = (await res.json()) as { stores?: StoreCard[] };
        setStores(data.stores ?? []);
      } catch {
        setStores([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [query, apiBaseUrl]);

  return (
    <div>
      <div className="relative mb-6">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, categories or shops…"
          className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm shadow-sm focus:border-brand-jade focus:outline-none focus:ring-2 focus:ring-brand-jade/20"
        />
      </div>

      {loading && stores.length === 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-white/70" />
          ))}
        </div>
      ) : stores.length === 0 ? (
        <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            {query.trim()
              ? `No shops or products match “${query.trim()}”.`
              : "No shops are listed yet. Check back soon."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {stores.map((s) => {
            const name = s.business_name || "Store";
            const initial = name[0]?.toUpperCase() ?? "S";
            return (
              <Link
                key={s.slug}
                href={`/store/${s.slug}`}
                className="flex flex-col items-center gap-3 rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-slate-100 transition hover:shadow-md"
              >
                {s.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.logo_url}
                    alt={name}
                    className="h-16 w-16 rounded-2xl bg-slate-100 object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-evergreen/10 text-2xl font-bold text-brand-evergreen">
                    {initial}
                  </div>
                )}
                <span className="line-clamp-2 text-sm font-semibold text-slate-900">{name}</span>
                {s.location && (
                  <span className="text-[11px] text-slate-400">{s.location}</span>
                )}
                {s.matched_products && s.matched_products.length > 0 ? (
                  <span className="line-clamp-2 text-xs text-brand-jade">
                    {s.matched_products.join(" · ")}
                  </span>
                ) : (
                  s.description && (
                    <span className="line-clamp-2 text-xs text-slate-500">{s.description}</span>
                  )
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
