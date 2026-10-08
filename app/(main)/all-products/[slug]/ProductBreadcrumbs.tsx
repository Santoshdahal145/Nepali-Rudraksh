"use client";

import { ProductType } from "@/app/types";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Home, Share2 } from "lucide-react";

interface ProductBreadcrumbsProps {
  product: ProductType;
  onShare: () => void;
}

export default function ProductBreadcrumbs({
  product,
  onShare,
}: ProductBreadcrumbsProps) {
  const categoryLabel =
    product.type === "RUDRAKSHA_MALA"
      ? "Sacred Japa Malas"
      : "Individual Rudrakshas";
  const categoryHref =
    product.type === "RUDRAKSHA_MALA"
      ? "/all-products?type=RUDRAKSHA_MALA"
      : "/all-products?type=INDIVIDUAL_RUDRAKSHA";

  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
      icon: <Home className="h-3.5 w-3.5" />,
    },
    {
      label: "All Products",
      href: "/all-products",
    },
    {
      label: categoryLabel,
      href: categoryHref,
    },
    {
      label: product.name,
    },
  ];

  const rightActions = (
    <>
      <button
        type="button"
        onClick={onShare}
        title="Share this sacred bead"
        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-900/15 bg-white px-2.5 py-1 text-xs font-semibold text-[#5c3a1e] shadow-2xs transition-all hover:border-amber-900/30 hover:bg-amber-50/50 hover:text-[#713f12] active:scale-95"
      >
        <Share2 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Share</span>
      </button>
    </>
  );

  return (
    <Breadcrumbs
      items={breadcrumbItems}
      rightContent={rightActions}
      className="border-b border-amber-900/10 pb-4"
    />
  );
}
