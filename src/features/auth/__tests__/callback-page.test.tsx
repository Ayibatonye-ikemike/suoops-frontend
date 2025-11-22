import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import OAuthCallbackPage from "../../../../app/(auth)/callback/page";

// Mock next/navigation hooks
vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
    useSearchParams: () => new URLSearchParams(globalThis.__TEST_PARAMS__ || ""),
  };
});

// Mock telemetry
vi.mock("@/lib/telemetry", () => ({ telemetry: { oauthCallbackError: vi.fn(), oauthCallbackSuccess: vi.fn(), oauthStart: vi.fn(), oauthExchangeSuccess: vi.fn(), oauthExchangeFailure: vi.fn() } }));

// Mock oauth client
vi.mock("@/features/auth/oauth-client", () => ({
  exchangeOAuthCode: vi.fn(async (code: string) => ({ access_token: `tok-${code}`, access_expires_at: new Date(Date.now() + 60000).toISOString() })),
  OAuthExchangeError: class extends Error { constructor(public kind: string, msg: string){ super(msg); } },
}));

// Mock auth store
vi.mock("@/features/auth/auth-store", () => {
  const setTokens = vi.fn();
  return {
    useAuthStore: (selector: (state: { setTokens: typeof setTokens }) => unknown) =>
      selector({ setTokens }),
  };
});

declare global { var __TEST_PARAMS__: string | undefined; }

describe("OAuthCallbackPage", () => {
  beforeEach(() => {
    global.__TEST_PARAMS__ = undefined;
  });

  it("shows loading spinner initially", () => {
    global.__TEST_PARAMS__ = "code=abc&state=xyz";
    render(<OAuthCallbackPage />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders error when provider error present", async () => {
    global.__TEST_PARAMS__ = "error=access_denied";
    render(<OAuthCallbackPage />);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/cancelled/i);
    });
  });

  it("renders error when missing params", async () => {
    global.__TEST_PARAMS__ = "code=only"; // missing state
    render(<OAuthCallbackPage />);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/Missing OAuth parameters|Security validation/i);
    });
  });

  it("successful flow redirects (mock) and no error displayed", async () => {
    global.__TEST_PARAMS__ = "code=abc&state=xyz";
    render(<OAuthCallbackPage />);
    await waitFor(() => {
      expect(screen.queryByRole("alert")).toBeNull();
    });
  });
});
