"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/features/auth/auth-store";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setTokens = useAuthStore((state) => state.setTokens);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const code = searchParams?.get("code");
        const state = searchParams?.get("state");
        const errorParam = searchParams?.get("error");

        // Handle provider error
        if (errorParam) {
          setError(
            errorParam === "access_denied"
              ? "Sign in was cancelled. Please try again."
              : `Authentication failed: ${errorParam}`
          );
          setProcessing(false);
          return;
        }

        if (!code || !state) {
          setError("Invalid OAuth callback. Missing required parameters.");
          setProcessing(false);
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.suoops.com";
        const response = await fetch(
          `${apiUrl}/auth/oauth/google/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ detail: "Authentication failed" }));
          throw new Error(errorData.detail || "Failed to complete sign in");
        }

        const data = await response.json();
        const accessExpiresAt: string =
          typeof data.access_expires_at === "string"
            ? data.access_expires_at
            : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        setTokens({ accessToken: data.access_token, accessExpiresAt });
        setProcessing(false);
        router.replace("/dashboard");
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
        setProcessing(false);
      }
    };
    run();
    // Only run on initial mount/searchParams change
  }, [searchParams, setTokens, router]);

  if (processing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-600 to-emerald-700">
        <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl bg-white p-10 shadow-xl">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-green-600"></div>
            <div className="space-y-2 text-center">
              <h1 className="text-xl font-semibold text-slate-900">Completing sign in...</h1>
              <p className="text-sm text-slate-500">Please wait while we verify your account.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-600 to-emerald-700">
        <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl bg-white p-10 shadow-xl">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold text-slate-900">Sign in failed</h1>
            <p className="text-sm text-slate-500">We couldn&apos;t complete your sign in.</p>
          </div>
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600" role="alert">
            {error}
          </p>
          <button
            onClick={() => router.push("/login")}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-600 to-emerald-700">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
