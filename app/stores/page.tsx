import type { Metadata } from "next";
import Link from "next/link";

import { getConfig } from "@/lib/config";

type StoreCard = {
  slug: string;
  business_name: string | null;
  logo_url: string | null;
};

type Directory = {
  page: number;
  page_size: number;
  total: number;
  stores: StoreCard[];
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shops on Suoops — Browse Nigerian businesses",
  description:
    "Discover businesses selling on Suoops. Browse their products and order directly on WhatsApp.",
};

async function fetchStores(apiBaseUrl: string): Promise<Directory | null> {
  try {
    const res = await fetch(`${apiBaseUrl}/public/stores`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as Directory;
  } catch {
    return null;
  }
}

export default async function StoresDirectoryPage() {
  const { apiBaseUrl } = getConfig();
  const data = await fetchStores(apiBaseUrl);
  const stores = data?.stores ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-brand-evergreen px-4 pb-10 pt-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Shops on Suoops</h1>
          <p className="mt-2 text-sm text-emerald-200">
            Browse businesses and order directly on WhatsApp.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        {stores.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-sm text-slate-500">
              No shops are listed yet. Check back soon.
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
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
