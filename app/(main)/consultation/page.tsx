"use client";

import Breadcrumbs from "@/components/Breadcrumb";
import { ConsultationFAQ } from "./ConsultationFAQ";
import { ConsultationForm } from "./ConsultationForm";
import { ContactCards } from "./ContactCards";
import { FounderSpotlight } from "./FounderSpotlight";
import { TrustBanners } from "./TrustBanners";

export default function ConsultationPage() {
  return (
    <main className="min-h-screen bg-[#faf7f2] pb-24 pt-6 sm:pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Sacred Consultation" },
          ]}
        />

        <header className="space-y-3 border-b border-amber-900/10 pb-6 sm:pb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-[#422006] leading-[1.15]">
            Personalized Sacred Consultation with{" "}
            <span className="bg-linear-to-r from-[#713f12] via-[#92400e] to-[#b45309] bg-clip-text text-transparent">
              Founder Ujwal Bhandari
            </span>
          </h1>

          <p className="max-w-3xl text-xs sm:text-sm text-[#5c3a1e]/75 leading-relaxed">
            Every soul carries a unique planetary frequency. Connect directly
            with Ujwal Bhandari to review your birth chart (Janma Kundali),
            understand your chakra vibrations, and receive an authentic,
            Pashupatinath-consecrated Himalayan Rudraksha recommendation
            tailored specifically to your life destiny.
          </p>
        </header>
        <FounderSpotlight />
        <ContactCards />
        <TrustBanners />
        <ConsultationForm />
        <ConsultationFAQ />
      </div>
    </main>
  );
}
