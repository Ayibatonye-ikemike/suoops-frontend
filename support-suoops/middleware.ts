import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.suoops.com";

/**
 * Gate the /admin pages by client IP.
 *
 * Before any admin page renders, we ask the backend whether the visitor's IP is
 * on the admin allowlist. If it isn't, we rewrite to /admin/blocked so the panel
 * (including the login screen) is never shown. The backend API independently
 * enforces the same allowlist on every request, so this is defence in depth — if
 * the verdict call fails we fail open here and let the API do the blocking.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Never gate the blocked page itself (avoids a redirect loop).
  if (pathname.startsWith("/admin/blocked")) {
    return NextResponse.next();
  }

  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "";

  try {
    const res = await fetch(`${API_URL}/admin/auth/ip-allowed`, {
      method: "GET",
      headers: clientIp ? { "x-forwarded-for": clientIp } : {},
      cache: "no-store",
    });
    if (res.ok) {
      const data = (await res.json()) as { allowed?: boolean };
      if (data?.allowed === false) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/blocked";
        url.search = "";
        return NextResponse.rewrite(url);
      }
    }
  } catch {
    // Backend unreachable — fail open; the API still enforces the allowlist.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
