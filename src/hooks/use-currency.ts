"use client";

import { useEffect, useCallback, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getExchangeRate, refreshExchangeRate } from "@/api/analytics";
import { useCurrencyStore } from "@/stores/currency-store";

/**
 * Central hook for currency display across the entire app.
 *
 * Returns the current currency, symbol, and formatting helpers.
 * Automatically fetches and caches the live exchange rate.
 *
 * Usage:
 *   const { symbol, formatAmount, formatCompact, currency, refreshRate } = useCurrency();
 *   <p>{formatAmount(150000)}</p>   // → "₦150,000.00" or "$111.47"
 *   <p>{formatCompact(150000)}</p>  // → "₦150k" or "$111"
 */
export function useCurrency() {
  const currency = useCurrencyStore((s) => s.currency);
  const exchangeRate = useCurrencyStore((s) => s.exchangeRate);
  const setExchangeRate = useCurrencyStore((s) => s.setExchangeRate);
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch live exchange rate and keep it in the store
  const { data: rateInfo } = useQuery({
    queryKey: ["exchange-rate"],
    queryFn: getExchangeRate,
    staleTime: 10 * 60 * 1000, // 10 min
    refetchInterval: 15 * 60 * 1000, // auto-refresh every 15 min
  });

  useEffect(() => {
    if (rateInfo?.rate && rateInfo.rate !== exchangeRate) {
      setExchangeRate(rateInfo.rate);
    }
  }, [rateInfo?.rate, exchangeRate, setExchangeRate]);

  const rate = exchangeRate ?? rateInfo?.rate ?? null;
  const symbol = currency === "NGN" ? "₦" : "$";

  /**
   * Force-refresh the exchange rate from the server.
   * Busts the server-side cache and re-fetches.
   */
  const refreshRate = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const fresh = await refreshExchangeRate();
      setExchangeRate(fresh.rate);
      // Invalidate the React Query cache so the hook picks up the new value
      queryClient.invalidateQueries({ queryKey: ["exchange-rate"] });
    } finally {
      setIsRefreshing(false);
    }
  }, [setExchangeRate, queryClient]);

  /** Convert an NGN amount to the selected currency. */
  const convert = (ngnAmount: number): number => {
    if (currency === "NGN" || !rate) return ngnAmount;
    return ngnAmount / rate;
  };

  /**
   * Full-precision currency format.
   * e.g. "₦150,000.00" or "$111.47"
   */
  const formatAmount = (ngnAmount: number): string => {
    const value = convert(ngnAmount);
    return `${symbol}${value.toLocaleString("en-US", {
      minimumFractionDigits: currency === "NGN" ? 0 : 2,
      maximumFractionDigits: currency === "NGN" ? 0 : 2,
    })}`;
  };

  /**
   * Compact format for dashboard cards.
   * e.g. "₦150k", "₦1.2M", "$111"
   */
  const formatCompact = (ngnAmount: number): string => {
    const value = convert(ngnAmount);
    if (value >= 1_000_000) return `${symbol}${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${symbol}${(value / 1_000).toFixed(0)}k`;
    return `${symbol}${value.toLocaleString("en-US", { maximumFractionDigits: currency === "NGN" ? 0 : 2 })}`;
  };

  /**
   * Integer format — no decimal places.
   * e.g. "₦150,000" or "$111"
   */
  const formatWhole = (ngnAmount: number): string => {
    const value = convert(ngnAmount);
    return `${symbol}${value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: currency === "NGN" ? 0 : 2,
    })}`;
  };

  return {
    currency,
    symbol,
    exchangeRate: rate,
    rateDescription: rateInfo?.description ?? null,
    convert,
    formatAmount,
    formatCompact,
    formatWhole,
    refreshRate,
    isRefreshing,
  };
}
