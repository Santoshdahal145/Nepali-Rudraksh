"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight, ShieldCheck, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CartEmptyState() {
  return (
    <div className="mt-12 rounded-3xl border border-amber-900/10 bg-white p-10 sm:p-16 text-center shadow-lg shadow-amber-950/5 max-w-2xl mx-auto">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 border border-amber-900/15 shadow-inner">
        <ShoppingBag className="h-10 w-10 text-[#713f12]/60" />
      </div>
      <h2 className="mt-6 text-xl sm:text-2xl font-black text-[#422006]">
        Your Sacred Vessel is Empty
      </h2>
      <p className="mt-2 text-xs sm:text-sm text-[#5c3a1e]/75 max-w-md mx-auto leading-relaxed">
        No consecrated Himalayan Rudraksha beads or Japa Malas have been chosen yet.
        Explore our laboratory-certified collection blessed at Pashupatinath.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="/all-products">
          <Button className="h-11 bg-[#713f12] px-6 text-xs sm:text-sm font-bold text-white shadow-md shadow-amber-950/20 hover:bg-[#5c330e]">
            Explore Sacred Collection
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Sacred Guarantee Points */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-amber-900/10 pt-8 text-left">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="h-5 w-5 text-[#713f12] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-[#422006]">100% Nepali Origin</h4>
            <p className="text-[11px] text-[#5c3a1e]/70">
              Harvested from authentic trees in Sankhuwasabha.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Sparkles className="h-5 w-5 text-[#713f12] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-[#422006]">Pashupatinath Blessed</h4>
            <p className="text-[11px] text-[#5c3a1e]/70">
              Consecrated with Vedic mantras prior to dispatch.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Check className="h-5 w-5 text-[#713f12] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-[#422006]">Lab Certified</h4>
            <p className="text-[11px] text-[#5c3a1e]/70">
              Accompanied by verified X-Ray authentication certificate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
