"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Star, ShoppingBag, Eye } from "lucide-react";

type Category = "all" | "mukhi" | "mala" | "bracelets" | "collector";

interface Product {
  id: string;
  name: string;
  category: "mukhi" | "mala" | "bracelets" | "collector";
  mukhi?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  description: string;
  emoji: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "1 Mukhi Half Moon Rudraksha",
    category: "collector",
    mukhi: "1 Mukhi",
    price: 499,
    originalPrice: 599,
    rating: 5.0,
    reviewsCount: 128,
    badge: "Rare & Sacred",
    description: "Supreme consciousness & liberation. Blessed from Pashupatinath Temple.",
    emoji: "🌙",
  },
  {
    id: "2",
    name: "5 Mukhi Nepal Siddh Mala (108+1)",
    category: "mala",
    mukhi: "5 Mukhi",
    price: 149,
    originalPrice: 189,
    rating: 4.9,
    reviewsCount: 412,
    badge: "Bestseller",
    description: "Ideal for daily japa, peace of mind, health, and spiritual alignment.",
    emoji: "📿",
  },
  {
    id: "3",
    name: "7 Mukhi Mahalakshmi Rudraksha",
    category: "mukhi",
    mukhi: "7 Mukhi",
    price: 189,
    originalPrice: 220,
    rating: 4.9,
    reviewsCount: 235,
    badge: "Prosperity",
    description: "Attracts wealth, success, prosperity, and career breakthrough.",
    emoji: "✨",
  },
  {
    id: "4",
    name: "14 Mukhi Devamani Rudraksha",
    category: "collector",
    mukhi: "14 Mukhi",
    price: 1299,
    originalPrice: 1450,
    rating: 5.0,
    reviewsCount: 64,
    badge: "Collector",
    description: "Awakens the Sixth Sense (Ajna Chakra) and intuition. Extremely rare.",
    emoji: "🔱",
  },
  {
    id: "5",
    name: "Sacred Rudraksha Silver Bracelet",
    category: "bracelets",
    mukhi: "5 Mukhi",
    price: 89,
    originalPrice: 110,
    rating: 4.8,
    reviewsCount: 180,
    badge: "Handcrafted",
    description: "925 Pure Sterling Silver handcrafted by master Newari artisans.",
    emoji: "⚡",
  },
  {
    id: "6",
    name: "Gauri Shankar Sacred Divine Bead",
    category: "collector",
    mukhi: "Rare Twin",
    price: 649,
    originalPrice: 750,
    rating: 5.0,
    reviewsCount: 92,
    badge: "Divine Union",
    description: "Represents the union of Lord Shiva & Goddess Parvati. Harmonizes relationships.",
    emoji: "💫",
  },
];

const categories: { label: string; value: Category }[] = [
  { label: "All Items", value: "all" },
  { label: "Sacred Mukhis", value: "mukhi" },
  { label: "Japa Malas", value: "mala" },
  { label: "Silver Bracelets", value: "bracelets" },
  { label: "Collector Beads", value: "collector" },
];

export default function CollectionSection() {
  const [activeTab, setActiveTab] = useState<Category>("all");

  const filteredProducts =
    activeTab === "all"
      ? products
      : products.filter((p) => p.category === activeTab);

  return (
    <section id="collections" className="relative bg-[#faf7f2] py-14 sm:py-20 lg:py-28">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute right-0 top-10 h-72 w-72 rounded-full bg-amber-200/20 blur-3xl sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute bottom-10 left-0 h-72 w-72 rounded-full bg-orange-200/20 blur-3xl sm:h-96 sm:w-96" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-800/20 bg-amber-50 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#713f12] sm:text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              Sacred Collections
            </div>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#2d1a0e] sm:text-3xl lg:text-4xl">
              Curated Himalayan Treasures
            </h2>
            <p className="mt-2 max-w-xl text-xs text-[#5c3a1e]/70 sm:text-sm md:text-base">
              Each piece is certified for authenticity, lab-tested, and blessed with sacred mantras prior to dispatch.
            </p>
          </div>

          <Link href="/all-products" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="h-10 w-full border-amber-900/20 text-xs font-semibold text-[#713f12] hover:border-amber-900/40 hover:bg-amber-50 sm:h-11 sm:w-auto sm:text-sm"
            >
              Explore Full Catalog
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Category Tabs - Horizontally scrollable on mobile */}
        <div className="mt-6 flex overflow-x-auto pb-2 scrollbar-none sm:mt-10 sm:flex-wrap sm:gap-2 sm:border-b sm:border-amber-900/10 sm:pb-4">
          <div className="flex gap-2 min-w-full sm:min-w-0">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveTab(cat.value)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all sm:px-5 sm:py-2 sm:text-sm ${
                  activeTab === cat.value
                    ? "bg-[#713f12] text-white shadow-xs shadow-amber-950/20"
                    : "bg-white/80 text-[#5c3a1e]/80 hover:bg-white hover:text-[#713f12]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="mt-6 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-900/10 bg-white/90 p-5 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-amber-950/5 sm:p-6"
            >
              {/* Top Badge & Mukhi Label */}
              <div className="flex items-center justify-between gap-2">
                {product.badge && (
                  <span className="rounded-full bg-amber-100/80 px-2.5 py-0.5 text-[11px] font-semibold text-[#713f12] sm:px-3 sm:py-1 sm:text-xs">
                    {product.badge}
                  </span>
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800/80 sm:text-xs">
                  {product.mukhi}
                </span>
              </div>

              {/* Emoji / Showcase Container */}
              <div className="relative my-4 flex h-36 items-center justify-center rounded-xl bg-linear-to-br from-[#faf7f2] via-amber-50/50 to-orange-50/30 sm:my-6 sm:h-44">
                <div className="text-5xl transition-transform duration-300 group-hover:scale-110 sm:text-6xl">
                  {product.emoji}
                </div>
                <div className="absolute bottom-2 right-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:bottom-3 sm:right-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#713f12] shadow-md sm:h-8 sm:w-8">
                    <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </span>
                </div>
              </div>

              {/* Info */}
              <div>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 sm:h-4 sm:w-4" />
                  <span className="text-xs font-bold text-[#422006] sm:text-sm">
                    {product.rating}
                  </span>
                  <span className="text-[11px] text-muted-foreground sm:text-xs">
                    ({product.reviewsCount})
                  </span>
                </div>

                <h3 className="mt-1.5 text-base font-bold text-[#2d1a0e] transition-colors group-hover:text-[#713f12] sm:mt-2 sm:text-lg">
                  {product.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#5c3a1e]/70">
                  {product.description}
                </p>
              </div>

              {/* Price & Action */}
              <div className="mt-5 flex items-center justify-between gap-2 border-t border-amber-900/10 pt-3.5 sm:mt-6 sm:pt-4">
                <div>
                  <div className="flex items-baseline gap-1.5 sm:gap-2">
                    <span className="text-lg font-extrabold text-[#713f12] sm:text-xl">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[11px] text-muted-foreground line-through sm:text-xs">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-green-700 font-medium sm:text-[10px]">Free Lab Certificate</span>
                </div>

                <Link href={`/all-products`}>
                  <Button
                    size="sm"
                    className="h-8 gap-1 bg-[#713f12] px-3 text-xs font-semibold text-white shadow-xs hover:bg-[#5c330e] sm:h-9 sm:gap-1.5 sm:px-3.5"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Order
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
