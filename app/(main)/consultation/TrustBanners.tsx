"use client";

import {
  ShieldCheck,
  Sparkles,
  FileCheck2,
  TreePine,
  Globe2,
  Award,
} from "lucide-react";

export function TrustBanners() {
  const trustPoints = [
    {
      icon: Globe2,
      title: "Verified Origin",
      subtitle: "Traceable Source & Provenance",
      description:
        "Every Rudraksha is sourced with documented origin information, allowing you to know where your bead comes from and what type of Rudraksha you are receiving.",
      badge: "Origin Verified",
    },
    {
      icon: FileCheck2,
      title: "Authenticity Verified",
      subtitle: "Carefully Inspected Rudraksha",
      description:
        "Each Rudraksha is carefully inspected for natural characteristics, Mukhi formation, size, and overall authenticity before being offered for sale.",
      badge: "Authenticity Checked",
    },
    {
      icon: Sparkles,
      title: "Sacredly Consecrated",
      subtitle: "Traditional Vedic Rituals",
      description:
        "Eligible Rudraksha products can be purified and consecrated through traditional Vedic practices before dispatch, preparing them for spiritual use.",
      badge: "Consecrated",
    },
    {
      icon: Award,
      title: "Authenticity Guarantee",
      subtitle: "Confidence in Every Purchase",
      description:
        "Every qualifying Rudraksha comes with an authenticity guarantee and supporting documentation where applicable, giving you confidence in your purchase.",
      badge: "Guaranteed Authentic",
    },
  ];

  return (
    <section className="rounded-3xl border border-amber-900/15 bg-gradient-to-br from-[#2d1a0e] to-[#422006] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
      {/* Ambience glow */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 px-3.5 py-1 text-xs font-bold text-amber-300">
          <ShieldCheck className="h-4 w-4 text-amber-400" />
          The Nepali Rudraksh Trust Standard
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
          Why Devotees Around the World Trust Ujwal Bhandari
        </h2>
        <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed">
          In a market flooded with artificial carvings and misleading claims,
          our sacred lineage guarantees uncompromising purity from tree branch
          to prayer altar.
        </p>
      </div>

      {/* 4 Trust Cards */}
      <div className="relative mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {trustPoints.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10 hover:border-amber-400/40 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                  {item.badge}
                </span>
              </div>

              <h3 className="mt-4 text-base font-bold text-white">
                {item.title}
              </h3>
              <p className="text-xs font-semibold text-amber-300/90">
                {item.subtitle}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-amber-100/70">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Trust Stats Bar */}
      <div className="relative mt-10 border-t border-white/10 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">
            10,000+
          </div>
          <p className="mt-0.5 text-xs text-amber-100/70">
            Devotees Blessed Globally
          </p>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">
            100%
          </div>
          <p className="mt-0.5 text-xs text-amber-100/70">Himalayan Origin</p>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">
            10+
          </div>
          <p className="mt-0.5 text-xs text-amber-100/70">
            Countries Shipped Safely
          </p>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">
            10+ Yrs
          </div>
          <p className="mt-0.5 text-xs text-amber-100/70">
            Generational Vedic Custodianship
          </p>
        </div>
      </div>
    </section>
  );
}
