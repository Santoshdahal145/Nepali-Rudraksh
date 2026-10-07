"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PaginationType, ProductType } from "@/app/types";
import { Pagination } from "@/components/ui/pagination";
import AllProductsMobileFilter from "./AllProductsMobileFilter";
import PublicProductCard from "./PublicProductCard";
import PublicProductSearchAndFilter from "./PublicProductSearchAndFilter";
import PublicProductSidebarFilter from "./PublicProductSidebarFilter";
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
    <div className="min-h-screen w-full bg-[#faf7f2] pb-24 pt-4 sm:pt-6 md:pt-8">
      <main className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <PublicAllProductsHeader />

        {/* Top Search & Filter Bar:
            - Mobile: Search bar + Filter button side by side
            - Desktop: Search bar + Mukhis dropdown + Sort dropdown side by side
        */}
        <PublicProductSearchAndFilter
          initialSearch={searchParams.search}
          initialSortBy={searchParams.sortBy}
          initialSortOrder={searchParams.sortOrder}
          initialMukhi={searchParams.mukhi}
          totalFound={pagination.total}
          onOpenMobileFilter={() => setMobileFilterOpen(true)}
        />

        {/* Desktop Layout: Sidebar on Left, Products on Right */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Desktop Sidebar: Other filters (Categories, Price range, Certifications) */}
          <div className="hidden lg:block w-72 xl:w-80 shrink-0">
            <PublicProductSidebarFilter totalFound={pagination.total} />
          </div>

          {/* Main Products Listing Area */}
          <div className="flex-1 w-full space-y-6">
            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3.5 sm:gap-5">
              {products.map((product) => (
                <PublicProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
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
          </div>
        </div>

        {/* Mobile Filter Modal: Opens when mobile filter button is tapped */}
        <AllProductsMobileFilter
          isOpen={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
          totalFound={pagination.total}
        />
      </main>
    </div>
  );
}
