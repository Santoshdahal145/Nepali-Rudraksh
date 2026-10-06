"use client";

import { Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductType } from "@/app/types";

interface ProductOverviewProps {
  product: ProductType;
}

export default function ProductOverview({ product }: ProductOverviewProps) {
  return (
    <Card className="border-amber-900/10 shadow-xs bg-white">
      <CardHeader className="p-4 sm:p-5 pb-3 border-b border-amber-900/10 bg-amber-50/30">
        <CardTitle className="text-sm font-bold text-[#422006] flex items-center gap-1.5">
          <Tag className="h-4 w-4 text-amber-700" />
          Product Overview & Description
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Description Section */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            Description
          </p>
          <div className="rounded-xl border border-amber-900/10 bg-amber-50/20 p-3.5 sm:p-4 text-xs sm:text-sm text-[#422006]/90 leading-relaxed whitespace-pre-line break-words">
            {product.description || (
              <span className="italic text-muted-foreground">
                No description provided for this product.
              </span>
            )}
          </div>
        </div>

        {/* Technical Specifications Grid */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Sacred Specifications
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-amber-900/10 bg-white p-3 shadow-2xs">
              <span className="text-[11px] font-semibold text-muted-foreground block">
                Product Category
              </span>
              <span className="text-xs font-bold text-[#422006] mt-0.5 block truncate">
                {product.type === "INDIVIDUAL_RUDRAKSHA"
                  ? "Individual Sacred Rudraksha"
                  : "Rudraksha Sacred Mala"}
              </span>
            </div>

            <div className="rounded-xl border border-amber-900/10 bg-white p-3 shadow-2xs">
              <span className="text-[11px] font-semibold text-muted-foreground block">
                Mukhi Grade
              </span>
              <span className="text-xs font-bold text-[#422006] mt-0.5 block truncate">
                {product.individualRudrakshaDetail?.mukhi
                  ? `${product.individualRudrakshaDetail.mukhi} Mukhi`
                  : product.rudrakshaMalaDetail?.mukhi
                    ? `${product.rudrakshaMalaDetail.mukhi} Mukhi`
                    : "Standard / Multi-Mukhi"}
              </span>
            </div>

            <div className="rounded-xl border border-amber-900/10 bg-white p-3 shadow-2xs min-w-0">
              <span className="text-[11px] font-semibold text-muted-foreground block">
                Permanent URL Slug
              </span>
              <span className="text-xs font-mono font-bold text-[#713f12] truncate mt-0.5 block">
                {product.slug}
              </span>
            </div>

            <div className="rounded-xl border border-amber-900/10 bg-white p-3 shadow-2xs">
              <span className="text-[11px] font-semibold text-muted-foreground block">
                System Identifier
              </span>
              <span className="text-xs font-mono font-bold text-[#422006] mt-0.5 block">
                ID #{product.id}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
