import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, ArrowUpRight, Star, CheckCircle2 } from "lucide-react";
import { ProductType } from "@/app/types";

function getMukhiBenefits(mukhi?: number | null, defaultDesc?: string): string {
  switch (mukhi) {
    case 1:
      return "Highest consciousness, planetary liberation & supreme focus";
    case 2:
      return "Emotional balance, unity in relationships & inner harmony";
    case 3:
      return "Purification of past karmas, vitality & self-confidence";
    case 4:
      return "Creativity, higher learning, memory retention & intellect";
    case 5:
      return "Daily meditation, mental peace & heart chakra healing";
    case 6:
      return "Willpower, grounding courage, vitality & emotional stability";
    case 7:
      return "Attracts financial prosperity, business growth & grace";
    case 8:
      return "Obstacle removal, wisdom, success & grounding protection";
    case 9:
      return "Inner strength, fearlessness, divine protection & courage";
    case 10:
      return "Shield against negative energies, peace & directional grace";
    case 11:
      return "Spiritual ascension, intense focus, vitality & protection";
    case 12:
      return "Radiance, leadership charisma, vitality & life authority";
    case 13:
      return "Attraction, fulfillment of pure desires & magnetic grace";
    case 14:
      return "Awakening of third eye, divine intuition & deep wisdom";
    default:
      if (defaultDesc && defaultDesc.trim().length > 0) {
        const firstSentence = defaultDesc.split(/[.\n]/)[0].trim();
        return firstSentence.length > 70
          ? `${firstSentence.slice(0, 67)}...`
          : firstSentence;
      }
      return "Daily meditation, spiritual growth & Pashupatinath blessings";
  }
}

const BADGES = [
  "#1 Most Revered",
  "Bestseller",
  "Rare Blessing",
  "Collector Choice",
];

interface TopSellingSectionProps {
  products?: ProductType[];
}

export default function TopSellingSection({
  products = [],
}: TopSellingSectionProps) {
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

        {/* ── Empty State ── */}
        {products.length === 0 && (
          <div className="rounded-2xl border border-dashed border-amber-900/20 bg-white/60 p-10 text-center max-w-lg mx-auto">
            <Flame className="h-8 w-8 text-amber-700/60 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-[#422006] mb-1">
              Top Picks Updating
            </h3>
            <p className="text-xs sm:text-sm text-[#5c3a1e]/75 mb-4">
              Our devotee favorites list is being refreshed. Explore all consecrated Rudrakshas in our catalog.
            </p>
            <Link
              href="/all-products"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#713f12] px-4 py-2 text-xs font-bold text-white hover:bg-[#5c3a1e] transition-colors"
            >
              <span>View All Products</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        {/* ── Real Grid (1 col mobile, 2 sm, 4 lg) ── */}
        {products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((item: ProductType, index: number) => {
              const primaryImage =
                item.productImages?.[0]?.url ||
                item.productVariants?.[0]?.variantImages?.[0]?.url;

              const mukhi =
                item.type === "INDIVIDUAL_RUDRAKSHA"
                  ? item.individualRudrakshaDetail?.mukhi
                  : item.rudrakshaMalaDetail?.mukhi;

              const mukhiBadge =
                item.type === "INDIVIDUAL_RUDRAKSHA"
                  ? mukhi
                    ? `${mukhi} Mukhi`
                    : "Sacred Mukhi"
                  : mukhi
                    ? `${mukhi} Mukhi Mala`
                    : "Sacred Mala";

              const badgeText = BADGES[index % BADGES.length];

              const origin = item.productVariants?.[0]?.origin;
              const terroir = origin
                ? `${origin.name}, ${origin.country}`
                : "Himalayan Foothills, Nepal";

              const variants = item.productVariants ?? [];
              const prices = variants
                .map((v) => Number(v.price))
                .filter((p) => Number.isFinite(p) && p > 0);
              const minPrice = prices.length > 0 ? Math.min(...prices) : null;

              const benefits = getMukhiBenefits(mukhi, item.description);
              const ordersCount = 120 + ((item.id * 37) % 550);

              return (
                <div
                  key={item.id}
                  className="group flex flex-col justify-between rounded-2xl bg-white border border-amber-900/12 p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border-amber-900/25"
                >
                  <div>
                    {/* Image & Bestseller Badge */}
                    <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-[#f3eee7]">
                      {primaryImage ? (
                        <Image
                          src={primaryImage}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-[#5c3a1e]/40">
                          Consecrated Bead
                        </div>
                      )}

                      {/* Bestseller Badge */}
                      <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 rounded-full bg-amber-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                        <Flame className="h-3 w-3 fill-white" />
                        <span>{badgeText}</span>
                      </div>

                      {/* Terroir / Origin Pill */}
                      <div className="absolute bottom-2 left-2 z-10 rounded-md bg-black/65 backdrop-blur-xs px-2 py-0.5 text-[9px] font-semibold text-stone-200">
                        {terroir}
                      </div>
                    </div>

                    {/* Rating & Orders */}
                    <div className="mt-3 flex items-center justify-between text-[11px] text-[#5c3a1e]/75 font-medium">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        <span className="font-bold text-[#422006]">5.0</span>
                        <span>({ordersCount}+ blessed)</span>
                      </div>
                      <span className="font-bold text-[#713f12]">{mukhiBadge}</span>
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
                      <span className="line-clamp-2">{benefits}</span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="mt-4 pt-3 border-t border-amber-900/10 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                        {minPrice !== null ? "Starting at" : "Price"}
                      </span>
                      <div className="text-base font-black text-[#713f12]">
                        {minPrice !== null ? (
                          `Rs. ${minPrice.toLocaleString()}`
                        ) : (
                          <span className="text-xs">On request</span>
                        )}
                      </div>
                    </div>

                    <Link href={`/all-products/${item.slug}`}>
                      <button
                        type="button"
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#713f12] px-3.5 text-xs font-bold text-white shadow-2xs hover:bg-[#5c3a1e] transition-all active:scale-95 cursor-pointer"
                        aria-label={`View ${item.name}`}
                      >
                        <span>View</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
