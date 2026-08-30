"use client";

import Link from "next/link";
import { TopMostHeader, NavBar, Footer } from "@/layout";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Sparkles,
  Printer,
  ArrowRight,
  ShieldCheck,
  Package,
  Clock,
  Heart,
  MapPin,
} from "lucide-react";

export default function CheckoutSuccessPage() {
  const orderId = "NR-849204";
  const orderDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col justify-between">
      {/* Global Header */}
      <header className="sticky top-0 z-50 border-b border-amber-900/10 bg-[#faf7f2]/90 backdrop-blur-md">
        <TopMostHeader />
        <NavBar />
      </header>

      {/* Main Success Container */}
      <main className="flex-1 pb-20 pt-8 sm:pt-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Main Success Card */}
          <div className="overflow-hidden rounded-3xl border border-amber-900/10 bg-white p-6 shadow-xl shadow-amber-950/5 sm:p-10 text-center">
            {/* Animated Celebration Icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-amber-100 to-orange-100 text-4xl shadow-inner">
              🕉️
            </div>

            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-green-600/20 bg-green-50 px-3.5 py-1 text-xs font-bold text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              Order Consecrated &amp; Confirmed
            </span>

            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2d1a0e]">
              Thank You for Your Sacred Order
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-[#5c3a1e]/80 max-w-lg mx-auto leading-relaxed">
              Your order <span className="font-bold text-[#713f12]">#{orderId}</span> has been received. Our temple priests at Pashupatinath will commence the Vedic purification rituals shortly.
            </p>

            {/* Stepper Timeline */}
            <div className="mt-8 rounded-2xl border border-amber-900/10 bg-[#faf7f2] p-5 sm:p-6 text-left">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#422006] mb-4">
                Consecration &amp; Fulfillment Timeline
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                {[
                  {
                    step: "1",
                    title: "Order Placed",
                    desc: orderDate,
                    status: "done",
                  },
                  {
                    step: "2",
                    title: "Pashupatinath Puja",
                    desc: "Vedic Shuddhikaran",
                    status: "active",
                  },
                  {
                    step: "3",
                    title: "Lab Certification",
                    desc: "X-Ray Report Issue",
                    status: "pending",
                  },
                  {
                    step: "4",
                    title: "Global Express",
                    desc: "3-5 Days Delivery",
                    status: "pending",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex sm:flex-col items-center sm:items-start gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        item.status === "done"
                          ? "bg-green-600 text-white"
                          : item.status === "active"
                          ? "bg-[#713f12] text-amber-200 ring-4 ring-amber-200"
                          : "bg-amber-900/10 text-[#5c3a1e]/60"
                      }`}
                    >
                      {item.status === "done" ? "✓" : item.step}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[#422006]">{item.title}</h3>
                      <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items Overview */}
            <div className="mt-6 rounded-2xl border border-amber-900/10 bg-white p-5 text-left">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#422006] border-b border-amber-900/10 pb-3">
                Items Consecrated in this Order
              </h2>

              <div className="mt-3 divide-y divide-amber-900/5">
                <div className="flex items-center justify-between py-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌙</span>
                    <div>
                      <p className="font-bold text-[#2d1a0e]">1 Mukhi Half Moon Rudraksha</p>
                      <p className="text-[11px] text-[#713f12]">Included: 925 Pure Silver Cap + Certified Lab Certificate</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#422006]">$499</span>
                </div>

                <div className="flex items-center justify-between py-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📿</span>
                    <div>
                      <p className="font-bold text-[#2d1a0e]">5 Mukhi Nepal Siddh Mala (108+1)</p>
                      <p className="text-[11px] text-[#713f12]">Included: Consecrated Vibhuti + Raw Silk Knotting</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#422006]">$149</span>
                </div>
              </div>

              <div className="mt-4 border-t border-amber-900/10 pt-3 flex justify-between text-sm font-bold text-[#422006]">
                <span>Total Paid</span>
                <span className="text-base text-[#713f12]">$648.00 (Includes Insured Shipping)</span>
              </div>
            </div>

            {/* Shipping & Support Notice */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 text-left text-xs text-[#5c3a1e]/80">
              <div className="rounded-xl border border-amber-900/10 bg-amber-50/40 p-4">
                <div className="flex items-center gap-2 font-bold text-[#422006] mb-1">
                  <MapPin className="h-4 w-4 text-[#713f12]" />
                  <span>Delivery Address</span>
                </div>
                <p>Aarav Sharma</p>
                <p>Pashupati Marga, Ward 8, Kathmandu, Nepal</p>
                <p>Tracking number will be emailed within 24 hours.</p>
              </div>

              <div className="rounded-xl border border-amber-900/10 bg-amber-50/40 p-4">
                <div className="flex items-center gap-2 font-bold text-[#422006] mb-1">
                  <ShieldCheck className="h-4 w-4 text-[#713f12]" />
                  <span>Sacred Devotee Support</span>
                </div>
                <p>Need custom astrological guidance for wearing?</p>
                <p className="font-semibold text-[#713f12] mt-1">support@nepalirudraksh.com</p>
                <p>+977 (1) 449-7800 (Pashupatinath Office)</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Link href="/all-products" className="w-full sm:w-auto">
                <Button className="h-11 w-full bg-[#713f12] text-xs sm:text-sm font-semibold text-white hover:bg-[#5c330e] sm:w-auto">
                  Continue Exploring Beads
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="h-11 w-full border-amber-900/20 text-xs sm:text-sm font-semibold text-[#713f12] hover:bg-amber-50 sm:w-auto"
                >
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
