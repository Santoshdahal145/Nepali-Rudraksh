"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useProductAdminHook from "@/hooks/tanstack-hooks/useProductAdmin";
import { useDebounce } from "@/hooks/useDebounce";
import { Eye, Globe, Loader2, PackageSearch, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
    debouncedSearch
  );

  const handleDelete = (id: number, name: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${name}"? This cannot be undone.`
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

  const data = getProducts.data;
  const products = data?.products ?? [];
  const pagination = data?.pagination;

  // Client-side stock filter (the server doesn't expose a stock param on getAll)
  const filteredProducts = products.filter((product) => {
    const variants = product.productVariants ?? [];
    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

    if (categoryFilter !== "all") {
      // Simple type mapping
      if (categoryFilter === "mukhi" && product.type !== "INDIVIDUAL_RUDRAKSHA")
        return false;
      if (categoryFilter === "mala" && product.type !== "RUDRAKSHA_MALA")
        return false;
      if (
        categoryFilter !== "mukhi" &&
        categoryFilter !== "mala" &&
        categoryFilter !== "all"
      )
        return false; // collector/bracelet not in schema yet
    }

    if (stockFilter === "instock" && !(totalStock > 4)) return false;
    if (stockFilter === "low" && !(totalStock > 0 && totalStock <= 4))
      return false;
    if (stockFilter === "out" && totalStock !== 0) return false;

    return true;
  });

  // Aggregate stats from current page data
  const totalItems = pagination?.total ?? 0;
  const optimalStockCount = products.filter((p) => {
    const stock = (p.productVariants ?? []).reduce((s, v) => s + v.stock, 0);
    return stock > 4;
  }).length;
  const lowStockCount = products.filter((p) => {
    const stock = (p.productVariants ?? []).reduce((s, v) => s + v.stock, 0);
    return stock > 0 && stock <= 4;
  }).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-amber-900/10 bg-linear-to-r from-amber-100/70 via-orange-50/50 to-amber-50 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" className="text-[10px]">
              Inventory Management
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#422006]">
            All Products
          </h1>
          <p className="text-xs sm:text-sm text-[#5c3a1e]/80 mt-1 max-w-2xl">
            Track stock quantities, Mukhi grades, and pricing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/all-products/origins">
            <Button
              variant="outline"
              size="sm"
              className="h-10 gap-2 border-amber-900/15 bg-white text-xs font-bold text-[#713f12] shadow-2xs hover:bg-amber-50 hover:text-[#422006]"
            >
              <Globe className="h-4 w-4 text-amber-700" />
              Manage Origins
            </Button>
          </Link>
        </div>
      </div>

      {/* Inventory Health Pills */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-4 shadow-2xs">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Total Products
          </p>
          <p className="text-2xl font-black text-[#422006] mt-1">
            {getProducts.isLoading ? "—" : `${totalItems} Items`}
          </p>
        </Card>
        <Card className="p-4 shadow-2xs">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Optimal Stock
          </p>
          <p className="text-2xl font-black text-emerald-900 mt-1">
            {getProducts.isLoading ? "—" : `${optimalStockCount} Items`}
          </p>
        </Card>
        <Card className="p-4 shadow-2xs">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
            Low Stock Alert
          </p>
          <p className="text-2xl font-black text-amber-900 mt-1">
            {getProducts.isLoading ? "—" : `${lowStockCount} Items`}
          </p>
        </Card>
        <Card className="p-4 shadow-2xs">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Showing
          </p>
          <p className="text-2xl font-black text-[#422006] mt-1">
            {getProducts.isLoading ? "—" : `${pageSearchLimit.limit} / Page`}
          </p>
        </Card>
      </div>

      {/* Search and Category Filter */}
      <div className="flex flex-col gap-3 rounded-2xl border border-amber-900/10 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={pageSearchLimit.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-10 pl-10 text-xs sm:text-sm border-amber-900/15 focus-visible:ring-amber-700 bg-amber-50/20"
          />
        </div>

        {/* Category & Stock filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-xl border bg-white px-3 text-xs font-semibold text-[#422006] outline-none focus:border-amber-700"
          >
            <option value="all">Category: All</option>
            <option value="mukhi">Individual Rudraksha</option>
            <option value="mala">Rudraksha Mala</option>
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="h-10 rounded-xl border bg-white px-3 text-xs font-semibold text-[#422006] outline-none focus:border-amber-700"
          >
            <option value="all">Stock: All</option>
            <option value="instock">In Stock (&gt; 4)</option>
            <option value="low">Low Stock (≤ 4)</option>
            <option value="out">Out of Stock</option>
          </select>

          {/* Limit selector */}
          <select
            value={pageSearchLimit.limit}
            onChange={(e) =>
              setPageSearchLimit((prev) => ({
                ...prev,
                limit: Number(e.target.value),
                page: 1,
              }))
            }
            className="h-10 rounded-xl border bg-white px-3 text-xs font-semibold text-[#422006] outline-none focus:border-amber-700"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <Card className="shadow-xs overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">
            Product Catalog
          </CardTitle>
          <CardDescription>
            {pagination
              ? `Showing ${filteredProducts.length} of ${pagination.total} products (page ${pagination.page} of ${pagination.totalPages})`
              : "Loading..."}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {/* Loading state */}
          {getProducts.isLoading && (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <Loader2 className="h-8 w-8 animate-spin text-amber-700" />
              <p className="text-sm font-semibold text-[#5c3a1e]/70">
                Loading sacred inventory…
              </p>
            </div>
          )}

          {/* Error state */}
          {getProducts.isError && (
            <div className="p-12 text-center">
              <span className="text-4xl">⚠️</span>
              <p className="mt-2 text-sm font-bold text-red-700">
                Failed to load products
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {getProducts.error instanceof Error
                  ? getProducts.error.message
                  : "An unexpected error occurred."}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => getProducts.refetch()}
                className="mt-4 border-amber-900/20 text-xs text-[#713f12]"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Empty state */}
          {!getProducts.isLoading &&
            !getProducts.isError &&
            filteredProducts.length === 0 && (
              <div className="p-12 text-center">
                <PackageSearch className="mx-auto h-10 w-10 text-amber-700/40" />
                <p className="mt-3 text-sm font-bold text-[#422006]">
                  No sacred items match your query
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try searching for another Mukhi, deity name, or resetting
                  filters.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleSearchChange("");
                    setCategoryFilter("all");
                    setStockFilter("all");
                  }}
                  className="mt-4 border-amber-900/20 text-xs text-[#713f12]"
                >
                  Reset Filters
                </Button>
              </div>
            )}

          {/* Data table */}
          {!getProducts.isLoading &&
            !getProducts.isError &&
            filteredProducts.length > 0 && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Variants</TableHead>
                      <TableHead>Price Range</TableHead>
                      <TableHead>Stock Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => {
                      const variants = product.productVariants ?? [];
                      const images = product.productImages ?? [];

                      // First product image or first variant image as thumbnail
                      const thumbUrl =
                        images[0]?.url ??
                        variants[0]?.variantImages?.[0]?.url ??
                        null;

                      const totalStock = variants.reduce(
                        (s, v) => s + v.stock,
                        0
                      );
                      const prices = variants.map((v) => v.price);
                      const minPrice = prices.length
                        ? Math.min(...prices)
                        : null;
                      const maxPrice = prices.length
                        ? Math.max(...prices)
                        : null;

                      const isLowStock = totalStock <= 4 && totalStock > 0;
                      const isOut = totalStock === 0;

                      return (
                        <TableRow key={product.id}>
                          {/* Product thumbnail + name */}
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {/* Thumbnail */}
                              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-amber-100/70 shadow-2xs">
                                {thumbUrl ? (
                                  <Image
                                    src={thumbUrl}
                                    alt={images[0]?.altText ?? product.name}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                    onError={(e) => {
                                      (
                                        e.currentTarget as HTMLImageElement
                                      ).style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <span className="text-2xl">🌿</span>
                                )}
                              </div>

                              {/* Name + type badge */}
                              <div className="min-w-0">
                                <Link
                                  href={`/admin/all-products/${product.id}`}
                                  className="font-bold text-[#422006] text-xs sm:text-sm hover:text-[#713f12] hover:underline truncate block max-w-50"
                                >
                                  {product.name}
                                </Link>
                                <span className="text-[10px] font-semibold text-amber-700/70 uppercase tracking-wide">
                                  {product.type === "INDIVIDUAL_RUDRAKSHA"
                                    ? "Individual"
                                    : "Mala"}
                                  {product.individualRudrakshaDetail
                                    ? ` · ${product.individualRudrakshaDetail.mukhi} Mukhi`
                                    : product.rudrakshaMalaDetail?.mukhi
                                      ? ` · ${product.rudrakshaMalaDetail.mukhi} Mukhi`
                                      : ""}
                                </span>
                              </div>
                            </div>
                          </TableCell>

                          {/* Variants column — small image chips */}
                          <TableCell>
                            {variants.length === 0 ? (
                              <span className="text-xs text-muted-foreground italic">
                                No variants
                              </span>
                            ) : (
                              <div className="flex flex-wrap gap-1.5 max-w-55">
                                {variants.slice(0, 4).map((variant) => {
                                  const vImg =
                                    variant.variantImages?.[0]?.url ?? null;
                                  return (
                                    <div
                                      key={variant.id}
                                      title={`SKU: ${variant.sku} · Stock: ${variant.stock}`}
                                      className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-amber-900/10 bg-amber-50 shadow-2xs"
                                    >
                                      {vImg ? (
                                        <Image
                                          src={vImg}
                                          alt={variant.sku}
                                          fill
                                          className="object-cover"
                                          sizes="40px"
                                          onError={(e) => {
                                            (
                                              e.currentTarget as HTMLImageElement
                                            ).style.display = "none";
                                          }}
                                        />
                                      ) : (
                                        <span className="text-base">🪬</span>
                                      )}
                                      {/* Stock dot */}
                                      <span
                                        className={`absolute bottom-0.5 right-0.5 h-1.5 w-1.5 rounded-full ring-1 ring-white ${
                                          variant.stock === 0
                                            ? "bg-red-500"
                                            : variant.stock <= 4
                                              ? "bg-amber-500"
                                              : "bg-emerald-500"
                                        }`}
                                      />
                                    </div>
                                  );
                                })}
                                {variants.length > 4 && (
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-900/10 bg-amber-50 text-[10px] font-black text-[#713f12]">
                                    +{variants.length - 4}
                                  </div>
                                )}
                              </div>
                            )}
                            <p className="mt-1 text-[10px] text-muted-foreground">
                              {variants.length}{" "}
                              {variants.length === 1 ? "variant" : "variants"}
                            </p>
                          </TableCell>

                          {/* Price range */}
                          <TableCell>
                            <div className="font-bold text-sm text-[#713f12]">
                              {minPrice !== null ? (
                                minPrice === maxPrice ? (
                                  `Rs. ${minPrice}`
                                ) : (
                                  `Rs. ${minPrice} – ${maxPrice}`
                                )
                              ) : (
                                <span className="text-xs text-muted-foreground italic">
                                  No price
                                </span>
                              )}
                            </div>
                          </TableCell>

                          {/* Stock Status */}
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`inline-block h-2 w-2 rounded-full ${
                                  isOut
                                    ? "bg-red-600"
                                    : isLowStock
                                      ? "bg-amber-500 animate-pulse"
                                      : "bg-emerald-600"
                                }`}
                              />
                              <span
                                className={`text-xs font-bold ${
                                  isOut
                                    ? "text-red-700"
                                    : isLowStock
                                      ? "text-amber-800"
                                      : "text-emerald-800"
                                }`}
                              >
                                {totalStock} units
                              </span>
                            </div>
                            <span className="text-[10px] text-muted-foreground">
                              {isOut
                                ? "Out of stock"
                                : isLowStock
                                  ? "Low stock alert"
                                  : "In stock"}
                            </span>
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link href={`/admin/all-products/${product.id}`}>
                                <Button
                                  variant="outline"
                                  size="xs"
                                  className="h-8 gap-1 border-amber-900/15 text-xs text-[#713f12] hover:bg-amber-100/60"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  Details
                                </Button>
                              </Link>

                              <Button
                                variant="ghost"
                                size="xs"
                                onClick={() =>
                                  handleDelete(product.id, product.name)
                                }
                                disabled={deleteProduct.isPending}
                                className="h-8 text-red-700 hover:bg-red-50 hover:text-red-900 disabled:opacity-50"
                              >
                                {deleteProduct.isPending ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="border-t border-amber-900/10 px-4">
                    <Pagination
                      page={pagination.page}
                      totalPages={pagination.totalPages}
                      hasNextPage={pagination.hasNextPage}
                      hasPrevPage={pagination.hasPrevPage}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
