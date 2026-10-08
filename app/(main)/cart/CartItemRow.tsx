"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { EnrichedCartItem } from "@/app/api/cart/api";

interface CartItemRowProps {
  item: EnrichedCartItem;
  isItemBusy: boolean;
  formatPrice: (price: number) => string;
  onUpdateQty: (
    variantId: number,
    currentQty: number,
    delta: number,
    cartItemId?: number
  ) => void;
  onRemove: (variantId: number, cartItemId?: number) => void;
}

export function CartItemRow({
  item,
  isItemBusy,
  formatPrice,
  onUpdateQty,
  onRemove,
}: CartItemRowProps) {
  const variant = item.variant;
  const product = variant?.product;
  const imageUrl =
    variant?.variantImages?.[0]?.url ||
    product?.productImages?.[0]?.url ||
    "/placeholder.jpg";

  // Mukhi / Attributes detail string
  const mukhiDetail = product?.individualRudrakshaDetail?.mukhi
    ? `${product.individualRudrakshaDetail.mukhi} Mukhi`
    : product?.rudrakshaMalaDetail?.mukhi
    ? `${product.rudrakshaMalaDetail.mukhi} Mukhi Mala`
    : variant?.malaVariantAttrs?.beadCount
    ? `${variant.malaVariantAttrs.beadCount} Beads`
    : null;

  const originName = variant?.origin?.name || "Nepali";
  const sizeDetail = variant?.individualVariantAttrs?.size
    ? `${variant.individualVariantAttrs.size}mm`
    : null;

  const itemPrice = variant?.price || 0;
  const lineTotal = itemPrice * item.quantity;
  const isAtMaxStock =
    variant?.stock !== undefined && item.quantity >= variant.stock;

  return (
    <div
      className={`p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
        isItemBusy ? "opacity-60 pointer-events-none" : "hover:bg-amber-50/20"
      }`}
    >
      {/* Left: Product Image & Details */}
      <div className="flex items-center gap-4">
        {/* Thumbnail */}
        <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-2xl border border-amber-900/10 bg-amber-50/40">
          {imageUrl && imageUrl !== "/placeholder.jpg" ? (
            <Image
              src={imageUrl}
              alt={product?.name || "Rudraksha"}
              fill
              unoptimized
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl">
              📿
            </div>
          )}
        </div>

        {/* Title & Attributes */}
        <div className="space-y-1">
          {product?.slug ? (
            <Link
              href={`/all-products?search=${encodeURIComponent(product.name)}`}
              className="text-sm sm:text-base font-bold text-[#422006] hover:text-[#713f12] transition-colors line-clamp-1"
            >
              {product.name}
            </Link>
          ) : (
            <h3 className="text-sm sm:text-base font-bold text-[#422006] line-clamp-1">
              {product?.name || "Consecrated Rudraksha Bead"}
            </h3>
          )}

          {/* Attribute Tags */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#5c3a1e]/80">
            {mukhiDetail && (
              <span className="rounded-md bg-amber-100/70 px-2 py-0.5 font-semibold text-amber-900 border border-amber-900/15">
                {mukhiDetail}
              </span>
            )}
            <span className="rounded-md bg-amber-50 px-2 py-0.5 font-medium text-[#5c3a1e] border border-amber-900/10">
              {originName} Origin
            </span>
            {sizeDetail && (
              <span className="text-muted-foreground">({sizeDetail})</span>
            )}
            {variant?.color && (
              <span className="text-muted-foreground">• {variant.color}</span>
            )}
          </div>

          <p className="text-xs font-bold text-[#713f12] sm:hidden pt-1">
            {formatPrice(itemPrice)} each
          </p>

          {/* SKU & Stock alert */}
          {variant?.stock !== undefined && variant.stock <= 3 && (
            <p className="text-[10px] font-semibold text-amber-800">
              Only {variant.stock} left in sacred stock!
            </p>
          )}
        </div>
      </div>

      {/* Right: Quantity Controls, Price, & Remove */}
      <div className="flex items-center justify-between sm:justify-end sm:gap-6 pt-3 sm:pt-0 border-t border-amber-900/10 sm:border-t-0">
        {/* Quantity Counter */}
        <div className="flex items-center rounded-xl border border-amber-900/20 bg-amber-50/40 p-1">
          <button
            type="button"
            onClick={() => onUpdateQty(item.variantId, item.quantity, -1, item.id)}
            disabled={isItemBusy}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#5c3a1e] hover:bg-white hover:shadow-xs transition-all disabled:opacity-50"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>

          <span className="w-8 text-center text-xs font-bold text-[#422006]">
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={() => onUpdateQty(item.variantId, item.quantity, 1, item.id)}
            disabled={isItemBusy || isAtMaxStock}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#5c3a1e] hover:bg-white hover:shadow-xs transition-all disabled:opacity-50"
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Price & Subtotal */}
        <div className="text-right">
          <p className="text-base sm:text-lg font-black text-[#713f12]">
            {formatPrice(lineTotal)}
          </p>
          {item.quantity > 1 && (
            <p className="text-[10px] text-[#5c3a1e]/60">
              ({formatPrice(itemPrice)} each)
            </p>
          )}
        </div>

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => onRemove(item.variantId, item.id)}
          disabled={isItemBusy}
          className="p-1 text-muted-foreground transition-colors hover:text-red-700 disabled:opacity-50"
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
