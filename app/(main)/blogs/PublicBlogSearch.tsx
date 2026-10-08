"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface PublicBlogSearchProps {
  initialSearch?: string;
}

export default function PublicBlogSearch({ initialSearch = "" }: PublicBlogSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchTerm, 400);

  // Sync state if URL changes externally
  useEffect(() => {
    setSearchTerm(initialSearch);
  }, [initialSearch]);

  // Update query params on debounced change
  useEffect(() => {
    const currentParam = searchParams.get("search") || "";
    if (debouncedSearch === currentParam) return;

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch.trim()) {
      params.set("search", debouncedSearch.trim());
    } else {
      params.delete("search");
    }
    params.set("page", "1"); // Reset to page 1 on new search

    router.push(`/blogs?${params.toString()}`);
  }, [debouncedSearch, router, searchParams]);

  const handleClear = () => {
    setSearchTerm("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.set("page", "1");
    router.push(`/blogs?${params.toString()}`);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 h-4 w-4 text-[#713f12]/60 pointer-events-none" />
        <input
          type="text"
          placeholder="Search articles by title or topic..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-11 pl-10 pr-10 text-xs sm:text-sm rounded-xl border border-amber-900/20 bg-white/80 text-[#422006] placeholder-[#5c3a1e]/40 shadow-xs focus:border-[#713f12] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#713f12] transition-all"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-full text-[#713f12]/60 hover:text-[#422006] hover:bg-amber-100/60 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
