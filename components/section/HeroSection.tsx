"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[#faf7f2] pb-16 pt-10 sm:pb-20 sm:pt-16 lg:pt-20"
    >
      {/* Ambient background glows - contained with overflow-hidden */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-amber-200/25 blur-3xl sm:-left-40 sm:-top-40 sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-orange-200/20 blur-3xl sm:-bottom-32 sm:right-0 sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-amber-100/30 blur-2xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* ── Left: Copy ── */}
          <div className="flex flex-col items-start text-left">
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-800/20 bg-amber-50 px-3.5 py-1 text-left sm:mb-5 sm:px-4 sm:py-1.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#713f12]" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#713f12] sm:text-xs sm:tracking-widest">
                Authentic Himalayan Collection
              </span>
            </div>

            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#2d1a0e] xs:text-4xl sm:text-5xl lg:text-6xl">
              Sacred Beads,{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#713f12]">Divine Energy</span>
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 9C60 3 120 1 150 1C180 1 240 3 298 9"
                    stroke="#c8813e"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-4 max-w-lg text-base leading-relaxed text-[#5c3a1e]/80 sm:mt-6 sm:text-lg">
              Hand-selected Rudraksha beads sourced directly from the sacred
              forests of Nepal — authenticated, blessed, and delivered with reverence to your doorstep.
            </p>

            {/* Trust chips */}
            <div className="mt-5 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
              {[
                { icon: ShieldCheck, text: "100% Authenticated" },
                { icon: Star, text: "4.9 ★ (2,400+ reviews)" },
              ].map(({ icon: Icon, text }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-900/15 bg-white px-3 py-1 text-xs font-medium text-[#713f12] shadow-xs"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {text}
                </span>
              ))}
            </div>

            {/* CTA row */}
            <div className="mt-6 flex w-full flex-col gap-3 xs:w-auto xs:flex-row sm:mt-8">
              <Link href="/all-products" className="w-full xs:w-auto">
                <Button className="h-11 w-full gap-2 bg-[#713f12] px-6 text-sm font-semibold text-white shadow-md shadow-amber-900/20 hover:bg-[#5c330e] xs:w-auto sm:h-12 sm:px-7 sm:text-base">
                  Shop Collection
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/#story" className="w-full xs:w-auto">
                <Button
                  variant="outline"
                  className="h-11 w-full border-amber-900/20 px-6 text-sm font-semibold text-[#713f12] hover:border-amber-900/40 hover:bg-amber-50 xs:w-auto sm:h-12 sm:px-7 sm:text-base"
                >
                  Our Story
                </Button>
              </Link>
            </div>

            {/* Social proof row */}
            <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4">
              <div className="flex -space-x-2">
                {["RK", "SM", "AP", "DN", "BT"].map((init) => (
                  <div
                    key={init}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#faf7f2] bg-amber-200 text-[9px] font-bold text-[#713f12] sm:h-8 sm:w-8 sm:text-[10px]"
                  >
                    {init}
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#5c3a1e]/80 sm:text-sm">
                <span className="font-bold text-[#422006]">10,000+</span> devotees trust us worldwide
              </p>
            </div>
          </div>

          {/* ── Right: Visual card ── */}
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none lg:justify-end">
            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-amber-200/40 via-orange-100/30 to-transparent blur-2xl" />

            {/* Main card */}
            <div className="relative mx-auto w-full max-w-sm rounded-3xl border border-amber-900/10 bg-white/90 p-6 shadow-xl shadow-amber-900/10 backdrop-blur-sm sm:p-8">
              {/* Emoji hero */}
              <div className="mb-4 flex items-center justify-center sm:mb-6">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-linear-to-br from-amber-100 to-orange-50 text-6xl shadow-inner sm:h-40 sm:w-40 sm:text-7xl">
                  📿
                </div>
              </div>

              <h3 className="text-center text-lg font-bold text-[#422006] sm:text-xl">
                5 Mukhi Rudraksha
              </h3>
              <p className="mt-1 text-center text-xs text-[#5c3a1e]/70 sm:text-sm">
                The Bead of Lord Shiva · Most Sacred &amp; Universal
              </p>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-amber-900/10 bg-amber-50/60 p-2.5 sm:mt-5 sm:gap-3 sm:p-3">
                {[
                  { val: "100%", label: "Genuine" },
                  { val: "4.9★", label: "Rating" },
                  { val: "Nepal", label: "Origin" },
                ].map(({ val, label }) => (
                  <div key={label} className="flex flex-col items-center text-center">
                    <span className="text-xs font-bold text-[#713f12] sm:text-sm">{val}</span>
                    <span className="text-[9px] text-[#5c3a1e]/70 sm:text-[10px]">{label}</span>
                  </div>
                ))}
              </div>

              <Link href="/all-products" className="mt-4 block">
                <Button className="h-10 w-full bg-[#713f12] text-xs font-semibold text-white hover:bg-[#5c330e] sm:text-sm">
                  View Details
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            {/* Floating badges - hidden on small mobile to avoid overflow, visible from sm */}
            <div className="absolute -left-2 top-4 hidden rounded-xl border border-amber-900/10 bg-white px-3 py-1.5 shadow-lg shadow-amber-900/10 sm:block sm:px-3 sm:py-2">
              <p className="text-xs font-bold text-[#713f12]">✓ Certified</p>
              <p className="text-[10px] text-[#5c3a1e]/60">By Nepali Experts</p>
            </div>
            <div className="absolute -right-2 bottom-4 hidden rounded-xl border border-amber-900/10 bg-white px-3 py-1.5 shadow-lg shadow-amber-900/10 sm:block sm:px-3 sm:py-2">
              <p className="text-xs font-bold text-[#713f12]">🚚 Free Shipping</p>
              <p className="text-[10px] text-[#5c3a1e]/60">Orders over $150</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
