import { ProductType } from "@/app/types";
import { ArrowUpRight, Layers } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PublicProductCardProps {
  product: ProductType;
}

export default function PublicProductCard({ product }: PublicProductCardProps) {
  const primaryImage = product.productImages?.[0]?.url;
  const variants = product.productVariants ?? [];

  const prices = variants
    .map((variant) => Number(variant.price))
    .filter((price) => Number.isFinite(price) && price > 0);

  const minPrice = prices.length ? Math.min(...prices) : null;
  const maxPrice = prices.length ? Math.max(...prices) : null;

  return (
    <article className="group min-w-0">
      <Link
        href={`/all-products/${product.slug}`}
        className="relative block overflow-hidden rounded-2xl bg-[#f3eee7]"
      >
        <div className="relative aspect-square w-full">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-[#5c3a1e]/40">
              No image
            </div>
          )}
        </div>
      </Link>

      {/* Product information */}
      <div className="pt-3 sm:pt-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/all-products/${product.slug}`} className="min-w-0">
            <h3 className="truncate text-sm font-bold tracking-tight text-[#422006] transition-colors group-hover:text-[#713f12] sm:text-base">
              {product.name}
            </h3>
          </Link>

          {variants.length > 0 && (
            <span className="shrink-0 pt-0.5 text-[9px] text-[#5c3a1e]/50 sm:text-[10px]">
              {variants.length} {variants.length === 1 ? "variant" : "variants"}
            </span>
          )}
        </div>

        {/* Price + button */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-[#5c3a1e]/50">
              {maxPrice && maxPrice > (minPrice ?? 0)
                ? "Starting from"
                : "Price"}
            </p>

            {minPrice !== null ? (
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span className="text-sm font-black text-[#713f12] sm:text-base">
                  Rs. {minPrice.toLocaleString()}
                </span>

                {maxPrice !== null && maxPrice > minPrice && (
                  <span className="hidden text-[10px] text-[#5c3a1e]/45 sm:inline">
                    – Rs. {maxPrice.toLocaleString()}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs font-medium italic text-[#5c3a1e]/60">
                Price on request
              </span>
            )}
          </div>

          <Link href={`/all-products/${product.slug}`} className="shrink-0">
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#713f12] px-3 text-[10px] font-bold text-white shadow-sm transition-all hover:bg-[#5c3a1e] active:scale-[0.97] sm:h-9 sm:rounded-xl sm:px-3.5 sm:text-xs"
            >
              View
              <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </article>
  );
}
