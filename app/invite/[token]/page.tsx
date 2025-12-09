"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { validateInvitation, acceptInvitation } from "@/api/team";
import { useAuthStore } from "@/features/auth/auth-store";
import Link from "next/link";

interface InvitationDetails {
  valid: boolean;
  team_name: string | null;
  inviter_name: string | null;
  email: string | null;
  error: string | null;
}

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const authStatus = useAuthStore((state) => state.status);
  const isAuthenticated = authStatus === "authenticated";
  const authLoading = authStatus === "idle" || authStatus === "loading";
  const token = params.token as string;

  const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Validate the invitation token
  useEffect(() => {
    async function validate() {
      try {
        const result = await validateInvitation(token);
        setInvitation(result);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Invalid or expired invitation";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      validate();
    }
  }, [token]);

  // Handle accepting the invitation
  async function handleAccept() {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      const returnUrl = encodeURIComponent(`/invite/${token}`);
      router.push(`/login?next=${returnUrl}`);
      return;
    }

    setAccepting(true);
    setError(null);

    try {
      await acceptInvitation(token);
      setSuccess(true);
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to accept invitation";
      setError(errorMessage);
    } finally {
      setAccepting(false);
    }
  }

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-evergreen p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-border border-t-brand-jade" />
              <p className="mt-4 text-brand-textMuted">Validating invitation...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-evergreen p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-brand-text">Welcome to the team!</h2>
              <p className="mt-2 text-brand-textMuted">Redirecting to your dashboard...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state - invalid invitation
  if (error || !invitation?.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-evergreen p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="h-12 w-12 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
              <span className="text-2xl">✗</span>
            </div>
            <h2 className="text-xl font-semibold text-red-700">Invalid Invitation</h2>
            <p className="mt-2 text-brand-textMuted">
              {error || invitation?.error || "This invitation link is invalid or has expired."}
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800">
              The invitation may have expired or already been used. Please ask the team admin
              to send a new invitation.
            </div>
            <div className="flex gap-2 justify-center">
              <Link 
                href="/" 
                className="inline-flex items-center justify-center rounded-lg font-bold uppercase tracking-wide transition-all px-4 py-3 text-sm border border-brand-jade bg-brand-jade/10 text-brand-evergreen hover:bg-brand-jade/20"
              >
                Go Home
              </Link>
              <Link 
                href="/login"
                className="inline-flex items-center justify-center rounded-lg font-bold uppercase tracking-wide transition-all px-4 py-3 text-sm bg-brand-jade text-white hover:bg-brand-jadeHover shadow-md"
              >
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Valid invitation - show accept UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-evergreen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-brand-jade/10 flex items-center justify-center">
            <span className="text-2xl">👥</span>
          </div>
          <h2 className="text-xl font-semibold text-brand-text">You&apos;re Invited!</h2>
          <p className="mt-2 text-brand-textMuted">
            You&apos;ve been invited to join a team on SuoOps
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-brand-border p-4 space-y-2 bg-brand-background">
            <div className="flex justify-between">
              <span className="text-brand-textMuted">Team</span>
              <span className="font-medium text-brand-text">{invitation.team_name || "Team"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-textMuted">Invited by</span>
              <span className="font-medium text-brand-text">{invitation.inviter_name || "Team Admin"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-textMuted">Your email</span>
              <span className="font-medium text-brand-text">{invitation.email || ""}</span>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            {isAuthenticated ? (
              <Button 
                onClick={handleAccept} 
                disabled={accepting}
                className="w-full"
              >
                {accepting ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Joining...
                  </>
                ) : (
                  "Accept Invitation"
                )}
              </Button>
            ) : (
              <Button onClick={handleAccept} className="w-full">
                Sign in to Accept
              </Button>
            )}
          </div>

          <p className="text-xs text-center text-brand-textMuted">
            By accepting, you&apos;ll join the team and be able to collaborate on invoices 
            and business operations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
