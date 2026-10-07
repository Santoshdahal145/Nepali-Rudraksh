"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  X,
  Check,
  RotateCcw,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  Layers,
  CircleDollarSign,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface AllProductsMobileFilterProps {
  isOpen: boolean;
  onClose: () => void;
  totalFound?: number;
}

const CATEGORIES = [
  { label: "All Sacred Items", value: "", icon: "🌿" },
  { label: "Individual Beads (1-21 Mukhi)", value: "INDIVIDUAL_RUDRAKSHA", icon: "📿" },
  { label: "Sacred Japa Malas (108+1)", value: "RUDRAKSHA_MALA", icon: "✨" },
];

const MUKHIS = [
  { label: "All Mukhis", value: "" },
  { label: "1 Mukhi", value: "1" },
  { label: "2 Mukhi", value: "2" },
  { label: "3 Mukhi", value: "3" },
  { label: "4 Mukhi", value: "4" },
  { label: "5 Mukhi", value: "5" },
  { label: "6 Mukhi", value: "6" },
  { label: "7 Mukhi", value: "7" },
  { label: "8 Mukhi", value: "8" },
  { label: "9 Mukhi", value: "9" },
  { label: "10 Mukhi", value: "10" },
  { label: "11 Mukhi", value: "11" },
  { label: "12 Mukhi", value: "12" },
  { label: "14 Mukhi", value: "14" },
  { label: "21 Mukhi", value: "21" },
];

const SORT_OPTIONS = [
  { label: "Newly Blessed", value: "newest", sortBy: "createdAt", sortOrder: "desc" },
  { label: "Oldest First", value: "oldest", sortBy: "createdAt", sortOrder: "asc" },
  { label: "Price: Low to High", value: "price-asc", sortBy: "price", sortOrder: "asc" },
  { label: "Price: High to Low", value: "price-desc", sortBy: "price", sortOrder: "desc" },
  { label: "Name: A to Z", value: "name-asc", sortBy: "name", sortOrder: "asc" },
  { label: "Name: Z to A", value: "name-desc", sortBy: "name", sortOrder: "desc" },
];

const PRICE_PRESETS = [
  { label: "Under Rs. 2,000", min: "", max: "2000" },
  { label: "Rs. 2,000 - 10,000", min: "2000", max: "10000" },
  { label: "Rs. 10,000 - 50,000", min: "10000", max: "50000" },
  { label: "Above Rs. 50,000", min: "50000", max: "" },
];

