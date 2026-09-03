"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Award,
  ArrowRight,
  Heart,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-amber-900/10 bg-[#2d1a0e] text-amber-100/90 overflow-hidden">
      {/* Background Ambience / Glow */}
      <div className="pointer-events-none absolute -left-40 top-0 h-72 w-72 rounded-full bg-amber-500/5 blur-3xl sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-72 w-72 rounded-full bg-orange-500/5 blur-3xl sm:h-96 sm:w-96" />

      {/* Newsletter Bar */}
      <div className="border-b border-white/10 bg-[#3a2213]/60 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400 sm:text-xs">
                Join the Sacred Circle
              </span>
              <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                Receive Vedic Blessings &amp; Rare Bead Alerts
              </h3>
              <p className="mt-1 text-xs text-amber-200/70 sm:text-sm">
                Get notified when rare 1-21 Mukhi harvests arrive from Eastern
                Nepal.
              </p>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full max-w-md flex-col gap-2 xs:flex-row"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-10 sm:h-11 border-white/15 bg-white/10  placeholder:text-amber-200/40 focus-visible:ring-amber-400 text-xs sm:text-sm"
              />
              <Button className="h-10 sm:h-11 shrink-0 bg-amber-400 text-xs sm:text-sm font-bold text-[#422006] hover:bg-amber-300">
                Subscribe
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 sm:ml-2 sm:h-4 sm:w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-10">
          {/* Brand Col (2 cols on lg) */}
          <div className="sm:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-amber-400 text-base sm:text-lg text-[#422006] shadow-md shadow-black/20">
                🌿
              </span>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Nepali <span className="text-amber-400">Rudraksh</span>
              </span>
            </Link>

            <p className="mt-3 sm:mt-4 max-w-sm text-xs sm:text-sm leading-relaxed text-amber-200/70">
              Direct harvesters and certified purveyors of authentic Himalayan
              Rudraksha beads. Consecrated with sacred Vedic mantras at
              Pashupatinath, Nepal.
            </p>

            <div className="mt-5 sm:mt-6 flex flex-col gap-2 text-xs text-amber-200/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Pashupatinath Marga, Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                <span>blessings@nepalirudraksh.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                <span>+977 (1) 449-7800 / +977 980-1234567</span>
              </div>
            </div>
          </div>

          {/* Col 1: Collections */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
              Sacred Beads
            </h4>
            <ul className="mt-3 sm:mt-4 space-y-2 text-xs sm:text-sm text-amber-200/70">
              <li>
                <Link
                  href="/all-products"
                  className="transition-colors hover:text-amber-300"
                >
                  1 Mukhi to 21 Mukhi
                </Link>
              </li>
              <li>
                <Link
                  href="/all-products"
                  className="transition-colors hover:text-amber-300"
                >
                  Siddh Japa Malas (108)
                </Link>
              </li>
              <li>
                <Link
                  href="/all-products"
                  className="transition-colors hover:text-amber-300"
                >
                  Gauri Shankar Pairs
                </Link>
              </li>
              <li>
                <Link
                  href="/all-products"
                  className="transition-colors hover:text-amber-300"
                >
                  Ganesh &amp; Garbh Gauri
                </Link>
              </li>
              <li>
                <Link
                  href="/all-products"
                  className="transition-colors hover:text-amber-300"
                >
                  Silver &amp; Gold Capped
                </Link>
              </li>
              <li>
                <Link
                  href="/all-products"
                  className="transition-colors hover:text-amber-300"
                >
                  Rare Collector Editions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Guidance & Story */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
              Wisdom &amp; Trust
            </h4>
            <ul className="mt-3 sm:mt-4 space-y-2 text-xs sm:text-sm text-amber-200/70">
              <li>
                <Link
                  href="/#story"
                  className="transition-colors hover:text-amber-300"
                >
                  Our Sacred Heritage
                </Link>
              </li>
              <li>
                <Link
                  href="/#features"
                  className="transition-colors hover:text-amber-300"
                >
                  Lab Certification Process
                </Link>
              </li>
              <li>
                <Link
                  href="/#devotee-stories"
                  className="transition-colors hover:text-amber-300"
                >
                  Devotee Testimonials
                </Link>
              </li>
              <li>
                <Link
                  href="/#offers"
                  className="transition-colors hover:text-amber-300"
                >
                  Special Blessings Offers
                </Link>
              </li>
              <li>
                <Link
                  href="/all-products"
                  className="transition-colors hover:text-amber-300"
                >
                  Horoscope Recommendation
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Account */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
              Devotee Care
            </h4>
            <ul className="mt-3 sm:mt-4 space-y-2 text-xs sm:text-sm text-amber-200/70">
              <li>
                <Link
                  href="/login"
                  className="transition-colors hover:text-amber-300"
                >
                  Sign In to Account
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="transition-colors hover:text-amber-300"
                >
                  Create New Account
                </Link>
              </li>

              <li>
                <Link
                  href="/forgot-password"
                  className="transition-colors hover:text-amber-300"
                >
                  Forgot Password
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Badges grid on mobile & desktop */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-3 border-y border-white/10 py-5 text-xs text-amber-200/80 sm:grid-cols-2 sm:py-6 lg:grid-cols-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 shrink-0" />
            <span>100% Genuine Certified Origin</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 shrink-0" />
            <span>Vedic Shuddhikaran &amp; Blessing</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🚚 Free Global Express Shipping &gt;$150</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔒 256-Bit Encrypted Secure Checkout</span>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-6 sm:mt-8 flex flex-col items-center justify-between gap-3 text-xs text-amber-200/60 sm:flex-row text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} Nepali Rudraksh. All sacred rights
            reserved.
          </p>
          <p className="flex items-center justify-center gap-1">
            Handcrafted with devotion{" "}
            <Heart className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />{" "}
            in Kathmandu, Nepal.
          </p>
          <div className="flex gap-4 sm:gap-6">
            <Link href="/terms-and-privacy-policy" className="hover:text-white">
              Terms And Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
