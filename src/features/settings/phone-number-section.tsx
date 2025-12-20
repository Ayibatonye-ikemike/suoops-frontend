/**
 * Phone Number Verification Section
 *
 * Allows users to add and verify their WhatsApp phone number.
 * Uses OTP verification via WhatsApp Business API.
 *
 * Design Principles:
 * - SRP: Single responsibility for phone verification UI
 * - DRY: Reuses OTPInput component from auth
 * - OOP: Clean state management with React hooks
 */

"use client";

import { useCallback, useState } from "react";
import { requestPhoneOTP, verifyPhoneOTP, removePhone } from "./phone-api";
import { OTPInput } from "@/features/auth/otp-input";
import { Button } from "@/components/ui/button";

/**
 * Normalize phone number to E.164 format
 * Handles Nigerian numbers: 0801234567 → +2348012345678
 */
function normalizePhone(input: string): string {
  const trimmed = input.replace(/\s+/g, "");
  if (trimmed.startsWith("+")) return trimmed;
  if (trimmed.startsWith("0")) return `+234${trimmed.slice(1)}`;
  if (trimmed.startsWith("234")) return `+${trimmed}`;
  return `+${trimmed}`;
}

type VerificationStep = "connect" | "input" | "otp" | "verified";

interface PhoneNumberSectionProps {
  /** Current user phone number (if any) */
  currentPhone?: string | null;
  /** Callback after successful verification */
  onPhoneVerified?: (phone: string) => void;
}

/**
 * Phone Number Section Component
 *
 * Displays current phone status and handles add/verify/remove flow:
 * 1. No phone → Show input field + "Send OTP" button
 * 2. OTP sent → Show 6-digit input + verify button
 * 3. Verified → Show phone number + "Remove" button
 */
