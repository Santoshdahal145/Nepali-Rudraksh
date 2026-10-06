"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchFilterOriginProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  viewMode: "cards" | "table";
  onViewModeChange: (mode: "cards" | "table") => void;
}

export default function SearchFilterOrigin({
  searchQuery,
  onSearchQueryChange,
  viewMode,
  onViewModeChange,
}: SearchFilterOriginProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-amber-900/10 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by region name or country (e.g. Nepal, Indonesia)..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="h-10 pl-10 text-xs sm:text-sm border-amber-900/15 focus-visible:ring-amber-700 bg-amber-50/20"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchQueryChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-[#422006]"
          >
            Clear
          </button>
        )}
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2">
        <div className="flex rounded-xl border border-amber-900/15 bg-white p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => onViewModeChange("cards")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
              viewMode === "cards"
                ? "bg-amber-100/70 text-[#713f12]"
                : "text-muted-foreground hover:text-[#422006]"
            }`}
          >
            Cards View
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
              viewMode === "table"
                ? "bg-amber-100/70 text-[#713f12]"
                : "text-muted-foreground hover:text-[#422006]"
            }`}
          >
            Table View
          </button>
        </div>
      </div>
    </div>
  );
}
