import type { Metadata } from "next";
import { Lock, ShieldCheck, Truck } from "lucide-react";

import { getConfig } from "@/lib/config";
import { StoreDirectory } from "@/features/storefront/store-directory";
import { BuyerProtectionNotice } from "@/features/storefront/buyer-protection-notice";

type StoreCard = {
  slug: string;
  business_name: string | null;
  logo_url: string | null;
  description: string | null;
  location?: string | null;
  matched_products?: string[];
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
    "Discover businesses selling on Suoops. Pay securely with buyer protection and get your order delivered nationwide by courier.",
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
            Search across every shop — pay securely and get it delivered nationwide.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/20"><ShieldCheck className="h-3.5 w-3.5" />Buyer protection</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/20"><Truck className="h-3.5 w-3.5" />Delivery nationwide</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/20"><Lock className="h-3.5 w-3.5" />Pay online</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <BuyerProtectionNotice className="mb-6" />
        <StoreDirectory apiBaseUrl={apiBaseUrl} initialStores={stores} />
      </main>
    </div>
  );
}