export function PhoneNumberSection({
  currentPhone,
  onPhoneVerified,
}: PhoneNumberSectionProps) {
  // Component state
  const [step, setStep] = useState<VerificationStep>(
    currentPhone ? "verified" : "connect" // Start with opt-in step to open 24-hour WhatsApp window
  );
  const [phone, setPhone] = useState(currentPhone || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * Handle phone number input and request OTP
   */
  const handleRequestOTP = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);
      setSuccess(null);

      const formData = new FormData(event.currentTarget);
      const phoneInput = formData.get("phone") as string;

      if (!phoneInput?.trim()) {
        setError("Enter your WhatsApp number");
        return;
      }

      setLoading(true);
      const normalizedPhone = normalizePhone(phoneInput);

      try {
        await requestPhoneOTP({ phone: normalizedPhone });
        setPhone(normalizedPhone);
        setStep("otp");
        setOtp("");
        setSuccess("OTP sent to WhatsApp!");
      } catch (err) {
        const message =
          (err as { response?: { data?: { detail?: string } } })?.response?.data
            ?.detail || "Failed to send OTP. Try again.";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Handle OTP verification
   */
  const handleVerifyOTP = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);
      setSuccess(null);

      if (otp.length !== 6) {
        setError("Enter the 6-digit code");
        return;
      }

      setLoading(true);

      try {
        const response = await verifyPhoneOTP({ phone, otp });
        setStep("verified");
        setSuccess(response.detail || "Phone verified successfully!");
        setOtp("");
        onPhoneVerified?.(phone);
      } catch (err) {
        const message =
          (err as { response?: { data?: { detail?: string } } })?.response?.data
            ?.detail || "Invalid code. Try again.";
        setError(message);
        setOtp("");
      } finally {
        setLoading(false);
      }
    },
    [otp, phone, onPhoneVerified]
  );

  /**
   * Handle phone number removal
   */
  const handleRemovePhone = useCallback(async () => {
    if (!confirm("Remove phone number from your account?")) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await removePhone();
      setPhone("");
      setStep("input");
      setSuccess("Phone number removed");
    } catch (err) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || "Failed to remove phone number";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset to input step
   */
  const handleBackToInput = useCallback(() => {
    setStep("input");
    setOtp("");
    setError(null);
    setSuccess(null);
  }, []);

  // Render verified state
  if (step === "verified") {
    // WhatsApp bot number for SuoOps (without + prefix for wa.me link)
    const botNumber = "2348106865807";
    const whatsappLink = `https://wa.me/${botNumber}?text=Hi`;
    
    return (
      <div className="space-y-4">
        {success && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </div>
        )}
        <div className="flex flex-col gap-4 rounded-xl border border-brand-border bg-brand-background p-4 text-brand-text md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-textMuted">
              WhatsApp Number
            </p>
            <p className="mt-2 text-lg font-semibold text-brand-text">
              {phone}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-brand-primary">
              ✓ Verified
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setStep("input"); // Skip opt-in, they've already interacted with the bot
                setPhone("");
                setError(null);
                setSuccess(null);
              }}
              disabled={loading}
            >
              Change Number
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleRemovePhone}
              disabled={loading}
            >
              {loading ? "Removing" : "Remove"}
            </Button>
          </div>
        </div>
        
        {/* WhatsApp Bot Link */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 transition-colors hover:bg-emerald-100"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-semibold">Open SuoOps Bot</p>
            <p className="text-sm text-emerald-600">Create invoices via WhatsApp</p>
          </div>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        
        <p className="text-xs text-brand-textMuted">
          You can now use this number to log in and receive invoice
          notifications via WhatsApp.
        </p>
      </div>
    );
  }

  // Render OTP verification step
  if (step === "otp") {
    return (
      <form onSubmit={handleVerifyOTP} className="space-y-4">
        {success && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-brand-textMuted">
            Enter 6-digit code sent to {phone}
          </label>
          <OTPInput
            value={otp}
            onChange={setOtp}
            disabled={loading}
            hasError={Boolean(error)}
          />
        </div>
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="flex-1"
          >
            {loading ? "Verifying" : "Verify Number"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleBackToInput}
            disabled={loading}
          >
            Back
          </Button>
        </div>
      </form>
    );
  }

  // Render connect/opt-in step (required to open 24-hour WhatsApp messaging window)
  if (step === "connect") {
    const botNumber = "2348106865807";
    const whatsappOptInLink = `https://wa.me/${botNumber}?text=Hi`;
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-brand-textMuted mb-4">
            Quick step: Message us on WhatsApp first to receive your OTP
          </p>
          <a
            href={whatsappOptInLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-[#25D366] px-6 py-3 text-white font-semibold transition-all hover:bg-[#1fb855] hover:scale-105 shadow-lg"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Say &ldquo;Hi&rdquo; on WhatsApp
          </a>
        </div>
        
        <div className="text-center pt-4 border-t border-brand-border">
          <p className="text-xs text-brand-textMuted mb-3">
            Done? Tap below to continue
          </p>
          <Button
            type="button"
            onClick={() => setStep("input")}
            variant="outline"
            className="w-full"
          >
            Continue →
          </Button>
        </div>
      </div>
    );
  }

  // Render phone input step
  return (
    <div className="space-y-4">
      {/* How it works info box */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">📱 How to create invoices via WhatsApp</h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Add your WhatsApp number below and verify with OTP</li>
          <li>Save our bot number: <strong>+234 810 686 5807</strong></li>
          <li>Send a message like: <em>&ldquo;Invoice John 50k for logo design&rdquo;</em></li>
          <li>Invoice is created and sent to your customer instantly!</li>
        </ol>
      </div>

      <form onSubmit={handleRequestOTP} className="space-y-4">
        {success && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="text-xs font-semibold uppercase tracking-wide text-brand-textMuted"
          >
            WhatsApp Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={phone}
            placeholder="0801 234 5678"
            required
            disabled={loading}
            className="w-full rounded-lg border border-brand-border bg-white px-3 py-3 text-sm text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 disabled:cursor-not-allowed disabled:bg-brand-background"
          />
          <p className="text-xs text-brand-textMuted">
            We use your WhatsApp number to send invoice updates and authentication
            codes.
          </p>
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Sending" : "Send Verification Code"}
        </Button>
      </form>
    </div>
  );
}
