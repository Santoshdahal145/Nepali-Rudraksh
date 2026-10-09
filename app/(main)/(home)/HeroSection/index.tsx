"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Mountain,
  Truck,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Compass,
  Search,
} from "lucide-react";

export default function HeroSection() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/all-products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/all-products");
    }
  };

  const handleQuickTagClick = (tag: string) => {
    router.push(`/all-products?search=${encodeURIComponent(tag)}`);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const sacredPillars = [
    {
      icon: (
        <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400 shrink-0" />
      ),
      title: "Pashupatinath Consecrated",
      mobileTitle: "Pashupatinath Blessed",
      desc: "Vedic rituals & holy Ganga jal blessings",
    },
    {
      icon: (
        <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 shrink-0" />
      ),
      title: "100% Lab Certified",
      mobileTitle: "100% Lab Certified",
      desc: "X-ray verified natural internal compartments",
    },
    {
      icon: (
        <Mountain className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-300 shrink-0" />
      ),
      title: "Harvested in Nepal",
      mobileTitle: "Origin: Nepal",
      desc: "Direct from Sankhuwasabha & Bhojpur groves",
    },
    {
      icon: (
        <Truck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400 shrink-0" />
      ),
      title: "Insured Worldwide Dispatch",
      mobileTitle: "Global Delivery",
      desc: "Sacred tamper-evident spiritual packaging",
    },
  ];

  return (
    <section className="relative min-h-[calc(100dvh-4rem)] lg:min-h-screen w-full overflow-hidden bg-stone-950 flex flex-col justify-between">
      {/* ── Background Video Container ── */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          src="/video/hero-video.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          className="h-full w-full object-cover object-center scale-105"
        />

        {/* Multi-layer Cinematic Overlays */}
        {/* Layer 1: Darkening Gradient for Text Legibility */}
        <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-stone-950/65 to-stone-950/75" />

        {/* Layer 2: Warm Amber Spiritual Tint Overlay */}
        <div className="absolute inset-0 bg-radial-[circle_at_center] from-amber-950/25 via-transparent to-stone-950/80 mix-blend-multiply" />

        {/* Layer 3: Soft Vignette */}
        <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.85)] sm:shadow-[inset_0_0_120px_rgba(0,0,0,0.85)]" />
      </div>

      {/* ── Interactive Video Controls (Top-Right) ── */}
      <div className="absolute top-3.5 right-3.5 sm:top-6 sm:right-6 z-20 flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
          className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-black/50 text-amber-200/90 backdrop-blur-md border border-amber-500/25 hover:bg-black/75 hover:text-white transition-all shadow-md active:scale-95 cursor-pointer"
        >
          {isPlaying ? (
            <Pause className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          ) : (
            <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-0.5" />
          )}
        </button>

        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-black/50 text-amber-200/90 backdrop-blur-md border border-amber-500/25 hover:bg-black/75 hover:text-white transition-all shadow-md active:scale-95 cursor-pointer"
        >
          {isMuted ? (
            <VolumeX className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          ) : (
            <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          )}
        </button>
      </div>

      {/* ── Hero Main Content ── */}
      <div className="relative z-10 mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 pt-10 sm:pt-24 md:pt-32 pb-8 sm:pb-14 text-center flex-1 flex flex-col justify-center items-center">
        {/* Main Headline */}
        <h1 className="text-[26px] xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black tracking-tight text-white max-w-4xl leading-[1.18] sm:leading-[1.12]">
          Awaken Divine Energy With Sacred{" "}
          <span className="bg-linear-to-r from-amber-200 via-amber-400 to-yellow-200 bg-clip-text text-transparent drop-shadow-[0_2px_14px_rgba(217,119,6,0.35)]">
            Nepali Rudraksha
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-3.5 sm:mt-5 md:mt-6 text-xs sm:text-base md:text-lg text-stone-300/90 max-w-2xl font-normal leading-relaxed sm:leading-relaxed">
          Harvested from sacred Himalayan slopes in Nepal, rigorously
          lab-certified for natural mukhi chambers, and sanctified with Vedic
          mantras before arriving at your shrine.
        </p>

        {/* ── Desktop Search Bar (hidden on mobile, visible on md and up) ── */}
        <div className="mt-8 sm:mt-10 hidden md:flex flex-col items-center w-full max-w-2xl">
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full flex items-center rounded-full border border-amber-400/40 bg-black/60 backdrop-blur-xl p-1.5 shadow-[0_0_35px_rgba(217,119,6,0.25)] transition-all focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/30"
          >
            <div className="pl-4 pr-2 text-amber-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 1–21 Mukhi, Siddh Mala, Gauri Shankar, Deity..."
              className="w-full bg-transparent py-2.5 text-sm sm:text-base text-white placeholder-stone-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="px-2 text-stone-400 hover:text-white transition-colors text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm px-6 py-3 transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Search</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Suggestion Pills */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-stone-400 font-medium">Sacred tags:</span>
            {[
              "5 Mukhi",
              "Siddh Mala",
              "Gauri Shankar",
              "14 Mukhi",
              "Ganesh Rudraksha",
            ].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleQuickTagClick(tag)}
                className="rounded-full border border-amber-400/20 bg-white/10 hover:bg-amber-500/20 px-3 py-1 text-amber-200/90 hover:text-white backdrop-blur-sm transition-all cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* ── Mobile Action Buttons (flex on mobile, hidden on desktop md+) ── */}
        <div className="mt-6 flex md:hidden flex-row items-center justify-center gap-2.5 w-full sm:w-auto">
          <Link
            href="/all-products"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2.5 rounded-full bg-linear-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-bold text-xs sm:text-base px-4 py-3 sm:px-8 sm:py-3.5 shadow-[0_0_25px_rgba(217,119,6,0.35)] transition-all duration-300 active:scale-[0.97]"
          >
            <span>Explore Beads</span>
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="/consultation"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-amber-300/35 bg-white/10 hover:bg-white/15 text-stone-100 font-semibold text-xs sm:text-base px-3.5 py-3 sm:px-7 sm:py-3.5 backdrop-blur-md transition-all duration-300 hover:border-amber-300/50 active:scale-[0.97]"
          >
            <Compass className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-300 shrink-0" />
            <span>Find Mukhi</span>
          </Link>
        </div>
      </div>

      {/* ── Sacred Trust Pillars (Bottom Glassmorphic Bar) ── */}
      <div className="relative z-10 w-full border-t border-white/10 bg-black/55 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-3 sm:py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
            {sacredPillars.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-colors hover:bg-white/5"
              >
                <div className="flex h-7 w-7 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-md sm:rounded-lg bg-white/10 border border-white/10">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-[11px] sm:text-sm font-bold text-white truncate leading-tight">
                    <span className="sm:hidden">{item.mobileTitle}</span>
                    <span className="hidden sm:inline">{item.title}</span>
                  </h2>
                  <p className="hidden sm:block text-[11px] text-stone-400 truncate mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
