"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tag, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function OfferSection() {
  return (
    <section
      id="offers"
      className="relative overflow-hidden bg-white py-14 sm:py-20 lg:py-28"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Banner Card */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#713f12] via-[#8B4A0F] to-[#422006] p-6 text-white shadow-2xl sm:p-10 lg:p-14">
          {/* Background Decorative Rings */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 sm:h-96 sm:w-96" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-400/10 blur-2xl sm:h-96 sm:w-96" />

          <div className="relative grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Left Copy (7 cols) */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/15 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-200 backdrop-blur-sm sm:px-4 sm:py-1.5 sm:text-xs sm:tracking-widest">
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-300" />
                Special Mahashivratri Blessing Offer
              </div>

              <h2 className="mt-4 text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl xl:text-5xl">
                Get <span className="text-amber-300">Up to 25% Off</span> On
                Rare Siddh Malas &amp; Collector Beads
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-amber-100/80 sm:mt-4 sm:text-base">
                Receive a complimentary pure silver capping, consecrated Gangajal, and a certified X-Ray authenticity report with every order.
              </p>

              {/* Offer Perks */}
              <div className="mt-5 grid grid-cols-1 gap-2.5 sm:mt-6 sm:grid-cols-2 sm:gap-3">
                {[
                  "Free Pashupatinath Consecration",
                  "Complimentary 925 Pure Silver Cap",
                  "Government Lab Test Certificate",
                  "Insured Express Global Delivery",
                ].map((perk) => (
                  <div
                    key={perk}
                    className="flex items-center gap-2 text-xs text-amber-100/90 sm:text-sm"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-300" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>

              {/* Coupon Code & CTA */}
              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center justify-between rounded-xl border border-dashed border-amber-300/40 bg-black/20 px-4 py-2.5 backdrop-blur-sm">
                  <div className="flex items-center">
                    <Tag className="mr-2 h-4 w-4 shrink-0 text-amber-300" />
                    <span className="text-xs text-amber-200/80 mr-2">Use Code:</span>
                  </div>
                  <span className="font-mono text-xs font-bold tracking-widest text-white sm:text-sm">
                    RUDRAKSHA25
                  </span>
                </div>

                <Link href="/all-products" className="w-full sm:w-auto">
                  <Button className="h-11 w-full gap-2 bg-amber-400 font-bold text-[#422006] shadow-lg shadow-amber-950/20 hover:bg-amber-300 sm:w-auto">
                    Claim Offer Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Featured Bundle Showcase (5 cols) */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md sm:p-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-300 sm:text-xs">
                      Featured Bundle
                    </span>
                    <h3 className="text-base font-bold text-white sm:text-lg">
                      The Siddh Shivalaya Set
                    </h3>
                  </div>
                  <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-black text-[#422006] sm:px-3 sm:py-1 sm:text-xs">
                    SAVE 30%
                  </span>
                </div>

                <div className="my-4 flex items-center justify-center rounded-xl bg-black/20 py-6 text-5xl sm:my-5 sm:py-8 sm:text-6xl">
                  🕉️
                </div>

                <ul className="space-y-2 text-xs text-amber-100/80">
                  <li className="flex justify-between">
                    <span>1 Mukhi to 14 Mukhi Power Combination</span>
                    <span className="font-semibold text-white">Included</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Hand-knotted in Raw Silk &amp; Silver</span>
                    <span className="font-semibold text-white">Included</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Custom Horoscope Mukhi Recommendation</span>
                    <span className="font-semibold text-white">Free</span>
                  </li>
                </ul>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3.5 sm:mt-6 sm:pt-4">
                  <div>
                    <span className="text-xs text-amber-200/60 line-through">
                      $899
                    </span>
                    <p className="text-xl font-extrabold text-white sm:text-2xl">$629</p>
                  </div>
                  <Link href="/all-products">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/30 bg-white/10 text-xs text-white hover:bg-white hover:text-[#422006]"
                    >
                      View Bundle
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
