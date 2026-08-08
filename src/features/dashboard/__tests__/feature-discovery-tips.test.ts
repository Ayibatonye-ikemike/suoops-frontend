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
      "expense-habit",
      "expense-whatsapp",
      "analytics",
      "tax-report",
      "team",
    ]));

    expect(FEATURE_TIPS.find((tip) => tip.id === "expense-habit")?.action?.href)
      .toBe("/dashboard/expenses");
    expect(FEATURE_TIPS.find((tip) => tip.id === "expense-whatsapp")?.action?.href)
      .toContain("wa.me/2348106865807");
  });

  it("does not describe included features as Pro-only", () => {
    const copy = FEATURE_TIPS.map((tip) => `${tip.title} ${tip.description}`).join(" ");
    expect(copy).not.toContain("Pro");
  });
});