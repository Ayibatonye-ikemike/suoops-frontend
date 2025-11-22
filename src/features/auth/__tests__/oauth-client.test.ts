import { describe, it, expect, vi, beforeEach } from "vitest";
import { exchangeOAuthCode } from "../oauth-client";

// Helper: set session storage expected state
function setState(value: string) {
  sessionStorage.setItem("oauth_expected_state", value);
}

type FetchMock = ReturnType<typeof vi.fn<Parameters<typeof fetch>, ReturnType<typeof fetch>>>;

describe("exchangeOAuthCode", () => {
  const provider = "google";
  let fetchMock: FetchMock;

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    fetchMock = vi.fn<Parameters<typeof fetch>, ReturnType<typeof fetch>>();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it("successfully exchanges code/state", async () => {
    setState("abc123");
    fetchMock.mockResolvedValueOnce({
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
    fetchMock
      .mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({ detail: "boom" }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ access_token: "after-retry", access_expires_at: new Date(Date.now() + 60000).toISOString() }) });
    const result = await exchangeOAuthCode("codeX", "vv", { provider, retries: 2 });
    expect(result.access_token).toBe("after-retry");
    expect(fetchMock.mock.calls.length).toBe(2);
  });

  it("classifies network timeout", async () => {
    setState("st" );
    fetchMock.mockImplementation(() => new Promise(() => {})); // never resolves
    await expect(exchangeOAuthCode("c","st", { provider, timeoutMs: 10, retries: 0 })).rejects.toMatchObject({ kind: "network" });
  });

  it("returns server classification after retries fail", async () => {
    setState("zz" );
    fetchMock
      .mockResolvedValue({ ok: false, status: 502, json: async () => ({ detail: "bad gateway" }) });
    await expect(exchangeOAuthCode("code","zz", { provider, retries: 1 })).rejects.toMatchObject({ kind: "server" });
  });

  it("maps missing params", async () => {
    await expect(exchangeOAuthCode(null, null, { provider })).rejects.toMatchObject({ kind: "missing_params" });
  });
});
