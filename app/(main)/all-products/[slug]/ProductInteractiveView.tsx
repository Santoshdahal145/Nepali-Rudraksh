"use client";

import {
  Award,
  BookOpen,
  Check,
  Copy,
  Gem,
  Layers,
  MapPin,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Loader2,
} from "lucide-react";
import useCart from "@/hooks/tanstack-hooks/useCart";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ProductType, ProductVariantType } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getVedicDetails } from "@/lib/getVedicDetails";

interface ProductInteractiveViewProps {
  product: ProductType;
}

export function ProductInteractiveView({
  product,
}: ProductInteractiveViewProps) {
  const { addToCart, isAdding } = useCart();
  const variants = useMemo(
    () => product.productVariants || [],
    [product.productVariants]
  );
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    variants[0]?.id ?? null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [copiedSku, setCopiedSku] = useState(false);

  // Active selected variant
  const activeVariant = useMemo(() => {
    return (
      variants.find((v) => v.id === selectedVariantId) || variants[0] || null
    );
  }, [variants, selectedVariantId]);

  // Aggregate images: product images + variant-specific images
  const allImages = useMemo(() => {
    const list: string[] = [];

    // Add product primary images
    if (product.productImages && product.productImages.length > 0) {
      product.productImages.forEach((img) => {
        if (img.url && !list.includes(img.url)) list.push(img.url);
      });
    }

    // Add variant images if any
    variants.forEach((v) => {
      v.variantImages?.forEach((img) => {
        if (img.url && !list.includes(img.url)) list.push(img.url);
      });
    });

    if (list.length === 0) {
      list.push(
        "https://www.shutterstock.com/image-photo/closeup-image-rudraksha-bead-elaeocarpus-260nw-2699062667.jpg"
      );
    }

    return list;
  }, [product, variants]);

  const [selectedImage, setSelectedImage] = useState<string>(allImages[0]);

  // If active variant has specific images, we can update preview
  const handleVariantSelect = (variant: ProductVariantType) => {
    setSelectedVariantId(variant.id);
    if (variant.variantImages && variant.variantImages[0]?.url) {
      setSelectedImage(variant.variantImages[0].url);
    }
  };

  const handleCopySku = (sku: string) => {
    navigator.clipboard.writeText(sku);
    setCopiedSku(true);
    toast.success(`SKU "${sku}" copied to clipboard`);
    setTimeout(() => setCopiedSku(false), 2000);
  };

  const handleAddToCart = async () => {
    if (!activeVariant) {
      toast.error("Please select a variant first.");
      return;
    }
    if (activeVariant.stock <= 0) {
      toast.error("This sacred bead is currently out of stock.");
      return;
    }
    try {
      await addToCart(activeVariant.id, quantity);
      toast.success(
        `Added ${quantity}x "${product.name}${
          activeVariant.sku ? ` (${activeVariant.sku})` : ""
        }" to your sacred cart.`
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add item to cart."
      );
    }
  };

  const mukhiNumber =
    product.type === "INDIVIDUAL_RUDRAKSHA"
      ? product.individualRudrakshaDetail?.mukhi
      : product.rudrakshaMalaDetail?.mukhi;

  const vedic = getVedicDetails(mukhiNumber);
  const isOutOfStock = activeVariant ? activeVariant.stock <= 0 : false;
  const isLowStock = activeVariant
    ? activeVariant.stock > 0 && activeVariant.stock <= 5
    : false;

  return (
    <div className="space-y-12">
      {/* Top Product Overview: Gallery (Left) & Configuration / Buy Box (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Sacred Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Display Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-amber-900/15 bg-gradient-to-br from-white via-amber-50/40 to-orange-50/20 shadow-md flex items-center justify-center">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-all duration-300"
            />

            {/* Sacred Seal Badge Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              <Badge
                variant="gold"
                className="text-[11px] shadow-xs gap-1 font-bold"
              >
                <Sparkles className="h-3 w-3 text-amber-700" />
                {mukhiNumber
                  ? `${mukhiNumber} Mukhi Blessed`
                  : "Sacred Consecrated"}
              </Badge>
              <span className="text-[10px] font-semibold text-white bg-[#422006]/85 backdrop-blur-xs px-2.5 py-0.5 rounded-full w-fit">
                Lab Tested & Verified
              </span>
            </div>

            {/* Stock indicator badge on image */}
            <div className="absolute bottom-4 left-4">
              <Badge
                variant={
                  isOutOfStock
                    ? "destructive"
                    : isLowStock
                      ? "warning"
                      : "success"
                }
                className="text-[11px] gap-1 shadow-xs"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isOutOfStock
                      ? "bg-red-500"
                      : isLowStock
                        ? "bg-amber-500 animate-pulse"
                        : "bg-emerald-500"
                  }`}
                />
                {isOutOfStock
                  ? "Out of Stock"
                  : isLowStock
                    ? `Only ${activeVariant?.stock} remaining`
                    : "In Stock & Consecrated"}
              </Badge>
            </div>
          </div>

          {/* Thumbnail Gallery Row */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {allImages.map((imgUrl, idx) => {
                const isSelected = selectedImage === imgUrl;
                return (
                  <button
                    key={`thumb-${idx}`}
                    type="button"
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-[#713f12] shadow-sm scale-105"
                        : "border-amber-900/15 opacity-70 hover:opacity-100 hover:border-amber-900/30"
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`${product.name} preview ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Consecration Trust Badge Card */}
          <div className="rounded-2xl border border-amber-900/15 bg-gradient-to-br from-amber-50/70 via-white to-amber-100/40 p-4 sm:p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-[#713f12]">
              <Award className="h-5 w-5 text-amber-700" />
              <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide">
                Temple Consecration & Authenticity Guarantee
              </h4>
            </div>
            <p className="text-xs text-[#5c3a1e]/80 leading-relaxed">
              Every Rudraksha bead from Nepali Rudraksh is purified with holy
              water from the Bagmati River and energized with personalized Beej
              Mantras by Vedic priests at Pashupatinath Temple, Kathmandu before
              dispatch.
            </p>
          </div>
        </div>

        {/* Right Column: Product Title, Pricing, Variant Selection, CTA */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header & Meta */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="sacred" className="text-[11px] font-bold">
                {product.type === "INDIVIDUAL_RUDRAKSHA"
                  ? "Individual Bead"
                  : "Sacred Mala"}
              </Badge>
              {activeVariant?.origin && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[#713f12] bg-amber-100/60 px-2.5 py-0.5 rounded-full border border-amber-900/10">
                  <MapPin className="h-3 w-3 text-amber-700" />
                  {activeVariant.origin.country || activeVariant.origin.name}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#422006]">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm font-medium text-[#713f12]/90 flex items-center gap-2">
              <span>Deity: {vedic.deity}</span>
              <span>•</span>
              <span>Planet: {vedic.planet}</span>
            </p>
          </div>

          {/* Pricing Box */}
          <div className="rounded-2xl border border-amber-900/15 bg-white p-4 sm:p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5c3a1e]/60 block">
                Vedic Offering Price
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl sm:text-4xl font-black text-[#713f12]">
                  {activeVariant?.price
                    ? `Rs. ${Number(activeVariant.price).toLocaleString()}`
                    : "Price on Inquiry"}
                </span>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Free Consecration Included
                </span>
              </div>
            </div>

            {/* SKU Badge with Copy */}
            {activeVariant?.sku && (
              <button
                type="button"
                onClick={() => handleCopySku(activeVariant.sku)}
                className="flex items-center gap-1.5 text-xs font-mono bg-amber-50 hover:bg-amber-100/70 border border-amber-900/10 px-2.5 py-1.5 rounded-xl text-[#713f12] transition-colors"
                title="Click to copy SKU"
              >
                <span>{activeVariant.sku}</span>
                {copiedSku ? (
                  <Check className="h-3.5 w-3.5 text-emerald-700" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-amber-700/60" />
                )}
              </button>
            )}
          </div>

          {/* Description Preview */}
          <p className="text-xs sm:text-sm text-[#5c3a1e]/85 leading-relaxed">
            {product.description}
          </p>

          {/* Variant Selector (Size / Bead Grade) */}
          {variants.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#422006] flex items-center gap-1.5">
                  <Ruler className="h-4 w-4 text-amber-700" />
                  Select Size / Grade Variant:
                </label>
                <span className="text-xs text-[#5c3a1e]/70">
                  {variants.length} options available
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {variants.map((variant) => {
                  const isSelected = variant.id === activeVariant?.id;
                  const sizeText = variant.individualVariantAttrs?.size
                    ? `${variant.individualVariantAttrs.size} mm`
                    : variant.malaVariantAttrs?.beadCount
                      ? `${variant.malaVariantAttrs.beadCount} Beads`
                      : variant.sku;

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => handleVariantSelect(variant)}
                      className={`relative flex flex-col justify-between rounded-xl border p-3 text-left transition-all ${
                        isSelected
                          ? "border-[#713f12] bg-amber-100/50 shadow-xs ring-1 ring-[#713f12]"
                          : "border-amber-900/15 bg-white hover:border-amber-900/30 hover:bg-amber-50/40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-extrabold text-[#422006]">
                          {sizeText}
                        </span>
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 text-[#713f12]" />
                        )}
                      </div>

                      <div className="flex items-baseline justify-between text-[11px] text-[#5c3a1e]/80">
                        <span className="font-bold text-[#713f12]">
                          Rs. {Number(variant.price).toLocaleString()}
                        </span>
                        {variant.weightGrams && (
                          <span className="text-[10px] text-stone-400">
                            {variant.weightGrams}g
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active Variant Attributes Pills */}
          {activeVariant && (
            <div className="rounded-xl border border-amber-900/10 bg-amber-50/40 p-3.5 text-xs text-[#5c3a1e] grid grid-cols-2 sm:grid-cols-3 gap-3">
              {activeVariant.individualVariantAttrs?.size && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#422006] block">
                    Bead Diameter
                  </span>
                  <span className="font-medium text-xs">
                    {activeVariant.individualVariantAttrs.size} mm
                  </span>
                </div>
              )}

              {activeVariant.weightGrams && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#422006] block">
                    Weight
                  </span>
                  <span className="font-medium text-xs">
                    {activeVariant.weightGrams} grams
                  </span>
                </div>
              )}

              {activeVariant.origin && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#422006] block">
                    Origin Provenance
                  </span>
                  <span className="font-medium text-xs">
                    {activeVariant.origin.name}, {activeVariant.origin.country}
                  </span>
                </div>
              )}

              {activeVariant.malaVariantAttrs?.beadCount && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#422006] block">
                    Bead Count
                  </span>
                  <span className="font-medium text-xs">
                    {activeVariant.malaVariantAttrs.beadCount} beads
                  </span>
                </div>
              )}

              {activeVariant.malaVariantAttrs?.material && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#422006] block">
                    Threading Material
                  </span>
                  <span className="font-medium text-xs">
                    {activeVariant.malaVariantAttrs.material}
                  </span>
                </div>
              )}

              <div>
                <span className="text-[10px] uppercase font-bold text-[#422006] block">
                  Consecration
                </span>
                <span className="font-semibold text-xs text-emerald-800">
                  Pashupatinath Temple
                </span>
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity selector */}
              <div className="flex items-center rounded-xl border border-amber-900/15 bg-white p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-[#422006] hover:bg-amber-100/60 disabled:opacity-30 transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center text-sm font-extrabold text-[#422006]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) =>
                      activeVariant
                        ? Math.min(activeVariant.stock, q + 1)
                        : q + 1
                    )
                  }
                  disabled={
                    isOutOfStock ||
                    (activeVariant ? quantity >= activeVariant.stock : false)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-[#422006] hover:bg-amber-100/60 disabled:opacity-30 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
                className="flex-1 h-12 rounded-xl bg-[#713f12] text-white hover:bg-[#5c3a1e] font-extrabold text-sm shadow-md shadow-amber-900/15 transition-all"
              >
                {isAdding ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ShoppingBag className="h-4 w-4 mr-2" />
                )}
                {isOutOfStock
                  ? "Out of Stock"
                  : isAdding
                  ? "Adding to Cart..."
                  : "Add to Sacred Cart"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Vedic Significance, Specifications & All Variants Comparison Matrix */}
      <Tabs
        defaultValue="vedic"
        className="w-full space-y-6 pt-6 border-t border-amber-900/10"
      >
        <TabsList className="grid w-full grid-cols-3 max-w-xl mx-auto sm:mx-0 h-12 rounded-xl bg-amber-100/60 p-1 border border-amber-900/15">
          <TabsTrigger
            value="vedic"
            className="rounded-lg gap-2 text-xs sm:text-sm font-bold"
          >
            <Sparkles className="h-4 w-4" />
            <span>Vedic Meaning</span>
          </TabsTrigger>
          <TabsTrigger
            value="variants"
            className="rounded-lg gap-2 text-xs sm:text-sm font-bold"
          >
            <Layers className="h-4 w-4" />
            <span>All Variants ({variants.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="guidelines"
            className="rounded-lg gap-2 text-xs sm:text-sm font-bold"
          >
            <BookOpen className="h-4 w-4" />
            <span>Ritual Guidelines</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: Vedic Meaning & Astrological Benefits */}
        <TabsContent value="vedic" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deity & Astrological Card */}
            <Card className="border-amber-900/15 shadow-xs bg-white">
              <CardHeader className="pb-3 border-b border-amber-900/10">
                <CardTitle className="text-base font-bold text-[#422006] flex items-center gap-2">
                  <Gem className="h-4 w-4 text-amber-700" />
                  Spiritual & Astrological Alignment
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3.5 text-xs text-[#5c3a1e]">
                <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
                  <span className="font-semibold text-[#422006]">
                    Presiding Deity
                  </span>
                  <span className="font-bold text-amber-900">
                    {vedic.deity}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
                  <span className="font-semibold text-[#422006]">
                    Ruling Celestial Planet
                  </span>
                  <span className="font-bold text-amber-900">
                    {vedic.planet}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
                  <span className="font-semibold text-[#422006]">
                    Chakra Energy Center
                  </span>
                  <span className="font-bold text-amber-900">
                    {vedic.chakra}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
                  <span className="font-semibold text-[#422006]">
                    Recommended Day to Wear
                  </span>
                  <span className="font-bold text-emerald-800">
                    Monday or Auspicious Shiva Ratri
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Sacred Mantra & Benefits Card */}
            <Card className="border-amber-900/15 shadow-xs bg-gradient-to-br from-white to-amber-50/40">
              <CardHeader className="pb-3 border-b border-amber-900/10">
                <CardTitle className="text-base font-bold text-[#422006] flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-700" />
                  Vedic Beej Mantra & Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="rounded-xl border border-amber-900/15 bg-amber-100/60 p-4 text-center">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                    Chant 108 Times During Japa
                  </span>
                  <p className="text-base sm:text-lg font-black text-[#422006] font-serif">
                    {vedic.mantra}
                  </p>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-[#422006] uppercase tracking-wide mb-1">
                    Divine Blessings & Protection:
                  </h5>
                  <p className="text-xs text-[#5c3a1e]/85 leading-relaxed">
                    {vedic.benefits}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: All Variants Comparison Table (Similar to admin detail view) */}
        <TabsContent value="variants" className="space-y-6">
          <Card className="border-amber-900/15 shadow-xs bg-white overflow-hidden">
            <CardHeader className="border-b border-amber-900/10 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-[#422006]">
                    Available Himalayan Beads Breakdown
                  </CardTitle>
                  <CardDescription className="text-xs text-[#5c3a1e]/70 mt-1">
                    Compare every certified variant size, weight, and inventory
                    availability.
                  </CardDescription>
                </div>
                <Badge variant="sacred" className="text-xs">
                  {variants.length} Configured
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#422006]">
                  <thead className="bg-amber-50/60 text-[#5c3a1e] font-bold uppercase tracking-wider text-[10px] border-b border-amber-900/10">
                    <tr>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3">Size / Beads</th>
                      <th className="px-4 py-3">Weight</th>
                      <th className="px-4 py-3">Origin</th>
                      <th className="px-4 py-3">Stock Status</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-900/10">
                    {variants.map((v) => {
                      const isSelected = v.id === activeVariant?.id;
                      const sizeVal = v.individualVariantAttrs?.size
                        ? `${v.individualVariantAttrs.size} mm`
                        : v.malaVariantAttrs?.beadCount
                          ? `${v.malaVariantAttrs.beadCount} beads`
                          : "—";

                      return (
                        <tr
                          key={v.id}
                          className={`transition-colors hover:bg-amber-50/40 ${
                            isSelected ? "bg-amber-100/40 font-semibold" : ""
                          }`}
                        >
                          <td className="px-4 py-3.5 font-mono text-[11px] font-bold text-[#713f12]">
                            {v.sku}
                          </td>
                          <td className="px-4 py-3.5">{sizeVal}</td>
                          <td className="px-4 py-3.5">
                            {v.weightGrams ? `${v.weightGrams}g` : "—"}
                          </td>
                          <td className="px-4 py-3.5">
                            {v.origin?.country || v.origin?.name || "Nepal"}
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`inline-flex items-center gap-1 font-bold ${
                                v.stock > 5
                                  ? "text-emerald-700"
                                  : v.stock > 0
                                    ? "text-amber-700"
                                    : "text-rose-700"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  v.stock > 5
                                    ? "bg-emerald-600"
                                    : v.stock > 0
                                      ? "bg-amber-600"
                                      : "bg-rose-600"
                                }`}
                              />
                              {v.stock > 0 ? `${v.stock} in stock` : "Sold out"}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 font-black text-sm text-[#713f12]">
                            Rs. {Number(v.price).toLocaleString()}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            {isSelected ? (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#713f12] bg-amber-200/60 px-2.5 py-1 rounded-lg">
                                <Check className="h-3 w-3" /> Selected
                              </span>
                            ) : (
                              <Button
                                size="xs"
                                variant="outline"
                                onClick={() => handleVariantSelect(v)}
                                className="h-7 rounded-lg border-amber-900/20 text-[#713f12] hover:bg-amber-50 text-[11px] font-bold"
                              >
                                Select Size
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: Ritual Guidelines & Consecration Steps */}
        <TabsContent value="guidelines" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-amber-900/15 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-2 text-[#713f12] mb-3">
                <Sparkles className="h-5 w-5" />
                <h4 className="text-sm font-bold uppercase tracking-wide">
                  Step 1: Purification
                </h4>
              </div>
              <p className="text-xs text-[#5c3a1e]/80 leading-relaxed">
                Before wearing for the first time, wash the Rudraksha with
                unboiled cow milk and pure Ganga jal. Wipe dry with a clean
                cotton or silk cloth.
              </p>
            </Card>

            <Card className="border-amber-900/15 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-2 text-[#713f12] mb-3">
                <BookOpen className="h-5 w-5" />
                <h4 className="text-sm font-bold uppercase tracking-wide">
                  Step 2: Mantra Japa
                </h4>
              </div>
              <p className="text-xs text-[#5c3a1e]/80 leading-relaxed">
                Sit facing East or North on an auspicious Monday morning. Light
                incense and chant the sacred Beej Mantra {vedic.mantra} 108
                times with devotion.
              </p>
            </Card>

            <Card className="border-amber-900/15 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-2 text-[#713f12] mb-3">
                <ShieldCheck className="h-5 w-5" />
                <h4 className="text-sm font-bold uppercase tracking-wide">
                  Step 3: Daily Care
                </h4>
              </div>
              <p className="text-xs text-[#5c3a1e]/80 leading-relaxed">
                Oil the beads occasionally with sandalwood or mustard oil to
                nourish the natural seed. Remove during cremation ceremonies or
                bathing with harsh chemical soaps.
              </p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
