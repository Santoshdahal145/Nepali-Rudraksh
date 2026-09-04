"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const SUPPORTED_CURRENCIES = [
  "TH",
  "USD",
  "NZD",
  "NPR",
  "EUR",
  "INR",
  "JPY",
  "AED",
  "AUD",
  "GBP",
  "CAD",
] as const;

export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

type ExchangeRate = {
  base: string;
  quote: string;
  rate: number;
};

type PriceContextType = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (priceNPR: number) => number;
  formatPrice: (priceNPR: number) => string;
  rates: Record<string, number>;
  loading: boolean;
};

const PriceContext = createContext<PriceContextType | null>(null);

export function PriceProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("NPR");

  const [rates, setRates] = useState<Record<string, number>>({
    NPR: 1,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRates() {
      try {
        const response = await fetch(
          "https://api.frankfurter.dev/v2/rates?base=NPR"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch exchange rates");
        }

        const data: ExchangeRate[] = await response.json();

        const rateMap: Record<string, number> = {
          NPR: 1,
        };

        for (const item of data) {
          if (SUPPORTED_CURRENCIES.includes(item.quote as Currency)) {
            rateMap[item.quote] = item.rate;
          }
        }

        setRates(rateMap);
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRates();
  }, []);

  const convertPrice = (priceNPR: number) => {
    const rate = rates[currency];

    if (!rate) {
      return priceNPR;
    }

    return priceNPR * rate;
  };

  const formatPrice = (priceNPR: number) => {
    const convertedPrice = convertPrice(priceNPR);

    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(convertedPrice);
  };

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      convertPrice,
      formatPrice,
      rates,
      loading,
    }),
    [currency, rates, loading]
  );

  return (
    <PriceContext.Provider value={value}>{children}</PriceContext.Provider>
  );
}

export function usePrice() {
  const context = useContext(PriceContext);

  if (!context) {
    throw new Error("usePrice must be used inside PriceProvider");
  }

  return context;
}
