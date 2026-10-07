"use client";

import { PaginationType, ProductType } from "@/app/types";
import { Pagination } from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import AllProductsMobileFilter from "./AllProductsMobileFilter";
import PublicProductCard from "./PublicProductCard";
import PublicProductSearchAndFilter from "./PublicProductSearchAndFilter";
import { AllProductsSearchParamsPublic } from "./types";
import PublicAllProductsHeader from "./PublicAllProductsHeader";

interface PageContentProps {
  products: ProductType[];
  pagination: PaginationType;
  searchParams: Awaited<AllProductsSearchParamsPublic>;
}

export default function PageContent({
  products,
  pagination,
  searchParams,
}: PageContentProps) {
  const router = useRouter();

  const currentSearchParams = useSearchParams();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const navigateToPage = (newPage: number) => {
    const params = new URLSearchParams(currentSearchParams.toString());
    params.set("page", String(newPage));
    router.push(`/all-products?${params.toString()}`);
  };

  return (
    <main
      className="
    min-h-screen w-full
    bg-[#faf7f2]
    px-3.5 pb-24 pt-4
    sm:px-6 sm:pt-6
    md:pt-8
    lg:px-8
    space-y-6 sm:space-y-8
    mx-auto max-w-7xl
  "
    >
      <PublicAllProductsHeader />

      <PublicProductSearchAndFilter
        initialSearch={searchParams.search}
        initialSortBy={searchParams.sortBy}
        initialSortOrder={searchParams.sortOrder}
        initialMukhi={searchParams.mukhi}
        totalFound={pagination.total}
        onOpenMobileFilter={() => setMobileFilterOpen(true)}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
        {products.map((product) => (
          <PublicProductCard key={product.id} product={product} />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="border-t border-amber-900/10 pt-4">
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPrevPage}
            onPageChange={navigateToPage}
          />
        </div>
      )}

      <AllProductsMobileFilter
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
      />
    </main>
  );
}
