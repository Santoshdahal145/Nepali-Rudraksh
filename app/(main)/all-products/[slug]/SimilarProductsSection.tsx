import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { ProductType } from "@/app/types";
import PublicProductCard from "@/app/(main)/all-products/PublicProductCard";
import { SimilarProductsSectionProps } from "./types";

export default function SimilarProductsSection({
  products,
  title = "Similar Sacred Beads",
  subtitle = "Handpicked consecrated beads with harmonious energy and sacred mukhi resonance.",
}: SimilarProductsSectionProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="similar-products-heading"
      className="space-y-6 pt-4 sm:pt-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-amber-900/10 pb-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-700/10 px-3 py-1 text-xs font-semibold text-amber-800">
            <Sparkles className="h-3.5 w-3.5 text-amber-700" />
            <span>Sacred Recommendations</span>
          </div>
          <h2
            id="similar-products-heading"
            className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-[#422006]"
          >
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-[#5c3a1e]/75 max-w-2xl">
            {subtitle}
          </p>
        </div>

        <Link
          href="/all-products"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#713f12] hover:text-[#5c3a1e] transition-colors shrink-0 group self-start sm:self-auto"
        >
          <span>Explore all beads</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
        {products.map((product) => (
          <PublicProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
