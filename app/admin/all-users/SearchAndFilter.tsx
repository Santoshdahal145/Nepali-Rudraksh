"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchAndFilterProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  verifiedFilter: string;
  handleVerifiedChange: (val: string) => void;
  sortBy: "createdAt" | "firstName" | "lastName" | "email";
  sortOrder: "asc" | "desc";
  handleSortChange: (val: string) => void;
}

export default function SearchAndFilter({
  searchInput,
  setSearchInput,
  verifiedFilter,
  handleVerifiedChange,
  sortBy,
  sortOrder,
  handleSortChange,
}: SearchAndFilterProps) {
  const currentSortValue =
    sortBy === "createdAt" && sortOrder === "desc"
      ? "newest"
      : sortBy === "createdAt" && sortOrder === "asc"
        ? "oldest"
        : sortBy === "firstName" && sortOrder === "asc"
          ? "name-asc"
          : sortBy === "firstName" && sortOrder === "desc"
            ? "name-desc"
            : "email-asc";

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-amber-900/10 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name, contact or email..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="h-10 pl-10 text-xs sm:text-sm border-amber-900/15 focus-visible:ring-amber-700 bg-amber-50/20"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => setSearchInput("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-[#422006]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filters & Sorting */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Verification Filter */}
        <select
          value={verifiedFilter}
          onChange={(e) => handleVerifiedChange(e.target.value)}
          className="h-10 rounded-xl border border-amber-900/15 bg-white px-3 text-xs font-semibold text-[#422006] outline-none shadow-2xs"
        >
          <option value="all">Email: All</option>
          <option value="true">✓ Verified Email</option>
          <option value="false">⚠ Unverified Email</option>
        </select>

        {/* Sort Dropdown */}
        <select
          value={currentSortValue}
          onChange={(e) => handleSortChange(e.target.value)}
          className="h-10 rounded-xl border border-amber-900/15 bg-white px-3 text-xs font-semibold text-[#422006] outline-none shadow-2xs"
        >
          <option value="newest">Sort: Newest Joined</option>
          <option value="oldest">Sort: Oldest Joined</option>
          <option value="name-asc">Sort: First Name (A-Z)</option>
          <option value="name-desc">Sort: First Name (Z-A)</option>
          <option value="email-asc">Sort: Email (A-Z)</option>
        </select>
      </div>
    </div>
  );
}
