"use client";

import { useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthContext";
import { cartApi, EnrichedCart } from "@/app/api/cart/api";
import { requestAPI } from "@/lib/requestAPI";

export const GUEST_CART_STORAGE_KEY = "nepali_rudraksh_guest_cart_id";

export const enum CART_KEYS {
  cart = "cart",
}

// ── Storage Helpers ──────────────────────────────────────────────────────────

export function getStoredGuestCartId(): number | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(GUEST_CART_STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) ? undefined : parsed;
  } catch {
    return undefined;
  }
}

export function setStoredGuestCartId(cartId: number): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GUEST_CART_STORAGE_KEY, String(cartId));
  } catch (error) {
    console.error("Failed to store guest cart ID in localStorage:", error);
  }
}

export function clearStoredGuestCartId(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(GUEST_CART_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear guest cart ID from localStorage:", error);
  }
}

// ── Hook Implementation ──────────────────────────────────────────────────────

export default function useCart() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  // 1. Fetch active Cart (for logged in user, or guest from localStorage)
  const cartQuery = useQuery<EnrichedCart | null>({
    queryKey: [CART_KEYS.cart, isAuthenticated ? `user-${user?.id}` : "guest"],
    queryFn: async () => {
      const guestCartId = !isAuthenticated ? getStoredGuestCartId() : undefined;
      const res = await requestAPI<EnrichedCart>(
        cartApi.getCart({
          cartId: guestCartId,
        })
      );

      const cartData = res.data;

      // When guest user gets a cart, persist its ID in localStorage
      if (!isAuthenticated && cartData?.id) {
        setStoredGuestCartId(cartData.id);
      }

      return cartData;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  });

  // 2. Merge Guest Cart Mutation (runs when guest logs in)
  const mergeCartMutation = useMutation({
    mutationFn: async ({
      guestCartId,
      userId,
    }: {
      guestCartId: number;
      userId: number;
    }) => {
      const res = await requestAPI<EnrichedCart>(
        cartApi.mergeGuestCart({ guestCartId, userId })
      );
      return res.data;
    },
    onSuccess: (mergedCart) => {
      clearStoredGuestCartId();
      if (mergedCart) {
        queryClient.setQueryData(
          [CART_KEYS.cart, `user-${user?.id}`],
          mergedCart
        );
      }
      queryClient.invalidateQueries({ queryKey: [CART_KEYS.cart] });
    },
  });

  // Automatically trigger merge if user is authenticated and a guest cart is in localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const guestCartId = getStoredGuestCartId();
    if (isAuthenticated && user?.id && guestCartId) {
      mergeCartMutation.mutate({
        guestCartId,
        userId: user.id,
      });
    }
  }, [isAuthenticated, user?.id, mergeCartMutation]);

  // 3. Add to Cart Mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({
      variantId,
      quantity = 1,
    }: {
      variantId: number;
      quantity?: number;
    }) => {
      const currentGuestId = !isAuthenticated ? getStoredGuestCartId() : undefined;
      const res = await requestAPI<EnrichedCart>(
        cartApi.addToCart({
          cartId: currentGuestId,
          variantId,
          quantity,
        })
      );

      const cartData = res.data;
      if (!isAuthenticated && cartData?.id) {
        setStoredGuestCartId(cartData.id);
      }

      return cartData;
    },
    onSuccess: (updatedCart) => {
      if (updatedCart) {
        const queryKey = [
          CART_KEYS.cart,
          isAuthenticated ? `user-${user?.id}` : "guest",
        ];
        queryClient.setQueryData(queryKey, updatedCart);
      }
      queryClient.invalidateQueries({ queryKey: [CART_KEYS.cart] });
    },
  });

  // 4. Update Quantity Mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({
      variantId,
      quantity,
      cartItemId,
    }: {
      variantId?: number;
      quantity: number;
      cartItemId?: number;
    }) => {
      const currentGuestId = !isAuthenticated ? getStoredGuestCartId() : undefined;
      const res = await requestAPI<EnrichedCart>(
        cartApi.updateCartItemQuantity({
          cartId: currentGuestId,
          variantId,
          cartItemId,
          quantity,
        })
      );
      return res.data;
    },
    onSuccess: (updatedCart) => {
      if (updatedCart) {
        const queryKey = [
          CART_KEYS.cart,
          isAuthenticated ? `user-${user?.id}` : "guest",
        ];
        queryClient.setQueryData(queryKey, updatedCart);
      }
      queryClient.invalidateQueries({ queryKey: [CART_KEYS.cart] });
    },
  });

  // 5. Remove Item Mutation
  const removeItemMutation = useMutation({
    mutationFn: async ({
      variantId,
      cartItemId,
    }: {
      variantId?: number;
      cartItemId?: number;
    }) => {
      const currentGuestId = !isAuthenticated ? getStoredGuestCartId() : undefined;
      const res = await requestAPI<EnrichedCart>(
        cartApi.removeCartItem({
          cartId: currentGuestId,
          variantId,
          cartItemId,
        })
      );
      return res.data;
    },
    onSuccess: (updatedCart) => {
      if (updatedCart) {
        const queryKey = [
          CART_KEYS.cart,
          isAuthenticated ? `user-${user?.id}` : "guest",
        ];
        queryClient.setQueryData(queryKey, updatedCart);
      }
      queryClient.invalidateQueries({ queryKey: [CART_KEYS.cart] });
    },
  });

  // 6. Clear Cart Mutation
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const currentGuestId = !isAuthenticated ? getStoredGuestCartId() : undefined;
      const res = await requestAPI<EnrichedCart>(cartApi.clearCart(currentGuestId));
      return res.data;
    },
    onSuccess: (clearedCart) => {
      if (clearedCart) {
        const queryKey = [
          CART_KEYS.cart,
          isAuthenticated ? `user-${user?.id}` : "guest",
        ];
        queryClient.setQueryData(queryKey, clearedCart);
      }
      queryClient.invalidateQueries({ queryKey: [CART_KEYS.cart] });
    },
  });

  // Helper action dispatchers
  const addToCart = useCallback(
    async (variantId: number, quantity = 1) => {
      return await addToCartMutation.mutateAsync({ variantId, quantity });
    },
    [addToCartMutation]
  );

  const updateQuantity = useCallback(
    async (variantId: number, quantity: number, cartItemId?: number) => {
      return await updateQuantityMutation.mutateAsync({
        variantId,
        quantity,
        cartItemId,
      });
    },
    [updateQuantityMutation]
  );

  const removeItem = useCallback(
    async (variantId?: number, cartItemId?: number) => {
      return await removeItemMutation.mutateAsync({ variantId, cartItemId });
    },
    [removeItemMutation]
  );

  const clearCart = useCallback(async () => {
    return await clearCartMutation.mutateAsync();
  }, [clearCartMutation]);

  return {
    cart: cartQuery.data ?? null,
    items: cartQuery.data?.items ?? [],
    subtotal: cartQuery.data?.subtotal ?? 0,
    totalItems: cartQuery.data?.totalItems ?? 0,
    uniqueItemCount: cartQuery.data?.uniqueItemCount ?? 0,

    isLoading: cartQuery.isLoading,
    isFetching: cartQuery.isFetching,
    isError: cartQuery.isError,
    error: cartQuery.error,
    refetch: cartQuery.refetch,

    addToCart,
    updateQuantity,
    removeItem,
    clearCart,

    isAdding: addToCartMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isRemoving: removeItemMutation.isPending,
    isClearing: clearCartMutation.isPending,
    isMerging: mergeCartMutation.isPending,
  };
}
