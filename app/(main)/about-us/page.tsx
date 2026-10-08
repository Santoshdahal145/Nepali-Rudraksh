"use client";

import { AboutConsultationCta } from "./AboutConsultationCta";
import { AboutHero } from "./AboutHero";
import { AboutProcess } from "./AboutProcess";
import { AboutStory } from "./AboutStory";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#faf7f2] pb-24 pt-6 sm:pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        <AboutHero />
        <AboutStory />

        <AboutProcess />
        <AboutConsultationCta />
      </div>
    </main>
  );
}
