"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

type StoreCard = {
  slug: string;
  business_name: string | null;
  logo_url: string | null;
  description: string | null;
  location?: string | null;
  matched_products?: string[];
};

// Jumia-style quick categories. Selecting one just seeds the search term — the
// backend already matches product names/categories — so no new API is needed.
const CATEGORIES: { label: string; term: string; emoji: string }[] = [
  { label: "All", term: "", emoji: "🛍️" },
  { label: "Fashion", term: "fashion", emoji: "👗" },
  { label: "Food & Drinks", term: "food", emoji: "🍲" },
  { label: "Beauty", term: "beauty", emoji: "💄" },
  { label: "Electronics", term: "electronics", emoji: "📱" },
  { label: "Home", term: "home", emoji: "🏠" },
  { label: "Health", term: "health", emoji: "💊" },
  { label: "Kids", term: "kids", emoji: "🧸" },
  { label: "Services", term: "service", emoji: "🛠️" },
];

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
  // The server already rendered the unfiltered list, so skip the redundant
  // fetch on first mount (a real load-speed win) — only fetch on interaction.
  const firstRun = useRef(true);

  // Pick up a search term deep-linked from the landing page (/stores?q=…).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) setQuery(q);
  }, []);

  useEffect(() => {
    if (firstRun.current && query.trim() === "") {
      firstRun.current = false;
      return;
    }
    firstRun.current = false;
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

  const activeCategory = query.trim().toLowerCase();

  return (
    <div>
      <div className="relative mb-4">
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

      {/* Category chips (Jumia-style quick filters) */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((c) => {
          const active =
            c.term === "" ? activeCategory === "" : activeCategory === c.term;
          return (
            <button
              key={c.label}
              type="button"
              onClick={() => setQuery(c.term)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-brand-evergreen text-white shadow-sm"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              <span aria-hidden>{c.emoji}</span>
              {c.label}
            </button>
          );
        })}
      </div>

      {loading && stores.length === 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-2xl bg-white/70" />
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {stores.map((s) => {
            const name = s.business_name || "Store";
            const initial = name[0]?.toUpperCase() ?? "S";
            return (
              <Link
                key={s.slug}
                href={`/store/${s.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Card header — brand band + logo, marketplace look */}
                <div className="relative h-20 bg-gradient-to-br from-brand-evergreen to-brand-teal">
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold text-brand-jade shadow-sm">
                    <ShieldCheck className="h-3 w-3" />
                    Protected
                  </span>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                    {s.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={s.logo_url}
                        alt={name}
                        width={56}
                        height={56}
                        loading="lazy"
                        className="h-14 w-14 rounded-2xl bg-white object-cover shadow-md ring-2 ring-white"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl font-bold text-brand-evergreen shadow-md ring-2 ring-white">
                        {initial}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col items-center gap-1 px-3 pb-4 pt-8 text-center">
                  <span className="line-clamp-1 text-sm font-semibold text-slate-900">
                    {name}
                  </span>
                  {s.location && (
                    <span className="text-[11px] text-slate-400">📍 {s.location}</span>
                  )}
                  {s.matched_products && s.matched_products.length > 0 ? (
                    <div className="mt-1.5 flex flex-wrap justify-center gap-1">
                      {s.matched_products.slice(0, 3).map((p) => (
                        <span
                          key={p}
                          className="line-clamp-1 rounded-full bg-brand-jade/10 px-2 py-0.5 text-[10px] font-medium text-brand-jade"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  ) : (
                    s.description && (
                      <span className="mt-1 line-clamp-2 text-xs text-slate-500">
                        {s.description}
                      </span>
                    )
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
