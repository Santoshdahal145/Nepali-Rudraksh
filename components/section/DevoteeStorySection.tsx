"use client";

import { useState } from "react";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  role: string;
  rating: number;
  productBought: string;
  story: string;
  verified: boolean;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Dr. Acharya Sanjeev Sharma",
    location: "Varanasi, India",
    role: "Vedic Astrologer & Sanskrit Scholar",
    rating: 5,
    productBought: "14 Mukhi Devamani Rudraksha",
    story:
      "The authenticity of Nepali Rudraksh is rare in today's commercial market. The 14 Mukhi I purchased has remarkable clarity, natural mukhi lines, and high vibrational energy. My deep meditation practice has reached completely new heights.",
    verified: true,
    avatar: "SS",
  },
  {
    id: "2",
    name: "Elena Rostova",
    location: "Zurich, Switzerland",
    role: "Kundalini Yoga Teacher",
    rating: 5,
    productBought: "5 Mukhi Siddh Mala (108+1)",
    story:
      "I ordered the 108 Siddh Mala for my daily japa. The packaging came with the certificate of origin, sacred vibhuti, and pure Gangajal. You can instantly feel the divine vibrations. Shipping to Europe was under 5 days!",
    verified: true,
    avatar: "ER",
  },
  {
    id: "3",
    name: "Rajesh K. Shrestha",
    location: "Kathmandu, Nepal",
    role: "Entrepreneur & Shiva Devotee",
    rating: 5,
    productBought: "7 Mukhi Mahalakshmi + 8 Mukhi Ganesha Combo",
    story:
      "Being from Nepal, I know how hard it is to get genuine non-doctored Rudraksha. These beads are 100% natural, lab tested, and blessed. My business obstacles melted away within months of wearing them.",
    verified: true,
    avatar: "RS",
  },
  {
    id: "4",
    name: "Ananya Iyer",
    location: "Bengaluru, India",
    role: "Meditation Practitioner",
    rating: 5,
    productBought: "Gauri Shankar Sacred Twin Bead",
    story:
      "The Gauri Shankar bead brought an immense sense of harmony and peace into our family. The craftsmanship in pure silver capping was exquisite. Blessings to the entire team for preserving this sacred tradition.",
    verified: true,
    avatar: "AI",
  },
];

export default function DevoteeStorySection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev + 1) % testimonials.length
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const current = testimonials[currentIndex];

  return (
    <section id="devotee-stories" className="relative bg-white py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-800/20 bg-amber-50 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#713f12] sm:text-xs">
            <Heart className="h-3.5 w-3.5 fill-[#713f12]" />
            Devotee Experiences
          </div>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#2d1a0e] sm:text-3xl lg:text-4xl">
            Blessed Journeys &amp; Transformations
          </h2>
          <p className="mt-2 text-xs text-[#5c3a1e]/70 sm:mt-3 sm:text-sm md:text-base">
            Real stories from spiritual practitioners, yoga masters, and
            devotees across 50+ countries.
          </p>
        </div>

        {/* Featured Big Testimonial Card */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-amber-900/10 bg-linear-to-br from-[#faf7f2] via-white to-amber-50/40 p-5 shadow-xl shadow-amber-950/5 sm:mt-14 sm:p-8 lg:p-12">
          <div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-12">
            {/* Left Avatar / Product Badge (4 cols) */}
            <div className="flex flex-col items-center text-center lg:col-span-4 lg:items-start lg:text-left">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#713f12] text-xl font-black text-amber-200 shadow-lg shadow-amber-950/20 sm:h-24 sm:w-24 sm:text-2xl">
                  {current.avatar}
                </div>
                {current.verified && (
                  <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white ring-2 ring-white sm:h-7 sm:w-7">
                    <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </span>
                )}
              </div>

              <h3 className="mt-3 text-lg font-bold text-[#422006] sm:mt-4 sm:text-xl">
                {current.name}
              </h3>
              <p className="text-xs font-medium text-[#713f12]">
                {current.role}
              </p>
              <p className="text-[11px] text-muted-foreground sm:text-xs">
                {current.location}
              </p>

              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-900/10 bg-white px-3 py-1 text-[11px] font-semibold text-[#713f12] shadow-xs sm:mt-4 sm:text-xs">
                📿 {current.productBought}
              </div>
            </div>

            {/* Right Quote & Navigation (8 cols) */}
            <div className="border-t border-amber-900/10 pt-5 lg:col-span-8 lg:border-t-0 lg:border-l lg:pl-10 lg:pt-0">
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400 sm:h-5 sm:w-5"
                    />
                  ))}
                </div>
                <Quote className="h-7 w-7 text-amber-900/15 sm:h-10 sm:w-10" />
              </div>

              <p className="mt-3 text-sm italic leading-relaxed text-[#2d1a0e]/90 sm:mt-4 sm:text-base lg:text-lg">
                &ldquo;{current.story}&rdquo;
              </p>

              {/* Navigation controls */}
              <div className="mt-6 flex items-center justify-between border-t border-amber-900/10 pt-3.5 sm:mt-8 sm:pt-4">
                <div className="flex gap-1.5">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all sm:h-2.5 ${
                        idx === currentIndex
                          ? "w-6 sm:w-8 bg-[#713f12]"
                          : "w-2 sm:w-2.5 bg-amber-900/20 hover:bg-amber-900/40"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex gap-1.5 sm:gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevTestimonial}
                    className="h-8 w-8 rounded-full border-amber-900/20 hover:bg-amber-100 sm:h-9 sm:w-9"
                    aria-label="Previous review"
                  >
                    <ChevronLeft className="h-4 w-4 text-[#713f12]" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextTestimonial}
                    className="h-8 w-8 rounded-full border-amber-900/20 hover:bg-amber-100 sm:h-9 sm:w-9"
                    aria-label="Next review"
                  >
                    <ChevronRight className="h-4 w-4 text-[#713f12]" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mini Highlights Grid */}
        <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
          {[
            {
              metric: "10,000+",
              label: "Consecrated Beads Delivered Globally",
            },
            {
              metric: "4.95 / 5.0",
              label: "Average Devotee Satisfaction Rating",
            },
            { metric: "100%", label: "Lab Tested Certified Nepali Origin" },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-amber-900/10 bg-[#faf7f2] p-4 text-center sm:p-5"
            >
              <p className="text-lg font-extrabold text-[#713f12] sm:text-xl">
                {item.metric}
              </p>
              <p className="mt-1 text-[11px] text-[#5c3a1e]/70 sm:text-xs">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
