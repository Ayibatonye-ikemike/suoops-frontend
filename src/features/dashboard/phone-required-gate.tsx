"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Phone, ArrowRight, Shield } from "lucide-react";
import { apiClient } from "@/api/client";

const BOT_NUMBER = "2348106865807";

interface UserData {
  phone?: string | null;
  phone_verified?: boolean;
  name?: string;
}

/**
 * Gate that blocks the dashboard until user has a verified phone number.
 * Catches Google OAuth users who signed up without a phone.
 *
 * Returns null if phone is verified (dashboard renders normally).
 * Returns a full-screen prompt if phone is missing or unverified.
 */
export function PhoneRequiredGate({ children }: { children: React.ReactNode }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<UserData>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get<UserData>("/users/me");
      return response.data;
    },
    staleTime: 60000,
  });

  // Loading state
  if (isLoading) return <>{children}</>;

  // Phone verified — let through
  if (user?.phone_verified && user?.phone) return <>{children}</>;

  const firstName = user?.name?.split(" ")[0] || "there";

  const handleSavePhone = async () => {
    if (!phone.trim()) {
      setError("Please enter your WhatsApp number.");
      return;
    }

    // Basic Nigerian phone validation
    const digits = phone.replace(/[\s\-()]/g, "");
    const isValid = /^(0[789]\d{9}|\+234[789]\d{9}|234[789]\d{9})$/.test(digits);
    if (!isValid) {
      setError("Please enter a valid Nigerian phone number (e.g. 08012345678).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiClient.post("/users/me/phone", { phone: phone.trim() });
      setSaved(true);
      // Refresh user data
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    } catch (err) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e.response?.data?.detail || "Failed to save phone number. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Phone saved but not yet verified via WhatsApp
  if (saved || (user?.phone && !user?.phone_verified)) {
    const whatsappLink = `https://wa.me/${BOT_NUMBER}?text=Hi`;
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="max-w-md w-full">
          <div className="rounded-2xl border-2 border-brand-jade/30 bg-white p-8 shadow-lg text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-4">
              <Phone className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Verify your WhatsApp
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Send a message to our WhatsApp bot to verify your number.
              Just tap the button below and say &quot;Hi&quot;.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#1fb855]"
            >
              Open WhatsApp
              <ArrowRight className="h-5 w-5" />
            </a>
            <p className="mt-4 text-xs text-slate-400">
              After sending a message, refresh this page.
            </p>
            <button
              onClick={() => queryClient.invalidateQueries({ queryKey: ["currentUser"] })}
              className="mt-2 text-xs text-brand-jadeText hover:underline"
            >
              I&apos;ve sent a message — refresh
            </button>
          </div>
        </div>
      </main>
    );
  }

  // No phone at all — prompt to add
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full">
        <div className="rounded-2xl border-2 border-brand-jade/30 bg-white p-8 shadow-lg">
          <div className="text-center mb-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-4">
              <Shield className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Connect your WhatsApp, {firstName}!
            </h2>
            <p className="text-sm text-slate-600">
              SuoOps is WhatsApp-first. Add your number to create invoices,
              get payment alerts, and manage your business from WhatsApp.
            </p>
          </div>

          <label className="block text-sm font-semibold text-slate-700 mb-2">
            WhatsApp number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08012345678"
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-brand-jade focus:ring-2 focus:ring-brand-jade/20"
          />
          <p className="mt-1 text-xs text-slate-400">
            We&apos;ll connect you to the SuoOps invoice bot
          </p>

          {error && (
            <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
              {error}
            </p>
          )}

          <button
            onClick={handleSavePhone}
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-brand-jade px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-jade/90 disabled:opacity-70"
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </div>
      </div>
    </main>
  );
}
