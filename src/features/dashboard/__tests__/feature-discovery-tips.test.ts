import { describe, expect, it } from "vitest";

import { FEATURE_TIPS } from "../feature-discovery-tips";

describe("FEATURE_TIPS", () => {
  it("covers the main SuoOps workflows", () => {
    const ids = FEATURE_TIPS.map((tip) => tip.id);

    expect(ids).toEqual(expect.arrayContaining([
      "storefront",
      "buyer-protection-delivery",
      "inventory",
      "invoice-verification",
      "expense-dashboard",
      "analytics",
      "tax-report",
      "team",
    ]));
  });

  it("does not describe included features as Pro-only", () => {
    const copy = FEATURE_TIPS.map((tip) => `${tip.title} ${tip.description}`).join(" ");
    expect(copy).not.toContain("Pro");
  });
});