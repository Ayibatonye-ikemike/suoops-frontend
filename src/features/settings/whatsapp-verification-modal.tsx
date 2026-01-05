/**
 * WhatsApp Verification Modal
 *
 * A standalone modal for WhatsApp phone verification that can be opened
 * from anywhere in the app (e.g., invoice form, dashboard prompts).
 */

"use client";

import { useCallback, useState, useEffect } from "react";
import { X } from "lucide-react";
import { requestPhoneOTP, verifyPhoneOTP } from "./phone-api";
import { OTPInput } from "@/features/auth/otp-input";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Normalize phone number to E.164 format
 */
function normalizePhone(input: string): string {
  const trimmed = input.replace(/\s+/g, "");
  
  if (trimmed.startsWith("+")) return trimmed;
  
  if (trimmed.startsWith("0") && trimmed.length === 11 && "789".includes(trimmed[1])) {
    return `+234${trimmed.slice(1)}`;
  }
  if (trimmed.startsWith("234") && trimmed.length === 13) {
    return `+${trimmed}`;
  }
  if (trimmed.length === 10 && "789".includes(trimmed[0])) {
    return `+234${trimmed}`;
  }
  
  return `+${trimmed}`;
}

// WhatsApp bot number for SuoOps
const BOT_NUMBER = "2348106865807";
const WHATSAPP_LINK = `https://wa.me/${BOT_NUMBER}?text=Hi`;

type Step = "connect" | "input" | "otp" | "success";

interface WhatsAppVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified?: (phone: string) => void;
}

export function WhatsAppVerificationModal({
  isOpen,
  onClose,
  onVerified,
}: WhatsAppVerificationModalProps) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<Step>("connect");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("connect");
      setPhone("");
      setOtp("");
      setError(null);
    }
  }, [isOpen]);

  const handleRequestOTP = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
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
    } catch (err) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || "Failed to send OTP. Try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleVerifyOTP = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (otp.length !== 6) {
      setError("Enter the 6-digit code");
      return;
    }

    setLoading(true);

    try {
      await verifyPhoneOTP({ phone, otp });
      setStep("success");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      onVerified?.(phone);
      
      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || "Invalid code. Try again.";
      setError(message);
      setOtp("");
    } finally {
      setLoading(false);
    }
  }, [otp, phone, onVerified, onClose, queryClient]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Step 1: Connect to WhatsApp first */}
        {step === "connect" && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <svg className="h-8 w-8 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Connect WhatsApp
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                First, send a &quot;Hi&quot; to our bot to open the connection window.
              </p>
            </div>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 font-semibold text-white transition hover:bg-emerald-600"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Open WhatsApp & Send Hi
            </a>

            <button
              onClick={() => setStep("input")}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              I&apos;ve sent Hi, continue →
            </button>
          </div>
        )}

        {/* Step 2: Enter phone number */}
        {step === "input" && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Enter Your WhatsApp Number
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                We&apos;ll send a 6-digit code to verify it&apos;s you.
              </p>
            </div>

            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                {error}
              </div>
            )}

            <form onSubmit={handleRequestOTP} className="space-y-4">
              <input
                type="tel"
                name="phone"
                placeholder="08012345678"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                autoFocus
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? "Sending..." : "Send OTP via WhatsApp"}
              </Button>
            </form>

            <button
              onClick={() => setStep("connect")}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back
            </button>
          </div>
        )}

        {/* Step 3: Enter OTP */}
        {step === "otp" && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Enter Verification Code
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Check your WhatsApp for the 6-digit code sent to {phone}
              </p>
            </div>

            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <OTPInput
                value={otp}
                onChange={setOtp}
                length={6}
              />
              <Button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full"
              >
                {loading ? "Verifying..." : "Verify & Connect"}
              </Button>
            </form>

            <button
              onClick={() => {
                setStep("input");
                setOtp("");
                setError(null);
              }}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              ← Change number
            </button>
          </div>
        )}

        {/* Step 4: Success */}
        {step === "success" && (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              WhatsApp Connected! 🎉
            </h3>
            <p className="text-sm text-gray-600">
              You can now create invoices by texting our bot.
            </p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-600"
            >
              Try It Now: &quot;Invoice John 50k for design&quot;
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
