"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/features/auth/auth-store";
import { validateInvitation, acceptInvitation, acceptInvitationDirect } from "@/api/team";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, XCircle, Users } from "lucide-react";

type PageStatus = "loading" | "valid" | "invalid" | "accepting" | "success" | "error";

interface InvitationDetails {
  teamName: string;
  inviterName: string;
  email: string;
}

function AcceptInvitationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const { status: authStatus, accessToken, setTokens } = useAuthStore();
  
  const [pageStatus, setPageStatus] = useState<PageStatus>("loading");
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [name, setName] = useState<string>("");

  // Validate invitation on mount
  useEffect(() => {
    async function validate() {
      if (!token) {
        setErrorMessage("No invitation token provided");
        setPageStatus("invalid");
        return;
      }

      try {
        const result = await validateInvitation(token);
        
        if (result.valid) {
          setInvitation({
            teamName: result.team_name || "Unknown Team",
            inviterName: result.inviter_name || "A team member",
            email: result.email || "",
          });
          setPageStatus("valid");
        } else {
          setErrorMessage(result.error || "This invitation is invalid or has expired");
          setPageStatus("invalid");
        }
      } catch (error) {
        console.error("Error validating invitation:", error);
        setErrorMessage("Failed to validate invitation. Please try again.");
        setPageStatus("invalid");
      }
    }

    validate();
  }, [token]);

  // Handle accept for authenticated users
  const handleAcceptAuthenticated = async () => {
    if (!token || !accessToken) return;

    setPageStatus("accepting");
    
    try {
      await acceptInvitation(token);
      setPageStatus("success");
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error: unknown) {
      console.error("Error accepting invitation:", error);
      const err = error as { response?: { data?: { detail?: string } } };
      setErrorMessage(err.response?.data?.detail || "Failed to accept invitation. Please try again.");
      setPageStatus("error");
    }
  };

  // Handle accept for unauthenticated users (creates account automatically)
  const handleAcceptDirect = async () => {
    if (!token || !name.trim()) return;

    setPageStatus("accepting");
    
    try {
      const result = await acceptInvitationDirect(token, name.trim());
      
      // Store the tokens to log the user in
      setTokens(result.access_token, result.refresh_token);
      
      setPageStatus("success");
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error: unknown) {
      console.error("Error accepting invitation:", error);
      const err = error as { response?: { data?: { detail?: string } } };
      setErrorMessage(err.response?.data?.detail || "Failed to accept invitation. Please try again.");
      setPageStatus("error");
    }
  };

  const handleDecline = () => {
    router.push("/");
  };

  // Loading state
  if (pageStatus === "loading" || authStatus === "loading" || authStatus === "idle") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Validating invitation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invalid/expired invitation
  if (pageStatus === "invalid") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-6 w-6 text-destructive" />
            </div>
            <h2 className="text-lg font-semibold">Invalid Invitation</h2>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => router.push("/")}>
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (pageStatus === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold">Welcome to {invitation?.teamName}!</h2>
            <p className="text-sm text-muted-foreground">
              You have successfully joined the team. Redirecting to dashboard...
            </p>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error accepting invitation
  if (pageStatus === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-6 w-6 text-destructive" />
            </div>
            <h2 className="text-lg font-semibold">Error</h2>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => router.push("/")}>
              Go to Homepage
            </Button>
            <Button onClick={() => setPageStatus("valid")}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Valid invitation - show accept options
  const isAuthenticated = authStatus === "authenticated";
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">Team Invitation</h2>
          <p className="text-sm text-muted-foreground">
            {invitation?.inviterName} has invited you to join{" "}
            <strong>{invitation?.teamName}</strong>
          </p>
        </CardHeader>
        <CardContent>
          {invitation?.email && (
            <p className="mb-6 text-center text-sm text-muted-foreground">
              This invitation was sent to <strong>{invitation.email}</strong>
            </p>
          )}
          
          <div className="flex flex-col gap-4">
            {isAuthenticated ? (
              // Authenticated user - simple accept/decline
              <>
                <Button 
                  onClick={handleAcceptAuthenticated} 
                  disabled={pageStatus === "accepting"}
                  className="w-full"
                >
                  {pageStatus === "accepting" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    "Accept Invitation"
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleDecline}
                  disabled={pageStatus === "accepting"}
                  className="w-full"
                >
                  Decline
                </Button>
              </>
            ) : (
              // Unauthenticated user - collect name and create account
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={pageStatus === "accepting"}
                  />
                  <p className="text-xs text-muted-foreground">
                    We&apos;ll create an account for you using the invitation email
                  </p>
                </div>
                
                <Button 
                  onClick={handleAcceptDirect} 
                  disabled={pageStatus === "accepting" || !name.trim()}
                  className="w-full"
                >
                  {pageStatus === "accepting" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account & joining...
                    </>
                  ) : (
                    "Accept & Join Team"
                  )}
                </Button>
                
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">
                      Already have an account?
                    </span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const returnUrl = `/team/accept?token=${token}`;
                    router.push(`/login?next=${encodeURIComponent(returnUrl)}`);
                  }}
                  disabled={pageStatus === "accepting"}
                  className="w-full"
                >
                  Sign in instead
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AcceptInvitationContent />
    </Suspense>
  );
}
