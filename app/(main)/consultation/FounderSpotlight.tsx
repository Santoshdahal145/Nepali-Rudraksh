"use client";

import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

export function FounderSpotlight() {
  const whatsappNumber = "+9779801234567";
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Namaste Ujwal ji, I am reaching out from Nepali Rudraksh for a personal Rudraksha & astrological consultation.",
  )}`;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-amber-900/15 bg-gradient-to-b from-white via-[#fffdfa] to-amber-50/40 p-6 shadow-xl shadow-amber-950/5 sm:p-10 lg:p-12">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-orange-400/10 blur-3xl" />

      <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
        {/* Left Column: Founder Photo & Quick Contact Badges (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-sm sm:max-w-md">
            {/* Outer Golden Halo Frame */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border-2 border-amber-900/20 bg-amber-100/50 shadow-2xl shadow-amber-950/15">
              <Image
                src="/images/founder-ujwal.jpeg"
                alt="Ujwal Bhandari - Founder of Nepali Rudraksh"
                fill
                priority
                className="object-cover object-top transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 400px"
              />

              {/* Verified Founder Badge Overlay */}
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/30 bg-[#2d1a0e]/85 p-3.5 backdrop-blur-md text-white shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-[#422006]">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold tracking-tight text-white">
                      Ujwal Bhandari
                    </h3>
                    <p className="text-[11px] font-medium text-amber-300">
                      Founder &amp; Vedic Consecration Curator
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-credibility Pills */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-[#5c3a1e]">
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-900/15 bg-white px-3 py-1 shadow-xs">
                <MapPin className="h-3 w-3 text-[#713f12]" />
                Bhojpur Native
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-900/15 bg-white px-3 py-1 shadow-xs">
                <Sparkles className="h-3 w-3 text-amber-600" />
                10+ Yrs Vedic Heritage
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-900/15 bg-white px-3 py-1 shadow-xs">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                1000+ Devotees Guided
              </span>
            </div>

            {/* Direct Connect Action Row */}
            <div className="mt-6 flex flex-col sm:flex-row gap-2.5 w-full">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full h-11 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/15 gap-2 transition-transform active:scale-[0.98]">
                  <MessageCircle className="h-4 w-4 fill-white" />
                  Chat on WhatsApp
                </Button>
              </a>

              <a href="tel:+9779801234567" className="sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-11 border-amber-900/20 bg-white hover:bg-amber-50 text-[#713f12] font-bold text-xs sm:text-sm gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Call Direct
                </Button>
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-900/15 bg-amber-100/70 px-3 py-1 text-xs font-bold text-[#713f12]">
              <HeartHandshake className="h-3.5 w-3.5 text-amber-700" />
              Direct Founder Guidance
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#422006] leading-tight">
              &ldquo;Rudraksha is not merchandise. It is Lord Shiva&apos;s
              cosmic blessing.&rdquo;
            </h2>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-amber-800">
              A Personal Message from Ujwal Bhandari
            </p>
          </div>

          {/* Letter / Quote Block */}
          <div className="relative rounded-2xl border border-amber-900/10 bg-amber-50/50 p-6 sm:p-7 text-xs sm:text-sm leading-relaxed text-[#5c3a1e] space-y-3.5 shadow-inner">
            <span className="absolute -top-3 left-6 bg-white px-2 text-2xl font-serif text-[#713f12]/40 select-none">
              &ldquo;
            </span>

            <p>
              <strong>Namaste and warm blessings from Kathmandu.</strong>
            </p>

            <p>
              Growing up at the foothills of Bhojpur in Eastern Nepal, I had the
              privilege of walking among natural, ancient Rudraksha groves. In
              our ancestral tradition, a Rudraksha is never treated as a
              commercial item—it is revered as the divine tear of Mahadev,
              formed with sacred mathematical facets (Mukhis) that resonate
              directly with human chakras and planetary energies.
            </p>

            <p>
              Over the last two decades, I have seen so many devotees buy the
              wrong mukhi through guesswork, or worse, receive artificially
              glued beads. Wearing a Rudraksha that conflicts with your Janma
              Kundali (birth chart) or personal spiritual frequency can lead to
              dissonance instead of inner peace.
            </p>

            <p>
              That is why I personally oversee every single consultation.
              Whether you are facing intense planetary periods like{" "}
              <em>Shani Sade Sati</em>, career confusion, health distress, or
              simply seeking spiritual deepening, you can talk to me directly. I
              will analyze your birth planetary positions and recommend the
              exact consecrated Nepali bead designed for your destiny.
            </p>

            <div className="pt-2 border-t border-amber-900/10 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#422006]">Ujwal Bhandari</p>
                <p className="text-[11px] text-[#5c3a1e]/70">
                  Founder, Nepali Rudraksh • Kathmandu, Nepal
                </p>
              </div>
            </div>
          </div>

          {/* Core Guarantees List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-900/10 bg-white p-3.5 shadow-xs">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#422006]">
                  Zero Obligation Consultation
                </h4>
                <p className="text-[11px] text-[#5c3a1e]/70">
                  Receive honest astrological advice without pressure to
                  purchase.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-amber-900/10 bg-white p-3.5 shadow-xs">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#422006]">
                  Pashupatinath Energization
                </h4>
                <p className="text-[11px] text-[#5c3a1e]/70">
                  Consecrated with authentic Vedic mantras prior to dispatch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
