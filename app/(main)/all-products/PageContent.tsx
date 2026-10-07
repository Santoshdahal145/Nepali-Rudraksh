"use client";

import { PaginationType, ProductType } from "@/app/types";
import { Pagination } from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import AllProductsMobileFilter from "./AllProductsMobileFilter";
import PublicProductCard from "./PublicProductCard";
import PublicProductSearchAndFilter from "./PublicProductSearchAndFilter";
import { AllProductsSearchParamsPublic } from "./types";

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
    <main className="min-h-screen bg-[#faf7f2] pb-20 pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#422006]">
                Authentic Himalayan Rudraksha
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[#5c3a1e]/80 max-w-2xl leading-relaxed">
                Every bead in our sacred sanctuary is 100% naturally formed,
                lab-certified, and energized according to Vedic rites at the
                holy Pashupatinath Temple in Kathmandu.
              </p>
            </div>
          </div>
        </div>

        <PublicProductSearchAndFilter
          initialSearch={searchParams.search}
          initialSortBy={searchParams.sortBy}
          initialSortOrder={searchParams.sortOrder}
          initialMukhi={searchParams.mukhi}
          totalFound={pagination.total}
          onOpenMobileFilter={() => setMobileFilterOpen(true)}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          {products.map((product) => (
            <PublicProductCard key={product.id} product={product} />
          ))}
        </div>

        {pagination.totalPages > 1 && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPrevPage}
            onPageChange={navigateToPage}
          />
        )}

        <AllProductsMobileFilter
          isOpen={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
        />
      </div>
    </main>
  );
}
