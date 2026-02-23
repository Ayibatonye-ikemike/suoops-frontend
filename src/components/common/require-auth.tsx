"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAuthStore } from "@/features/auth/auth-store";

export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const status = useAuthStore((state) => state.status);

  useEffect(() => {
    if (status === "unauthenticated") {
      const search = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${search}`);
    }
    if (status === "expired") {
      const params = new URLSearchParams();
      params.set("reason", "expired");
      if (pathname) {
        params.set("next", pathname);
      }
      router.replace(`/login?${params.toString()}`);
    }
  }, [pathname, router, status]);

  if (status === "idle" || status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-jade border-t-transparent" />
          <p className="text-sm font-medium text-white/70">Verifying session…</p>
        </div>
      </div>
    );
  }

  if (status !== "authenticated") {
    return null;
  }

  return <>{children}</>;
}
