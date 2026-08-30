"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, Check, ShieldCheck } from "lucide-react";

export default function OurStorySection() {
  return (
    <section
      id="story"
      className="relative overflow-x-hidden bg-[#faf7f2] py-12 sm:py-16 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Visual Montage */}
          <div className="w-full min-w-0 lg:col-span-5">
            <div className="w-full rounded-3xl border border-amber-900/10 bg-white p-4 shadow-xl shadow-amber-950/5 sm:p-6">
              {/* Himalayan Banner */}
              <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl bg-linear-to-br from-[#713f12] via-[#8B4A0F] to-[#d97706] px-4 py-6 text-center text-white shadow-inner sm:min-h-[260px] sm:px-6">
                <span className="text-4xl sm:text-5xl">🏔️</span>
                <p className="mt-3 break-words text-[10px] font-semibold uppercase tracking-widest text-amber-200 sm:text-xs">
                  Sankhuwasabha &amp; Bhojpur, Nepal
                </p>
                <h3 className="mt-1 text-base font-bold text-white sm:text-2xl">
                  Sacred Himalayan Foothills
                </h3>
                <p className="mt-2 max-w-xs text-xs leading-relaxed text-amber-100/80">
                  Where pristine glacial waters and pure high altitude cultivate
                  the world&apos;s most potent and revered Rudraksha trees.
                </p>
              </div>

              {/* Micro Stats Grid */}
              <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                <div className="min-w-0 rounded-xl border border-amber-900/10 bg-[#faf7f2] p-2.5 text-center sm:p-4">
                  <p className="text-base font-extrabold text-[#713f12] sm:text-2xl">
                    3+ Decades
                  </p>
                  <p className="mt-0.5 text-[10px] leading-snug text-[#5c3a1e]/70 sm:text-xs">
                    Himalayan heritage &amp; lineage
                  </p>
                </div>
                <div className="min-w-0 rounded-xl border border-amber-900/10 bg-[#faf7f2] p-2.5 text-center sm:p-4">
                  <p className="text-base font-extrabold text-[#713f12] sm:text-2xl">
                    100% Direct
                  </p>
                  <p className="mt-0.5 text-[10px] leading-snug text-[#5c3a1e]/70 sm:text-xs">
                    From local harvesters to you
                  </p>
                </div>
              </div>

              {/* Integrated Trust Tag */}
              <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-amber-900/10 bg-amber-50/60 p-2.5 text-center">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#713f12]" />
                <span className="text-[11px] font-semibold leading-snug text-[#422006] sm:text-xs">
                  Vedic Consecrated · Certified Authentic Origin
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Pillars */}
          <div className="w-full min-w-0 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-800/20 bg-amber-50 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#713f12] sm:text-xs">
              <Compass className="h-3.5 w-3.5 shrink-0" />
              Our Sacred Roots
            </div>

            <h2 className="mt-3 text-xl font-extrabold leading-tight text-[#2d1a0e] sm:text-3xl lg:text-4xl">
              Born in the High Himalayas, Dedicated to Divine Truth
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-[#5c3a1e]/80 sm:mt-4 sm:text-base">
              According to ancient Vedic scriptures (Shiva Purana), Rudraksha
              beads originated from the tears of compassion shed by Lord Shiva
              for humankind.
            </p>

            <p className="mt-2 text-xs leading-relaxed text-[#5c3a1e]/70 sm:text-sm">
              For generations, our family has worked directly with traditional
              indigenous collectors across Eastern Nepal. We bypass commercial
              middlemen, ensuring that every single bead you receive is pure,
              untreated, naturally matured on the tree, and ethically sourced.
            </p>

            {/* Three Pillars */}
            <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
              {[
                {
                  title: "Pristine Himalayan Terroir",
                  desc: "Nepali Rudrakshas are globally renowned for deep mukhi grooves, heavy density, and higher electromagnetic vibrations compared to other varieties.",
                },
                {
                  title: "Ethical & Fair Harvester Support",
                  desc: "We support local Nepali harvesting families with fair wages, medical funds, and sustainable replanting programs in Taplejung.",
                },
                {
                  title: "Sacred Temple Blessings",
                  desc: "Before shipping, each bead undergoes traditional Vedic purification (Shuddhikaran) by authorized priests at the revered Pashupatinath temple.",
                },
              ].map((pillar, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#713f12] text-white sm:h-5 sm:w-5">
                    <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#422006] sm:text-sm">
                      {pillar.title}
                    </h4>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-[#5c3a1e]/70 sm:text-xs">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4">
              <Link href="/all-products" className="w-full sm:w-auto">
                <Button className="h-11 w-full bg-[#713f12] text-xs font-semibold text-white shadow-xs hover:bg-[#5c330e] sm:w-auto sm:text-sm">
                  Explore Sacred Beads
                </Button>
              </Link>
              <Link href="/#story" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="h-11 w-full whitespace-normal border-amber-900/20 text-xs font-semibold text-[#713f12] hover:bg-amber-50 sm:w-auto sm:text-sm"
                >
                  Read Full Heritage Story →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
