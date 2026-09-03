"use client";

import { useState } from "react";
import Link from "next/link";
import { TopMostHeader, NavBar, Footer } from "@/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Star,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  Check,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: "mukhi" | "mala" | "bracelet" | "collector";
  mukhiType: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  emoji: string;
  deity: string;
  description: string;
  inStock: boolean;
}

const allProducts: Product[] = [
  {
    id: "1",
    name: "1 Mukhi Half Moon Rudraksha",
    category: "collector",
    mukhiType: "1 Mukhi",
    price: 499,
    originalPrice: 599,
    rating: 5.0,
    reviewsCount: 128,
    badge: "Rare & Sacred",
    emoji: "🌙",
    deity: "Lord Shiva (Supreme Consciousness)",
    description: "Supreme consciousness & liberation. Naturally grown and blessed at Pashupatinath Temple.",
    inStock: true,
  },
  {
    id: "2",
    name: "5 Mukhi Nepal Siddh Mala (108+1)",
    category: "mala",
    mukhiType: "5 Mukhi",
    price: 149,
    originalPrice: 189,
    rating: 4.9,
    reviewsCount: 412,
    badge: "Bestseller",
    emoji: "📿",
    deity: "Kalagni Rudra",
    description: "Hand-knotted with silk thread. Ideal for daily japa, peace of mind, health, and spiritual alignment.",
    inStock: true,
  },
  {
    id: "3",
    name: "7 Mukhi Mahalakshmi Rudraksha",
    category: "mukhi",
    mukhiType: "7 Mukhi",
    price: 189,
    originalPrice: 220,
    rating: 4.9,
    reviewsCount: 235,
    badge: "Prosperity",
    emoji: "✨",
    deity: "Goddess Mahalakshmi",
    description: "Attracts wealth, business success, abundance, and eliminates negative financial karma.",
    inStock: true,
  },
  {
    id: "4",
    name: "14 Mukhi Devamani Rudraksha",
    category: "collector",
    mukhiType: "14 Mukhi",
    price: 1299,
    originalPrice: 1450,
    rating: 5.0,
    reviewsCount: 64,
    badge: "Most Rare",
    emoji: "🔱",
    deity: "Lord Hanuman & Shiva",
    description: "Awakens the Sixth Sense (Ajna Chakra) and intuition. Extremely sought-after collector bead.",
    inStock: true,
  },
  {
    id: "5",
    name: "Sacred Rudraksha Silver Bracelet",
    category: "bracelet",
    mukhiType: "5 Mukhi",
    price: 89,
    originalPrice: 110,
    rating: 4.8,
    reviewsCount: 180,
    badge: "Handcrafted",
    emoji: "⚡",
    deity: "Lord Shiva",
    description: "925 Pure Sterling Silver handcrafted by master Newari artisans in Kathmandu.",
    inStock: true,
  },
  {
    id: "6",
    name: "Gauri Shankar Sacred Divine Bead",
    category: "collector",
    mukhiType: "Twin Bead",
    price: 649,
    originalPrice: 750,
    rating: 5.0,
    reviewsCount: 92,
    badge: "Divine Union",
    emoji: "💫",
    deity: "Shiva & Parvati",
    description: "Represents the eternal union of Lord Shiva & Goddess Parvati. Harmonizes marriage and relationships.",
    inStock: true,
  },
  {
    id: "7",
    name: "8 Mukhi Lord Ganesha Rudraksha",
    category: "mukhi",
    mukhiType: "8 Mukhi",
    price: 219,
    originalPrice: 260,
    rating: 4.9,
    reviewsCount: 145,
    badge: "Vighnaharta",
    emoji: "🐘",
    deity: "Lord Ganesha",
    description: "Removes all obstacles, provides wisdom, intellect, and guaranteed success in new ventures.",
    inStock: true,
  },
  {
    id: "8",
    name: "11 Mukhi Hanuman Rudraksha",
    category: "mukhi",
    mukhiType: "11 Mukhi",
    price: 389,
    originalPrice: 440,
    rating: 5.0,
    reviewsCount: 88,
    badge: "Fearlessness",
    emoji: "🛡️",
    deity: "11 Rudras / Hanuman",
    description: "Grants supreme courage, physical stamina, mental clarity, and victory over adversaries.",
    inStock: true,
  },
  {
    id: "9",
    name: "Garbh Gauri Mother & Child Bead",
    category: "collector",
    mukhiType: "Twin Conjoined",
    price: 520,
    originalPrice: 580,
    rating: 4.9,
    reviewsCount: 76,
    badge: "Maternity Blessing",
    emoji: "🌸",
    deity: "Goddess Gauri & Ganesha",
    description: "Sacred bead for maternal blessings, child protection, family harmony, and peaceful conception.",
    inStock: true,
  },
];

const categories = [
  { id: "all", label: "All Sacred Items" },
  { id: "mukhi", label: "Sacred Mukhis (1-21)" },
  { id: "mala", label: "Japa Malas (108)" },
  { id: "bracelet", label: "Silver Bracelets" },
  { id: "collector", label: "Collector Rare Beads" },
];

