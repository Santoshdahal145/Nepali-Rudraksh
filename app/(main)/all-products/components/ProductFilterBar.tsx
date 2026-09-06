"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ArrowUpDown, X, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProductFilterBarProps {
  initialSearch?: string;
  initialSortBy?: string;
  initialSortOrder?: string;
  initialMukhi?: string;
  totalFound: number;
}

const MUKHI_OPTIONS = [
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

export function ProductFilterBar({
  initialSearch = "",
  initialSortBy = "createdAt",
  initialSortOrder = "desc",
  initialMukhi = "",
  totalFound,
}: ProductFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(initialSearch);

  // Helper to update URL params
  const updateParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset to page 1 on filter changes
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchTerm.trim() });
  };

  const handleSortChange = (combinedValue: string) => {
    switch (combinedValue) {
      case "price-asc":
        updateParams({ sortBy: "price", sortOrder: "asc" });
        break;
      case "price-desc":
        updateParams({ sortBy: "price", sortOrder: "desc" });
        break;
      case "name-asc":
        updateParams({ sortBy: "name", sortOrder: "asc" });
        break;
      case "name-desc":
        updateParams({ sortBy: "name", sortOrder: "desc" });
        break;
      case "oldest":
        updateParams({ sortBy: "createdAt", sortOrder: "asc" });
        break;
      case "newest":
      default:
        updateParams({ sortBy: "createdAt", sortOrder: "desc" });
        break;
    }
  };

  const currentSort =
    initialSortBy === "price"
      ? initialSortOrder === "asc"
        ? "price-asc"
        : "price-desc"
      : initialSortBy === "name"
        ? initialSortOrder === "asc"
          ? "name-asc"
          : "name-desc"
        : initialSortOrder === "asc"
          ? "oldest"
          : "newest";

  const hasActiveFilters = Boolean(
    initialSearch || initialMukhi || initialSortBy !== "createdAt" || searchParams.get("type")
  );

  const handleClearAll = () => {
    setSearchTerm("");
    startTransition(() => {
      router.push("/all-products");
    });
  };

  return (
    <div className="space-y-3.5">
      {/* Search & Sort Main Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-amber-900/15 bg-white p-3 sm:p-4 shadow-xs">
        {/* Search form */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by Rudraksha name, deity, or mukhi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10.5 rounded-xl border border-amber-900/15 bg-amber-50/20 pl-10 pr-10 text-xs sm:text-sm text-[#422006] placeholder:text-stone-400 outline-none focus:border-amber-700 focus:bg-white transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                updateParams({ search: "" });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        {/* Controls: Mukhi filter & Sort select */}
        <div className="flex items-center gap-2.5">
          {/* Mukhi dropdown */}
          <select
            value={initialMukhi}
            onChange={(e) => updateParams({ mukhi: e.target.value })}
            className="h-10.5 rounded-xl border border-amber-900/15 bg-white px-3 text-xs sm:text-sm font-semibold text-[#422006] outline-none hover:border-amber-700 focus:border-amber-700 cursor-pointer shadow-2xs"
          >
            {MUKHI_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Sort dropdown */}
          <select
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="h-10.5 rounded-xl border border-amber-900/15 bg-white px-3 text-xs sm:text-sm font-semibold text-[#422006] outline-none hover:border-amber-700 focus:border-amber-700 cursor-pointer shadow-2xs"
          >
            <option value="newest">Sort: Newly Blessed</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>

          {/* Clear Filters button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="h-10.5 rounded-xl border-amber-900/20 text-[#713f12] hover:bg-amber-50 text-xs font-bold px-3"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Mukhi Quick Pills Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-[11px] font-bold text-[#713f12] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-amber-600" />
          Popular:
        </span>
        {["1", "5", "6", "7", "8", "11", "14"].map((m) => {
          const isActive = initialMukhi === m;
          return (
            <button
              key={m}
              type="button"
              onClick={() => updateParams({ mukhi: isActive ? "" : m })}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#713f12] text-white shadow-xs"
                  : "bg-white border border-amber-900/15 text-[#5c3a1e] hover:bg-amber-50 hover:border-amber-900/30"
              }`}
            >
              {m} Mukhi
            </button>
          );
        })}
      </div>
    </div>
  );
}
