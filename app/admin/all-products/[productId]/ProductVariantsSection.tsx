"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Check,
  CircleDot,
  Copy,
  Edit,
  Globe,
  Plus,
  Ruler,
  Scale,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductVariantType } from "@/app/types";

interface ProductVariantsSectionProps {
  productId: number;
  variants: ProductVariantType[];
  activeImageUrl: string | null;
  variantSearch: string;
  onSearchChange: (value: string) => void;
  viewMode: "cards" | "table";
  onViewModeChange: (mode: "cards" | "table") => void;
  copiedSku: string | null;
  onCopySku: (sku: string) => void;
  onDeleteVariant: (variantId: number, sku: string) => void;
  isDeletingVariant: boolean;
}

export default function ProductVariantsSection({
  productId,
  variants,
  activeImageUrl,
  variantSearch,
  onSearchChange,
  viewMode,
  onViewModeChange,
  copiedSku,
  onCopySku,
  onDeleteVariant,
  isDeletingVariant,
}: ProductVariantsSectionProps) {
  // Filter variants by search query
  const filteredVariants = variants.filter((v) => {
    const query = variantSearch.toLowerCase().trim();
    if (!query) return true;
    const matchSku = v.sku.toLowerCase().includes(query);
    const matchOrigin =
      v.origin?.name?.toLowerCase().includes(query) ||
      v.origin?.country?.toLowerCase().includes(query);
    const matchColor = v.color?.toLowerCase().includes(query);
    return matchSku || matchOrigin || matchColor;
  });

  return (
    <div className="space-y-4 pt-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#422006]">
              Product Variants
            </h2>
            <Badge variant="gold" className="text-xs">
              {variants.length} {variants.length === 1 ? "Variant" : "Variants"}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#5c3a1e]/80 mt-0.5">
            Available sizes, weights, bead materials, origin sources, and stock
            levels.
          </p>
        </div>

        {/* Controls: Search, View Mode & Add Variant */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-56 md:w-64 min-w-[140px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Filter by SKU or Origin..."
              value={variantSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-9 w-full pl-9 text-xs border-amber-900/15 bg-white focus-visible:ring-amber-700"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Toggle */}
            <div className=" hidden sm:flex rounded-xl border border-amber-900/15 bg-white p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => onViewModeChange("cards")}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                  viewMode === "cards"
                    ? "bg-amber-100/70 text-[#713f12]"
                    : "text-muted-foreground hover:text-[#422006]"
                }`}
              >
                Cards
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("table")}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                  viewMode === "table"
                    ? "bg-amber-100/70 text-[#713f12]"
                    : "text-muted-foreground hover:text-[#422006]"
                }`}
              >
                Table
              </button>
            </div>

            {/* Add Variant Button */}
            <Link href={`/admin/all-products/${productId}/variants/new`}>
              <Button
                size="sm"
                className="h-9 gap-1.5 bg-[#713f12] text-white hover:bg-[#5c3a1e] font-bold text-xs shadow-xs shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">Add</span> Variant
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Empty States */}
      {variants.length === 0 ? (
        <Card className="border-dashed border-amber-900/20 bg-amber-50/20 p-8 sm:p-12 text-center shadow-none">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100/70 text-2xl text-[#713f12] mb-3">
            📦
          </div>
          <h3 className="text-base font-bold text-[#422006]">
            No Variants Configured Yet
          </h3>
          <p className="text-xs text-[#5c3a1e]/80 max-w-md mx-auto mt-1">
            This product exists in the catalog but has no active inventory
            variants. Create a variant with SKU, size, origin, and pricing to
            make it purchasable.
          </p>
          <div className="mt-5">
            <Link href={`/admin/all-products/${productId}/variants/new`}>
              <Button
                size="sm"
                className="bg-[#713f12] text-white hover:bg-[#5c3a1e] font-bold text-xs gap-1.5"
              >
                <Plus className="h-4 w-4" /> Add Your First Variant
              </Button>
            </Link>
          </div>
        </Card>
      ) : filteredVariants.length === 0 ? (
        <Card className="p-8 text-center border-amber-900/10 bg-white">
          <p className="text-xs font-semibold text-muted-foreground">
            No variants matching &quot;{variantSearch}&quot;
          </p>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onSearchChange("")}
            className="mt-2 text-xs text-[#713f12]"
          >
            Clear Filter
          </Button>
        </Card>
      ) : viewMode === "cards" ? (
        /* Cards View - Fully Responsive */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {filteredVariants.map((variant) => {
            const variantImg =
              variant.variantImages?.[0]?.url || activeImageUrl || null;
            const isVarOutOfStock = variant.stock === 0;
            const isVarLowStock = variant.stock > 0 && variant.stock <= 4;

            return (
              <Card
                key={variant.id}
                className="group overflow-hidden border-amber-900/15 bg-white shadow-xs transition-all hover:shadow-md hover:border-amber-900/25"
              >
                {/* Card Header with SKU & Stock status */}
                <div className="border-b border-amber-900/10 bg-linear-to-r from-amber-50/80 to-orange-50/40 p-3.5 sm:p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-mono text-xs font-black text-[#422006] tracking-wide truncate">
                        {variant.sku}
                      </span>
                      <button
                        type="button"
                        onClick={() => onCopySku(variant.sku)}
                        className="text-muted-foreground/70 hover:text-[#713f12] transition-colors p-0.5 rounded shrink-0"
                        title="Copy SKU"
                      >
                        {copiedSku === variant.sku ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>

                    <Badge
                      variant={
                        isVarOutOfStock
                          ? "destructive"
                          : isVarLowStock
                            ? "warning"
                            : "success"
                      }
                      className="text-[10px] gap-1 shrink-0"
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isVarOutOfStock
                            ? "bg-red-500"
                            : isVarLowStock
                              ? "bg-amber-500 animate-pulse"
                              : "bg-emerald-500"
                        }`}
                      />
                      {isVarOutOfStock
                        ? "Out of Stock"
                        : isVarLowStock
                          ? `${variant.stock} left`
                          : `${variant.stock} in stock`}
                    </Badge>
                  </div>

                  {/* Price banner */}
                  <div className="mt-2 flex items-baseline justify-between gap-2 flex-wrap">
                    <span className="text-lg sm:text-xl font-black text-[#713f12]">
                      Rs. {variant.price.toLocaleString()}
                    </span>
                    {variant.origin && (
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-white/90 border-amber-900/20 text-[#5c3a1e] gap-1 truncate max-w-44"
                      >
                        <Globe className="h-3 w-3 text-amber-700 shrink-0" />
                        <span className="truncate">{variant.origin.name}</span>
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Card Body with image & attributes */}
                <CardContent className="p-3.5 sm:p-4 space-y-3">
                  <div className="flex gap-3 items-start">
                    {/* Variant Thumbnail */}
                    <div className="relative h-18 w-18 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl border border-amber-900/10 bg-amber-50/60 shadow-2xs">
                      {variantImg ? (
                        <Image
                          src={variantImg}
                          alt={`Variant ${variant.sku}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                          onError={(e) => {
                            (
                              e.currentTarget as HTMLImageElement
                            ).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xl">
                          🌿
                        </div>
                      )}
                    </div>

                    {/* Attribute Pills */}
                    <div className="flex-1 space-y-1.5 min-w-0">
                      {/* Individual Attributes */}
                      {variant.individualVariantAttrs && (
                        <div className="flex items-center gap-1.5 text-xs text-[#5c3a1e]">
                          <Ruler className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                          <span className="font-semibold text-muted-foreground text-[11px]">
                            Size:
                          </span>
                          <span className="font-bold text-[#422006] truncate">
                            {variant.individualVariantAttrs.size} mm
                          </span>
                        </div>
                      )}

                      {/* Mala Attributes */}
                      {variant.malaVariantAttrs && (
                        <>
                          {variant.malaVariantAttrs.beadCount && (
                            <div className="flex items-center gap-1.5 text-xs text-[#5c3a1e]">
                              <CircleDot className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                              <span className="font-semibold text-muted-foreground text-[11px]">
                                Beads:
                              </span>
                              <span className="font-bold text-[#422006] truncate">
                                {variant.malaVariantAttrs.beadCount} beads
                              </span>
                            </div>
                          )}
                          {variant.malaVariantAttrs.material && (
                            <div className="flex items-center gap-1.5 text-xs text-[#5c3a1e]">
                              <Sparkles className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                              <span className="font-semibold text-muted-foreground text-[11px]">
                                Material:
                              </span>
                              <span className="font-bold text-[#422006] truncate">
                                {variant.malaVariantAttrs.material}
                              </span>
                            </div>
                          )}
                        </>
                      )}

                      {/* Weight */}
                      {variant.weightGrams !== null &&
                        variant.weightGrams !== undefined && (
                          <div className="flex items-center gap-1.5 text-xs text-[#5c3a1e]">
                            <Scale className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                            <span className="font-semibold text-muted-foreground text-[11px]">
                              Weight:
                            </span>
                            <span className="font-bold text-[#422006] truncate">
                              {variant.weightGrams} grams
                            </span>
                          </div>
                        )}

                      {/* Color */}
                      {variant.color && (
                        <div className="flex items-center gap-1.5 text-xs text-[#5c3a1e]">
                          <span className="h-2.5 w-2.5 rounded-full border border-amber-900/20 bg-amber-700 shrink-0" />
                          <span className="font-semibold text-muted-foreground text-[11px]">
                            Color:
                          </span>
                          <span className="font-bold text-[#422006] truncate">
                            {variant.color}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Variant Footer: ID & Actions */}
                  <div className="pt-2 border-t border-amber-900/10 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-muted-foreground truncate">
                      ID #{variant.id} • {variant.variantImages?.length || 0}{" "}
                      img
                    </span>

                    <div className="flex items-center gap-1 shrink-0">
                      <Link
                        href={`/admin/all-products/${productId}/variants/${variant.id}/edit`}
                      >
                        <Button
                          variant="outline"
                          size="xs"
                          className="h-7 px-2 border-amber-900/15 text-[#713f12] hover:bg-amber-50 text-[11px] gap-1"
                        >
                          <Edit className="h-3 w-3" /> Edit
                        </Button>
                      </Link>

                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => onDeleteVariant(variant.id, variant.sku)}
                        disabled={isDeletingVariant}
                        className="h-7 px-2 text-red-700 hover:bg-red-50 hover:text-red-900 text-[11px] gap-1"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Table View - With Horizontal Scroll Protection */
        <Card className="shadow-xs overflow-hidden border-amber-900/15 bg-white">
          <div className="overflow-x-auto w-full">
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow className="border-amber-900/10 bg-amber-50/40">
                  <TableHead className="w-16 font-bold text-[#422006]">
                    Image
                  </TableHead>
                  <TableHead className="font-bold text-[#422006]">
                    SKU
                  </TableHead>
                  <TableHead className="font-bold text-[#422006]">
                    Origin
                  </TableHead>
                  <TableHead className="font-bold text-[#422006]">
                    Specifications
                  </TableHead>
                  <TableHead className="font-bold text-[#422006]">
                    Stock
                  </TableHead>
                  <TableHead className="text-right font-bold text-[#422006]">
                    Price
                  </TableHead>
                  <TableHead className="text-right font-bold text-[#422006]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVariants.map((variant) => {
                  const variantImg =
                    variant.variantImages?.[0]?.url || activeImageUrl || null;
                  const isVarOutOfStock = variant.stock === 0;
                  const isVarLowStock = variant.stock > 0 && variant.stock <= 4;

                  return (
                    <TableRow
                      key={variant.id}
                      className="border-amber-900/10 hover:bg-amber-50/20"
                    >
                      {/* Image Thumbnail */}
                      <TableCell>
                        <div className="relative h-11 w-11 overflow-hidden rounded-lg border border-amber-900/10 bg-amber-50/60 shadow-2xs">
                          {variantImg ? (
                            <Image
                              src={variantImg}
                              alt={variant.sku}
                              fill
                              className="object-cover"
                              sizes="44px"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-base">
                              🌿
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* SKU */}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-xs font-bold text-[#422006]">
                            {variant.sku}
                          </span>
                          <button
                            type="button"
                            onClick={() => onCopySku(variant.sku)}
                            className="text-muted-foreground/60 hover:text-[#713f12]"
                            title="Copy SKU"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </TableCell>

                      {/* Origin */}
                      <TableCell>
                        {variant.origin ? (
                          <Badge
                            variant="outline"
                            className="text-[10px] bg-white border-amber-900/20 text-[#5c3a1e]"
                          >
                            {variant.origin.name} ({variant.origin.country})
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            —
                          </span>
                        )}
                      </TableCell>

                      {/* Specifications */}
                      <TableCell>
                        <div className="space-y-0.5 text-xs">
                          {variant.individualVariantAttrs && (
                            <span className="inline-block mr-2 font-medium text-[#422006]">
                              {variant.individualVariantAttrs.size} mm
                            </span>
                          )}
                          {variant.malaVariantAttrs?.beadCount && (
                            <span className="inline-block mr-2 font-medium text-[#422006]">
                              {variant.malaVariantAttrs.beadCount} beads
                            </span>
                          )}
                          {variant.malaVariantAttrs?.material && (
                            <span className="inline-block mr-2 text-muted-foreground">
                              {variant.malaVariantAttrs.material}
                            </span>
                          )}
                          {variant.weightGrams && (
                            <span className="inline-block text-muted-foreground">
                              {variant.weightGrams}g
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Stock Status */}
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              isVarOutOfStock
                                ? "bg-red-500"
                                : isVarLowStock
                                  ? "bg-amber-500 animate-pulse"
                                  : "bg-emerald-500"
                            }`}
                          />
                          <span
                            className={`text-xs font-bold ${
                              isVarOutOfStock
                                ? "text-red-700"
                                : isVarLowStock
                                  ? "text-amber-800"
                                  : "text-emerald-800"
                            }`}
                          >
                            {variant.stock} units
                          </span>
                        </div>
                      </TableCell>

                      {/* Price */}
                      <TableCell className="text-right">
                        <span className="text-xs sm:text-sm font-black text-[#713f12]">
                          Rs. {variant.price.toLocaleString()}
                        </span>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/all-products/${productId}/variants/${variant.id}/edit`}
                          >
                            <Button
                              variant="outline"
                              size="xs"
                              className="h-8 gap-1 border-amber-900/15 text-xs text-[#713f12] hover:bg-amber-100/60"
                            >
                              <Edit className="h-3.5 w-3.5" /> Edit
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() =>
                              onDeleteVariant(variant.id, variant.sku)
                            }
                            disabled={isDeletingVariant}
                            className="h-8 text-red-700 hover:bg-red-50 hover:text-red-900"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
