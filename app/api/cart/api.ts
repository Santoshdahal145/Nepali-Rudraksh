import { ApiRequestType } from "@/lib/requestAPI";
import type {
  AddToCartInput,
  UpdateCartItemQuantityInput,
  RemoveCartItemInput,
  MergeCartInput,
  SyncCartInput,
} from "@/server/cart/cart.schema";
import type { EnrichedCart } from "@/server/cart/cart.service";

export type { EnrichedCart };

export type GetCartParams = {
  cartId?: number;
};

// ─────────────────────────────────────────────────────────────────────────────
// Cart API Requests
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/cart
 * Fetch active cart for authenticated user or guest
 */
const getCart = (params?: GetCartParams): ApiRequestType => ({
  method: "get",
  route: "/cart",
  params,
  showToast: false,
});

/**
 * POST /api/cart
 * Add an item to the cart or increment quantity
 */
const addToCart = (data: AddToCartInput): ApiRequestType => ({
  method: "post",
  route: "/cart",
  payload: data,
  showToast: true,
  successMessage: "Added to sacred cart",
});

/**
 * PATCH /api/cart
 * Update cart item quantity
 */
const updateCartItemQuantity = (data: UpdateCartItemQuantityInput): ApiRequestType => ({
  method: "patch",
  route: "/cart",
  payload: data,
  showToast: false,
});

/**
 * DELETE /api/cart
 * Remove an item from the cart by cartItemId or variantId
 */
const removeCartItem = (params: RemoveCartItemInput): ApiRequestType => ({
  method: "delete",
  route: "/cart",
  params: params as Record<string, unknown>,
  showToast: true,
  successMessage: "Item removed from cart",
});

/**
 * DELETE /api/cart?clear=true
 * Clear all items from the cart
 */
const clearCart = (cartId?: number): ApiRequestType => ({
  method: "delete",
  route: "/cart",
  params: { cartId, clear: true },
  showToast: true,
  successMessage: "Cart cleared",
});

/**
 * POST /api/cart (action: merge)
 * Merge a guest cart into the authenticated user's cart
 */
const mergeGuestCart = (data: MergeCartInput): ApiRequestType => ({
  method: "post",
  route: "/cart",
  payload: { action: "merge", ...data },
  showToast: false,
});

/**
 * POST /api/cart (action: sync)
 * Batch synchronize cart items
 */
const syncCart = (data: SyncCartInput): ApiRequestType => ({
  method: "post",
  route: "/cart",
  payload: { action: "sync", ...data },
  showToast: false,
});

export const cartApi = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  mergeGuestCart,
  syncCart,
};
