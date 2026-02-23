"use client";

import { create } from "zustand";

export type Currency = "NGN" | "USD";

interface CurrencyState {
  /** The currently selected display currency. */
  currency: Currency;
  /** The cached NGN-per-1-USD exchange rate (e.g. 1345). */
  exchangeRate: number | null;
  /** Toggle or set the display currency. */
  setCurrency: (c: Currency) => void;
  /** Store the latest exchange rate fetched from the backend. */
  setExchangeRate: (rate: number) => void;
}

export const useCurrencyStore = create<CurrencyState>()((set) => ({
  currency: "NGN",
  exchangeRate: null,
  setCurrency: (currency) => set({ currency }),
  setExchangeRate: (exchangeRate) => set({ exchangeRate }),
}));
