import { describe, expect, it } from "vitest";

import { getStorefrontSetupCompletion } from "../storefront-setup-guide";

describe("getStorefrontSetupCompletion", () => {
  it("keeps each storefront requirement independent", () => {
    expect(
      getStorefrontSetupCompletion({
        storeEnabled: true,
        hasLogo: false,
        detailsComplete: false,
        hasListableProduct: true,
        hasBankDetails: false,
        paymentsEnabled: true,
      }),
    ).toEqual([true, false, false, true, false, true]);
  });

  it("marks a storefront ready only when every requirement is complete", () => {
    expect(
      getStorefrontSetupCompletion({
        storeEnabled: true,
        hasLogo: true,
        detailsComplete: true,
        hasListableProduct: true,
        hasBankDetails: true,
        paymentsEnabled: true,
      }).every(Boolean),
    ).toBe(true);
  });
});