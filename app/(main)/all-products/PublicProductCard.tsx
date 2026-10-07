import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Layers, MapPin, ShieldCheck } from "lucide-react";
import { ProductType } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PublicProductCardProps {
  product: ProductType;
}

export default function PublicProductCard({ product }: PublicProductCardProps) {
  // Determine primary image
  const primaryImage =
    product.productImages?.[0]?.url ||
    product.productVariants?.[0]?.variantImages?.[0]?.url ||
    "https://www.shutterstock.com/image-photo/closeup-image-rudraksha-bead-elaeocarpus-260nw-2699062667.jpg";

  // Calculate price range & stock from variants
  const variants = product.productVariants || [];
  const prices = variants.map((v) => Number(v.price) || 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : null;
  const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  const isOutOfStock = variants.length > 0 && totalStock <= 0;

  // Mukhi & Type labeling
  const mukhiCount =
    product.type === "INDIVIDUAL_RUDRAKSHA"
      ? product.individualRudrakshaDetail?.mukhi
      : product.rudrakshaMalaDetail?.mukhi;

  const origin = variants.find((v) => v.origin?.name)?.origin;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-900/15 bg-white p-3.5 sm:p-4.5 lg:p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-amber-900/30 hover:shadow-xl hover:shadow-amber-950/5">
      {/* Top Section */}
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          {mukhiCount ? (
            <Badge
              variant="gold"
              className="text-[10px] sm:text-[11px] font-bold tracking-wide py-0.5 px-2"
            >
              {mukhiCount} Mukhi
            </Badge>
          ) : (
            <Badge variant="sacred" className="text-[10px] sm:text-[11px] py-0.5 px-2">
              {product.type === "INDIVIDUAL_RUDRAKSHA"
                ? "Individual Bead"
                : "Sacred Mala"}
            </Badge>
          )}

          {origin ? (
            <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold text-[#713f12]/80 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-900/10 truncate max-w-[130px]">
              <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-700 shrink-0" />
              <span className="truncate">{origin.country || origin.name}</span>
            </span>
          ) : (
            <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Lab Certified
            </span>
          )}
        </div>

        {/* Product Image Display */}
        <Link href={`/all-products/${product.slug}`} className="block">
          <div className="relative my-3 sm:my-4 aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#faf7f2] via-amber-50/40 to-orange-50/20 flex items-center justify-center">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center">
                <span className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-red-600/90 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div>
          <Link href={`/all-products/${product.slug}`}>
            <h3 className="text-sm sm:text-base font-extrabold text-[#422006] transition-colors group-hover:text-[#713f12] line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="mt-1 line-clamp-2 text-[11px] sm:text-xs leading-relaxed text-[#5c3a1e]/75">
            {product.description}
          </p>

          {/* Variants metadata preview */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-[#5c3a1e]/70">
            {variants.length > 0 && (
              <span className="inline-flex items-center gap-1 font-medium bg-amber-50/80 px-1.5 sm:px-2 py-0.5 rounded border border-amber-900/10">
                <Layers className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-700" />
                {variants.length}{" "}
                {variants.length === 1 ? "Option" : "Options"}
              </span>
            )}
            <span className="inline-flex items-center gap-1 font-medium text-emerald-800">
              <ShieldCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-emerald-700" />
              Blessed
            </span>
          </div>
        </div>
      </div>

      {/* Price & Action Button */}
      <div className="mt-4 border-t border-amber-900/10 pt-3 flex flex-col xs:flex-row xs:items-center justify-between gap-2.5">
        <div className="min-w-0">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#5c3a1e]/60 font-medium block">
            {prices.length > 1 ? "Starting From" : "Price"}
          </span>
          <div className="flex items-baseline gap-1 truncate">
            <span className="text-sm sm:text-base font-black text-[#713f12] truncate">
              {minPrice !== null ? (
                `Rs. ${minPrice.toLocaleString()}`
              ) : (
                <span className="text-xs text-muted-foreground italic">
                  Inquire
                </span>
              )}
            </span>
            {maxPrice && maxPrice > (minPrice || 0) && (
              <span className="text-[10px] text-muted-foreground hidden sm:inline">
                - Rs. {maxPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <Link href={`/all-products/${product.slug}`} className="w-full xs:w-auto shrink-0">
          <Button
            size="sm"
            className="w-full xs:w-auto h-8 sm:h-9 gap-1.5 rounded-xl bg-[#713f12] px-3 sm:px-3.5 text-xs font-bold text-white shadow-xs hover:bg-[#5c3a1e] transition-all cursor-pointer"
          >
            <span>Details</span>
            <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
