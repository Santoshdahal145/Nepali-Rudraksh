"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { EnrichedCartItem } from "@/app/api/cart/api";
import { CartItemRow } from "./CartItemRow";

interface CartItemListProps {
  items: EnrichedCartItem[];
  pendingItemId: number | null;
  isUpdating: boolean;
  isRemoving: boolean;
  formatPrice: (price: number) => string;
  onUpdateQty: (
    variantId: number,
    currentQty: number,
    delta: number,
    cartItemId?: number
  ) => void;
  onRemove: (variantId: number, cartItemId?: number) => void;
}

export function CartItemList({
  items,
  pendingItemId,
  isUpdating,
  isRemoving,
  formatPrice,
  onUpdateQty,
  onRemove,
}: CartItemListProps) {
  return (
    <div className="space-y-6">
      {/* Items Card List */}
      <div className="rounded-3xl border border-amber-900/10 bg-white shadow-xl shadow-amber-950/5 overflow-hidden divide-y divide-amber-900/10">
        {items.map((item) => {
          const isItemBusy =
            (isUpdating || isRemoving) && pendingItemId === item.variantId;

          return (
            <CartItemRow
              key={item.id}
              item={item}
              isItemBusy={isItemBusy}
              formatPrice={formatPrice}
              onUpdateQty={onUpdateQty}
              onRemove={onRemove}
            />
          );
        })}
      </div>

      {/* Continue Shopping Link */}
      <div className="flex items-center justify-between pt-2">
        <Link
          href="/all-products"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#713f12] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Exploring Sacred Beads
        </Link>
      </div>
    </div>
  );
}
