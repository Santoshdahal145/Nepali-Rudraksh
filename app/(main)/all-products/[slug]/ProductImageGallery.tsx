"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Award,
  ShieldCheck,
  ZoomIn,
  ImageOff,
  Sparkles,
  Layers,
} from "lucide-react";
import { ProductVariantType } from "@/app/types";
import { GalleryImageItem } from "./types";

interface ProductImageGalleryProps {
  productName: string;
  mukhi?: number | null;
  selectedVariant: ProductVariantType | null;
  galleryImages: GalleryImageItem[];
  activeImage: GalleryImageItem | undefined;
  activeImageIndex: number;
  onSelectImage: (index: number) => void;
}

export default function ProductImageGallery({
  productName,
  mukhi,
  selectedVariant,
  galleryImages,
  activeImage,
  activeImageIndex,
  onSelectImage,
}: ProductImageGalleryProps) {
  const [isHovered, setIsHovered] = useState(false);

  const mainImageUrl = activeImage?.url || galleryImages[0]?.url;
  const originName = selectedVariant?.origin?.name;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Container */}
      <div
        className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-amber-900/10 bg-[#f3eee7] shadow-sm transition-all"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {mainImageUrl ? (
          <Image
            src={mainImageUrl}
            alt={activeImage?.altText || productName}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            className={`object-cover transition-transform duration-700 ease-out ${
              isHovered ? "scale-108" : "scale-100"
            }`}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#5c3a1e]/40">
            <ImageOff className="h-10 w-10 stroke-[1.5]" />
            <span className="text-xs font-medium">Sacred Imagery Pending</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 pointer-events-none">
          {/* Mukhi Badge */}
          {mukhi ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#422006]/90 backdrop-blur-xs px-3 py-1 text-xs font-bold text-amber-200 shadow-sm">
              <Award className="h-3.5 w-3.5 text-amber-400" />
              {mukhi} Mukhi
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#422006]/90 backdrop-blur-xs px-3 py-1 text-xs font-bold text-amber-200 shadow-sm">
              <Award className="h-3.5 w-3.5 text-amber-400" />
              Sacred Himalayan
            </span>
          )}

          {/* Authenticity Certificate Badge */}
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/80 backdrop-blur-xs px-2.5 py-1 text-[11px] font-semibold text-emerald-200 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            Lab Certified
          </span>
        </div>

        {/* Bottom image context tag */}
        <div className="absolute bottom-3.5 left-3.5 pointer-events-none flex items-center gap-2 flex-wrap">
          {activeImage?.isVariantImage ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-[#422006]/85 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold tracking-wide text-amber-200">
              <Sparkles className="h-3 w-3 text-amber-400" />
              {activeImage.label || "Variant Specimen"}
            </span>
          ) : originName ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-black/55 backdrop-blur-xs px-2.5 py-1 text-[10px] font-medium tracking-wide text-white/90">
              Origin: {originName}
            </span>
          ) : null}
        </div>

        {/* Hover zoom hint */}
        <div className="absolute bottom-3.5 right-3.5 pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1 rounded-lg bg-black/60 px-2.5 py-1 text-[10px] text-white/90 backdrop-blur-xs">
            <ZoomIn className="h-3 w-3" />
            Hover to magnify
          </span>
        </div>
      </div>

      {/* Thumbnails Strip */}
      {galleryImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
          {galleryImages.map((img, idx) => {
            const isActive = idx === activeImageIndex;
            return (
              <button
                key={img.id ? `${img.id}-${idx}` : idx}
                type="button"
                onClick={() => onSelectImage(idx)}
                aria-label={`View image ${idx + 1}`}
                className={`group/thumb relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                  isActive
                    ? "border-[#713f12] ring-2 ring-[#713f12]/20 shadow-sm scale-102"
                    : "border-amber-900/15 hover:border-amber-900/40 opacity-75 hover:opacity-100"
                } bg-[#f3eee7]`}
              >
                <Image
                  src={img.url}
                  alt={img.altText || `${productName} view ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />

                {/* Variant indicator on thumbnail */}
                {img.isVariantImage && (
                  <span className="absolute bottom-1 right-1 rounded-md bg-[#422006]/85 px-1 py-0.2 text-[8px] font-black text-amber-200 backdrop-blur-2xs">
                    {img.variantSize ? `${img.variantSize}mm` : "Var"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
