"use client";

import React from "react";
import Image from "next/image";
import { Check, Ruler, Scale, MapPin, Sparkles, Layers, Package } from "lucide-react";
import { ProductVariantType } from "@/app/types";
import { usePrice } from "@/providers/PriceContext";

interface ProductVariantsSectionProps {
  variants: ProductVariantType[];
  selectedVariant: ProductVariantType | null;
  onSelectVariant: (variant: ProductVariantType) => void;
  productType: "INDIVIDUAL_RUDRAKSHA" | "RUDRAKSHA_MALA";
}

export default function ProductVariantsSection({
  variants,
  selectedVariant,
  onSelectVariant,
  productType,
}: ProductVariantsSectionProps) {
  const { formatPrice } = usePrice();

  if (!variants || variants.length === 0) return null;

  return (
    <section className="rounded-3xl border border-amber-900/12 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-amber-900/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#422006]">
              Available Editions & Variants
            </h2>
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-[#713f12]">
              {variants.length} {variants.length === 1 ? "Option" : "Options"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#5c3a1e]/75 mt-1">
            Choose from distinct certified specimens differing in millimeter size, natural weight, and harvesting origin.
          </p>
        </div>
      </div>

      {/* Variants Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {variants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;
          const isInStock = variant.stock > 0;
          const size = variant.individualVariantAttrs?.size;
          const beadCount = variant.malaVariantAttrs?.beadCount;
          const material = variant.malaVariantAttrs?.material;
          const weight = variant.weightGrams;
          const originName = variant.origin?.name;
          const variantImage = variant.variantImages?.[0]?.url;

          return (
            <div
              key={variant.id}
              onClick={() => isInStock && onSelectVariant(variant)}
              className={`relative flex flex-col justify-between rounded-2xl border p-4.5 transition-all cursor-pointer ${
                isSelected
                  ? "border-[#713f12] bg-[#fbf8f3] ring-2 ring-[#713f12]/20 shadow-xs"
                  : "border-amber-900/15 bg-white hover:border-amber-900/35 hover:bg-amber-50/30"
              } ${!isInStock ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {/* Selected badge overlay */}
              {isSelected && (
                <div className="absolute -top-2.5 right-4 z-10">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#713f12] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-2xs">
                    <Check className="h-3 w-3 stroke-[2.5]" />
                    Active Selection
                  </span>
                </div>
              )}

              <div className="space-y-3">
                {/* Top row: Thumbnail & Basic Info */}
                <div className="flex items-start gap-3">
                  {variantImage ? (
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-amber-900/15 bg-[#f3eee7]">
                      <Image
                        src={variantImage}
                        alt={variant.sku}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-amber-900/15 bg-amber-50 text-amber-800">
                      <Package className="h-6 w-6 stroke-[1.5]" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {size && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-100/80 px-2 py-0.5 text-xs font-bold text-[#713f12]">
                          <Ruler className="h-3 w-3" />
                          {size} mm
                        </span>
                      )}

                      {beadCount && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-100/80 px-2 py-0.5 text-xs font-bold text-[#713f12]">
                          <Sparkles className="h-3 w-3" />
                          {beadCount} Beads
                        </span>
                      )}

                      {variant.color && (
                        <span className="text-[11px] font-medium text-[#5c3a1e]/70">
                          • {variant.color}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] font-mono text-[#5c3a1e]/60 mt-1 truncate">
                      SKU: {variant.sku}
                    </p>
                  </div>
                </div>

                {/* Spec Badges Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#5c3a1e]/85 pt-1 border-t border-amber-900/8">
                  {originName && (
                    <div className="flex items-center gap-1 truncate">
                      <MapPin className="h-3 w-3 text-amber-700 shrink-0" />
                      <span className="truncate">{originName}</span>
                    </div>
                  )}

                  {weight && (
                    <div className="flex items-center gap-1">
                      <Scale className="h-3 w-3 text-amber-700 shrink-0" />
                      <span>{weight}g core</span>
                    </div>
                  )}

                  {material && (
                    <div className="flex items-center gap-1 col-span-2 truncate">
                      <Layers className="h-3 w-3 text-amber-700 shrink-0" />
                      <span className="truncate">{material}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom: Price & Select CTA */}
              <div className="mt-4 flex items-center justify-between gap-2 border-t border-amber-900/10 pt-3">
                <div>
                  <span className="text-xs font-bold text-[#713f12] sm:text-sm">
                    {variant.price > 0
                      ? formatPrice(variant.price)
                      : "Price on request"}
                  </span>
                  <div className="text-[10px] font-medium text-[#5c3a1e]/60">
                    {isInStock
                      ? `${variant.stock} in stock`
                      : "Out of stock"}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!isInStock}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isInStock) onSelectVariant(variant);
                  }}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all shadow-2xs ${
                    isSelected
                      ? "bg-[#713f12] text-white"
                      : isInStock
                      ? "bg-[#faf7f2] border border-amber-900/15 text-[#422006] hover:bg-amber-100 hover:text-[#713f12]"
                      : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                  }`}
                >
                  {isSelected
                    ? "Selected"
                    : isInStock
                    ? "Select"
                    : "Sold Out"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
