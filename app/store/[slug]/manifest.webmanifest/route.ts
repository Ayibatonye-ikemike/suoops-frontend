import { NextResponse } from "next/server";

import { getConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

/**
 * Per-store PWA manifest so a customer can "Add to home screen" and land back
 * on THIS storefront (not the main dashboard). Falls back gracefully if the
 * store can't be loaded.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const { apiBaseUrl } = getConfig();

  let name = "Store";
  let icon = "/icon.png";
  try {
    const res = await fetch(`${apiBaseUrl}/public/store/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const store = (await res.json()) as { business_name?: string | null; logo_url?: string | null };
      name = store.business_name || name;
      if (store.logo_url) icon = store.logo_url;
    }
  } catch {
    /* use defaults */
  }

  return NextResponse.json(
    {
      name: `${name} — Shop`,
      short_name: name.slice(0, 20),
      start_url: `/store/${slug}`,
      scope: `/store/${slug}`,
      display: "standalone",
      background_color: "#f8fafc",
      theme_color: "#0f5132",
      icons: [
        { src: icon, sizes: "512x512", type: "image/png", purpose: "any" },
        { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    { headers: { "Content-Type": "application/manifest+json" } },
  );
}
