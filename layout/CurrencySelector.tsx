"use client";

import { useState, useRef, useEffect } from "react";
import { usePrice, Currency } from "@/providers/PriceContext";
import { COUNTRY_WITH_FLAG_AND_NAME } from "@/constants/country";
import { ChevronDown, Check } from "lucide-react";

const CURRENCY_METADATA: Record<Currency, { name: string; symbol: string }> = {
  NPR: { name: "Nepalese Rupee", symbol: "Rs." },
  INR: { name: "Indian Rupee", symbol: "₹" },
  USD: { name: "US Dollar", symbol: "$" },
  EUR: { name: "Euro", symbol: "€" },
  GBP: { name: "British Pound", symbol: "£" },
  AUD: { name: "Australian Dollar", symbol: "A$" },
  CAD: { name: "Canadian Dollar", symbol: "C$" },
  JPY: { name: "Japanese Yen", symbol: "¥" },
  AED: { name: "UAE Dirham", symbol: "AED" },
  NZD: { name: "New Zealand Dollar", symbol: "NZ$" },
  TH: { name: "Thai Baht", symbol: "฿" },
};

interface CurrencySelectorProps {
  variant?: "desktop" | "compact" | "full";
  className?: string;
}

export default function CurrencySelector({
  variant = "desktop",
  className = "",
}: CurrencySelectorProps) {
  const { currency, setCurrency } = usePrice();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeItem =
    COUNTRY_WITH_FLAG_AND_NAME.find((c) => c.label === currency) ||
    COUNTRY_WITH_FLAG_AND_NAME[3]; // default to NPR if not matched

  const activeMeta = CURRENCY_METADATA[currency] || {
    name: currency,
    symbol: "",
  };

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSelect = (selectedCurrency: Currency) => {
    setCurrency(selectedCurrency);
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block text-left ${
        variant === "full" ? "w-full" : ""
      } ${className}`}
    >
      {/* Trigger Button */}
      {variant === "compact" ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={`Select currency, currently ${currency}`}
          className="flex h-9 items-center gap-1.5 rounded-lg border border-amber-900/15 bg-white/80 px-2 py-1 text-xs font-semibold text-[#5c3a1e] shadow-2xs transition-all hover:border-amber-900/35 hover:bg-amber-50 cursor-pointer"
        >
          {activeItem?.flag && (
            <img
              src={activeItem.flag}
              alt={currency}
              className="h-3.5 w-5 rounded-xs border border-amber-900/10 object-cover shadow-2xs"
            />
          )}
          <span>{currency}</span>
          <ChevronDown
            className={`size-3 text-[#713f12]/60 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      ) : variant === "full" ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={`Select currency, currently ${currency}`}
          className="flex w-full items-center justify-between rounded-xl border border-amber-900/20 bg-white px-3.5 py-2.5 text-xs font-medium text-[#422006] shadow-xs transition-colors hover:border-amber-900/40 hover:bg-amber-50/60 cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            {activeItem?.flag && (
              <img
                src={activeItem.flag}
                alt={currency}
                className="h-4 w-5.5 rounded-xs border border-amber-900/10 object-cover shadow-2xs"
              />
            )}
            <div className="flex flex-col text-left">
              <span className="font-bold text-[#422006]">
                {currency} ({activeMeta.symbol})
              </span>
              <span className="text-[11px] text-[#713f12]/70">
                {activeMeta.name}
              </span>
            </div>
          </div>
          <ChevronDown
            className={`size-4 text-[#713f12]/60 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      ) : (
        /* Desktop Variant */
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={`Select currency, currently ${currency}`}
          className="group flex h-9 items-center gap-1.5 rounded-lg border border-amber-900/20 bg-white/70 px-2.5 text-xs font-semibold text-[#5c3a1e] shadow-2xs transition-all duration-200 hover:border-amber-900/40 hover:bg-amber-50/80 hover:text-[#713f12] cursor-pointer"
        >
          {activeItem?.flag && (
            <img
              src={activeItem.flag}
              alt={currency}
              className="h-3.5 w-5 rounded-xs border border-amber-900/10 object-cover shadow-2xs transition-transform duration-200 group-hover:scale-105"
            />
          )}
          <span className="tracking-wide">{currency}</span>
          <ChevronDown
            className={`size-3 text-[#713f12]/60 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Currencies"
          className={`absolute z-50 mt-1.5 max-h-80 overflow-y-auto rounded-2xl border border-amber-900/15 bg-[#faf7f2] p-1.5 shadow-xl backdrop-blur-md transition-all animate-in fade-in zoom-in-95 duration-150 ${
            variant === "full" ? "left-0 right-0 w-full" : "right-0 min-w-55"
          }`}
        >
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#713f12]/60 border-b border-amber-900/10 mb-1">
            Choose Currency
          </div>

          <div className="space-y-0.5">
            {COUNTRY_WITH_FLAG_AND_NAME.map((item) => {
              const isSelected = item.label === currency;
              const meta = CURRENCY_METADATA[item.label] || {
                name: item.label,
                symbol: "",
              };

              return (
                <button
                  key={item.label}
                  role="option"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => handleSelect(item.label)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-2.5 py-2 text-left text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-amber-100/90 font-bold text-[#713f12] shadow-2xs"
                      : "text-[#422006] hover:bg-amber-100/50 hover:text-[#713f12]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.flag}
                      alt={item.label}
                      className="h-3.5 w-5 shrink-0 rounded-xs border border-amber-900/10 object-cover shadow-2xs"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="truncate">
                        <span className="font-bold">{item.label}</span>
                        {meta.symbol && (
                          <span className="ml-1 text-[11px] opacity-70">
                            ({meta.symbol})
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] text-[#713f12]/60 truncate">
                        {meta.name}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="size-4 shrink-0 text-[#713f12]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
