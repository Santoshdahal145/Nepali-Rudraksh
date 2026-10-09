import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Mountain,
  Compass,
  Award,
  Truck,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function OurFeatureSection() {
  const features = [
    {
      icon: <Sparkles className="h-6 w-6 text-amber-700" />,
      badge: "Vedic Sanctity",
      title: "Pashupatinath Temple Consecration",
      description:
        "Every bead undergoes traditional Prana Pratishtha rituals by temple priests, bathed in holy Gangajal and sanctified with sacred Shiva mantras.",
      points: ["Traditional Prana Pratishtha", "Vedic mantra energization", "Ready to wear upon receipt"],
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-700" />,
      badge: "Scientific Proof",
      title: "100% Lab Tested & X-Ray Verified",
      description:
        "Each bead is tested by certified gemological laboratories with non-destructive X-ray verification to confirm internal natural seed chambers.",
      points: ["X-Ray chamber verification", "Physical authenticity certificate", "Zero synthetic or glued beads"],
    },
    {
      icon: <Mountain className="h-6 w-6 text-amber-800" />,
      badge: "Sacred Terroir",
      title: "Direct Nepal Mountain Harvest",
      description:
        "Sourced ethically from organic family groves in Sankhuwasabha and Bhojpur, renowned for producing the densest, most vibrant Himalayan Rudraksha.",
      points: ["100% high-altitude trees", "Dense natural thorny ridges", "Fair trade with local growers"],
    },
    {
      icon: <Compass className="h-6 w-6 text-amber-700" />,
      badge: "Personalized Alignment",
      title: "Free Astrological Mukhi Guidance",
      description:
        "Our Vedic pandits evaluate your Janam Kundali, moon sign, and birth Nakshatra to prescribe the exact Mukhi bead aligned with your life goals.",
      points: ["Janam Kundali analysis", "Planetary dosha remediation", "Personalized wearing guidance"],
    },
    {
      icon: <Award className="h-6 w-6 text-amber-700" />,
      badge: "Purity Promise",
      title: "Lifetime Authenticity Guarantee",
      description:
        "We stake our reputation on spiritual purity. If any bead is ever proven non-natural by a recognized lab, we provide a 100% full money-back guarantee.",
      points: ["Lifetime certificate validity", "Uncompromised natural seed", "Zero chemical polishing"],
    },
    {
      icon: <Truck className="h-6 w-6 text-amber-700" />,
      badge: "Global Sanctity",
      title: "Worldwide Insured Express Delivery",
      description:
        "Delivered safely to over 60 countries in tamper-evident spiritual packaging, accompanied by energized sacred thread and consecrated Ganga jal.",
      points: ["Insured doorstep tracking", "Tamper-evident packaging", "Dispatched to 60+ countries"],
    },
  ];

  return (
    <section className="w-full bg-[#faf7f2] py-16 sm:py-24 border-b border-amber-900/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-900/15 bg-white px-3.5 py-1 text-xs font-bold text-[#713f12] shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
            <span>The Sacred Guarantee</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-tight text-[#422006]">
            Why Devotees Choose Nepali Rudraksh
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-[#5c3a1e]/80 leading-relaxed">
            From the high Himalayan slopes to your shrine, discover the sacred Vedic process, lab certification, and ancient rituals that set our beads apart.
          </p>
        </div>

        {/* ── Feature Cards Bento Grid (1 col mobile, 2 tablet, 3 desktop) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col justify-between rounded-2xl bg-white border border-amber-900/10 p-6 shadow-2xs hover:shadow-md transition-all duration-300 hover:border-amber-900/25"
            >
              <div>
                {/* Icon & Badge Header */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3eee7] border border-amber-900/10 group-hover:scale-105 transition-transform">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#713f12]/80 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-900/10">
                    {feat.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-[#422006] mb-2 leading-snug">
                  {feat.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#5c3a1e]/75 leading-relaxed mb-4">
                  {feat.description}
                </p>
              </div>

              {/* Bullet Points */}
              <div className="pt-4 border-t border-amber-900/10 space-y-1.5">
                {feat.points.map((pt, pIdx) => (
                  <div key={pIdx} className="flex items-center gap-2 text-xs font-medium text-[#422006]/90">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Consultation Callout Banner ── */}
        <div className="mt-12 sm:mt-16 rounded-3xl bg-linear-to-r from-[#422006] via-[#5c330e] to-[#713f12] p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-300">
              Not Sure Which Mukhi Suits You?
            </span>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold">
              Get Free Astrological Mukhi Recommendation
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              Talk directly with our experienced Vedic astrologers to discover the perfect bead matching your horoscope, current dasha, and life intentions.
            </p>
          </div>

          <Link href="/consultation" className="shrink-0 w-full md:w-auto">
            <button
              type="button"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 hover:bg-amber-300 text-[#422006] font-bold text-sm sm:text-base px-7 py-3.5 transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Book Free Consultation</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
