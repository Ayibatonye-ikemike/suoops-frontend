import { describe, it, expect, vi, beforeEach } from "vitest";
import { exchangeOAuthCode, OAuthExchangeError } from "../oauth-client";

// Helper: set session storage expected state
function setState(value: string) {
  sessionStorage.setItem("oauth_expected_state", value);
}

describe("exchangeOAuthCode", () => {
  const provider = "google";

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    (global as any).fetch = vi.fn();
  });

  it("successfully exchanges code/state", async () => {
    setState("abc123");
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: "tok", access_expires_at: new Date(Date.now() + 3600_000).toISOString() }),
    });
    const result = await exchangeOAuthCode("code1", "abc123", { provider });
    expect(result.access_token).toBe("tok");
    expect(sessionStorage.getItem("oauth_expected_state")).toBeNull();
  });

  it("throws invalid_state when mismatch occurs", async () => {
    setState("expected");
    await expect(exchangeOAuthCode("codeA", "other", { provider })).rejects.toMatchObject({ kind: "invalid_state" });
  });

  it("retries on server error then succeeds", async () => {
    setState("vv" );
    (fetch as any)
      .mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({ detail: "boom" }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ access_token: "after-retry", access_expires_at: new Date(Date.now() + 60000).toISOString() }) });
    const result = await exchangeOAuthCode("codeX", "vv", { provider, retries: 2 });
    expect(result.access_token).toBe("after-retry");
    expect((fetch as any).mock.calls.length).toBe(2);
  });

  it("classifies network timeout", async () => {
    setState("st" );
    (fetch as any).mockImplementation(() => new Promise((_r,_j)=>{})); // never resolves
    await expect(exchangeOAuthCode("c","st", { provider, timeoutMs: 10, retries: 0 })).rejects.toMatchObject({ kind: "network" });
  });

  it("returns server classification after retries fail", async () => {
    setState("zz" );
    (fetch as any)
      .mockResolvedValue({ ok: false, status: 502, json: async () => ({ detail: "bad gateway" }) });
    await expect(exchangeOAuthCode("code","zz", { provider, retries: 1 })).rejects.toMatchObject({ kind: "server" });
  });

  it("maps missing params", async () => {
    await expect(exchangeOAuthCode(null, null, { provider })).rejects.toMatchObject({ kind: "missing_params" });
  });
});
