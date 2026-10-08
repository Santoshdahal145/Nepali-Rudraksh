"use client";

import Link from "next/link";
import {
  Calendar,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutConsultationCta() {
  const whatsappUrl = `https://wa.me/9779801234567?text=${encodeURIComponent(
    "Namaste Ujwal ji, I visited the About page and would like guidance on choosing the right Rudraksha for my birth chart."
  )}`;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-amber-900/15 bg-gradient-to-br from-[#2d1a0e] via-[#3a2213] to-[#422006] p-8 sm:p-12 text-white shadow-xl">
      {/* Ambience glow */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative max-w-3xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 px-3.5 py-1 text-xs font-bold text-amber-300">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          Personal Vedic Consultation
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
            Not Sure Which Rudraksha to Choose?
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/80 max-w-2xl mx-auto leading-relaxed">
            A Rudraksha bead works best when aligned with your astrological birth chart (Janma Kundali) and life intentions. Connect with Founder Ujwal Bhandari to receive a thoughtful, personalized recommendation before you choose.
          </p>
        </div>

        {/* 3 Simple highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-xl mx-auto pt-2">
          <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-amber-100/90">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Zero obligation to purchase</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-amber-100/90">
            <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
            <span>Birth chart &amp; Rashi matching</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-amber-100/90">
            <MessageCircle className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Direct WhatsApp guidance</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link href="/consultation" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto h-11 px-6 bg-amber-400 hover:bg-amber-300 text-[#422006] font-bold text-xs sm:text-sm gap-2 shadow-md">
              <Calendar className="h-4 w-4" />
              Go to Consultation Page
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              variant="outline"
              className="w-full sm:w-auto h-11 px-6 border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm gap-2"
            >
              <MessageCircle className="h-4 w-4 fill-white" />
              Chat on WhatsApp
            </Button>
          </a>

          <Link href="/all-products" className="w-full sm:w-auto">
            <Button
              variant="ghost"
              className="w-full sm:w-auto h-11 px-5 text-amber-200 hover:text-white hover:bg-white/10 text-xs sm:text-sm font-semibold"
            >
              Browse Catalog
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
