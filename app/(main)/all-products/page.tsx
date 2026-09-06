"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Filter, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";

const categories = [
  { id: "all", label: "All Sacred Items" },
  { id: "mukhi", label: "Sacred Mukhis (1-21)" },
  { id: "mala", label: "Japa Malas (108)" },
];

export default function AllProductsPage() {
  return (
    <main className="flex-1 pb-20 pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-medium text-[#5c3a1e]/70">
            <Link href="/" className="hover:text-[#713f12]">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#713f12] font-semibold">
              Sacred Collection
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#2d1a0e] sm:text-4xl">
                Authentic Himalayan Rudraksha
              </h1>
              <p className="mt-2 text-sm text-[#5c3a1e]/70 max-w-2xl">
                Explore our sacred collection of non-doctored, lab-certified
                Nepali Rudraksha beads, malas, and silver-crafted ornaments.
              </p>
            </div>

            <span className="text-xs font-semibold text-[#713f12] bg-amber-100/70 border border-amber-900/10 px-3.5 py-1.5 rounded-full w-fit">
              10 Sacred Items Found
            </span>
          </div>
        </div>

        {/* Search, Filter Bar & Sort Controls */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-amber-900/10 bg-white p-3.5 shadow-xs">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search Mukhi, deity, or mala..."
              value={""}
              onChange={(e) => {}}
              className="h-10 pl-10 border-amber-900/15 focus-visible:ring-amber-700 text-xs sm:text-sm bg-transparent"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={""}
              onChange={(e) => {}}
              className="h-10 rounded-xl border border-amber-900/15 bg-white px-3 text-xs sm:text-sm font-medium text-[#422006] outline-none "
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            <Button
              variant="outline"
              className="h-10 gap-1.5 border-amber-900/15 text-xs font-medium text-[#713f12] sm:hidden"
              onClick={() => {}}
            >
              <Filter className="h-3.5 w-3.5" />
              Filter
            </Button>
          </div>
        </div>

        {/* Main Content Layout with Sidebar & Products Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            {/* Category Filter */}
            <div className="rounded-2xl border border-amber-900/10 bg-white p-5 shadow-xs">
              <h3 className="text-sm font-bold text-[#422006] uppercase tracking-wider mb-4">
                Categories
              </h3>
              <div className="space-y-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {}}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                      true
                        ? "bg-[#713f12] text-white shadow-xs"
                        : "text-[#5c3a1e]/80 hover:bg-amber-50 hover:text-[#713f12]"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <Check className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Vedic Guarantee Card */}
            <div className="rounded-2xl border border-amber-900/10 bg-linear-to-br from-amber-50 to-orange-50/40 p-5">
              <div className="flex items-center gap-2 text-[#713f12] mb-2">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Authenticity Promise
                </span>
              </div>
              <p className="text-xs text-[#5c3a1e]/80 leading-relaxed">
                Every bead comes with an official certificate of origin, X-Ray
                test verification, and complimentary Vedic blessing.
              </p>
            </div>
          </aside>

          {/* Mobile Filter Drawer / Horizontal Pills */}
          <div className="lg:hidden col-span-1">
            <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {}}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                    true
                      ? "bg-[#713f12] text-white"
                      : "bg-white border border-amber-900/10 text-[#5c3a1e]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
