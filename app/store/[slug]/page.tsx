import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getConfig } from "@/lib/config";
import { StoreCatalog } from "@/features/storefront/store-catalog";
import { StoreReviews } from "@/features/storefront/store-reviews";

type StoreProduct = {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  unit: string | null;
  image_url: string | null;
  in_stock: boolean;
  category: string | null;
};

type Storefront = {
  slug: string;
  business_name: string | null;
  description: string | null;
  logo_url: string | null;
  online_payments_enabled: boolean;
  whatsapp_url: string | null;
  announcement: string | null;
  location: {
    address: string | null;
    city: string | null;
    state: string | null;
    maps_url: string | null;
  };
  hours: Record<string, { open: string; close: string }> | null;
  open_now: boolean;
  open_from: string | null;
  open_to: string | null;
  fulfillment: { delivery: boolean; pickup: boolean; delivery_fee: number };
  reviews: { count: number; average: number | null };
  products: StoreProduct[];
};

type RouteProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

async function fetchStore(slug: string, apiBaseUrl: string): Promise<Storefront | null> {
  const res = await fetch(`${apiBaseUrl}/public/store/${encodeURIComponent(slug)}`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Unable to load storefront. Please try again later.");
  return (await res.json()) as Storefront;
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const { apiBaseUrl } = getConfig();
  try {
    const store = await fetchStore(slug, apiBaseUrl);
    if (!store) return { title: "Store Not Found — Suoops" };
    const name = store.business_name || "Store";
    const description =
      store.description || `Browse ${name}'s products and order directly.`;
    const image = store.logo_url ?? undefined;
    return {
      title: `${name} — Shop on Suoops`,
      description,
      manifest: `/store/${slug}/manifest.webmanifest`,
      openGraph: {
        title: name,
        description,
        siteName: "Suoops",
        type: "website",
        url: `https://suoops.com/store/${slug}`,
        ...(image ? { images: [{ url: image }] } : {}),
      },
      twitter: {
        card: image ? "summary_large_image" : "summary",
        title: name,
        description,
        ...(image ? { images: [image] } : {}),
      },
    };
  } catch {
    return { title: "Store — Suoops" };
  }
}

export default async function StorePage({ params }: RouteProps) {
  const { slug } = await params;
  const { apiBaseUrl } = getConfig();
  const store = await fetchStore(slug, apiBaseUrl);
  if (!store) notFound();

  const name = store.business_name || "Store";
  const initial = name[0]?.toUpperCase() ?? "S";
  const storeUrl = `https://suoops.com/store/${slug}`;
  const headerOrderLink = store.whatsapp_url
    ? `${store.whatsapp_url}?text=${encodeURIComponent(`Hi ${name}, I'd like to order from your store (${storeUrl}).`)}`
    : "#";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-brand-evergreen px-4 pb-8 pt-6">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          {store.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={store.logo_url}
              alt={name}
              className="h-14 w-14 rounded-2xl border-2 border-white/20 bg-white object-cover shadow-lg"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-white/20 bg-white/10 text-2xl font-bold text-white shadow-lg">
              {initial}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-white">{name}</h1>
            {store.description && (
              <p className="mt-0.5 text-sm text-emerald-100">{store.description}</p>
            )}
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {store.hours && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    store.open_now
                      ? "bg-emerald-400/20 text-emerald-200"
                      : "bg-white/10 text-emerald-100"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${store.open_now ? "bg-emerald-300" : "bg-slate-300"}`}
                  />
                  {store.open_now
                    ? `Open${store.open_to ? ` · closes ${store.open_to}` : ""}`
                    : "Closed"}
                </span>
              )}
              {store.reviews.count > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-200">
                  ★ {store.reviews.average} ({store.reviews.count})
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-emerald-300">Powered by Suoops · suoops.com</p>
          </div>
        </div>
        {store.location.address && (
          <div className="mx-auto mt-3 max-w-3xl">
            <a
              href={store.location.maps_url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-100 hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {store.location.address} · Get directions
            </a>
          </div>
        )}
        {store.whatsapp_url && (
          <div className="mx-auto mt-4 max-w-3xl">
            <a
              href={headerOrderLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#1ebe5a]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6a9 9 0 0 1-3.4-3c-.3-.4-.8-1.1-.8-2.1s.5-1.5.7-1.7a.7.7 0 0 1 .5-.2h.4c.2 0 .3 0 .5.4l.6 1.4c.1.1.1.3 0 .4l-.3.4-.2.2c-.1.1-.2.3 0 .5.2.3.7 1 1.4 1.6.9.7 1.5.9 1.7 1 .2.1.3.1.5-.1l.6-.7c.2-.2.3-.2.5-.1l1.4.7c.2.1.4.2.4.3.1.1.1.5-.1 1Z" />
              </svg>
              Chat / Order on WhatsApp
            </a>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        {store.announcement && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
            {store.announcement}
          </div>
        )}
        {store.products.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-sm text-slate-500">
              This store hasn&apos;t listed any products yet. Check back soon.
            </p>
          </div>
        ) : (
          <StoreCatalog
            slug={store.slug}
            storeName={name}
            products={store.products}
            whatsappUrl={store.whatsapp_url}
            onlinePaymentsEnabled={store.online_payments_enabled}
            fulfillment={store.fulfillment}
          />
        )}
        <StoreReviews slug={store.slug} summary={store.reviews} />
      </main>
    </div>
  );
}
