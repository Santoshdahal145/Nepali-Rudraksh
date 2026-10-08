"use client";

import { Loader2, Trash2 } from "lucide-react";

interface CartHeaderProps {
  totalItems: number;
  hasItems: boolean;
  isClearing: boolean;
  onClearCart: () => void;
}

export function CartHeader({
  totalItems,
  hasItems,
  isClearing,
  onClearCart,
}: CartHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-amber-900/10 pb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-[#422006] leading-[1.15]">
          Your Sacred{" "}
          <span className="bg-linear-to-r from-[#713f12] via-[#92400e] to-[#b45309] bg-clip-text text-transparent">
            Shopping Cart
          </span>
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#5c3a1e]/75">
          {totalItems > 0
            ? `You have selected ${totalItems} blessed ${
                totalItems === 1 ? "item" : "items"
              } ready for consecration.`
            : "Review your holy beads before proceeding to consecrated checkout."}
        </p>
      </div>

      {hasItems && (
        <button
          type="button"
          onClick={onClearCart}
          disabled={isClearing}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto text-xs font-semibold text-[#5c3a1e]/70 hover:text-red-700 transition-colors disabled:opacity-50"
        >
          {isClearing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
          Empty Entire Cart
        </button>
      )}
    </div>
  );
}
