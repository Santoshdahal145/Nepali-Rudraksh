"use client";

import { Boxes, Layers, Sparkles, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProductType } from "@/app/types";

interface ProductKpisProps {
  variantsCount: number;
  totalStock: number;
  minPrice: number | null;
  maxPrice: number | null;
  product: ProductType;
}

export default function ProductKpis({
  variantsCount,
  totalStock,
  minPrice,
  maxPrice,
  product,
}: ProductKpisProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
      <Card className="p-3 sm:p-4 shadow-2xs border-amber-900/10 bg-white">
        <div className="flex items-center justify-between">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">
            Total Variants
          </p>
          <Layers className="h-4 w-4 text-amber-700/60 shrink-0" />
        </div>
        <p className="text-xl sm:text-2xl font-black text-[#422006] mt-1 truncate">
          {variantsCount}{" "}
          <span className="text-[10px] sm:text-xs font-normal text-muted-foreground">
            configured
          </span>
        </p>
      </Card>

      <Card className="p-3 sm:p-4 shadow-2xs border-amber-900/10 bg-white">
        <div className="flex items-center justify-between">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-800 truncate">
            Cumulative Stock
          </p>
          <Boxes className="h-4 w-4 text-emerald-700/60 shrink-0" />
        </div>
        <p className="text-xl sm:text-2xl font-black text-emerald-950 mt-1 truncate">
          {totalStock}{" "}
          <span className="text-[10px] sm:text-xs font-normal text-muted-foreground">
            units
          </span>
        </p>
      </Card>

      <Card className="p-3 sm:p-4 shadow-2xs border-amber-900/10 bg-white">
        <div className="flex items-center justify-between">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-800 truncate">
            Price Range
          </p>
          <Tag className="h-4 w-4 text-amber-700/60 shrink-0" />
        </div>
        <p className="text-base sm:text-xl font-black text-amber-950 mt-1 truncate" title={
          minPrice !== null
            ? minPrice === maxPrice
              ? `Rs. ${minPrice.toLocaleString()}`
              : `Rs. ${minPrice.toLocaleString()} - ${maxPrice?.toLocaleString()}`
            : "No price"
        }>
          {minPrice !== null ? (
            minPrice === maxPrice ? (
              `Rs. ${minPrice.toLocaleString()}`
            ) : (
              `Rs. ${minPrice.toLocaleString()} - ${maxPrice?.toLocaleString()}`
            )
          ) : (
            <span className="text-xs font-medium text-muted-foreground italic">No price</span>
          )}
        </p>
      </Card>

      <Card className="p-3 sm:p-4 shadow-2xs border-amber-900/10 bg-white">
        <div className="flex items-center justify-between">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">
            Mukhi / Type
          </p>
          <Sparkles className="h-4 w-4 text-amber-700/60 shrink-0" />
        </div>
        <p className="text-base sm:text-xl font-black text-[#422006] mt-1 truncate">
          {product.individualRudrakshaDetail?.mukhi
            ? `${product.individualRudrakshaDetail.mukhi} Mukhi`
            : product.rudrakshaMalaDetail?.mukhi
              ? `${product.rudrakshaMalaDetail.mukhi} Mukhi Mala`
              : product.type === "INDIVIDUAL_RUDRAKSHA"
                ? "Individual"
                : "Mala"}
        </p>
      </Card>
    </div>
  );
}
