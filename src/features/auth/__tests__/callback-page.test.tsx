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

// Mock oauth client - class must be defined inside vi.mock factory since it's hoisted
vi.mock("@/features/auth/oauth-client", () => {
  class OAuthExchangeError extends Error {
    kind: string;
    constructor(kind: string, msg: string) {
      super(msg);
      this.kind = kind;
      this.name = "OAuthExchangeError";
    }
  }
  return {
    exchangeOAuthCode: vi.fn(async (code: string | null, state: string | null) => {
      if (!code || !state) {
        throw new OAuthExchangeError("missing_params", "Missing code/state parameters.");
      }
      return { access_token: `tok-${code}`, access_expires_at: new Date(Date.now() + 60000).toISOString() };
    }),
    OAuthExchangeError,
  };
});

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
      expect(screen.getByRole("alert")).toHaveTextContent(/Missing sign in information|try signing in again/i);
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
