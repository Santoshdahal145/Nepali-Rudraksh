"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, ArrowUpRight, Star, ShieldCheck } from "lucide-react";

interface FeaturedItem {
  id: string;
  name: string;
  slug: string;
  category: "all" | "mukhi" | "mala" | "collector";
  categoryLabel: string;
  mukhiLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  deity: string;
  isRare?: boolean;
}

const featuredProducts: FeaturedItem[] = [
  {
    id: "f1",
    name: "5 Mukhi Nepal Siddh Japa Mala (108+1)",
    slug: "5-mukhi-nepal-siddh-japa-mala-108-1",
    category: "mala",
    categoryLabel: "Sacred Mala",
    mukhiLabel: "5 Mukhi",
    price: 3499,
    originalPrice: 4200,
    rating: 5.0,
    reviewsCount: 142,
    imageUrl: "https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=600&q=80",
    deity: "Kalagni Rudra",
  },
  {
    id: "f2",
    name: "7 Mukhi Mahalakshmi Consecrated Bead",
    slug: "7-mukhi-mahalakshmi-rudraksha",
    category: "mukhi",
    categoryLabel: "Individual Mukhi",
    mukhiLabel: "7 Mukhi",
    price: 4999,
    originalPrice: 6000,
    rating: 4.9,
    reviewsCount: 98,
    imageUrl: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=600&q=80",
    deity: "Goddess Mahalakshmi",
  },
  {
    id: "f3",
    name: "1 Mukhi Sacred Half Moon Himalayan Bead",
    slug: "1-mukhi-half-moon-rudraksha",
    category: "collector",
    categoryLabel: "Collector Rare",
    mukhiLabel: "1 Mukhi",
    price: 24999,
    originalPrice: 28500,
    rating: 5.0,
    reviewsCount: 46,
    imageUrl: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=600&q=80",
    deity: "Lord Shiva",
    isRare: true,
  },
  {
    id: "f4",
    name: "Gauri Shankar Sacred Divine Pair Bead",
    slug: "gauri-shankar-rudraksha",
    category: "collector",
    categoryLabel: "Collector Rare",
    mukhiLabel: "Twin Bead",
    price: 18500,
    originalPrice: 21000,
    rating: 4.9,
    reviewsCount: 64,
    imageUrl: "https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=600&q=80",
    deity: "Shiva & Parvati",
    isRare: true,
  },
  {
    id: "f5",
    name: "11 Mukhi Consecrated Hanuman Bead",
    slug: "11-mukhi-hanuman-rudraksha",
    category: "mukhi",
    categoryLabel: "Individual Mukhi",
    mukhiLabel: "11 Mukhi",
    price: 7800,
    originalPrice: 9200,
    rating: 4.8,
    reviewsCount: 52,
    imageUrl: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=600&q=80",
    deity: "Lord Hanuman",
  },
  {
    id: "f6",
    name: "14 Mukhi Devamani Supreme Ajna Bead",
    slug: "14-mukhi-devamani-rudraksha",
    category: "collector",
    categoryLabel: "Collector Rare",
    mukhiLabel: "14 Mukhi",
    price: 45000,
    originalPrice: 52000,
    rating: 5.0,
    reviewsCount: 31,
    imageUrl: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=600&q=80",
    deity: "Lord Shiva & Hanuman",
    isRare: true,
  },
  {
    id: "f7",
    name: "8 Mukhi Vighnaharta Ganesh Rudraksha",
    slug: "8-mukhi-ganesh-rudraksha",
    category: "mukhi",
    categoryLabel: "Individual Mukhi",
    mukhiLabel: "8 Mukhi",
    price: 5400,
    originalPrice: 6500,
    rating: 4.9,
    reviewsCount: 73,
    imageUrl: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=600&q=80",
    deity: "Lord Ganesha",
  },
  {
    id: "f8",
    name: "Chikna Natural Rudraksha Japa Kantha",
    slug: "chikna-natural-rudraksha-japa-kantha",
    category: "mala",
    categoryLabel: "Sacred Mala",
    mukhiLabel: "54+1 Beads",
    price: 6800,
    originalPrice: 8200,
    rating: 4.9,
    reviewsCount: 88,
    imageUrl: "https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=600&q=80",
    deity: "Sadashiva",
  },
];

