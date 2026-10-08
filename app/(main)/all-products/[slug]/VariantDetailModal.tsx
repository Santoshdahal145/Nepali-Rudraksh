"use client";

import { ProductImageType, ProductVariantType } from "@/app/types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { usePrice } from "@/providers/PriceContext";
import {
  ChevronLeft,
  ChevronRight,
  Layers,
  MapPin,
  Package,
  Ruler,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface VariantDetailModalProps {
  variant: ProductVariantType | null;
  fallbackImages?: ProductImageType[];
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  mukhi?: number | null;
}

export default function VariantDetailModal({
  variant,
  fallbackImages = [],
  isOpen,
  onClose,
  productName,
  mukhi,
}: VariantDetailModalProps) {
  const { formatPrice } = usePrice();
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setSelectedImgIndex(0);
    }
  }, [isOpen, variant?.id]);

  if (!variant) return null;

  const variantImages = variant.variantImages ?? [];
  const images = variantImages.length > 0 ? variantImages : fallbackImages;
  const hasImages = images.length > 0;

  const safeIndex = selectedImgIndex >= images.length ? 0 : selectedImgIndex;

  const activeImg = images[safeIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();

    setSelectedImgIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();

    setSelectedImgIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const size = variant.individualVariantAttrs?.size;
  const beadCount = variant.malaVariantAttrs?.beadCount;
  const material = variant.malaVariantAttrs?.material;
  const weight = variant.weightGrams;
  const originName = variant.origin?.name;
  const originCountry = variant.origin?.country;

  const specifications = [
    size && {
      icon: Ruler,
      label: "Bead Diameter",
      value: `${size} mm`,
    },
    weight && {
      icon: Scale,
      label: "Weight",
      value: `${weight} Grams`,
    },
    originName && {
      icon: MapPin,
      label: "Origin",
      value: `${originName}${originCountry ? `, ${originCountry}` : ""}`,
    },
    beadCount && {
      icon: Sparkles,
      label: "Bead Count",
      value: `${beadCount} Sacred Beads`,
    },
    material && {
      icon: Layers,
      label: "Material",
      value: material,
    },
    variant.color && {
      icon: Sparkles,
      label: "Shade / Color",
      value: variant.color,
    },
  ].filter(Boolean) as {
    icon: React.ElementType;
    label: string;
    value: string;
  }[];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="
          w-[calc(100%-1.5rem)]
          max-w-4xl
          max-h-[90vh]
          overflow-hidden
          rounded-3xl
          border border-amber-900/15
          bg-white
          p-0
        "
      >
        <div className="grid max-h-[90vh] grid-cols-1 overflow-hidden md:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
          {/* =========================================================
              LEFT — IMAGE GALLERY
          ========================================================== */}
          <div className="bg-[#faf7f2] p-4 sm:p-5 md:p-6">
            {hasImages ? (
              <div className="flex h-full flex-col">
                {/* Main Image */}
                <div
                  className="
                    group
                    relative
                    aspect-square
                    w-full
                    overflow-hidden
                    rounded-2xl
                    border
                    border-amber-900/10
                    bg-[#f3eee7]
                  "
                >
                  <Image
                    src={activeImg.url}
                    alt={
                      activeImg.altText ||
                      `${variant.sku} view ${safeIndex + 1}`
                    }
                    fill
                    priority
                    sizes="
                      (max-width: 768px) 100vw,
                      50vw
                    "
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                  />

                  {/* Verification Badge */}
                  <div className="absolute left-3 top-3 z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/85 px-2.5 py-1 text-[10px] font-semibold text-emerald-100 shadow-sm backdrop-blur">
                      <ShieldCheck className="h-3 w-3 text-emerald-300" />
                      {variantImages.length > 0
                        ? "Variant Photo"
                        : "Product Reference"}
                    </span>
                  </div>

                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="absolute right-3 top-3 z-10">
                      <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
                        {safeIndex + 1} / {images.length}
                      </span>
                    </div>
                  )}

                  {/* Previous */}
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Previous variant image"
                      className="
                        absolute
                        left-3
                        top-1/2
                        z-10
                        flex
                        h-9
                        w-9
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-full
                        bg-black/45
                        text-white
                        backdrop-blur-sm
                        transition
                        hover:bg-black/70
                        active:scale-95
                      "
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                  )}

                  {/* Next */}
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Next variant image"
                      className="
                        absolute
                        right-3
                        top-1/2
                        z-10
                        flex
                        h-9
                        w-9
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-full
                        bg-black/45
                        text-white
                        backdrop-blur-sm
                        transition
                        hover:bg-black/70
                        active:scale-95
                      "
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {images.map((img, idx) => (
                      <button
                        key={img.id ? `${img.id}-${idx}` : idx}
                        type="button"
                        onClick={() => setSelectedImgIndex(idx)}
                        className={`
                          relative
                          h-14
                          w-14
                          shrink-0
                          overflow-hidden
                          rounded-xl
                          border-2
                          bg-[#f3eee7]
                          transition-all
                          ${
                            safeIndex === idx
                              ? "border-[#713f12] ring-2 ring-[#713f12]/15"
                              : "border-amber-900/10 opacity-60 hover:opacity-100"
                          }
                        `}
                      >
                        <Image
                          src={img.url}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex aspect-square w-full flex-col items-center justify-center rounded-2xl border border-dashed border-amber-900/15 bg-[#f3eee7] text-[#5c3a1e]/50">
                <Package className="h-10 w-10 stroke-[1.3]" />

                <span className="mt-2 text-xs font-medium">
                  Specimen cataloged by SKU
                </span>

                <span className="mt-0.5 font-mono text-[10px]">
                  {variant.sku}
                </span>
              </div>
            )}
          </div>

          {/* =========================================================
              RIGHT — PRODUCT DETAILS
          ========================================================== */}
          <div className="flex min-h-0 flex-col">
            {/* Header */}
            <div className="border-b border-amber-900/10 px-5 py-4 sm:px-6 sm:py-5">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-1.5 pr-8">
                {mukhi && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-[#713f12]">
                    <Sparkles className="h-3 w-3" />
                    {mukhi} Mukhi
                  </span>
                )}

                {size && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-900/10 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-[#5c3a1e]">
                    <Ruler className="h-3 w-3" />
                    {size} mm
                  </span>
                )}

                {beadCount && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-900/10 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-[#5c3a1e]">
                    <Sparkles className="h-3 w-3" />
                    {beadCount} Beads
                  </span>
                )}
              </div>

              <DialogTitle className="mt-2 text-xl font-black leading-tight text-[#422006] sm:text-2xl">
                {productName}
              </DialogTitle>

              <p className="mt-1 font-mono text-[10px] text-[#5c3a1e]/50">
                SKU: {variant.sku}
              </p>
            </div>

            {/* Scrollable Details */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
              {/* Price */}
              <div className="flex items-center justify-between rounded-2xl border border-amber-900/10 bg-[#faf7f2] px-4 py-3.5">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#5c3a1e]/55">
                    Consecrated Price
                  </p>

                  <p className="mt-0.5 text-xl font-black text-[#713f12]">
                    {variant.price > 0
                      ? formatPrice(variant.price)
                      : "Price on request"}
                  </p>
                </div>

                <ShieldCheck className="h-5 w-5 text-[#713f12]/40" />
              </div>

              {/* Specifications */}
              {specifications.length > 0 && (
                <div className="mt-5">
                  <div className="mb-2.5 flex items-center justify-between">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#422006]">
                      Specimen Specifications
                    </h4>

                    <span className="text-[9px] text-[#5c3a1e]/40">
                      {specifications.length} details
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-amber-900/10 bg-white">
                    {specifications.map(
                      ({ icon: Icon, label, value }, index) => (
                        <div
                          key={label}
                          className={`
                            flex
                            items-center
                            justify-between
                            gap-4
                            px-3.5
                            py-3
                            ${
                              index !== specifications.length - 1
                                ? "border-b border-amber-900/8"
                                : ""
                            }
                          `}
                        >
                          <div className="flex min-w-0 items-center gap-2.5">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                              <Icon className="h-3.5 w-3.5 text-[#713f12]" />
                            </div>

                            <span className="text-xs text-[#5c3a1e]/70">
                              {label}
                            </span>
                          </div>

                          <span className="max-w-[55%] text-right text-xs font-bold text-[#422006]">
                            {value}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Variant Information */}
              <div className="mt-5 rounded-2xl bg-[#faf7f2] p-3.5">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#713f12]" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[#422006]">
                      Authentic Specimen
                    </p>

                    <p className="mt-0.5 text-[10px] leading-relaxed text-[#5c3a1e]/60">
                      {variantImages.length > 0
                        ? "The images shown are specific to this variant."
                        : "Images are shown as a reference for this product."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
