"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchAndFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  stockFilter: string;
  onStockFilterChange: (value: string) => void;
}

export default function SearchAndFilter({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  stockFilter,
  onStockFilterChange,
}: SearchAndFilterProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-amber-900/10 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 pl-10 text-xs sm:text-sm border-amber-900/15 focus-visible:ring-amber-700 bg-amber-50/20"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-[#422006]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category & Stock filters */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="h-10 rounded-xl border bg-white px-3 text-xs font-semibold text-[#422006] outline-none focus:border-amber-700 shadow-2xs"
        >
          <option value="all">Category: All</option>
          <option value="mukhi">Individual Rudraksha</option>
          <option value="mala">Rudraksha Mala</option>
        </select>

        <select
          value={stockFilter}
          onChange={(e) => onStockFilterChange(e.target.value)}
          className="h-10 rounded-xl border bg-white px-3 text-xs font-semibold text-[#422006] outline-none focus:border-amber-700 shadow-2xs"
        >
          <option value="all">Stock: All</option>
          <option value="instock">In Stock (&gt; 4)</option>
          <option value="low">Low Stock (≤ 4)</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>
    </div>
  );
}
