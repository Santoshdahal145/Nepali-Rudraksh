"use client";

import { TreePine, CheckCircle2, Sparkles } from "lucide-react";

export function AboutProcess() {
  const steps = [
    {
      step: "01",
      icon: TreePine,
      title: "Ethical Mountain Harvest",
      description:
        "Rudraksha fruits are harvested only after reaching full natural maturity on trees across the eastern hills of Nepal (Bhojpur and neighboring areas).",
    },
    {
      step: "02",
      icon: CheckCircle2,
      title: "Hands-on Verification",
      description:
        "Each bead is gently cleaned, inspected for natural Mukhi facets, density, and natural formation to confirm it is completely unadulterated.",
    },
    {
      step: "03",
      icon: Sparkles,
      title: "Vedic Consecration",
      description:
        "Before reaching the devotee, eligible beads are purified with sacred Gangajal and blessed through traditional rituals in Kathmandu.",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-1.5">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#713f12]">
          Our Process
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#422006]">
          From the Tree to Your Altar
        </h2>
        <p className="text-xs sm:text-sm text-[#5c3a1e]/75">
          A disciplined, traditional approach that honors both nature and sacred scripture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="relative rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-3xl font-black text-amber-900/15">
                {item.step}
              </span>

              <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100/70 text-[#713f12]">
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-base font-bold text-[#422006]">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#5c3a1e]/75">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