export default function AllProductsMobileFilter({
  isOpen,
  onClose,
  totalFound,
}: AllProductsMobileFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentType = searchParams.get("type") || "";
  const currentMukhi = searchParams.get("mukhi") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentSortBy = searchParams.get("sortBy") || "createdAt";
  const currentSortOrder = searchParams.get("sortOrder") || "desc";

  // Local draft state for filters
  const [selectedType, setSelectedType] = useState(currentType);
  const [selectedMukhi, setSelectedMukhi] = useState(currentMukhi);
  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);
  const [selectedSort, setSelectedSort] = useState(
    currentSortBy === "price"
      ? currentSortOrder === "asc"
        ? "price-asc"
        : "price-desc"
      : currentSortBy === "name"
        ? currentSortOrder === "asc"
          ? "name-asc"
          : "name-desc"
        : currentSortOrder === "asc"
          ? "oldest"
          : "newest"
  );

  useEffect(() => {
    setSelectedType(currentType);
    setSelectedMukhi(currentMukhi);
    setMinPrice(currentMinPrice);
    setMaxPrice(currentMaxPrice);
    setSelectedSort(
      currentSortBy === "price"
        ? currentSortOrder === "asc"
          ? "price-asc"
          : "price-desc"
        : currentSortBy === "name"
          ? currentSortOrder === "asc"
            ? "name-asc"
            : "name-desc"
          : currentSortOrder === "asc"
            ? "oldest"
            : "newest"
    );
  }, [
    currentType,
    currentMukhi,
    currentMinPrice,
    currentMaxPrice,
    currentSortBy,
    currentSortOrder,
    isOpen,
  ]);

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    // Type
    if (selectedType) params.set("type", selectedType);
    else params.delete("type");

    // Mukhi
    if (selectedMukhi) params.set("mukhi", selectedMukhi);
    else params.delete("mukhi");

    // Prices
    if (minPrice.trim()) params.set("minPrice", minPrice.trim());
    else params.delete("minPrice");

    if (maxPrice.trim()) params.set("maxPrice", maxPrice.trim());
    else params.delete("maxPrice");

    // Sort
    const sortObj = SORT_OPTIONS.find((s) => s.value === selectedSort);
    if (sortObj) {
      params.set("sortBy", sortObj.sortBy);
      params.set("sortOrder", sortObj.sortOrder);
    }

    startTransition(() => {
      router.push(`/all-products?${params.toString()}`);
      onClose();
    });
  };

  const handleResetAll = () => {
    setSelectedType("");
    setSelectedMukhi("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedSort("newest");

    startTransition(() => {
      const params = new URLSearchParams();
      const currentSearch = searchParams.get("search");
      if (currentSearch) params.set("search", currentSearch);

      router.push(`/all-products${params.toString() ? `?${params.toString()}` : ""}`);
      onClose();
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="max-h-[90vh] rounded-t-3xl bg-[#faf7f2] p-0 text-[#422006] flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-amber-900/10 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-[#713f12]" />
            <SheetTitle className="text-base font-extrabold text-[#422006]">
              Filter Sacred Products
            </SheetTitle>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-[#5c3a1e]/70 hover:bg-amber-100/50 cursor-pointer"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {/* Scrollable Filter Options */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* 1. Sort Section */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#713f12]">
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>Sort By</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SORT_OPTIONS.map((opt) => {
                const isSelected = selectedSort === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedSort(opt.value)}
                    className={`rounded-xl px-3 py-2.5 text-xs font-semibold text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#713f12] text-white shadow-xs font-bold"
                        : "bg-white border border-amber-900/15 text-[#5c3a1e] hover:bg-amber-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Category Section */}
          <div className="space-y-2.5 border-t border-amber-900/10 pt-5">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#713f12]">
              <Layers className="h-3.5 w-3.5" />
              <span>Sacred Category</span>
            </label>
            <div className="space-y-1.5">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedType === cat.value;
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => setSelectedType(cat.value)}
                    className={`flex w-full items-center justify-between rounded-xl p-3 text-left text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-amber-100/90 text-[#713f12] font-bold border border-amber-900/20 shadow-2xs"
                        : "bg-white border border-amber-900/10 text-[#422006] hover:bg-amber-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{cat.icon}</span>
                      <span>{cat.label}</span>
                    </div>
                    {isSelected && <Check className="size-4 text-[#713f12]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Mukhi Section */}
          <div className="space-y-2.5 border-t border-amber-900/10 pt-5">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#713f12]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Sacred Mukhi (Facets)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {MUKHIS.map((m) => {
                const isSelected = selectedMukhi === m.value;
                return (
                  <button
                    key={m.label}
                    type="button"
                    onClick={() => setSelectedMukhi(m.value)}
                    className={`rounded-xl py-2.5 px-2 text-center text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#713f12] text-white shadow-xs font-bold"
                        : "bg-white border border-amber-900/15 text-[#5c3a1e] hover:bg-amber-50"
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Price Range Section */}
          <div className="space-y-2.5 border-t border-amber-900/10 pt-5">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#713f12]">
              <CircleDollarSign className="h-3.5 w-3.5" />
              <span>Price Range (NPR)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min Rs."
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full h-10 rounded-xl border border-amber-900/15 bg-white px-3 text-xs text-[#422006] outline-none focus:border-amber-700"
              />
              <input
                type="number"
                placeholder="Max Rs."
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-10 rounded-xl border border-amber-900/15 bg-white px-3 text-xs text-[#422006] outline-none focus:border-amber-700"
              />
            </div>

            {/* Quick Price Presets */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {PRICE_PRESETS.map((preset) => {
                const isSelected = minPrice === preset.min && maxPrice === preset.max;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setMinPrice("");
                        setMaxPrice("");
                      } else {
                        setMinPrice(preset.min);
                        setMaxPrice(preset.max);
                      }
                    }}
                    className={`rounded-lg py-1.5 px-2 text-center text-[11px] font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-amber-100 text-[#713f12] font-bold border border-amber-900/20"
                        : "bg-white border border-amber-900/10 text-[#5c3a1e]/80"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Sticky Footer Actions */}
        <div className="border-t border-amber-900/10 p-4 bg-white shrink-0 flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleResetAll}
            className="flex-1 h-11 rounded-xl border-amber-900/20 text-[#713f12] hover:bg-amber-50 font-bold text-xs gap-1.5 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset All</span>
          </Button>

          <Button
            type="button"
            onClick={handleApply}
            className="flex-1 h-11 rounded-xl bg-[#713f12] text-white hover:bg-[#5c330e] font-extrabold text-xs shadow-md cursor-pointer"
          >
            {typeof totalFound === "number"
              ? `Show Results (${totalFound})`
              : "Apply Filters"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
