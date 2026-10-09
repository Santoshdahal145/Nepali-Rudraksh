"use client";

import React from "react";
import { Star, CheckCircle, Quote, ShieldCheck, Heart } from "lucide-react";

interface DevoteeReview {
  id: string;
  name: string;
  location: string;
  beadPurchased: string;
  rating: number;
  date: string;
  review: string;
  initials: string;
  avatarColor: string;
}

const reviews: DevoteeReview[] = [
  {
    id: "r1",
    name: "Dr. Rajesh Sharma",
    location: "Varanasi, India",
    beadPurchased: "14 Mukhi Devamani Rudraksha",
    rating: 5,
    date: "2 weeks ago",
    review:
      "I tested the 14 Mukhi at my local gem laboratory before wearing it. The X-ray clearly revealed all 14 internal compartments with unbroken natural lines. The vibration during my morning Sandhyavandanam meditation has been profound. Truly blessed work.",
    initials: "RS",
    avatarColor: "bg-amber-800 text-amber-100",
  },
  {
    id: "r2",
    name: "Aarati Pradhan",
    location: "Kathmandu, Nepal",
    beadPurchased: "7 Mukhi Mahalakshmi Bead",
    rating: 5,
    date: "1 month ago",
    review:
      "Having visited the Pashupatinath temple consecration myself, I can verify the sanctity and dedication of their team. Wearing this 7 Mukhi brought a tremendous sense of clarity and stability to our family business during challenging times.",
    initials: "AP",
    avatarColor: "bg-emerald-800 text-emerald-100",
  },
  {
    id: "r3",
    name: "David M. Thorne",
    location: "London, United Kingdom",
    beadPurchased: "5 Mukhi Nepal Siddh Mala (108+1)",
    rating: 5,
    date: "3 weeks ago",
    review:
      "Shipped securely to London with DHL tracking. The mala arrived smelling of sacred incense and Gangajal, accompanied by the government lab certificate. It has completely transformed my daily japa practice. The energy is undeniable.",
    initials: "DT",
    avatarColor: "bg-stone-800 text-stone-100",
  },
  {
    id: "r4",
    name: "Pooja & Sameer Verma",
    location: "Dallas, Texas, USA",
    beadPurchased: "Gauri Shankar Sacred Pair",
    rating: 5,
    date: "2 months ago",
    review:
      "We ordered the natural Gauri Shankar pair for our wedding altar after consulting with their astrologer. The bead is naturally fused without any artificial adhesives. It brings immense peace and harmony into our home. Har Har Mahadev!",
    initials: "PV",
    avatarColor: "bg-amber-900 text-amber-100",
  },
  {
    id: "r5",
    name: "Siddharth Gautam",
    location: "Singapore",
    beadPurchased: "1 Mukhi Half Moon Bead",
    rating: 5,
    date: "1 month ago",
    review:
      "Finding an authentic 1 Mukhi Himalayan bead without fake carving is rare today. Nepali Rudraksh provided the government certificate, high-resolution X-ray scans, and live video proof of consecration. Absolute master-grade authenticity.",
    initials: "SG",
    avatarColor: "bg-stone-900 text-stone-100",
  },
  {
    id: "r6",
    name: "Meenakshi Sundaram",
    location: "Chennai, India",
    beadPurchased: "11 Mukhi Hanuman Protection Bead",
    rating: 5,
    date: "2 weeks ago",
    review:
      "The free astrological consultation was eye-opening. The pandit suggested an 11 Mukhi for courage and anxiety relief. Since wearing it following the Monday vidhi, my confidence and mental stillness have grown exponentially.",
    initials: "MS",
    avatarColor: "bg-amber-700 text-amber-100",
  },
];

export default function CustomerReviewSection() {
  return (
    <section className="w-full bg-[#faf7f2] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-900/15 bg-white px-3.5 py-1 text-xs font-bold text-[#713f12] shadow-2xs">
            <Heart className="h-3.5 w-3.5 text-amber-600 fill-amber-600" />
            <span>Devotee Experiences & Blessings</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-tight text-[#422006]">
            Revered by Over 2,400+ Devotees
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-[#5c3a1e]/80 leading-relaxed">
            Read heartfelt experiences from devotees across the globe who have welcomed authentic consecrated Himalayan Rudraksha into their daily spiritual sadhana.
          </p>

          {/* Aggregate Rating Pill */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
              ))}
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#422006]">
              4.9 out of 5.0 Rating
            </span>
            <span className="text-xs text-[#5c3a1e]/60 font-medium">
              (2,420+ Verified Purchases)
            </span>
          </div>
        </div>

        {/* ── Reviews Grid (1 col mobile, 2 col tablet, 3 col desktop) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col justify-between rounded-2xl bg-white border border-amber-900/10 p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all duration-300 hover:border-amber-900/25"
            >
              <div>
                {/* Top: Stars & Date */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#5c3a1e]/50 font-medium">
                    {rev.date}
                  </span>
                </div>

                {/* Purchased Bead Tag */}
                <div className="inline-flex items-center gap-1.5 rounded-md bg-[#faf7f2] border border-amber-900/10 px-2.5 py-1 text-[11px] font-bold text-[#713f12] mb-3">
                  <ShieldCheck className="h-3 w-3 text-emerald-700" />
                  <span className="truncate">{rev.beadPurchased}</span>
                </div>

                {/* Review Quote */}
                <div className="relative">
                  <Quote className="h-5 w-5 text-amber-900/10 absolute -top-1 -left-1" />
                  <p className="text-xs sm:text-sm text-[#5c3a1e]/85 leading-relaxed relative z-10 pl-4">
                    &ldquo;{rev.review}&rdquo;
                  </p>
                </div>
              </div>

              {/* Bottom: Devotee Info */}
              <div className="mt-5 pt-4 border-t border-amber-900/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-xs shadow-2xs ${rev.avatarColor}`}
                  >
                    {rev.initials}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-[#422006] truncate">
                      {rev.name}
                    </h4>
                    <p className="text-[11px] text-[#5c3a1e]/60 truncate">
                      {rev.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-800/15 shrink-0">
                  <CheckCircle className="h-3 w-3" />
                  <span className="hidden sm:inline">Verified Devotee</span>
                  <span className="sm:hidden">Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom Trust Note ── */}
        <div className="mt-12 text-center">
          <p className="text-xs text-[#5c3a1e]/60">
            All reviews are collected from authentic consecrated bead owners. Verified with order receipts and laboratory serial tracking.
          </p>
        </div>
      </div>
    </section>
  );
}
