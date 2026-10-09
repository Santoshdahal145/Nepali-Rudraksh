"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, ArrowUpRight, Star, CheckCircle2, ShieldCheck } from "lucide-react";

interface TopSellerItem {
  id: string;
  name: string;
  slug: string;
  mukhiBadge: string;
  badgeText: string;
  price: number;
  rating: number;
  ordersCount: number;
  benefits: string;
  imageUrl: string;
  terroir: string;
}

const topSellers: TopSellerItem[] = [
  {
    id: "ts1",
    name: "5 Mukhi Nepal Siddh Mala (108+1 Consecrated)",
    slug: "5-mukhi-nepal-siddh-japa-mala-108-1",
    mukhiBadge: "5 Mukhi",
    badgeText: "#1 Most Revered",
    price: 3499,
    rating: 5.0,
    ordersCount: 840,
    benefits: "Daily meditation, mental peace & heart chakra healing",
    imageUrl: "https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=600&q=80",
    terroir: "Sankhuwasabha, Nepal",
  },
  {
    id: "ts2",
    name: "7 Mukhi Mahalakshmi Wealth & Abundance Bead",
    slug: "7-mukhi-mahalakshmi-rudraksha",
    mukhiBadge: "7 Mukhi",
    badgeText: "Bestseller",
    price: 4999,
    rating: 4.9,
    ordersCount: 620,
    benefits: "Attracts financial prosperity, business growth & grace",
    imageUrl: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=600&q=80",
    terroir: "Bhojpur Wild Terroir",
  },
  {
    id: "ts3",
    name: "Gauri Shankar Sacred Divine Union Himalayan Bead",
    slug: "gauri-shankar-rudraksha",
    mukhiBadge: "Twin Bead",
    badgeText: "Rare Blessing",
    price: 18500,
    rating: 5.0,
    ordersCount: 310,
    benefits: "Relationship harmony, family peace & spiritual unity",
    imageUrl: "https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=600&q=80",
    terroir: "High-Altitude Nepal",
  },
  {
    id: "ts4",
    name: "1 Mukhi Half Moon Supreme Shiva Collector Bead",
    slug: "1-mukhi-half-moon-rudraksha",
    mukhiBadge: "1 Mukhi",
    badgeText: "Collector Choice",
    price: 24999,
    rating: 5.0,
    ordersCount: 195,
    benefits: "Highest consciousness, planetary liberation & supreme focus",
    imageUrl: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=600&q=80",
    terroir: "Sankhuwasabha Terroir",
  },
];

export default function TopSellingSection() {
  return (
    <section className="w-full bg-[#f6eee4]/60 py-14 sm:py-20 border-b border-amber-900/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-700/20 bg-amber-100/70 px-3.5 py-1 text-xs font-bold text-amber-900 shadow-2xs">
            <Flame className="h-3.5 w-3.5 text-amber-700 fill-amber-700" />
            <span>Devotee Favorites</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-tight text-[#422006]">
            Top Selling Sacred Beads
          </h2>

          <p className="text-xs sm:text-sm text-[#5c3a1e]/80 leading-relaxed">
            Our most revered and trusted consecrated beads, chosen by thousands of devotees worldwide for authentic spiritual transformation and divine grace.
          </p>
        </div>

        {/* ── Grid (2 cols mobile, 4 cols desktop) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {topSellers.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col justify-between rounded-2xl bg-white border border-amber-900/12 p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border-amber-900/25"
            >
              <div>
                {/* Image & Bestseller Badge */}
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-[#f3eee7]">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* Bestseller Badge */}
                  <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 rounded-full bg-amber-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                    <Flame className="h-3 w-3 fill-white" />
                    <span>{item.badgeText}</span>
                  </div>

                  {/* Terroir / Origin Pill */}
                  <div className="absolute bottom-2 left-2 z-10 rounded-md bg-black/65 backdrop-blur-xs px-2 py-0.5 text-[9px] font-semibold text-stone-200">
                    {item.terroir}
                  </div>
                </div>

                {/* Rating & Orders */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-[#5c3a1e]/75 font-medium">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span className="font-bold text-[#422006]">{item.rating}</span>
                    <span>({item.ordersCount}+ blessed)</span>
                  </div>
                  <span className="font-bold text-[#713f12]">{item.mukhiBadge}</span>
                </div>

                {/* Product Name */}
                <Link href={`/all-products/${item.slug}`} className="block mt-1.5">
                  <h3 className="text-sm font-bold text-[#422006] group-hover:text-[#713f12] transition-colors line-clamp-2 leading-snug">
                    {item.name}
                  </h3>
                </Link>

                {/* Key Benefit */}
                <div className="mt-2 flex items-start gap-1.5 text-[11px] text-[#5c3a1e]/75 leading-relaxed bg-[#faf7f2] p-2 rounded-lg border border-amber-900/5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{item.benefits}</span>
                </div>
              </div>

              {/* Price & Action */}
              <div className="mt-4 pt-3 border-t border-amber-900/10 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Starting at</span>
                  <div className="text-base font-black text-[#713f12]">
                    Rs. {item.price.toLocaleString()}
                  </div>
                </div>

                <Link href={`/all-products/${item.slug}`}>
                  <button
                    type="button"
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#713f12] px-3.5 text-xs font-bold text-white shadow-2xs hover:bg-[#5c3a1e] transition-all active:scale-95 cursor-pointer"
                  >
                    <span>View</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
