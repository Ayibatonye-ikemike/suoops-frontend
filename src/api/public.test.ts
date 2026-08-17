import { afterEach, describe, expect, it, vi } from "vitest";

import { getPublicTestimonials } from "./public";

describe("getPublicTestimonials", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns testimonials from a successful response", async () => {
    const testimonials = [{ id: 1, text: "Useful" }];
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => testimonials })
    );

    await expect(getPublicTestimonials()).resolves.toEqual(testimonials);
  });

  it.each([
    ["HTTP error", vi.fn().mockResolvedValue({ ok: false })],
    ["network error", vi.fn().mockRejectedValue(new TypeError("Failed to fetch"))],
    ["malformed response", vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })],
  ])("returns an empty list for %s", async (_label, fetchMock) => {
    vi.stubGlobal("fetch", fetchMock);

    await expect(getPublicTestimonials()).resolves.toEqual([]);
  });
});