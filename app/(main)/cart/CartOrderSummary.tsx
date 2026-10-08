"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface CartOrderSummaryProps {
  subtotal: number;
  totalItems: number;
  totalAmount: number;
  formatPrice: (price: number) => string;
}

export function CartOrderSummary({
  subtotal,
  totalItems,
  totalAmount,
  formatPrice,
}: CartOrderSummaryProps) {
  return (
    <div className="rounded-2xl border border-amber-900/10 bg-white p-4 shadow-sm sm:p-5">
      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#5c3a1e]/70">
            Subtotal ({totalItems} items)
          </span>

          <span className="font-semibold text-[#422006]">
            {formatPrice(subtotal)}
          </span>
        </div>

        {/* Total */}
        <div className="flex items-end justify-between border-t border-amber-900/10 pt-3">
          <div>
            <span className="text-base font-bold text-[#422006]">
              Estimated Total
            </span>

            <p className="mt-0.5 text-[10px] text-[#5c3a1e]/55">
              All taxes & consecration included
            </p>
          </div>

          <span className="text-xl font-black text-[#713f12] sm:text-2xl">
            {formatPrice(totalAmount)}
          </span>
        </div>
      </div>

      {/* Checkout */}
      <Link href="/checkout" className="mt-4 block">
        <Button
          className="
            h-11
            w-full
            rounded-xl
            bg-[#713f12]
            text-sm
            font-bold
            text-white
            shadow-md
            shadow-amber-950/10
            transition-all
            hover:bg-[#5c330e]
            hover:shadow-lg
            active:scale-[0.99]
          "
        >
          Proceed to Checkout
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
