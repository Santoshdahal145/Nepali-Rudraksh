"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  RotateCcw,
  Sparkles,
  Layers,
  CircleDollarSign,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PublicProductSidebarFilterProps {
  totalFound: number;
}

const CATEGORIES = [
  { label: "All Sacred Items", value: "", icon: "🌿" },
  {
    label: "Individual Beads (1-21 Mukhi)",
    value: "INDIVIDUAL_RUDRAKSHA",
    icon: "📿",
  },
  { label: "Sacred Japa Malas (108+1)", value: "RUDRAKSHA_MALA", icon: "✨" },
];

const PRICE_PRESETS = [
  { label: "Under Rs. 2,000", min: "", max: "2000" },
  { label: "Rs. 2,000 - Rs. 10,000", min: "2000", max: "10000" },
  { label: "Rs. 10,000 - Rs. 50,000", min: "10000", max: "50000" },
  { label: "Above Rs. 50,000", min: "50000", max: "" },
];

export default function PublicProductSidebarFilter({
  totalFound,
}: PublicProductSidebarFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentType = searchParams.get("type") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";

  const [minPriceInput, setMinPriceInput] = useState(currentMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(currentMaxPrice);

  useEffect(() => {
    setMinPriceInput(currentMinPrice);
    setMaxPriceInput(currentMaxPrice);
  }, [currentMinPrice, currentMaxPrice]);

  const updateParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    Object.entries(updates).forEach(([key, val]) => {
      if (val !== undefined && val !== "") {
        params.set(key, val);
      } else {
        params.delete(key);
      }
    });

    startTransition(() => {
      router.push(`/all-products?${params.toString()}`);
    });
  };

  const handleApplyPrice = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({
      minPrice: minPriceInput.trim(),
      maxPrice: maxPriceInput.trim(),
    });
  };

  const handleSelectPricePreset = (min: string, max: string) => {
    const isAlreadySelected =
      currentMinPrice === min && currentMaxPrice === max;
    if (isAlreadySelected) {
      updateParams({ minPrice: "", maxPrice: "" });
    } else {
      updateParams({ minPrice: min, maxPrice: max });
    }
  };

  const hasActiveSidebarFilters = Boolean(
    currentType || currentMinPrice || currentMaxPrice,
  );

  const handleResetSidebar = () => {
    setMinPriceInput("");
    setMaxPriceInput("");
    updateParams({
      type: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  return (
    <aside className="w-full space-y-5 rounded-2xl border border-amber-900/15 bg-white p-5 shadow-xs">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-amber-900/10 pb-3.5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#713f12]" />
          <h3 className="font-extrabold text-sm sm:text-base text-[#422006]">
            Filter Catalog
          </h3>
        </div>

        {hasActiveSidebarFilters && (
          <button
            type="button"
            onClick={handleResetSidebar}
            className="flex items-center gap-1 text-[11px] font-bold text-[#713f12] hover:underline cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 1. Category Section */}
      <div className="space-y-3">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#713f12]">
          <Layers className="h-3.5 w-3.5 text-amber-700" />
          <span>Category</span>
        </label>

        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => {
            const isSelected = currentType === cat.value;
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => updateParams({ type: cat.value })}
                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-amber-100/80 font-bold text-[#713f12] border border-amber-900/20 shadow-2xs"
                    : "text-[#5c3a1e] hover:bg-amber-50 hover:text-[#713f12] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{cat.icon}</span>
                  <span>{cat.label}</span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-[#713f12]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Price Range Section */}
      <div className="space-y-3 border-t border-amber-900/10 pt-4">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#713f12]">
          <CircleDollarSign className="h-3.5 w-3.5 text-amber-700" />
          <span>Price (NPR)</span>
        </label>

        {/* Min / Max Inputs */}
        <form onSubmit={handleApplyPrice} className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                placeholder="Min Rs."
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                className="w-full h-9 rounded-xl border border-amber-900/15 bg-amber-50/20 px-2.5 text-xs text-[#422006] placeholder:text-stone-400 outline-none focus:border-amber-700 focus:bg-white"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Max Rs."
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                className="w-full h-9 rounded-xl border border-amber-900/15 bg-amber-50/20 px-2.5 text-xs text-[#422006] placeholder:text-stone-400 outline-none focus:border-amber-700 focus:bg-white"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="sm"
            className="w-full h-8.5 rounded-xl bg-[#713f12] hover:bg-[#5c330e] text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            Apply Price Range
          </Button>
        </form>

        {/* Quick Price Preset Pills */}
        <div className="space-y-1.5 pt-1">
          {PRICE_PRESETS.map((preset) => {
            const isSelected =
              currentMinPrice === preset.min && currentMaxPrice === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleSelectPricePreset(preset.min, preset.max)}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[11px] font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-amber-100 text-[#713f12] font-bold"
                    : "text-[#5c3a1e]/80 hover:bg-amber-50 hover:text-[#713f12]"
                }`}
              >
                <span>{preset.label}</span>
                {isSelected && <Check className="h-3 w-3 text-[#713f12]" />}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
