"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Check,
  Copy,
  Edit,
  Loader2,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductType } from "@/app/types";

interface ProductTopHeaderProps {
  product: ProductType;
  isDeleting: boolean;
  onDelete: () => void;
  onEdit?: () => void;
  isOutOfStock: boolean;
  isLowStock: boolean;
  copiedSlug: boolean;
  onCopySlug: (slug: string) => void;
}

export default function ProductTopHeader({
  product,
  isDeleting,
  onDelete,
  onEdit,
  isOutOfStock,
  isLowStock,
  copiedSlug,
  onCopySlug,
}: ProductTopHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Quick Actions Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href="/admin/all-products"
            className="inline-flex items-center gap-1.5 shrink-0 rounded-xl border border-amber-900/15 bg-white px-3 py-1.5 text-xs font-bold text-[#713f12] shadow-2xs hover:bg-amber-50 hover:text-[#422006] transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Link>
          <span className="text-xs text-muted-foreground/60 shrink-0">/</span>
          <span className="text-xs font-medium text-muted-foreground truncate">
            {product.name}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {onEdit ? (
            <Button
              variant="outline"
              size="xs"
              onClick={onEdit}
              className="h-8 gap-1.5 border-amber-900/15 text-xs text-[#713f12] hover:bg-amber-100/60"
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Product</span>
            </Button>
          ) : (
            <Link href={`/admin/all-products/${product.id}/edit`}>
              <Button
                variant="outline"
                size="xs"
                className="h-8 gap-1.5 border-amber-900/15 text-xs text-[#713f12] hover:bg-amber-100/60"
              >
                <Edit className="h-3.5 w-3.5" />
                <span>Edit Product</span>
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="xs"
            onClick={onDelete}
            disabled={isDeleting}
            className="h-8 gap-1.5 text-red-700 hover:bg-red-50 hover:text-red-900"
          >
            {isDeleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            <span>Delete Product</span>
          </Button>
        </div>
      </div>

      {/* Main Product Banner */}
      <div className="rounded-2xl sm:rounded-3xl border border-amber-900/10 bg-linear-to-r from-amber-100/70 via-orange-50/50 to-amber-50 p-4 sm:p-6 md:p-8 shadow-xs">
        <div className="flex flex-col gap-3">
          {/* Badges line */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <Badge
              variant="gold"
              className="text-[10px] sm:text-[11px] font-bold"
            >
              Product #{product.id}
            </Badge>

            {product.type === "INDIVIDUAL_RUDRAKSHA" ? (
              <Badge variant="gold" className="text-[10px] sm:text-[11px]">
                🌿 Individual Rudraksha
              </Badge>
            ) : (
              <Badge variant="sacred" className="text-[10px] sm:text-[11px]">
                📿 Rudraksha Mala
              </Badge>
            )}

            {product.individualRudrakshaDetail?.mukhi && (
              <Badge
                variant="outline"
                className="text-[10px] sm:text-[11px] font-semibold bg-white/80 border-amber-900/20 text-[#713f12]"
              >
                ✨ {product.individualRudrakshaDetail.mukhi} Mukhi
              </Badge>
            )}

            {product.rudrakshaMalaDetail?.mukhi && (
              <Badge
                variant="outline"
                className="text-[10px] sm:text-[11px] font-semibold bg-white/80 border-amber-900/20 text-[#713f12]"
              >
                ✨ {product.rudrakshaMalaDetail.mukhi} Mukhi
              </Badge>
            )}

            <Badge
              variant={
                isOutOfStock
                  ? "destructive"
                  : isLowStock
                    ? "warning"
                    : "success"
              }
              className="text-[10px] sm:text-[11px] gap-1"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isOutOfStock
                    ? "bg-red-500"
                    : isLowStock
                      ? "bg-amber-500 animate-pulse"
                      : "bg-emerald-500"
                }`}
              />
              {isOutOfStock
                ? "Out of Stock"
                : isLowStock
                  ? "Low Stock"
                  : "In Stock"}
            </Badge>
          </div>

          {/* Product Title */}
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-[#422006] tracking-tight break-words">
            {product.name}
          </h1>

          {/* Slug & Metadata */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[#5c3a1e]/80">
            <button
              type="button"
              onClick={() => onCopySlug(product.slug)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-900/5 px-2.5 py-1 font-mono text-[11px] text-[#713f12] hover:bg-amber-900/10 transition-colors max-w-full truncate"
              title="Click to copy slug"
            >
              <span className="truncate">/{product.slug}</span>
              {copiedSlug ? (
                <Check className="h-3 w-3 shrink-0 text-emerald-700" />
              ) : (
                <Copy className="h-3 w-3 shrink-0 text-[#713f12]/70" />
              )}
            </button>

            <span className="text-muted-foreground/40 hidden sm:inline">•</span>
            <span className="flex items-center gap-1 shrink-0">
              <Calendar className="h-3.5 w-3.5 text-amber-800/60" />
              Added{" "}
              {new Date(product.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>

            {product.updatedAt && (
              <>
                <span className="text-muted-foreground/40 hidden sm:inline">
                  •
                </span>
                <span className="text-[#5c3a1e]/70 shrink-0">
                  Updated{" "}
                  {new Date(product.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
