import { ProductType } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers, MapPin, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: ProductType;
}

export function ProductCard({ product }: ProductCardProps) {
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
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-900/15 bg-white p-4 sm:p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-amber-900/30 hover:shadow-xl hover:shadow-amber-950/5">
      {/* Top Badges */}
      <div>
        <div className="flex items-center justify-between gap-2">
          {mukhiCount ? (
            <Badge
              variant="gold"
              className="text-[11px] font-bold tracking-wide"
            >
              {mukhiCount} Mukhi
            </Badge>
          ) : (
            <Badge variant="sacred" className="text-[11px]">
              {product.type === "INDIVIDUAL_RUDRAKSHA"
                ? "Individual Bead"
                : "Sacred Mala"}
            </Badge>
          )}

          {origin ? (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-[#713f12]/80 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-900/10">
              <MapPin className="h-3 w-3 text-amber-700" />
              {origin.country || origin.name}
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Lab Certified
            </span>
          )}
        </div>

        {/* Product Image Display */}
        <Link href={`/all-products/${product.slug}`} className="block">
          <div className="relative my-4 aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#faf7f2] via-amber-50/40 to-orange-50/20 flex items-center justify-center">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center">
                <span className="text-white text-xs font-bold uppercase tracking-wider bg-red-600/90 px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div>
          <Link href={`/all-products/${product.slug}`}>
            <h3 className="text-base font-extrabold text-[#422006] transition-colors group-hover:text-[#713f12] line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#5c3a1e]/75">
            {product.description}
          </p>

          {/* Variants metadata preview */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[#5c3a1e]/70">
            {variants.length > 0 && (
              <span className="inline-flex items-center gap-1 font-medium bg-amber-50/80 px-2 py-0.5 rounded border border-amber-900/10">
                <Layers className="h-3 w-3 text-amber-700" />
                {variants.length}{" "}
                {variants.length === 1 ? "Option" : "Sizes / Grades"}
              </span>
            )}
            <span className="inline-flex items-center gap-1 font-medium text-emerald-800">
              <ShieldCheck className="h-3 w-3 text-emerald-700" />
              Pashupatinath Blessed
            </span>
          </div>
        </div>
      </div>

      {/* Price & Action Button */}
      <div className="mt-5 border-t border-amber-900/10 pt-3.5 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#5c3a1e]/60 font-medium block">
            {prices.length > 1 ? "Starting From" : "Price"}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-black text-[#713f12]">
              {minPrice !== null ? (
                minPrice === maxPrice ? (
                  `Rs. ${minPrice.toLocaleString()}`
                ) : (
                  `Rs. ${minPrice.toLocaleString()}`
                )
              ) : (
                <span className="text-xs text-muted-foreground italic">
                  Inquire
                </span>
              )}
            </span>
            {maxPrice && maxPrice > (minPrice || 0) && (
              <span className="text-[11px] text-muted-foreground">
                - Rs. {maxPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <Link href={`/all-products/${product.slug}`}>
          <Button
            size="sm"
            className="h-9 gap-1.5 rounded-xl bg-[#713f12] px-3.5 text-xs font-bold text-white shadow-xs hover:bg-[#5c3a1e] transition-all"
          >
            <span>Details</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
