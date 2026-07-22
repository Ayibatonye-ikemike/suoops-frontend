import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { BuyerMessages } from "../order-messages";

function mockFetchOnce(body: unknown, ok = true) {
  return vi.fn().mockResolvedValue({
    ok,
    json: async () => body,
  });
}

describe("BuyerMessages", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("opens the thread with the release code and shows messages", async () => {
    const user = userEvent.setup();
    global.fetch = mockFetchOnce({
      messages: [
        { id: 1, sender_role: "seller", mine: false, body: "On my way!", flagged: false, created_at: null },
      ],
    }) as unknown as typeof fetch;

    render(<BuyerMessages slug="jade-store" />);
    await user.click(screen.getByText("Message the seller"));
    await user.type(screen.getByPlaceholderText("6-digit release code"), "481920");
    await user.click(screen.getByText("Open chat"));

    await waitFor(() => expect(screen.getByText("On my way!")).toBeInTheDocument());
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/public/store/jade-store/messages/list"),
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("shows a protection notice when a message is blocked", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      // messages/list (open chat)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ messages: [] }) })
      // send -> blocked
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: false, blocked: true, message: "Keep payments on SuoOps." }),
      })
      // reload after send
      .mockResolvedValueOnce({ ok: true, json: async () => ({ messages: [] }) });
    global.fetch = fetchMock as unknown as typeof fetch;

    render(<BuyerMessages slug="jade-store" />);
    await user.click(screen.getByText("Message the seller"));
    await user.type(screen.getByPlaceholderText("6-digit release code"), "481920");
    await user.click(screen.getByText("Open chat"));
    await waitFor(() => screen.getByPlaceholderText("Message about your delivery…"));

    await user.type(screen.getByPlaceholderText("Message about your delivery…"), "pay me directly");
    await user.click(screen.getByText("Send"));

    await waitFor(() => expect(screen.getByText("Keep payments on SuoOps.")).toBeInTheDocument());
  });
});
