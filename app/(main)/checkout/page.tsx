"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TopMostHeader, NavBar, Footer } from "@/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck,
  Lock,
  Sparkles,
  CreditCard,
  Building2,
  Wallet,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "esewa" | "bank" | "cod">("card");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/checkout-success");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col justify-between">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-amber-900/10 bg-[#faf7f2]/90 backdrop-blur-md">
        <TopMostHeader />
        <NavBar />
      </header>

      {/* Main Checkout Area */}
      <main className="flex-1 pb-20 pt-8 sm:pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-xs font-medium text-[#5c3a1e]/70">
            <Link href="/" className="hover:text-[#713f12]">Home</Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-[#713f12]">Cart</Link>
            <span>/</span>
            <span className="text-[#713f12] font-semibold">Consecrated Checkout</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2d1a0e]">
              Consecrated Checkout
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#5c3a1e]/70">
              Provide your details so our priests can personalize your Vedic blessing.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Left Form Area (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* 1. Contact Info */}
                <div className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-xs">
                  <h2 className="text-base font-bold text-[#422006] uppercase tracking-wider flex items-center gap-2 border-b border-amber-900/10 pb-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#713f12] text-xs font-bold text-white">
                      1
                    </span>
                    Contact &amp; Devotee Information
                  </h2>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-[#422006]">
                        Email Address (for order tracking &amp; certificates)
                      </label>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        required
                        defaultValue="devotee@nepalirudraksh.com"
                        className="h-10 border-amber-900/15 text-xs sm:text-sm focus-visible:ring-amber-700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#422006]">
                        First Name
                      </label>
                      <Input
                        type="text"
                        placeholder="Aarav"
                        required
                        defaultValue="Aarav"
                        className="h-10 border-amber-900/15 text-xs sm:text-sm focus-visible:ring-amber-700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#422006]">
                        Last Name
                      </label>
                      <Input
                        type="text"
                        placeholder="Sharma"
                        required
                        defaultValue="Sharma"
                        className="h-10 border-amber-900/15 text-xs sm:text-sm focus-visible:ring-amber-700"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-[#422006]">
                        Phone Number (with country code)
                      </label>
                      <Input
                        type="tel"
                        placeholder="+977 98XXXXXXXX or +1 (555) 000-0000"
                        required
                        defaultValue="+977 9801234567"
                        className="h-10 border-amber-900/15 text-xs sm:text-sm focus-visible:ring-amber-700"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Shipping Address */}
                <div className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-xs">
                  <h2 className="text-base font-bold text-[#422006] uppercase tracking-wider flex items-center gap-2 border-b border-amber-900/10 pb-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#713f12] text-xs font-bold text-white">
                      2
                    </span>
                    Shipping Destination
                  </h2>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-[#422006]">
                        Street Address / Apartment
                      </label>
                      <Input
                        type="text"
                        placeholder="123 Temple Way, Apt 4B"
                        required
                        defaultValue="Pashupati Marga, Ward 8"
                        className="h-10 border-amber-900/15 text-xs sm:text-sm focus-visible:ring-amber-700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#422006]">
                        City
                      </label>
                      <Input
                        type="text"
                        placeholder="Kathmandu"
                        required
                        defaultValue="Kathmandu"
                        className="h-10 border-amber-900/15 text-xs sm:text-sm focus-visible:ring-amber-700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#422006]">
                        State / Province / Postal Code
                      </label>
                      <Input
                        type="text"
                        placeholder="Bagmati, 44600"
                        required
                        defaultValue="Bagmati, 44600"
                        className="h-10 border-amber-900/15 text-xs sm:text-sm focus-visible:ring-amber-700"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-[#422006]">
                        Country
                      </label>
                      <select
                        defaultValue="Nepal"
                        className="h-10 w-full rounded-xl border border-amber-900/15 bg-white px-3 text-xs sm:text-sm font-medium text-[#422006] outline-none focus:border-amber-700"
                      >
                        <option value="Nepal">Nepal</option>
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Canada">Canada</option>
                        <option value="Germany">Germany</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Consecration Personalization Box */}
                <div className="rounded-3xl border border-amber-900/10 bg-gradient-to-br from-amber-50 to-orange-50/50 p-6 shadow-xs">
                  <h2 className="text-base font-bold text-[#422006] uppercase tracking-wider flex items-center gap-2 border-b border-amber-900/10 pb-3">
                    <Sparkles className="h-5 w-5 text-[#713f12]" />
                    Vedic Consecration Details (Complimentary)
                  </h2>
                  <p className="mt-2 text-xs text-[#5c3a1e]/80">
                    Our temple priests will perform a personalized Sankalpa (intention) at Pashupatinath Temple prior to shipment.
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#422006]">
                        Devotee Gotra / Clan (Optional)
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g. Kashyap, Vashistha"
                        className="h-10 border-amber-900/15 text-xs sm:text-sm bg-white focus-visible:ring-amber-700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#422006]">
                        Primary Intention
                      </label>
                      <select
                        defaultValue="peace"
                        className="h-10 w-full rounded-xl border border-amber-900/15 bg-white px-3 text-xs sm:text-sm font-medium text-[#422006] outline-none focus:border-amber-700"
                      >
                        <option value="peace">Spiritual Awakening &amp; Inner Peace</option>
                        <option value="wealth">Health, Healing &amp; Longevity</option>
                        <option value="prosperity">Career Growth &amp; Financial Prosperity</option>
                        <option value="protection">Protection from Negative Energies</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4. Payment Method */}
                <div className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-xs">
                  <h2 className="text-base font-bold text-[#422006] uppercase tracking-wider flex items-center gap-2 border-b border-amber-900/10 pb-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#713f12] text-xs font-bold text-white">
                      3
                    </span>
                    Select Payment Method
                  </h2>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {/* Credit Card */}
                    <div
                      onClick={() => setPaymentMethod("card")}
                      className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                        paymentMethod === "card"
                          ? "border-[#713f12] bg-amber-50/50 shadow-xs"
                          : "border-amber-900/10 hover:bg-[#faf7f2]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-[#713f12]" />
                          <span className="text-xs sm:text-sm font-bold text-[#422006]">
                            Credit / Debit Card
                          </span>
                        </div>
                        {paymentMethod === "card" && (
                          <CheckCircle2 className="h-4 w-4 text-[#713f12]" />
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-[#5c3a1e]/70">
                        Visa, MasterCard, Amex via 256-Bit SSL
                      </p>
                    </div>

                    {/* eSewa / Khalti */}
                    <div
                      onClick={() => setPaymentMethod("esewa")}
                      className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                        paymentMethod === "esewa"
                          ? "border-[#713f12] bg-amber-50/50 shadow-xs"
                          : "border-amber-900/10 hover:bg-[#faf7f2]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-5 w-5 text-[#713f12]" />
                          <span className="text-xs sm:text-sm font-bold text-[#422006]">
                            eSewa / Khalti
                          </span>
                        </div>
                        {paymentMethod === "esewa" && (
                          <CheckCircle2 className="h-4 w-4 text-[#713f12]" />
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-[#5c3a1e]/70">
                        Instant Nepal digital wallet transfer
                      </p>
                    </div>

                    {/* Bank Wire */}
                    <div
                      onClick={() => setPaymentMethod("bank")}
                      className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                        paymentMethod === "bank"
                          ? "border-[#713f12] bg-amber-50/50 shadow-xs"
                          : "border-amber-900/10 hover:bg-[#faf7f2]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-[#713f12]" />
                          <span className="text-xs sm:text-sm font-bold text-[#422006]">
                            SWIFT Bank Wire
                          </span>
                        </div>
                        {paymentMethod === "bank" && (
                          <CheckCircle2 className="h-4 w-4 text-[#713f12]" />
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-[#5c3a1e]/70">
                        Direct bank-to-bank transfer
                      </p>
                    </div>

                    {/* Cash on Delivery */}
                    <div
                      onClick={() => setPaymentMethod("cod")}
                      className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                        paymentMethod === "cod"
                          ? "border-[#713f12] bg-amber-50/50 shadow-xs"
                          : "border-amber-900/10 hover:bg-[#faf7f2]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">📦</span>
                          <span className="text-xs sm:text-sm font-bold text-[#422006]">
                            Cash on Delivery
                          </span>
                        </div>
                        {paymentMethod === "cod" && (
                          <CheckCircle2 className="h-4 w-4 text-[#713f12]" />
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-[#5c3a1e]/70">
                        Available for addresses inside Nepal
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Order Summary Column (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-xl shadow-amber-950/5">
                  <h2 className="text-base font-bold text-[#422006] uppercase tracking-wider border-b border-amber-900/10 pb-3">
                    Order Review
                  </h2>

                  {/* Items list */}
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <span>🌙</span>
                        <div>
                          <p className="font-bold text-[#2d1a0e]">1 Mukhi Rudraksha</p>
                          <p className="text-[11px] text-muted-foreground">Qty: 1 · Silver Capped</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#713f12]">$499</span>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <span>📿</span>
                        <div>
                          <p className="font-bold text-[#2d1a0e]">5 Mukhi Siddh Mala</p>
                          <p className="text-[11px] text-muted-foreground">Qty: 1 · 108 Beads</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#713f12]">$149</span>
                    </div>
                  </div>

                  {/* Summary Pricing */}
                  <div className="mt-6 space-y-2 border-t border-amber-900/10 pt-4 text-xs sm:text-sm">
                    <div className="flex justify-between text-[#5c3a1e]/80">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#422006]">$648</span>
                    </div>
                    <div className="flex justify-between text-[#5c3a1e]/80">
                      <span>Vedic Consecration</span>
                      <span className="font-semibold text-green-700">FREE</span>
                    </div>
                    <div className="flex justify-between text-[#5c3a1e]/80">
                      <span>Insured Express Shipping</span>
                      <span className="font-semibold text-green-700">FREE</span>
                    </div>

                    <div className="border-t border-amber-900/10 pt-3 flex justify-between text-base font-extrabold text-[#422006]">
                      <span>Total Due</span>
                      <span className="text-xl text-[#713f12]">$648</span>
                    </div>
                  </div>

                  {/* Complete Order CTA */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="mt-6 h-12 w-full bg-[#713f12] text-sm font-bold text-white shadow-md shadow-amber-950/20 hover:bg-[#5c330e]"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 animate-spin" /> Consecrating &amp; Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Lock className="h-4 w-4" /> Place Sacred Order ($648)
                      </span>
                    )}
                  </Button>

                  {/* Security Note */}
                  <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-green-700" />
                    <span>256-Bit Encrypted &amp; Lab-Certified</span>
                  </div>
                </div>

                <div className="text-center">
                  <Link
                    href="/cart"
                    className="inline-flex items-center gap-1.5 text-xs text-[#713f12] hover:underline"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Return to Cart
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
