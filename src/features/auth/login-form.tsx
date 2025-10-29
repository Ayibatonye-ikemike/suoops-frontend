"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { requestLoginOTP, verifyLoginOTP, resendOTP } from "./auth-api";
import { useAuthStore } from "./auth-store";
import { OTPInput } from "./otp-input";

type Step = "email" | "otp";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setTokens = useAuthStore((state) => state.setTokens);
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  const canResend = useMemo(() => resendTimer === 0, [resendTimer]);

  const startCountdown = useCallback(() => {
    setResendTimer(60);
    const interval = window.setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const nextRoute = searchParams?.get("next") ?? "/dashboard";

  const handleRequestOTP = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!email.trim()) {
        setError("Enter your registered email address.");
        return;
      }
      setLoading(true);
      setError(null);
      const normalizedEmail = email.trim().toLowerCase();
      try {
        await requestLoginOTP({ email: normalizedEmail });
        setStep("otp");
        setEmail(normalizedEmail);
        setOtp("");
        startCountdown();
      } catch (requestError: unknown) {
        console.error(requestError);
        const message =
          typeof requestError === "object" && requestError !== null && "response" in requestError
            ? (requestError as { response?: { data?: { detail?: string } } }).response?.data?.detail
            : undefined;
        setError(message || "We could not send an OTP to that email.");
      } finally {
        setLoading(false);
      }
    },
    [email, startCountdown]
  );

  const handleVerifyOTP = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (otp.length !== 6) {
        setError("Enter the 6-digit code sent to your email.");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const tokens = await verifyLoginOTP({ email, otp });
        setTokens({ accessToken: tokens.access_token, accessExpiresAt: tokens.access_expires_at });
        router.replace(nextRoute);
      } catch (verifyError: unknown) {
        console.error(verifyError);
        setOtp("");
        const message =
          typeof verifyError === "object" && verifyError !== null && "response" in verifyError
            ? (verifyError as { response?: { data?: { detail?: string } } }).response?.data?.detail
            : undefined;
        setError(message || "Invalid code. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [nextRoute, otp, email, router, setTokens]
  );

  const handleResend = useCallback(async () => {
    if (!canResend) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await resendOTP({ email, purpose: "login" });
      setOtp("");
      startCountdown();
    } catch (resendError: unknown) {
      console.error(resendError);
      const message =
        typeof resendError === "object" && resendError !== null && "response" in resendError
          ? (resendError as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : undefined;
      setError(message || "Please wait before requesting another code.");
    } finally {
      setLoading(false);
    }
  }, [canResend, email, startCountdown]);

  if (step === "otp") {
    return (
      <form className="flex w-full max-w-md flex-col gap-6 rounded-2xl border border-emerald-700/30 bg-emerald-900/40 p-10 shadow-2xl backdrop-blur-xl" onSubmit={handleVerifyOTP}>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-white">Enter the code</h1>
          <p className="text-sm text-emerald-100">
            We sent a 6-digit OTP to <span className="font-semibold text-white">{email}</span>
          </p>
        </div>
        {error ? (
          <p className="rounded-lg border border-rose-400/30 bg-rose-900/30 px-3 py-2 text-sm text-rose-200" role="alert">
            {error}
          </p>
        ) : null}
        <div className="flex flex-col items-center gap-4">
          <OTPInput value={otp} onChange={setOtp} disabled={loading} hasError={Boolean(error)} />
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full rounded-lg bg-white px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Verify & Sign in"}
          </button>
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || loading}
            className="text-sm font-medium text-emerald-200 hover:text-white hover:underline disabled:cursor-not-allowed disabled:text-emerald-400"
          >
            {canResend ? "Resend code" : `Resend in ${resendTimer}s`}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setOtp("");
              setError(null);
            }}
            className="text-sm text-emerald-200 hover:text-white"
          >
            Use a different email
          </button>
        </div>
      </form>
    );
  }

  return (
    <form className="flex w-full max-w-md flex-col gap-6 rounded-2xl border border-emerald-700/30 bg-emerald-900/40 p-10 shadow-2xl backdrop-blur-xl" onSubmit={handleRequestOTP}>
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-white">Sign in</h1>
        <p className="text-sm text-emerald-100">Enter your email to receive a one-time code.</p>
      </div>
      {error ? (
        <p className="rounded-lg border border-rose-400/30 bg-rose-900/30 px-3 py-2 text-sm text-rose-200" role="alert">
          {error}
        </p>
      ) : null}
      <label className="flex flex-col gap-2 text-left text-sm font-semibold text-white">
        Email address
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          className="rounded-lg border border-emerald-700/50 bg-emerald-950/50 px-3 py-2 text-base font-normal text-white placeholder-emerald-300 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Sending code..." : "Send login code"}
      </button>
      <p className="text-center text-sm text-emerald-200">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-white hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