type CategoryFilter = "all" | "mukhi" | "mala" | "collector";

export default function FeatureItemSection() {
  const [activeTab, setActiveTab] = useState<CategoryFilter>("all");

  const filteredItems =
    activeTab === "all"
      ? featuredProducts
      : featuredProducts.filter((item) => item.category === activeTab);

  const tabs: { key: CategoryFilter; label: string }[] = [
    { key: "all", label: "All Consecrated" },
    { key: "mukhi", label: "Sacred Mukhis" },
    { key: "mala", label: "Meditation Malas" },
    { key: "collector", label: "Rare Collector" },
  ];

  return (
    <section className="w-full bg-[#faf7f2] py-14 sm:py-20 md:py-24 border-b border-amber-900/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-900/15 bg-white px-3 py-1 text-xs font-bold text-[#713f12] shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
              <span>Sacred Himalayan Harvest</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-tight text-[#422006]">
              Featured Consecrated Beads
            </h2>
            <p className="text-xs sm:text-sm text-[#5c3a1e]/80 leading-relaxed">
              Lab-certified authentic beads blessed with ancient Vedic rituals at Pashupatinath Temple for prosperity, peace, and spiritual ascension.
            </p>
          </div>

          <Link
            href="/all-products"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#713f12] hover:text-[#422006] transition-colors shrink-0 group self-start md:self-auto"
          >
            <span>View Complete Collection</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#713f12] text-white shadow-sm"
                    : "bg-white text-[#5c3a1e] border border-amber-900/10 hover:border-amber-900/25 hover:bg-amber-50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Product Grid (2 cols mobile, 3 tablet, 4 desktop) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col justify-between rounded-2xl bg-white border border-amber-900/10 p-3 sm:p-4 shadow-2xs hover:shadow-md transition-all duration-300 hover:border-amber-900/25"
            >
              {/* Image & Badges Container */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#f3eee7]">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Top Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                  <span className="rounded-md bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-amber-200">
                    {item.mukhiLabel}
                  </span>
                  {item.isRare && (
                    <span className="rounded-md bg-amber-700/90 backdrop-blur-xs px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                      Rare
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2 right-2 rounded-full bg-white/90 backdrop-blur-xs p-1 text-emerald-800 shadow-2xs">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Product Info */}
              <div className="pt-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-[10px] text-amber-800 font-semibold mb-1">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span>{item.rating}</span>
                    <span className="text-stone-400">({item.reviewsCount})</span>
                    <span className="text-stone-300">•</span>
                    <span className="text-[#5c3a1e]/70 truncate">{item.deity}</span>
                  </div>

                  <Link href={`/all-products/${item.slug}`}>
                    <h3 className="line-clamp-2 text-xs sm:text-sm font-bold text-[#422006] hover:text-[#713f12] transition-colors leading-snug">
                      {item.name}
                    </h3>
                  </Link>
                </div>

                {/* Price and CTA */}
                <div className="mt-3 pt-2.5 border-t border-amber-900/10 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] text-[#5c3a1e]/60 font-medium">Consecrated</div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs sm:text-base font-black text-[#713f12]">
                        Rs. {item.price.toLocaleString()}
                      </span>
                      {item.originalPrice && (
                        <span className="hidden sm:inline text-[10px] text-stone-400 line-through">
                          Rs. {item.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link href={`/all-products/${item.slug}`}>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 sm:h-9 sm:w-auto sm:px-3 items-center justify-center gap-1 rounded-lg bg-[#713f12] text-white font-bold text-xs hover:bg-[#5c3a1e] transition-all active:scale-95 shadow-2xs cursor-pointer"
                      aria-label={`View ${item.name}`}
                    >
                      <span className="hidden sm:inline">View</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
