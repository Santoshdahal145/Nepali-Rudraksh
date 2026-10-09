"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Gift, Check, Crown } from "lucide-react";

interface BlessingOffer {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  scriptureRef: string;
  price: number;
  originalPrice: number;
  savingsText: string;
  inclusions: string[];
  imageUrl: string;
  slug: string;
}

const blessingOffers: BlessingOffer[] = [
  {
    id: "bo1",
    badge: "Supreme Sovereign Combination",
    title: "Sarva Siddha Maha Mala (1 to 14 Mukhi)",
    subtitle: "The most powerful combination in the Shiva Purana, awakening all chakras and bestowing supreme protection.",
    scriptureRef: "Shiva Purana Vidyeshvara Samhita 25",
    price: 185000,
    originalPrice: 215000,
    savingsText: "Save Rs. 30,000",
    inclusions: [
      "1 to 14 Mukhi Natural Nepal Beads",
      "Gauri Shankar & Ganesh Bead included",
      "X-Ray Gemological Certificate for each bead",
      "Pashupatinath Prana Pratishtha Consecration",
      "Energized velvet altar presentation box",
    ],
    imageUrl: "https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=800&q=80",
    slug: "sarva-siddha-maha-mala-1-to-14-mukhi",
  },
  {
    id: "bo2",
    badge: "Planetary Shield",
    title: "Navagraha Shanti Consecrated Kavach",
    subtitle: "Complete astronomical alignment balancing all 9 planetary influences (Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury, Ketu, Venus).",
    scriptureRef: "Shrimad Devi Bhagavatam Book XI",
    price: 36500,
    originalPrice: 42000,
    savingsText: "Save Rs. 5,500",
    inclusions: [
      "9 Specially chosen Mukhi beads (1-9 Mukhi)",
      "Energized pure 925 sterling silver capping",
      "Personalized Janam Kundali alignment certificate",
      "Sanctified with holy Ganga jal & Bilva leaves",
      "Free insured global express shipping",
    ],
    imageUrl: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=800&q=80",
    slug: "navagraha-shanti-consecrated-kavach",
  },
  {
    id: "bo3",
    badge: "Divine Love & Unity",
    title: "Gauri Shankar & Ganesh Family Harmony Set",
    subtitle: "The sacred union of Lord Shiva, Goddess Parvati, and Lord Ganesha, removing family disputes and welcoming prosperity.",
    scriptureRef: "Padma Purana Uttara Khanda",
    price: 24500,
    originalPrice: 28000,
    savingsText: "Save Rs. 3,500",
    inclusions: [
      "Natural Joined Gauri Shankar Bead (Nepal)",
      "8 Mukhi Lord Ganesh Obstacle-Remover Bead",
      "Individual Lab X-Ray Certificate",
      "Consecrated on auspicious Monday at Pashupatinath",
      "Red sacred consecration thread included",
    ],
    imageUrl: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80",
    slug: "gauri-shankar-ganesh-harmony-set",
  },
];

export default function SpecialBlessingOffers() {
  return (
    <section className="w-full bg-[#f6eee4] py-16 sm:py-24 border-b border-amber-900/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-800/20 bg-amber-100 px-3.5 py-1 text-xs font-bold text-[#713f12] shadow-2xs">
            <Crown className="h-3.5 w-3.5 text-amber-700" />
            <span>Sacred Scriptural Combinations</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-tight text-[#422006]">
            Special Consecrated Blessing Combinations
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-[#5c3a1e]/80 leading-relaxed">
            Multi-bead power sets consecrated together to amplify positive energy, planetary harmony, and spiritual transformation as recommended in the Shiva Purana.
          </p>
        </div>

        {/* ── Offers Cards Grid (1 col mobile, 3 cols desktop) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {blessingOffers.map((offer) => (
            <div
              key={offer.id}
              className="group flex flex-col justify-between rounded-3xl bg-white border border-amber-900/15 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:border-amber-900/30"
            >
              <div>
                {/* Visual Header */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-[#f3eee7]">
                  <Image
                    src={offer.imageUrl}
                    alt={offer.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-amber-700 px-3 py-1 text-[11px] font-bold text-white shadow-md">
                    <Sparkles className="h-3 w-3 fill-white" />
                    <span>{offer.badge}</span>
                  </div>

                  {/* Savings Tag */}
                  <div className="absolute top-3 right-3 z-10 rounded-full bg-emerald-800 px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
                    {offer.savingsText}
                  </div>

                  {/* Scripture Citation */}
                  <div className="absolute bottom-2.5 left-3 z-10 text-[10px] text-amber-200/90 font-medium">
                    📜 {offer.scriptureRef}
                  </div>
                </div>

                {/* Offer Details */}
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-serif font-black text-[#422006] group-hover:text-[#713f12] transition-colors leading-snug">
                    {offer.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-[#5c3a1e]/80 leading-relaxed">
                    {offer.subtitle}
                  </p>

                  {/* Sacred Inclusions */}
                  <div className="mt-5 pt-4 border-t border-amber-900/10 space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#713f12]">
                      Consecration Inclusions:
                    </div>
                    {offer.inclusions.map((inc, iIdx) => (
                      <div key={iIdx} className="flex items-start gap-2 text-xs text-[#422006]/90">
                        <Check className="h-3.5 w-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span className="leading-tight">{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-5 sm:p-6 pt-0">
                <div className="rounded-2xl bg-[#faf7f2] p-4 border border-amber-900/10 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#5c3a1e]/60">Complete Sanctified Kit</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg sm:text-xl font-black text-[#713f12]">
                        Rs. {offer.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-stone-400 line-through">
                        Rs. {offer.originalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Link href={`/all-products/${offer.slug}`}>
                    <button
                      type="button"
                      className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#713f12] hover:bg-[#5c3a1e] px-4 text-xs font-bold text-white shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
