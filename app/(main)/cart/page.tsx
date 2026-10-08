"use client";

import Breadcrumbs from "@/components/Breadcrumb";
import useCart from "@/hooks/tanstack-hooks/useCart";
import { usePrice } from "@/providers/PriceContext";
import { useState } from "react";
import { CartHeader } from "./CartHeader";
import { CartSkeleton } from "./CartSkeleton";
import { CartErrorState } from "./CartErrorState";
import { CartEmptyState } from "./CartEmptyState";
import { CartItemList } from "./CartItemList";
import { CartOrderSummary } from "./CartOrderSummary";

const FREE_SHIPPING_THRESHOLD = 15000; // NPR 15,000 threshold
const STANDARD_SHIPPING_FEE = 500;

export default function CartPage() {
  const {
    items,
    subtotal,
    totalItems,
    isLoading,
    isError,
    refetch,
    updateQuantity,
    removeItem,
    clearCart,
    isUpdating,
    isRemoving,
    isClearing,
  } = useCart();

  const { formatPrice } = usePrice();

  const [pendingItemId, setPendingItemId] = useState<number | null>(null);

  const handleUpdateQty = async (
    variantId: number,
    currentQty: number,
    delta: number,
    cartItemId?: number,
  ) => {
    const nextQty = currentQty + delta;
    setPendingItemId(variantId);
    try {
      if (nextQty <= 0) {
        await removeItem(variantId, cartItemId);
      } else {
        await updateQuantity(variantId, nextQty, cartItemId);
      }
    } finally {
      setPendingItemId(null);
    }
  };

  const handleRemove = async (variantId: number, cartItemId?: number) => {
    setPendingItemId(variantId);
    try {
      await removeItem(variantId, cartItemId);
    } finally {
      setPendingItemId(null);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to empty your sacred cart?")) {
      await clearCart();
    }
  };

  // Pricing calculations
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const totalAmount = subtotal + shippingFee;

  return (
    <main className="min-h-screen bg-[#faf7f2] pb-24 pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Collection", href: "/all-products" },
            { label: "Sacred Cart" },
          ]}
        />

        <CartHeader
          totalItems={totalItems}
          hasItems={items.length > 0}
          isClearing={isClearing}
          onClearCart={handleClearCart}
        />

        {isLoading ? (
          <CartSkeleton />
        ) : isError ? (
          <CartErrorState onRetry={() => refetch()} />
        ) : items.length === 0 ? (
          <CartEmptyState />
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-6">
              <CartItemList
                items={items}
                pendingItemId={pendingItemId}
                isUpdating={isUpdating}
                isRemoving={isRemoving}
                formatPrice={formatPrice}
                onUpdateQty={handleUpdateQty}
                onRemove={handleRemove}
              />
            </div>

            <div className="lg:col-span-4 space-y-6">
              <CartOrderSummary
                subtotal={subtotal}
                totalItems={totalItems}
                totalAmount={totalAmount}
                formatPrice={formatPrice}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
