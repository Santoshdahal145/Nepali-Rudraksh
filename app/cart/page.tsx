"use client";

import { useState } from "react";
import Link from "next/link";
import { TopMostHeader, NavBar, Footer } from "@/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
  Truck,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  mukhi: string;
  price: number;
  quantity: number;
  emoji: string;
  silverCap: boolean;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "1 Mukhi Half Moon Rudraksha",
      mukhi: "1 Mukhi (Nepal Certified)",
      price: 499,
      quantity: 1,
      emoji: "🌙",
      silverCap: true,
    },
    {
      id: "2",
      name: "5 Mukhi Nepal Siddh Mala (108+1)",
      mukhi: "5 Mukhi (Hand-knotted Silk)",
      price: 149,
      quantity: 1,
      emoji: "📿",
      silverCap: false,
    },
  ]);

  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const applyCoupon = () => {
    if (couponCode.trim().toUpperCase() === "RUDRAKSHA25") {
      setDiscountApplied(true);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon. Use code 'RUDRAKSHA25' for 25% off.");
    }
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = discountApplied ? Math.round(subtotal * 0.25) : 0;
  const freeShippingThreshold = 150;
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 25;
  const total = subtotal - discountAmount + shipping;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col justify-between">
      {/* Global Header */}
      <header className="sticky top-0 z-50 border-b border-amber-900/10 bg-[#faf7f2]/90 backdrop-blur-md">
        <TopMostHeader />
        <NavBar />
      </header>

      {/* Main Cart Body */}
      <main className="flex-1 pb-20 pt-8 sm:pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="mb-6 flex items-center gap-2 text-xs font-medium text-[#5c3a1e]/70">
            <Link href="/" className="hover:text-[#713f12]">Home</Link>
            <span>/</span>
            <Link href="/all-products" className="hover:text-[#713f12]">Shop</Link>
            <span>/</span>
            <span className="text-[#713f12] font-semibold">Sacred Cart</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2d1a0e]">
            Your Sacred Shopping Cart
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#5c3a1e]/70">
            Review your blessed items before proceeding to consecrated checkout.
          </p>

          {items.length === 0 ? (
            /* Empty State */
            <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-amber-900/10 bg-white p-12 text-center shadow-xs">
              <span className="text-6xl mb-4">📿</span>
              <h2 className="text-xl font-bold text-[#422006]">Your cart is currently empty</h2>
              <p className="text-xs sm:text-sm text-[#5c3a1e]/70 mt-1 max-w-sm">
                Explore our authentic Himalayan Mukhis and energized malas to begin your spiritual journey.
              </p>
              <Link href="/all-products" className="mt-6">
                <Button className="h-11 bg-[#713f12] text-white hover:bg-[#5c330e]">
                  Explore Sacred Catalog
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Left Column: Cart Items & Free Shipping Bar (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Free Shipping Progress Card */}
                <div className="rounded-2xl border border-amber-900/10 bg-white p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#422006]">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-[#713f12]" />
                      <span>
                        {subtotal >= freeShippingThreshold
                          ? "🎉 You've unlocked Free Global Express Shipping!"
                          : `Add $${freeShippingThreshold - subtotal} more to get Free Express Shipping`}
                      </span>
                    </div>
                    <span className="text-amber-800 font-bold">{Math.round(progressToFreeShipping)}%</span>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-amber-100">
                    <div
                      className="h-full rounded-full bg-[#713f12] transition-all duration-500"
                      style={{ width: `${progressToFreeShipping}%` }}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-amber-900/10 rounded-2xl border border-amber-900/10 bg-white shadow-xs">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                    >
                      {/* Left: Product Media & Info */}
                      <div className="flex items-center gap-4">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#faf7f2] to-amber-100/50 text-3xl sm:h-24 sm:w-24 sm:text-4xl shadow-inner">
                          {item.emoji}
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-[#2d1a0e]">
                            {item.name}
                          </h3>
                          <p className="text-xs text-amber-800/80 font-medium mt-0.5">
                            {item.mukhi}
                          </p>
                          {item.silverCap && (
                            <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                              ✓ 925 Pure Silver Cap Included
                            </span>
                          )}
                          <p className="text-sm font-extrabold text-[#713f12] mt-1 sm:hidden">
                            ${item.price} each
                          </p>
                        </div>
                      </div>

                      {/* Right: Quantity Controls & Price */}
                      <div className="flex items-center justify-between sm:justify-end sm:gap-6 pt-2 sm:pt-0 border-t border-amber-900/5 sm:border-t-0">
                        {/* Quantity Buttons */}
                        <div className="flex items-center rounded-xl border border-amber-900/15 bg-white p-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#5c3a1e] hover:bg-amber-50"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-[#422006]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#5c3a1e] hover:bg-amber-50"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="text-right">
                          <p className="text-base sm:text-lg font-extrabold text-[#713f12]">
                            ${item.price * item.quantity}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-[10px] text-muted-foreground">
                              (${item.price} each)
                            </p>
                          )}
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground transition-colors hover:text-red-600"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping Link */}
                <div className="flex justify-between items-center">
                  <Link
                    href="/all-products"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#713f12] hover:underline"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Continue Exploring Beads
                  </Link>
                </div>
              </div>

              {/* Right Column: Order Summary & Coupon (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-xl shadow-amber-950/5">
                  <h2 className="text-base font-bold text-[#422006] uppercase tracking-wider border-b border-amber-900/10 pb-3">
                    Order Summary
                  </h2>

                  {/* Coupon Code Input */}
                  <div className="mt-4">
                    <label className="text-xs font-semibold text-[#5c3a1e]">
                      Promo / Blessing Code
                    </label>
                    <div className="mt-1.5 flex gap-2">
                      <Input
                        type="text"
                        placeholder="e.g. RUDRAKSHA25"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="h-10 text-xs border-amber-900/15 focus-visible:ring-amber-700"
                      />
                      <Button
                        onClick={applyCoupon}
                        variant="outline"
                        className="h-10 shrink-0 border-amber-900/20 text-xs text-[#713f12] hover:bg-amber-50"
                      >
                        Apply
                      </Button>
                    </div>
                    {discountApplied && (
                      <p className="mt-1.5 text-xs text-green-700 font-semibold flex items-center gap-1">
                        <Check className="h-3.5 w-3.5" /> 25% Mahashivratri discount applied!
                      </p>
                    )}
                    {couponError && (
                      <p className="mt-1.5 text-xs text-red-600 font-medium">
                        {couponError}
                      </p>
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="mt-6 space-y-2.5 text-xs sm:text-sm border-t border-amber-900/10 pt-4">
                    <div className="flex justify-between text-[#5c3a1e]/80">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#422006]">${subtotal}</span>
                    </div>

                    {discountApplied && (
                      <div className="flex justify-between text-green-700 font-semibold">
                        <span>Discount (25%)</span>
                        <span>-${discountAmount}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#5c3a1e]/80">
                      <span>Vedic Shuddhikaran Consecration</span>
                      <span className="font-semibold text-green-700">FREE</span>
                    </div>

                    <div className="flex justify-between text-[#5c3a1e]/80">
                      <span>Express Insured Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="font-semibold text-green-700">FREE</span>
                        ) : (
                          `$${shipping}`
                        )}
                      </span>
                    </div>

                    <div className="border-t border-amber-900/10 pt-3 flex justify-between text-base sm:text-lg font-extrabold text-[#422006]">
                      <span>Estimated Total</span>
                      <span className="text-[#713f12]">${total}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Link href="/checkout" className="mt-6 block">
                    <Button className="h-12 w-full bg-[#713f12] text-sm font-bold text-white shadow-md shadow-amber-950/20 hover:bg-[#5c330e]">
                      Proceed to Consecrated Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>

                  {/* Trust list */}
                  <div className="mt-6 space-y-2 border-t border-amber-900/10 pt-4 text-[11px] text-[#5c3a1e]/70">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-[#713f12] shrink-0" />
                      <span>Certified Nepali Origin Lab Report Included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#713f12] shrink-0" />
                      <span>Purified at Pashupatinath Temple before dispatch</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
