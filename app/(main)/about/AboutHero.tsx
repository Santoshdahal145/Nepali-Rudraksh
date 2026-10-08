"use client";

import Breadcrumbs from "@/components/Breadcrumb";

export function AboutHero() {
  return (
    <section className="space-y-6">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />
      <div className="space-y-3 border-b border-amber-900/10 pb-6 sm:pb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-[#422006] leading-[1.15]">
          About{" "}
          <span className="bg-linear-to-r from-[#713f12] via-[#92400e] to-[#b45309] bg-clip-text text-transparent">
            Nepali Rudraksh
          </span>
        </h1>

        <p className="max-w-3xl text-xs sm:text-sm text-[#5c3a1e]/80 leading-relaxed">
          Rooted in the ancient hills of Eastern Nepal, we bridge devotees and
          seekers with authentic, naturally formed Himalayan Rudraksha beads.
          Our purpose is straightforward: honoring the sanctity of Lord
          Shiva&apos;s sacred seed through transparent sourcing, traditional
          care, and honest guidance.
        </p>
      </div>
    </section>
  );
}
