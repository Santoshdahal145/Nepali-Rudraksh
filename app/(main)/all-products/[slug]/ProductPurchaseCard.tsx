"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Zap,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Minus,
  Plus,
  Loader2,
  Check,
  Ruler,
  Scale,
  MapPin,
  Package,
  Eye,
  ChevronDown,
} from "lucide-react";
import { ProductType, ProductVariantType } from "@/app/types";
import { usePrice } from "@/providers/PriceContext";
import { Button } from "@/components/ui/button";
import VariantDetailModal from "./VariantDetailModal";

interface ProductPurchaseCardProps {
  product: ProductType;
  variants: ProductVariantType[];
  selectedVariant: ProductVariantType | null;
  onSelectVariant: (variant: ProductVariantType) => void;
  quantity: number;
  onIncreaseQuantity: () => void;
  onDecreaseQuantity: () => void;
  currentPrice: number;
  isAddingToCart: boolean;
  onAddToCart: () => Promise<void>;
  onBuyNow: () => Promise<void>;
}

export default function ProductPurchaseCard({
  product,
  variants,
  selectedVariant,
  onSelectVariant,
  quantity,
  onIncreaseQuantity,
  onDecreaseQuantity,
  currentPrice,
  isAddingToCart,
  onAddToCart,
  onBuyNow,
}: ProductPurchaseCardProps) {
  const { formatPrice } = usePrice();
  const [viewedVariant, setViewedVariant] = useState<ProductVariantType | null>(
    null,
  );

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const descriptionText = product.description || "";
  const isLongDescription = descriptionText.length > 120;

  const mukhi =
    product.individualRudrakshaDetail?.mukhi ??
    product.rudrakshaMalaDetail?.mukhi;

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-amber-900/12 bg-white p-6 sm:p-8 shadow-xs">
      {/* Title & Category Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          {mukhi && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-[#713f12]">
              <Sparkles className="h-3 w-3 text-amber-700" />
              {mukhi} Mukhi
            </span>
          )}

          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#5c3a1e]/80">
            {product.type === "RUDRAKSHA_MALA"
              ? "Sacred Japa Mala"
              : "Individual Rudraksha"}
          </span>

          {selectedVariant?.sku && (
            <span className="ml-auto text-[11px] font-mono text-[#5c3a1e]/60">
              SKU: {selectedVariant.sku}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#422006] leading-tight">
          {product.name}
        </h1>

        <div>
          <p
            className={`text-xs sm:text-sm text-[#5c3a1e]/80 leading-relaxed transition-all ${
              !isDescriptionExpanded && isLongDescription ? "line-clamp-2" : ""
            }`}
          >
            {descriptionText}
          </p>

          {isLongDescription && (
            <button
              type="button"
              onClick={() => setIsDescriptionExpanded((prev) => !prev)}
              className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#713f12] hover:text-[#5c3a1e] transition-colors cursor-pointer"
            >
              <span>{isDescriptionExpanded ? "Show less" : "Show more"}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  isDescriptionExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Pricing & Stock Status */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-y border-amber-900/10 py-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5c3a1e]/60">
            Consecrated Price
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl sm:text-3xl font-black text-[#713f12]">
              {currentPrice > 0
                ? formatPrice(currentPrice)
                : "Price on request"}
            </span>
          </div>
        </div>
      </div>

      {/* Available Variants Selection Cards */}
      {variants.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#422006]">
              Select Variant / Edition
            </label>
            <span className="text-[11px] font-semibold text-[#5c3a1e]/70">
              {variants.length} {variants.length === 1 ? "Option" : "Options"}{" "}
              available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              const isVariantInStock = variant.stock > 0;
              const size = variant.individualVariantAttrs?.size;
              const beadCount = variant.malaVariantAttrs?.beadCount;
              const material = variant.malaVariantAttrs?.material;
              const weight = variant.weightGrams;

              const variantImg = variant.variantImages?.[0]?.url;

              return (
                <div
                  key={variant.id}
                  onClick={() => isVariantInStock && onSelectVariant(variant)}
                  className={`relative flex flex-col justify-between rounded-2xl border p-3.5 transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#713f12] bg-[#fbf8f3] ring-2 ring-[#713f12]/20 shadow-2xs"
                      : "border-amber-900/15 bg-[#faf7f2]/60 hover:border-amber-900/35 hover:bg-amber-50/40"
                  } ${!isVariantInStock ? "opacity-55 cursor-not-allowed" : ""}`}
                >
                  {/* Active selection badge */}
                  {isSelected && (
                    <div className="absolute -top-2 right-3 z-10">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#713f12] px-2 py-0.5 text-[9px] font-bold text-white shadow-2xs">
                        <Check className="h-2.5 w-2.5 stroke-3" />
                        Active
                      </span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-start gap-2.5">
                      {variantImg ? (
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-amber-900/15 bg-[#f3eee7]">
                          <Image
                            src={variantImg}
                            alt={variant.sku}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-900/15 bg-amber-50 text-amber-800">
                          <Package className="h-5 w-5 stroke-[1.5]" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {size && (
                            <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-100/80 px-1.5 py-0.5 text-[11px] font-bold text-[#713f12]">
                              <Ruler className="h-3 w-3" />
                              {size} mm
                            </span>
                          )}

                          {beadCount && (
                            <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-100/80 px-1.5 py-0.5 text-[11px] font-bold text-[#713f12]">
                              <Sparkles className="h-3 w-3" />
                              {beadCount} Beads
                            </span>
                          )}

                          {variant.color && (
                            <span className="text-[10px] font-medium text-[#5c3a1e]/70">
                              {variant.color}
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] font-mono text-[#5c3a1e]/60 mt-1 truncate">
                          SKU: {variant.sku}
                        </p>
                      </div>
                    </div>

                    {/* Attributes summary */}
                    <div className="flex items-center gap-2 text-[10px] text-[#5c3a1e]/80 border-t border-amber-900/8 pt-1.5 flex-wrap">
                      {weight && (
                        <span className="inline-flex items-center gap-0.5">
                          <Scale className="h-3 w-3 text-amber-700 shrink-0" />
                          {weight}g
                        </span>
                      )}
                      {material && (
                        <span className="truncate text-[#5c3a1e]/70">
                          • {material}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price, Stock info & View Modal Button */}
                  <div className="mt-2.5 flex items-center justify-between border-t border-amber-900/10 pt-2 text-xs">
                    <div>
                      <span className="font-extrabold text-[#713f12]">
                        {variant.price > 0
                          ? formatPrice(variant.price)
                          : "Price on request"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewedVariant(variant);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-amber-900/15 bg-white px-2.5 py-1 text-[11px] font-bold text-[#713f12] shadow-2xs hover:bg-amber-100 hover:text-[#5c3a1e] transition-all active:scale-95"
                    >
                      <Eye className="h-3 w-3" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Stepper & Add to Cart */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-4">
          <label className="text-xs font-bold text-[#422006]">Quantity:</label>
          <div className="flex items-center rounded-xl border border-amber-900/20 bg-[#faf7f2] p-1">
            <button
              type="button"
              onClick={onDecreaseQuantity}
              disabled={quantity <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5c3a1e] hover:bg-amber-100/60 active:scale-95 disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-10 text-center font-bold text-sm text-[#422006]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={onIncreaseQuantity}
              disabled={quantity >= 1000}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5c3a1e] hover:bg-amber-100/60 active:scale-95 disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            onClick={onAddToCart}
            disabled={isAddingToCart}
            className="flex-1 h-12 gap-2 rounded-xl bg-[#713f12] text-white hover:bg-[#5c3a1e] active:scale-[0.98] font-bold text-sm shadow-sm transition-all"
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Blessing & Adding...</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                <span>Add to Sacred Cart</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onBuyNow}
            disabled={isAddingToCart}
            className="h-12 px-6 gap-2 rounded-xl border-amber-900/25 bg-amber-50/70 text-[#713f12] hover:bg-amber-100 hover:text-[#5c3a1e] active:scale-[0.98] font-bold text-sm transition-all"
          >
            <Zap className="h-4 w-4 fill-[#713f12]" />
            <span>Buy Now</span>
          </Button>
        </div>
      </div>

      <VariantDetailModal
        variant={viewedVariant}
        fallbackImages={product.productImages}
        isOpen={Boolean(viewedVariant)}
        onClose={() => setViewedVariant(null)}
        productName={product.name}
        mukhi={mukhi}
      />
    </div>
  );
}
