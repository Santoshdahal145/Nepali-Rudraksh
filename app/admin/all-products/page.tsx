"use client";

import { useState } from "react";
import useProductAdminHook from "@/hooks/tanstack-hooks/useProductAdmin";
import { useDebounce } from "@/hooks/useDebounce";
import TopHeaderAllProduct from "./TopHeaderAllProduct";
import SearchAndFilter from "./SearchAndFilter";
import AllProductsContent from "./AllProductsContent";

export type PageSearchLimitType = {
  page: number;
  limit: number;
  search: string;
};

export default function AdminAllProductsPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [pageSearchLimit, setPageSearchLimit] = useState<PageSearchLimitType>({
    limit: 10,
    page: 1,
    search: "",
  });

  const debouncedSearch = useDebounce(pageSearchLimit.search);

  const { getProducts, deleteProduct } = useProductAdminHook(
    pageSearchLimit.page,
    pageSearchLimit.limit,
    debouncedSearch,
  );

  const handleDelete = (id: number, name: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${name}"? This cannot be undone.`,
      )
    ) {
      deleteProduct.mutate({ id });
    }
  };

  const handlePageChange = (newPage: number) => {
    setPageSearchLimit((prev) => ({ ...prev, page: newPage }));
  };

  const handleSearchChange = (value: string) => {
    // Reset to page 1 when search changes
    setPageSearchLimit((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleResetFilters = () => {
    handleSearchChange("");
    setCategoryFilter("all");
    setStockFilter("all");
  };

  const data = getProducts.data;
  const products = data?.products ?? [];
  const pagination = data?.pagination;

  // Client-side category & stock filters
  const filteredProducts = products.filter((product) => {
    const variants = product.productVariants ?? [];
    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

    if (categoryFilter !== "all") {
      if (categoryFilter === "mukhi" && product.type !== "INDIVIDUAL_RUDRAKSHA")
        return false;
      if (categoryFilter === "mala" && product.type !== "RUDRAKSHA_MALA")
        return false;
      if (
        categoryFilter !== "mukhi" &&
        categoryFilter !== "mala" &&
        categoryFilter !== "all"
      )
        return false;
    }

    if (stockFilter === "instock" && !(totalStock > 4)) return false;
    if (stockFilter === "low" && !(totalStock > 0 && totalStock <= 4))
      return false;
    if (stockFilter === "out" && totalStock !== 0) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      <TopHeaderAllProduct />

      <SearchAndFilter
        search={pageSearchLimit.search}
        onSearchChange={handleSearchChange}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        stockFilter={stockFilter}
        onStockFilterChange={setStockFilter}
      />

      <AllProductsContent
        products={filteredProducts}
        pagination={pagination}
        isLoading={getProducts.isLoading}
        isError={getProducts.isError}
        error={getProducts.error}
        onRefetch={() => getProducts.refetch()}
        onDelete={handleDelete}
        isDeleting={deleteProduct.isPending}
        onPageChange={handlePageChange}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
}
