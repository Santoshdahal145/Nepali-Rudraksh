"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { searchableProducts, popularSearches } from "./nav-data";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Auto focus input when search modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Handle ESC key to close search modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter products by search query
  const filteredResults = searchQuery.trim()
    ? searchableProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.mukhi.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.deity.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onClose();
      router.push(`/all-products`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-16 sm:pt-24 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-amber-900/15 bg-white shadow-2xl animate-in zoom-in-95 duration-200 text-[#422006]">
        {/* Search Input Box */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative border-b border-amber-900/10 p-4"
        >
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-[#713f12] shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search 1-21 Mukhi, Siddh Mala, bracelets, deity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm sm:text-base font-medium placeholder:text-[#5c3a1e]/40 outline-none text-[#422006]"
            >
            </input>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="rounded-full p-1 text-[#713f12]/60 hover:bg-amber-50 hover:text-[#713f12] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-7 px-2 text-[11px] font-semibold text-[#713f12]/70 hover:bg-amber-50"
            >
              ESC
            </Button>
          </div>
        </form>

        {/* Modal Body */}
        <div className="max-h-[60vh] overflow-y-auto p-5">
          {searchQuery.trim() ? (
            /* Live Results */
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#713f12] mb-3">
                Found {filteredResults.length} Items
              </p>

              {filteredResults.length === 0 ? (
                <div className="py-8 text-center">
                  <span className="text-3xl mb-2 inline-block">🔍</span>
                  <p className="text-sm font-bold text-[#422006]">
                    No matching sacred beads found
                  </p>
                  <p className="text-xs text-[#5c3a1e]/70 mt-1">
                    Try searching for &quot;5 Mukhi&quot;, &quot;Siddh Mala&quot;, or &quot;Gauri Shankar&quot;.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredResults.map((item) => (
                    <Link
                      key={item.id}
                      href="/all-products"
                      onClick={onClose}
                      className="flex items-center justify-between rounded-2xl border border-amber-900/10 p-3.5 shadow-2xs transition hover:bg-amber-50/60"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100/50 text-xl">
                          {item.emoji}
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#422006]">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-[#713f12]/70">
                            {item.mukhi} · {item.deity}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs sm:text-sm font-extrabold text-[#713f12]">
                          {item.price}
                        </span>
                        <ArrowRight className="h-4 w-4 text-[#713f12]/60" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Default State / Popular Searches */
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#713f12] mb-3">
                <Sparkles className="h-3.5 w-3.5 text-[#713f12]" />
                Popular Searches
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setSearchQuery(term)}
                    className="rounded-full border border-amber-900/15 bg-white px-3.5 py-1.5 text-xs font-medium text-[#5c3a1e] hover:border-amber-900/35 hover:bg-amber-50 hover:text-[#713f12] transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <div className="border-t border-amber-900/10 pt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#713f12] mb-3">
                  Featured Collections
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Link
                    href="/all-products"
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-2xl border border-amber-900/10 p-3 hover:bg-amber-50/60"
                  >
                    <span className="text-xl">📿</span>
                    <div>
                      <p className="text-xs font-bold text-[#422006]">Nepal Siddh Malas</p>
                      <p className="text-[10px] text-[#713f12]/70">108+1 Blessed Beads</p>
                    </div>
                  </Link>

                  <Link
                    href="/all-products"
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-2xl border border-amber-900/10 p-3 hover:bg-amber-50/60"
                  >
                    <span className="text-xl">🌙</span>
                    <div>
                      <p className="text-xs font-bold text-[#422006]">1 to 21 Mukhi Beads</p>
                      <p className="text-[10px] text-[#713f12]/70">Rare Collector Grades</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer CTA */}
        <div className="border-t border-amber-900/10 p-3.5 px-5 sm:flex sm:items-center sm:justify-between text-center bg-[#faf7f2]/50">
          <span className="text-[11px] text-[#713f12]/70 hidden sm:inline">
            Press <kbd className="rounded border border-amber-900/15 bg-white px-1 py-0.5 font-mono text-[10px]">Enter</kbd> to search full catalog
          </span>
          <Link
            href="/all-products"
            onClick={onClose}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#713f12] hover:underline"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