export default function AllProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter products
  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.mukhiType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.deity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0; // featured
  });

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col justify-between">
      {/* Global Header */}
      <header className="sticky top-0 z-50 border-b border-amber-900/10 bg-[#faf7f2]/90 backdrop-blur-md">
        <TopMostHeader />
        <NavBar />
      </header>

      {/* Main Catalog View */}
      <main className="flex-1 pb-20 pt-8 sm:pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb & Header Title */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs font-medium text-[#5c3a1e]/70">
              <Link href="/" className="hover:text-[#713f12]">Home</Link>
              <span>/</span>
              <span className="text-[#713f12] font-semibold">Sacred Collection</span>
            </div>

            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-[#2d1a0e] sm:text-4xl">
                  Authentic Himalayan Rudraksha
                </h1>
                <p className="mt-2 text-sm text-[#5c3a1e]/70 max-w-2xl">
                  Explore our sacred collection of non-doctored, lab-certified Nepali Rudraksha beads, malas, and silver-crafted ornaments.
                </p>
              </div>

              <span className="text-xs font-semibold text-[#713f12] bg-amber-100/70 border border-amber-900/10 px-3.5 py-1.5 rounded-full w-fit">
                {sortedProducts.length} Sacred Items Found
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 pl-10 border-amber-900/15 focus-visible:ring-amber-700 text-xs sm:text-sm bg-transparent"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 rounded-xl border border-amber-900/15 bg-white px-3 text-xs sm:text-sm font-medium text-[#422006] outline-none focus:border-amber-700"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              <Button
                variant="outline"
                className="h-10 gap-1.5 border-amber-900/15 text-xs font-medium text-[#713f12] sm:hidden"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
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
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                        selectedCategory === cat.id
                          ? "bg-[#713f12] text-white shadow-xs"
                          : "text-[#5c3a1e]/80 hover:bg-amber-50 hover:text-[#713f12]"
                      }`}
                    >
                      <span>{cat.label}</span>
                      {selectedCategory === cat.id && <Check className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vedic Guarantee Card */}
              <div className="rounded-2xl border border-amber-900/10 bg-gradient-to-br from-amber-50 to-orange-50/40 p-5">
                <div className="flex items-center gap-2 text-[#713f12] mb-2">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Authenticity Promise
                  </span>
                </div>
                <p className="text-xs text-[#5c3a1e]/80 leading-relaxed">
                  Every bead comes with an official certificate of origin, X-Ray test verification, and complimentary Vedic blessing.
                </p>
              </div>
            </aside>

            {/* Mobile Filter Drawer / Horizontal Pills */}
            <div className="lg:hidden col-span-1">
              <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                      selectedCategory === cat.id
                        ? "bg-[#713f12] text-white"
                        : "bg-white border border-amber-900/10 text-[#5c3a1e]"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid (3 cols on lg) */}
            <div className="lg:col-span-3">
              {sortedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-amber-900/20 bg-white p-12 text-center">
                  <span className="text-5xl mb-3">🔍</span>
                  <h3 className="text-lg font-bold text-[#422006]">No Sacred Items Found</h3>
                  <p className="text-xs text-[#5c3a1e]/70 mt-1 max-w-sm">
                    Try adjusting your search terms or selecting a different category from the filter list.
                  </p>
                  <Button
                    onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
                    className="mt-4 h-9 bg-[#713f12] text-xs text-white"
                  >
                    Reset All Filters
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
                  {sortedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-900/10 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-950/5"
                    >
                      {/* Top Mukhi Tag & Badge */}
                      <div className="flex items-center justify-between gap-2">
                        {product.badge && (
                          <span className="rounded-full bg-amber-100/80 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-[#713f12]">
                            {product.badge}
                          </span>
                        )}
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-800">
                          {product.mukhiType}
                        </span>
                      </div>

                      {/* Emoji / Image Container */}
                      <div className="relative my-4 flex h-36 items-center justify-center rounded-xl bg-linear-to-br from-[#faf7f2] via-amber-50/50 to-orange-50/30">
                        <div className="text-5xl transition-transform duration-300 group-hover:scale-110">
                          {product.emoji}
                        </div>
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold text-[#422006]">
                            {product.rating}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            ({product.reviewsCount})
                          </span>
                        </div>

                        <h3 className="mt-1.5 text-base font-bold text-[#2d1a0e] transition-colors group-hover:text-[#713f12]">
                          {product.name}
                        </h3>
                        <p className="text-[11px] font-medium text-amber-800/80">
                          Deity: {product.deity}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#5c3a1e]/70">
                          {product.description}
                        </p>
                      </div>

                      {/* Price & Add to Cart Action */}
                      <div className="mt-5 flex items-center justify-between gap-2 border-t border-amber-900/10 pt-3.5">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-extrabold text-[#713f12]">
                              ${product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-[11px] text-muted-foreground line-through">
                                ${product.originalPrice}
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] text-green-700 font-medium">Free Consecration</span>
                        </div>

                        <Link href="/cart">
                          <Button
                            size="sm"
                            className="h-8.5 gap-1 bg-[#713f12] px-3.5 text-xs font-semibold text-white shadow-xs hover:bg-[#5c330e]"
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            Add
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
