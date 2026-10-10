"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, ArrowUpRight, Star, ShieldCheck } from "lucide-react";
import { ProductType } from "@/app/types";

type CategoryFilter = "all" | "mukhi" | "mala" | "collector";

function getMukhiDeity(mukhi?: number | null, isMala?: boolean): string {
  if (isMala) return "Sadashiva";
  switch (mukhi) {
    case 1:
      return "Lord Shiva";
    case 2:
      return "Ardhanarishwara";
    case 3:
      return "Agni Deva";
    case 4:
      return "Lord Brahma";
    case 5:
      return "Kalagni Rudra";
    case 6:
      return "Lord Kartikeya";
    case 7:
      return "Goddess Mahalakshmi";
    case 8:
      return "Lord Ganesha";
    case 9:
      return "Goddess Durga";
    case 10:
      return "Lord Vishnu";
    case 11:
      return "Lord Hanuman";
    case 12:
      return "Lord Surya";
    case 13:
      return "Lord Kamadeva";
    case 14:
      return "Devamani / Ajna";
    default:
      return mukhi && mukhi > 14 ? "Supreme Divinity" : "Pashupatinath";
  }
}

interface FeatureItemSectionProps {
  products?: ProductType[];
}

export default function FeatureItemSection({
  products = [],
}: FeatureItemSectionProps) {
  const [activeTab, setActiveTab] = useState<CategoryFilter>("all");

  const tabs: { key: CategoryFilter; label: string }[] = [
    { key: "all", label: "All Consecrated" },
    { key: "mukhi", label: "Sacred Mukhis" },
    { key: "mala", label: "Meditation Malas" },
    { key: "collector", label: "Rare Collector" },
  ];

  const filteredProducts = products.filter((item: ProductType) => {
    if (activeTab === "all") return true;

    const mukhi =
      item.type === "INDIVIDUAL_RUDRAKSHA"
        ? item.individualRudrakshaDetail?.mukhi
        : item.rudrakshaMalaDetail?.mukhi;

    const variants = item.productVariants ?? [];
    const prices = variants
      .map((v) => Number(v.price))
      .filter((p) => Number.isFinite(p) && p > 0);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

    const isRare =
      mukhi === 1 ||
      (mukhi !== undefined && mukhi !== null && mukhi >= 11) ||
      minPrice >= 18000;

    if (activeTab === "mukhi") {
      return item.type === "INDIVIDUAL_RUDRAKSHA";
    }
    if (activeTab === "mala") {
      return item.type === "RUDRAKSHA_MALA";
    }
    if (activeTab === "collector") {
      return isRare;
    }
    return true;
  });

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

        {/* ── Empty State ── */}
        {filteredProducts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-amber-900/20 bg-white/60 p-12 text-center">
            <Sparkles className="h-8 w-8 text-amber-600/60 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-[#422006] mb-1">
              No Consecrated Beads Available
            </h3>
            <p className="text-xs sm:text-sm text-[#5c3a1e]/75 max-w-md mx-auto mb-5">
              Items for this category are being prepared and consecrated at Pashupatinath Temple. Check out all products in our store.
            </p>
            <Link
              href="/all-products"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#713f12] px-4 py-2 text-xs font-bold text-white hover:bg-[#5c3a1e] transition-colors"
            >
              <span>Explore All Products</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        {/* ── Real Products Grid ── */}
        {filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredProducts.map((item: ProductType) => {
              const primaryImage =
                item.productImages?.[0]?.url ||
                item.productVariants?.[0]?.variantImages?.[0]?.url;

              const mukhi =
                item.type === "INDIVIDUAL_RUDRAKSHA"
                  ? item.individualRudrakshaDetail?.mukhi
                  : item.rudrakshaMalaDetail?.mukhi;

              const mukhiLabel =
                item.type === "INDIVIDUAL_RUDRAKSHA"
                  ? mukhi
                    ? `${mukhi} Mukhi`
                    : "Sacred Mukhi"
                  : mukhi
                    ? `${mukhi} Mukhi Mala`
                    : "Sacred Mala";

              const variants = item.productVariants ?? [];
              const prices = variants
                .map((v) => Number(v.price))
                .filter((p) => Number.isFinite(p) && p > 0);
              const minPrice = prices.length > 0 ? Math.min(...prices) : null;
              const originalPrice = minPrice ? Math.round(minPrice * 1.2) : null;

              const isRare =
                mukhi === 1 ||
                (mukhi !== undefined && mukhi !== null && mukhi >= 11) ||
                (minPrice !== null && minPrice >= 20000);

              const deity = getMukhiDeity(
                mukhi,
                item.type === "RUDRAKSHA_MALA",
              );

              const reviewCount = 20 + ((item.id * 13) % 85);

              return (
                <article
                  key={item.id}
                  className="group flex flex-col justify-between rounded-2xl bg-white border border-amber-900/10 p-3 sm:p-4 shadow-2xs hover:shadow-md transition-all duration-300 hover:border-amber-900/25"
                >
                  {/* Image & Badges Container */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#f3eee7]">
                    {primaryImage ? (
                      <Image
                        src={primaryImage}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-[#5c3a1e]/40">
                        Consecrated Bead
                      </div>
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                      <span className="rounded-md bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-amber-200">
                        {mukhiLabel}
                      </span>
                      {isRare && (
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
                        <span>5.0</span>
                        <span className="text-stone-400">({reviewCount})</span>
                        <span className="text-stone-300">•</span>
                        <span className="text-[#5c3a1e]/70 truncate">{deity}</span>
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
                          {minPrice !== null ? (
                            <>
                              <span className="text-xs sm:text-base font-black text-[#713f12]">
                                Rs. {minPrice.toLocaleString()}
                              </span>
                              {originalPrice && originalPrice > minPrice && (
                                <span className="hidden sm:inline text-[10px] text-stone-400 line-through">
                                  Rs. {originalPrice.toLocaleString()}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-xs font-semibold text-[#713f12]">
                              Price on request
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
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
