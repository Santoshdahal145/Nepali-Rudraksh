"use client";

import React, { useState } from "react";
import {
  Flame,
  Moon,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Check,
  HelpCircle,
  Copy,
} from "lucide-react";
import { ProductType } from "@/app/types";
import { getMukhiVedicInfo } from "./mukhiData";
import { toast } from "sonner";

interface ProductDivineDetailsProps {
  product: ProductType;
}

export default function ProductDivineDetails({
  product,
}: ProductDivineDetailsProps) {
  const [activeTab, setActiveTab] = useState<"vedic" | "description" | "ritual" | "authenticity">("vedic");

  const mukhi =
    product.individualRudrakshaDetail?.mukhi ??
    product.rudrakshaMalaDetail?.mukhi;

  const vedicInfo = getMukhiVedicInfo(mukhi, product.name);

  const copyMantra = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(vedicInfo.beejMantra).then(() => {
        toast.success("Beej Mantra copied to clipboard!");
      });
    }
  };

  return (
    <div className="rounded-3xl border border-amber-900/12 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-amber-900/10 pb-3 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("vedic")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === "vedic"
              ? "bg-[#713f12] text-white shadow-xs"
              : "text-[#5c3a1e] hover:bg-amber-100/50 hover:text-[#713f12]"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Vedic Significance</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("description")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === "description"
              ? "bg-[#713f12] text-white shadow-xs"
              : "text-[#5c3a1e] hover:bg-amber-100/50 hover:text-[#713f12]"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Sacred Lore</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ritual")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === "ritual"
              ? "bg-[#713f12] text-white shadow-xs"
              : "text-[#5c3a1e] hover:bg-amber-100/50 hover:text-[#713f12]"
          }`}
        >
          <Flame className="h-4 w-4" />
          <span>How to Wear & Ritual</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("authenticity")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === "authenticity"
              ? "bg-[#713f12] text-white shadow-xs"
              : "text-[#5c3a1e] hover:bg-amber-100/50 hover:text-[#713f12]"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Authenticity & Lab Test</span>
        </button>
      </div>

      {/* Tab 1: Vedic Significance */}
      {activeTab === "vedic" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-amber-900/10 bg-[#faf7f2] p-4.5 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5c3a1e]/60">
                Ruling Divine Deity
              </span>
              <p className="text-base font-extrabold text-[#422006]">
                {vedicInfo.deity}
              </p>
            </div>

            <div className="rounded-2xl border border-amber-900/10 bg-[#faf7f2] p-4.5 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5c3a1e]/60">
                Ruling Astrological Planet
              </span>
              <p className="text-base font-extrabold text-[#422006]">
                {vedicInfo.planet}
              </p>
            </div>
          </div>

          {/* Beej Mantra Box */}
          <div className="rounded-2xl border border-amber-900/20 bg-amber-50/70 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#713f12]">
                Sacred Beej Mantra
              </span>
              <p className="text-lg sm:text-xl font-black font-serif text-[#422006] italic">
                &ldquo;{vedicInfo.beejMantra}&rdquo;
              </p>
              <p className="text-xs text-[#5c3a1e]/75">
                {vedicInfo.recommendedChant}
              </p>
            </div>

            <button
              type="button"
              onClick={copyMantra}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-900/20 bg-white px-3.5 py-2 text-xs font-bold text-[#713f12] shadow-2xs hover:bg-amber-100 transition-all shrink-0 active:scale-95"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Mantra</span>
            </button>
          </div>

          {/* Divine Benefits */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-[#422006]">
              Vedic Blessings & Metaphysical Potency
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vedicInfo.benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 rounded-xl border border-amber-900/10 bg-[#faf7f2]/50 p-3 text-xs sm:text-sm text-[#422006]"
                >
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Sacred Lore */}
      {activeTab === "description" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="prose prose-amber max-w-none text-sm text-[#422006]/90 leading-relaxed space-y-3">
            <p className="text-base font-semibold text-[#422006]">
              {product.description}
            </p>
            <p>
              According to ancient Shaivite scriptures including the Shiva Purana,
              Shrimad Devi Bhagavatam, and Padma Purana, sacred Rudraksha beads
              originated from the tears of compassion shed by Lord Shiva during his
              deep penance for the welfare of all living beings.
            </p>
            <p>
              The dense soil, pristine glacial meltwaters, and high atmospheric altitudes
              of Eastern Nepal (Sankhuwasabha and Bhojpur regions) produce Rudraksha
              specimens with distinctive deep cleft lines (Mukhis), dense seed cores,
              and powerful bio-electromagnetic fields that cannot be replicated elsewhere.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: How to Wear & Ritual */}
      {activeTab === "ritual" && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="rounded-2xl border border-amber-900/10 bg-[#faf7f2] p-4.5 space-y-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-xs font-black text-[#713f12]">
                1
              </span>
              <h4 className="font-extrabold text-[#422006]">Auspicious Timing</h4>
              <p className="text-[#5c3a1e]/80 leading-relaxed">
                The most auspicious time to wear this bead for the first time is on a
                Monday morning during Brahma Muhurta or sunrise, following a purifying bath.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-900/10 bg-[#faf7f2] p-4.5 space-y-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-xs font-black text-[#713f12]">
                2
              </span>
              <h4 className="font-extrabold text-[#422006]">Prana Pratishtha</h4>
              <p className="text-[#5c3a1e]/80 leading-relaxed">
                Before sending, our temple priests perform Vedic sanctification with
                Panchamrit, holy Ganga jal, and Bilva leaves at Pashupatinath Temple.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-900/10 bg-[#faf7f2] p-4.5 space-y-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-xs font-black text-[#713f12]">
                3
              </span>
              <h4 className="font-extrabold text-[#422006]">Sacred Maintenance</h4>
              <p className="text-[#5c3a1e]/80 leading-relaxed">
                Keep the bead clean with gentle brushing using pure mustard or sesame
                oil once a month. Avoid wearing during funerary visits or using chemical soaps.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Authenticity & Lab Test */}
      {activeTab === "authenticity" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="rounded-2xl border border-emerald-900/15 bg-emerald-50/50 p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <h4 className="text-sm font-extrabold">
                100% Guaranteed Nepal Government & Gemological Certified
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-emerald-900/80 leading-relaxed">
              Every single bead dispatched by Nepali Rudraksh undergoes rigorous non-destructive
              X-ray radiography and digital density testing to verify internal seed chambers
              (compartments) corresponding accurately to the natural surface Mukhi grooves.
            </p>
            <ul className="text-xs text-emerald-950/80 space-y-1.5 list-disc list-inside">
              <li>Verified natural formation without artificial carves or glued facets</li>
              <li>Includes verifiable laboratory certificate with QR authentication</li>
              <li>Hand-inspected by certified gemologists with 25+ years Himalayan expertise</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
