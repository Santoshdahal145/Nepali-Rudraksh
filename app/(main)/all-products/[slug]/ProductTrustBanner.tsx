import React from "react";
import { Sparkles, ShieldCheck, Mountain, Truck } from "lucide-react";

export default function ProductTrustBanner() {
  const trustFeatures = [
    {
      icon: <Sparkles className="h-5 w-5 text-amber-700" />,
      title: "Pashupatinath Consecrated",
      description: "Sanctified with ancient Vedic mantras and Ganga jal before dispatch.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-emerald-700" />,
      title: "Government Lab Certified",
      description: "X-ray verified seed compartments ensuring 100% natural authenticity.",
    },
    {
      icon: <Mountain className="h-5 w-5 text-amber-700" />,
      title: "Ethically Harvested in Nepal",
      description: "Directly sourced from organic growers in Sankhuwasabha & Bhojpur.",
    },
    {
      icon: <Truck className="h-5 w-5 text-amber-700" />,
      title: "Worldwide Insured Express",
      description: "Secure, tamper-evident spiritual packaging with tracking to your doorstep.",
    },
  ];

  return (
    <section className="rounded-3xl border border-amber-900/12 bg-[#f3eee7]/70 p-6 sm:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {trustFeatures.map((feat, idx) => (
          <div key={idx} className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-2xs border border-amber-900/10">
              {feat.icon}
            </div>
            <div className="space-y-0.5 min-w-0">
              <h4 className="text-xs sm:text-sm font-extrabold text-[#422006]">
                {feat.title}
              </h4>
              <p className="text-[11px] sm:text-xs text-[#5c3a1e]/75 leading-relaxed">
                {feat.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
