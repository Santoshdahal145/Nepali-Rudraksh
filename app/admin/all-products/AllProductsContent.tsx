"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Loader2, PackageSearch, Trash2 } from "lucide-react";
import { PaginationType, ProductType } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AllProductsContentProps {
  products: ProductType[];
  pagination?: PaginationType;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  onRefetch: () => void;
  onDelete: (id: number, name: string) => void;
  isDeleting: boolean;
  onPageChange: (newPage: number) => void;
  onResetFilters: () => void;
}

export default function AllProductsContent({
  products,
  pagination,
  isLoading,
  isError,
  error,
  onRefetch,
  onDelete,
  isDeleting,
  onPageChange,
  onResetFilters,
}: AllProductsContentProps) {
  return (
    <Card className="shadow-xs overflow-hidden">
      <CardHeader className="pb-3 border-b border-amber-900/5 bg-amber-50/20">
        <CardTitle className="text-base sm:text-lg text-[#422006]">
          Product Catalog
        </CardTitle>
        <CardDescription>
          {pagination
            ? `Showing ${products.length} of ${pagination.total} products (page ${pagination.page} of ${pagination.totalPages})`
            : "Loading..."}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <Loader2 className="h-8 w-8 animate-spin text-amber-700" />
            <p className="text-sm font-semibold text-[#5c3a1e]/70">
              Loading sacred inventory…
            </p>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="p-12 text-center">
            <span className="text-4xl">⚠️</span>
            <p className="mt-2 text-sm font-bold text-red-700">
              Failed to load products
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {(error as { message?: string })?.message ||
                "An unexpected error occurred."}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefetch}
              className="mt-4 border-amber-900/20 text-xs text-[#713f12]"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && products.length === 0 && (
          <div className="p-12 text-center">
            <PackageSearch className="mx-auto h-10 w-10 text-amber-700/40" />
            <p className="mt-3 text-sm font-bold text-[#422006]">
              No sacred items match your query
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Try searching for another Mukhi, deity name, or resetting filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="mt-4 border-amber-900/20 text-xs text-[#713f12]"
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Products Content */}
        {!isLoading && !isError && products.length > 0 && (
          <>
            {/* Desktop / Tablet View: Full Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-amber-900/10 bg-amber-50/40">
                    <TableHead>Product</TableHead>
                    <TableHead>Variants</TableHead>
                    <TableHead>Price Range</TableHead>
                    <TableHead>Stock Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const variants = product.productVariants ?? [];
                    const images = product.productImages ?? [];

                    const thumbUrl =
                      images[0]?.url ??
                      variants[0]?.variantImages?.[0]?.url ??
                      null;

                    const totalStock = variants.reduce(
                      (s, v) => s + v.stock,
                      0,
                    );
                    const prices = variants.map((v) => v.price);
                    const minPrice = prices.length ? Math.min(...prices) : null;
                    const maxPrice = prices.length ? Math.max(...prices) : null;

                    const isLowStock = totalStock <= 4 && totalStock > 0;
                    const isOut = totalStock === 0;

                    return (
                      <TableRow
                        key={product.id}
                        className="border-amber-900/5 hover:bg-amber-50/20 transition-colors"
                      >
                        {/* Product thumbnail + name */}
                        <TableCell>
                          <div className="flex items-center gap-3">
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

                        {/* Variants column */}
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
                                onDelete(product.id, product.name)
                              }
                              disabled={isDeleting}
                              className="h-8 text-red-700 hover:bg-red-50 hover:text-red-900 disabled:opacity-50"
                            >
                              {isDeleting ? (
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
            </div>

            {/* Mobile View: Clean Card View */}
            <div className="md:hidden divide-y divide-amber-900/10">
              {products.map((product) => {
                const variants = product.productVariants ?? [];
                const images = product.productImages ?? [];

                const thumbUrl =
                  images[0]?.url ??
                  variants[0]?.variantImages?.[0]?.url ??
                  null;

                const totalStock = variants.reduce(
                  (s, v) => s + v.stock,
                  0,
                );
                const prices = variants.map((v) => v.price);
                const minPrice = prices.length ? Math.min(...prices) : null;
                const maxPrice = prices.length ? Math.max(...prices) : null;

                const isLowStock = totalStock <= 4 && totalStock > 0;
                const isOut = totalStock === 0;

                return (
                  <div
                    key={product.id}
                    className="p-3.5 space-y-3 bg-white hover:bg-amber-50/20 transition-colors"
                  >
                    {/* Header: Thumbnail + Name + Type */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
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
                            <span className="text-xl">🌿</span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <Link
                            href={`/admin/all-products/${product.id}`}
                            className="font-bold text-[#422006] text-xs hover:text-[#713f12] truncate block"
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

                      {/* Stock badge */}
                      <Badge
                        variant={isOut ? "destructive" : isLowStock ? "warning" : "success"}
                        className="text-[10px] shrink-0"
                      >
                        {totalStock} in stock
                      </Badge>
                    </div>

                    {/* Middle: Price range & Variant count */}
                    <div className="flex items-center justify-between text-xs bg-amber-50/40 px-3 py-2 rounded-xl border border-amber-900/5">
                      <div>
                        <span className="text-[10px] text-muted-foreground block">
                          Price
                        </span>
                        <span className="font-bold text-[#713f12]">
                          {minPrice !== null ? (
                            minPrice === maxPrice ? (
                              `Rs. ${minPrice}`
                            ) : (
                              `Rs. ${minPrice} – ${maxPrice}`
                            )
                          ) : (
                            "No price"
                          )}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-muted-foreground block">
                          Variants
                        </span>
                        <span className="font-semibold text-[#422006]">
                          {variants.length} {variants.length === 1 ? "variant" : "variants"}
                        </span>
                      </div>
                    </div>

                    {/* Footer: Details & Delete buttons */}
                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-amber-900/5">
                      <Link href={`/admin/all-products/${product.id}`}>
                        <Button
                          variant="outline"
                          size="xs"
                          className="h-8 text-xs gap-1 border-amber-900/20 text-[#713f12]"
                        >
                          <Eye className="h-3 w-3" />
                          Details
                        </Button>
                      </Link>

                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => onDelete(product.id, product.name)}
                        disabled={isDeleting}
                        className="h-8 text-red-700 hover:bg-red-50 hover:text-red-900 text-xs gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="border-t border-amber-900/10 px-4 py-2 bg-white">
                <Pagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  hasNextPage={pagination.hasNextPage}
                  hasPrevPage={pagination.hasPrevPage}
                  onPageChange={onPageChange}
                />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
