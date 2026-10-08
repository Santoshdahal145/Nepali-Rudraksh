"use client";

import { ShieldCheck, HeartHandshake, TreePine } from "lucide-react";

export function AboutStory() {
  const commitments = [
    {
      icon: TreePine,
      title: "Traceable Himalayan Origin",
      description:
        "Harvested directly from natural orchards in the eastern hills of Nepal. We deal exclusively in authentic Nepali beads, never compromised by synthetic imitations or artificial alterations.",
    },
    {
      icon: ShieldCheck,
      title: "Meticulous Inspection",
      description:
        "Every Rudraksha bead is carefully examined for natural Mukhi facets, density, and natural formation before it is recommended or prepared for dispatch.",
    },
    {
      icon: HeartHandshake,
      title: "Guidance Over Commerce",
      description:
        "We believe a Rudraksha should resonate with your personal energy and planetary alignment. We offer honest astrological guidance without sales pressure.",
    },
  ];

  return (
    <section className="space-y-8">
      {/* Narrative Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#713f12]">
            Our Origins
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#422006] leading-tight">
            Preserving a Sacred Himalayan Tradition
          </h2>
          <div className="h-1 w-16 bg-[#713f12] rounded-full" />
        </div>

        <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-[#5c3a1e]/85 leading-relaxed">
          <p>
            For generations, the high-altitude hills of Bhojpur, Sankhuwasabha, and eastern Nepal have been the sacred home of the world&apos;s finest Rudraksha trees. In local culture, these seeds are not mere commodities—they are revered as sacred tears of Lord Shiva, endowed with natural electromagnetic frequencies that support human well-being, mindfulness, and inner equilibrium.
          </p>
          <p>
            In recent years, the market has seen an influx of artificially manufactured beads, altered facets, and misleading astrological claims. <strong>Nepali Rudraksh</strong> was established to provide an authentic alternative: a transparent bridge between the sacred groves of Nepal and devotees seeking pure spiritual instruments.
          </p>
          <p>
            From the initial harvest to careful cleaning and traditional Vedic consecration in Kathmandu, every step is approached with devotion, humility, and complete transparency.
          </p>
        </div>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
        {commitments.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow space-y-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100/70 text-[#713f12]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#422006]">
                {item.title}
              </h3>
              <p className="text-xs text-[#5c3a1e]/75 leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
