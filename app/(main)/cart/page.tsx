"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Check,
  Tag,
  Loader2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useCart from "@/hooks/tanstack-hooks/useCart";
import { usePrice } from "@/providers/PriceContext";

export default function CartPage() {
  const {
    items,
    subtotal,
    totalItems,
    isLoading,
    isError,
    refetch,
    updateQuantity,
    removeItem,
    clearCart,
    isUpdating,
    isRemoving,
    isClearing,
  } = useCart();

  const { formatPrice } = usePrice();

  // Coupon / Blessing code state
  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [pendingItemId, setPendingItemId] = useState<number | null>(null);

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === "RUDRAKSHA25" || code === "SHIVA2026") {
      setDiscountApplied(true);
      setCouponError("");
    } else {
      setCouponError("Invalid code. Use 'RUDRAKSHA25' for 25% divine blessing discount.");
    }
  };

  const handleUpdateQty = async (
    variantId: number,
    currentQty: number,
    delta: number,
    cartItemId?: number
  ) => {
    const nextQty = currentQty + delta;
    setPendingItemId(variantId);
    try {
      if (nextQty <= 0) {
        await removeItem(variantId, cartItemId);
      } else {
        await updateQuantity(variantId, nextQty, cartItemId);
      }
    } finally {
      setPendingItemId(null);
    }
  };

  const handleRemove = async (variantId: number, cartItemId?: number) => {
    setPendingItemId(variantId);
    try {
      await removeItem(variantId, cartItemId);
    } finally {
      setPendingItemId(null);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to empty your sacred cart?")) {
      await clearCart();
    }
  };

  // Pricing calculations
  const discountAmount = discountApplied ? Math.round(subtotal * 0.25) : 0;
  const freeShippingThreshold = 15000; // NPR 15,000 threshold
  const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : 500;
  const totalAmount = subtotal - discountAmount + shippingFee;
  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <main className="min-h-screen bg-[#faf7f2] pb-24 pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center gap-2 text-xs font-medium text-[#5c3a1e]/70">
          <Link href="/" className="transition-colors hover:text-[#713f12]">
            Home
          </Link>
          <span>/</span>
          <Link href="/all-products" className="transition-colors hover:text-[#713f12]">
            Collection
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#713f12]">Sacred Cart</span>
        </div>

        {/* Page Title & Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-amber-900/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/70 border border-amber-900/15 px-2.5 py-0.5 rounded-full">
                <Sparkles className="h-3 w-3 text-amber-700" />
                Vedic Sanctified
              </span>
              <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                ✓ Authentic Himalayan Origin
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#422006]">
              Your Sacred Shopping Cart
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#5c3a1e]/70">
              {totalItems > 0
                ? `You have selected ${totalItems} blessed ${
                    totalItems === 1 ? "item" : "items"
                  } ready for consecration.`
                : "Review your holy beads before proceeding to consecrated checkout."}
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              disabled={isClearing}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5c3a1e]/70 hover:text-red-700 transition-colors"
            >
              {isClearing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              Empty Entire Cart
            </button>
          )}
        </div>

        {/* ── Content States ── */}
        {isLoading ? (
          /* Loading Skeleton */
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-28 rounded-2xl bg-amber-950/5 animate-pulse border border-amber-900/10"
                />
              ))}
            </div>
            <div className="lg:col-span-4">
              <div className="h-80 rounded-3xl bg-amber-950/5 animate-pulse border border-amber-900/10" />
            </div>
          </div>
        ) : isError ? (
          /* Error State */
          <div className="mt-12 rounded-3xl border border-red-200 bg-red-50/50 p-8 text-center max-w-lg mx-auto">
            <AlertCircle className="h-10 w-10 text-red-600 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-red-950">Unable to load your cart</h2>
            <p className="mt-1 text-xs text-red-800/80">
              We encountered an issue fetching your sacred cart. Please check your connection and try again.
            </p>
            <Button
              onClick={() => refetch()}
              className="mt-4 bg-[#713f12] text-xs font-semibold text-white hover:bg-[#5c330e]"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Retry Fetching
            </Button>
          </div>
        ) : items.length === 0 ? (
          /* Empty Cart State */
          <div className="mt-12 rounded-3xl border border-amber-900/10 bg-white p-10 sm:p-16 text-center shadow-lg shadow-amber-950/5 max-w-2xl mx-auto">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 border border-amber-900/15 shadow-inner">
              <ShoppingBag className="h-10 w-10 text-[#713f12]/60" />
            </div>
            <h2 className="mt-6 text-xl sm:text-2xl font-black text-[#422006]">
              Your Sacred Vessel is Empty
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#5c3a1e]/75 max-w-md mx-auto leading-relaxed">
              No consecrated Himalayan Rudraksha beads or Japa Malas have been chosen yet.
              Explore our laboratory-certified collection blessed at Pashupatinath.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/all-products">
                <Button className="h-11 bg-[#713f12] px-6 text-xs sm:text-sm font-bold text-white shadow-md shadow-amber-950/20 hover:bg-[#5c330e]">
                  Explore Sacred Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Sacred Guarantee Points */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-amber-900/10 pt-8 text-left">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-5 w-5 text-[#713f12] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#422006]">100% Nepali Origin</h4>
                  <p className="text-[11px] text-[#5c3a1e]/70">Harvested from authentic trees in Sankhuwasabha.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Sparkles className="h-5 w-5 text-[#713f12] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#422006]">Pashupatinath Blessed</h4>
                  <p className="text-[11px] text-[#5c3a1e]/70">Consecrated with Vedic mantras prior to dispatch.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-5 w-5 text-[#713f12] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#422006]">Lab Certified</h4>
                  <p className="text-[11px] text-[#5c3a1e]/70">Accompanied by verified X-Ray authentication certificate.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Active Cart with Items */
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Column: Items List (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free Shipping Progress Alert */}
              <div className="rounded-2xl border border-amber-900/10 bg-amber-50/70 p-4">
                <div className="flex items-center justify-between text-xs font-bold text-[#422006]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-[#713f12]" />
                    {isFreeShipping ? (
                      <span className="text-emerald-800">
                        You have unlocked FREE Insured Worldwide Shipping!
                      </span>
                    ) : (
                      <span>
                        Add {formatPrice(freeShippingThreshold - subtotal)} more for{" "}
                        <strong className="text-[#713f12]">FREE Insured Shipping</strong>
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] text-[#5c3a1e]/70">{shippingProgress}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-amber-900/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-600 to-[#713f12] transition-all duration-500"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="rounded-3xl border border-amber-900/10 bg-white shadow-xl shadow-amber-950/5 overflow-hidden divide-y divide-amber-900/10">
                {items.map((item) => {
                  const variant = item.variant;
                  const product = variant?.product;
                  const imageUrl =
                    variant?.variantImages?.[0]?.url ||
                    product?.productImages?.[0]?.url ||
                    "/placeholder.jpg";
                  const isItemBusy =
                    (isUpdating || isRemoving) && pendingItemId === item.variantId;

                  // Mukhi / Attributes detail string
                  const mukhiDetail =
                    product?.individualRudrakshaDetail?.mukhi
                      ? `${product.individualRudrakshaDetail.mukhi} Mukhi`
                      : product?.rudrakshaMalaDetail?.mukhi
                      ? `${product.rudrakshaMalaDetail.mukhi} Mukhi Mala`
                      : variant?.malaVariantAttrs?.beadCount
                      ? `${variant.malaVariantAttrs.beadCount} Beads`
                      : null;

                  const originName = variant?.origin?.name || "Nepali";
                  const sizeDetail = variant?.individualVariantAttrs?.size
                    ? `${variant.individualVariantAttrs.size}mm`
                    : null;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                        isItemBusy ? "opacity-60 pointer-events-none" : "hover:bg-amber-50/20"
                      }`}
                    >
                      {/* Left: Product Image & Details */}
                      <div className="flex items-center gap-4">
                        {/* Thumbnail */}
                        <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-2xl border border-amber-900/10 bg-amber-50/40">
                          {imageUrl && imageUrl !== "/placeholder.jpg" ? (
                            <Image
                              src={imageUrl}
                              alt={product?.name || "Rudraksha"}
                              fill
                              unoptimized
                              className="object-cover transition-transform duration-300 hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-2xl">
                              📿
                            </div>
                          )}
                        </div>

                        {/* Title & Attributes */}
                        <div className="space-y-1">
                          {product?.slug ? (
                            <Link
                              href={`/all-products?search=${encodeURIComponent(product.name)}`}
                              className="text-sm sm:text-base font-bold text-[#422006] hover:text-[#713f12] transition-colors line-clamp-1"
                            >
                              {product.name}
                            </Link>
                          ) : (
                            <h3 className="text-sm sm:text-base font-bold text-[#422006] line-clamp-1">
                              {product?.name || "Consecrated Rudraksha Bead"}
                            </h3>
                          )}

                          {/* Attribute Tags */}
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#5c3a1e]/80">
                            {mukhiDetail && (
                              <span className="rounded-md bg-amber-100/70 px-2 py-0.5 font-semibold text-amber-900 border border-amber-900/15">
                                {mukhiDetail}
                              </span>
                            )}
                            <span className="rounded-md bg-amber-50 px-2 py-0.5 font-medium text-[#5c3a1e] border border-amber-900/10">
                              {originName} Origin
                            </span>
                            {sizeDetail && (
                              <span className="text-muted-foreground">({sizeDetail})</span>
                            )}
                            {variant?.color && (
                              <span className="text-muted-foreground">• {variant.color}</span>
                            )}
                          </div>

                          <p className="text-xs font-bold text-[#713f12] sm:hidden pt-1">
                            {formatPrice(variant?.price || 0)} each
                          </p>

                          {/* SKU & Stock alert */}
                          {variant?.stock !== undefined && variant.stock <= 3 && (
                            <p className="text-[10px] font-semibold text-amber-800">
                              Only {variant.stock} left in sacred stock!
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Quantity Controls, Price, & Remove */}
                      <div className="flex items-center justify-between sm:justify-end sm:gap-6 pt-3 sm:pt-0 border-t border-amber-900/10 sm:border-t-0">
                        {/* Quantity Counter */}
                        <div className="flex items-center rounded-xl border border-amber-900/20 bg-amber-50/40 p-1">
                          <button
                            onClick={() =>
                              handleUpdateQty(item.variantId, item.quantity, -1, item.id)
                            }
                            disabled={isItemBusy}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#5c3a1e] hover:bg-white hover:shadow-xs transition-all disabled:opacity-50"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>

                          <span className="w-8 text-center text-xs font-bold text-[#422006]">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              handleUpdateQty(item.variantId, item.quantity, 1, item.id)
                            }
                            disabled={
                              isItemBusy ||
                              (variant?.stock !== undefined && item.quantity >= variant.stock)
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#5c3a1e] hover:bg-white hover:shadow-xs transition-all disabled:opacity-50"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Price & Subtotal */}
                        <div className="text-right">
                          <p className="text-base sm:text-lg font-black text-[#713f12]">
                            {formatPrice((variant?.price || 0) * item.quantity)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-[10px] text-[#5c3a1e]/60">
                              ({formatPrice(variant?.price || 0)} each)
                            </p>
                          )}
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleRemove(item.variantId, item.id)}
                          disabled={isItemBusy}
                          className="p-1 text-muted-foreground transition-colors hover:text-red-700 disabled:opacity-50"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Continue Shopping Link */}
              <div className="flex items-center justify-between pt-2">
                <Link
                  href="/all-products"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#713f12] hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Continue Exploring Sacred Beads
                </Link>
              </div>
            </div>

            {/* Right Column: Order Summary & Checkout (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-xl shadow-amber-950/5">
                <h2 className="text-sm font-black uppercase tracking-wider text-[#422006] border-b border-amber-900/10 pb-3">
                  Blessing & Order Summary
                </h2>

                {/* Promo / Blessing Code Form */}
                <div className="mt-4">
                  <label className="text-xs font-bold text-[#5c3a1e] flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-[#713f12]" />
                    Promo / Blessing Code
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <Input
                      type="text"
                      placeholder="e.g. RUDRAKSHA25"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="h-10 text-xs border-amber-900/20 focus-visible:ring-amber-700 uppercase"
                    />
                    <Button
                      onClick={applyCoupon}
                      variant="outline"
                      className="h-10 shrink-0 border-amber-900/20 text-xs font-bold text-[#713f12] hover:bg-amber-50"
                    >
                      Apply
                    </Button>
                  </div>
                  {discountApplied && (
                    <p className="mt-1.5 text-xs text-emerald-800 font-bold flex items-center gap-1">
                      <Check className="h-3.5 w-3.5 text-emerald-700" />
                      25% Divine Blessing discount applied!
                    </p>
                  )}
                  {couponError && (
                    <p className="mt-1.5 text-xs text-red-600 font-medium">
                      {couponError}
                    </p>
                  )}
                </div>

                {/* Pricing Breakdown */}
                <div className="mt-6 space-y-3 text-xs sm:text-sm border-t border-amber-900/10 pt-4">
                  <div className="flex justify-between text-[#5c3a1e]/80">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-bold text-[#422006]">{formatPrice(subtotal)}</span>
                  </div>

                  {discountApplied && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Blessing Discount (25%)</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#5c3a1e]/80">
                    <span className="flex items-center gap-1">
                      <span>Vedic Shuddhikaran Ritual</span>
                      <Sparkles className="h-3.5 w-3.5 text-amber-700" />
                    </span>
                    <span className="font-bold text-emerald-700">FREE</span>
                  </div>

                  <div className="flex justify-between text-[#5c3a1e]/80">
                    <span>Express Insured Worldwide Shipping</span>
                    <span>
                      {isFreeShipping ? (
                        <span className="font-bold text-emerald-700">FREE</span>
                      ) : (
                        <span className="font-bold text-[#422006]">
                          {formatPrice(shippingFee)}
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="border-t border-amber-900/10 pt-4 flex justify-between items-baseline">
                    <div>
                      <span className="text-base font-black text-[#422006]">Estimated Total</span>
                      <p className="text-[10px] text-[#5c3a1e]/60">All taxes & consecration included</p>
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-[#713f12]">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Proceed to Checkout CTA */}
                <Link href="/checkout" className="mt-6 block">
                  <Button className="h-12 w-full bg-[#713f12] text-sm font-bold text-white shadow-lg shadow-amber-950/20 hover:bg-[#5c330e] transition-all">
                    Proceed to Consecrated Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                {/* Sacred Trust Assurances */}
                <div className="mt-6 space-y-2.5 border-t border-amber-900/10 pt-4 text-[11px] text-[#5c3a1e]/75">
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
  );
}
