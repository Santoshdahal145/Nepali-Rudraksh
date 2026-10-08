import React from "react";

export default function PublicBlogsHeader() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-[#422006] leading-[1.15]">
        Sacred Vedic Wisdom &{" "}
        <span className="bg-linear-to-r from-[#713f12] via-[#92400e] to-[#b45309] bg-clip-text text-transparent">
          Articles
        </span>
      </h1>
      <p className="text-xs sm:text-sm md:text-base text-[#5c3a1e]/80 max-w-2xl leading-relaxed">
        Explore ancient Vedic scriptures, Shiva Purana references, authentic Mukhi guides, and consecrated Rudraksha practices blessed at Pashupatinath Temple.
      </p>
    </div>
  );
}
