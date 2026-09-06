import { db } from "../../src/prisma/db";
import { Temporal } from "@js-temporal/polyfill";
import type {
  AddToCartInput,
  UpdateCartItemQuantityInput,
  RemoveCartItemInput,
  MergeCartInput,
  SyncCartInput,
  SyncCartItemInput,
} from "./cart.schema";

// ── Types ────────────────────────────────────────────────────────────────────

export interface CartVariantSummary {
  id: number;
  productId: number;
  price: number;
  stock: number;
  sku: string;
  color?: string | null;
  weightGrams?: number | null;
  product?: {
    id: number;
    name: string;
    slug: string;
    description: string;
    type: string;
    productImages?: Array<{ url: string; altText?: string | null; position: number }>;
  };
  variantImages?: Array<{ url: string; altText?: string | null; position: number }>;
  individualVariantAttrs?: { size: number } | null;
  malaVariantAttrs?: { beadCount?: number | null; material?: string | null } | null;
  origin?: { id: number; name: string; country: string } | null;
}

export interface EnrichedCartItem {
  id: number;
  cartId: number;
  variantId: number;
  quantity: number;
  lineTotal: number;
  variant?: CartVariantSummary | null;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface EnrichedCart {
  id: number;
  userId: number | null;
  items: EnrichedCartItem[];
  subtotal: number;
  totalItems: number;
  uniqueItemCount: number;
  createdAt: unknown;
  updatedAt: unknown;
}

interface RawCartItem {
  id: number;
  cartId: number;
  variantId: number;
  quantity: number;
  variant?: (CartVariantSummary & { price?: number }) | null;
  createdAt: unknown;
  updatedAt: unknown;
  [key: string]: unknown;
}

interface RawCart {
  id: number;
  userId: number | null;
  items?: RawCartItem[];
  createdAt: unknown;
  updatedAt: unknown;
  [key: string]: unknown;
}

// ── Query Helpers ─────────────────────────────────────────────────────────────

function getCartBaseQuery() {
  return db.orm.public.Cart.include("items", (items) =>
    items
      .include("variant", (variant) =>
        variant
          .include("product", (prod) =>
            prod
              .include("productImages", (img) => img.orderBy((i) => i.position.asc()))
              .include("individualRudrakshaDetail")
              .include("rudrakshaMalaDetail")
          )
          .include("variantImages", (vi) => vi.orderBy((i) => i.position.asc()))
          .include("individualVariantAttrs")
          .include("malaVariantAttrs")
          .include("origin")
      )
      .orderBy((i) => i.createdAt.asc())
  );
}

function enrichCartWithSummary(cart: RawCart): EnrichedCart {
  const rawItems = cart.items || [];
  const items: EnrichedCartItem[] = rawItems.map((item) => {
    const price = Number(item.variant?.price ?? 0);
    const quantity = Number(item.quantity ?? 0);
    const lineTotal = price * quantity;

    return {
      ...item,
      lineTotal,
    };
  });

  const subtotal = items.reduce(
    (sum: number, item: EnrichedCartItem) => sum + item.lineTotal,
    0
  );
  const totalItems = items.reduce(
    (sum: number, item: EnrichedCartItem) => sum + item.quantity,
    0
  );

  return {
    ...cart,
    items,
    subtotal,
    totalItems,
    uniqueItemCount: items.length,
  };
}

// ── Cart Retrieval & Initialization ──────────────────────────────────────────

/**
 * Fetch a cart by its ID with full variant and product relations
 */
export async function getCartById(cartId: number): Promise<EnrichedCart | null> {
  const cart = await getCartBaseQuery()
    .where({ id: cartId })
    .first();

  if (!cart) return null;
  return enrichCartWithSummary(cart as unknown as RawCart);
}

/**
 * Fetch a user's active cart by their userId
 */
export async function getCartByUserId(userId: number): Promise<EnrichedCart | null> {
  const cart = await getCartBaseQuery()
    .where({ userId })
    .first();

  if (!cart) return null;
  return enrichCartWithSummary(cart as unknown as RawCart);
}

/**
 * Get or create a cart for an authenticated user
 */
export async function getOrCreateUserCart(userId: number): Promise<EnrichedCart> {
  let cart = await db.orm.public.Cart.where({ userId }).first();

  if (!cart) {
    cart = await db.orm.public.Cart.create({ userId });
  }

  const enriched = await getCartById(cart.id);
  if (!enriched) {
    throw new Error("Failed to load user cart");
  }
  return enriched;
}

/**
 * Create a new guest cart (not associated with any user)
 */
export async function createGuestCart(): Promise<EnrichedCart> {
  const cart = await db.orm.public.Cart.create({ userId: null });
  const enriched = await getCartById(cart.id);
  if (!enriched) {
    throw new Error("Failed to initialize guest cart");
  }
  return enriched;
}

/**
 * Resolve or initialize a cart for either authenticated user or guest
 */
export async function getOrCreateCart(cartId?: number, userId?: number): Promise<EnrichedCart> {
  if (userId) {
    return await getOrCreateUserCart(userId);
  }

  if (cartId) {
    const existing = await getCartById(cartId);
    if (existing) {
      return existing;
    }
  }

  return await createGuestCart();
}

// ── Cart Item Operations ─────────────────────────────────────────────────────

/**
 * Add an item to a cart or increment quantity if it already exists
 */
export async function addItemToCart(
  cartId: number,
  input: AddToCartInput
): Promise<EnrichedCart> {
  const quantityToAdd = input.quantity ?? 1;

  if (quantityToAdd <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  // 1. Verify cart exists
  const cart = await db.orm.public.Cart.where({ id: cartId }).first();
  if (!cart) {
    throw new Error(`Cart with ID ${cartId} not found`);
  }

  // 2. Verify product variant exists and has stock
  const variant = await db.orm.public.ProductVariant.where({ id: input.variantId }).first();
  if (!variant) {
    throw new Error(`Product variant with ID ${input.variantId} not found`);
  }

  if (variant.stock <= 0) {
    throw new Error("This product variant is currently out of stock");
  }

  // 3. Check for existing item in cart
  const existingItem = await db.orm.public.CartItem
    .where({ cartId, variantId: input.variantId })
    .first();

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantityToAdd;
    if (newQuantity > variant.stock) {
      throw new Error(
        `Cannot add ${quantityToAdd} more units. Only ${variant.stock} available in stock (${existingItem.quantity} already in cart).`
      );
    }

    await db.orm.public.CartItem.where({ id: existingItem.id }).update({
      quantity: newQuantity,
      updatedAt: Temporal.Now.instant(),
    });
  } else {
    if (quantityToAdd > variant.stock) {
      throw new Error(
        `Cannot add ${quantityToAdd} units. Only ${variant.stock} available in stock.`
      );
    }

    await db.orm.public.CartItem.create({
      cartId,
      variantId: input.variantId,
      quantity: quantityToAdd,
    });
  }

  // Touch cart timestamp
  await db.orm.public.Cart.where({ id: cartId }).update({
    updatedAt: Temporal.Now.instant(),
  });

  const updated = await getCartById(cartId);
  if (!updated) {
    throw new Error("Failed to load updated cart");
  }
  return updated;
}

/**
 * Update quantity for a specific variant in a cart
 */
export async function updateCartItemQuantity(
  cartId: number,
  variantId: number,
  quantity: number
): Promise<EnrichedCart> {
  if (quantity <= 0) {
    return await removeCartItem(cartId, variantId);
  }

  const item = await db.orm.public.CartItem.where({ cartId, variantId }).first();
  if (!item) {
    throw new Error(`Item with variant ID ${variantId} not found in cart ${cartId}`);
  }

  const variant = await db.orm.public.ProductVariant.where({ id: variantId }).first();
  if (!variant) {
    throw new Error(`Product variant with ID ${variantId} not found`);
  }

  if (quantity > variant.stock) {
    throw new Error(`Cannot set quantity to ${quantity}. Only ${variant.stock} available in stock.`);
  }

  await db.orm.public.CartItem.where({ id: item.id }).update({
    quantity,
    updatedAt: Temporal.Now.instant(),
  });

  await db.orm.public.Cart.where({ id: cartId }).update({
    updatedAt: Temporal.Now.instant(),
  });

  const updated = await getCartById(cartId);
  if (!updated) {
    throw new Error("Failed to load updated cart");
  }
  return updated;
}

/**
 * Update cart item quantity using schema input
 */
export async function updateCartItemQuantityByInput(
  input: UpdateCartItemQuantityInput
): Promise<EnrichedCart> {
  if (input.cartItemId) {
    return await updateCartItemQuantityById(input.cartItemId, input.quantity);
  }

  if (input.cartId && input.variantId) {
    return await updateCartItemQuantity(input.cartId, input.variantId, input.quantity);
  }

  throw new Error("Either cartItemId or (cartId and variantId) must be provided");
}

/**
 * Update cart item quantity by cartItemId
 */
export async function updateCartItemQuantityById(
  cartItemId: number,
  quantity: number
): Promise<EnrichedCart> {
  const item = await db.orm.public.CartItem.where({ id: cartItemId }).first();
  if (!item) {
    throw new Error(`Cart item with ID ${cartItemId} not found`);
  }
  return await updateCartItemQuantity(item.cartId, item.variantId, quantity);
}

/**
 * Remove an item from the cart by variant ID
 */
export async function removeCartItem(cartId: number, variantId: number): Promise<EnrichedCart> {
  const item = await db.orm.public.CartItem.where({ cartId, variantId }).first();
  if (item) {
    await db.orm.public.CartItem.where({ id: item.id }).delete();
    await db.orm.public.Cart.where({ id: cartId }).update({
      updatedAt: Temporal.Now.instant(),
    });
  }

  const updated = await getCartById(cartId);
  if (!updated) {
    throw new Error("Failed to load updated cart");
  }
  return updated;
}

/**
 * Remove cart item using schema input
 */
export async function removeCartItemByInput(
  input: RemoveCartItemInput
): Promise<EnrichedCart | null> {
  if (input.cartItemId) {
    return await removeCartItemById(input.cartItemId);
  }

  if (input.cartId && input.variantId) {
    return await removeCartItem(input.cartId, input.variantId);
  }

  throw new Error("Either cartItemId or (cartId and variantId) must be provided");
}

/**
 * Remove an item from the cart by its CartItem ID
 */
export async function removeCartItemById(cartItemId: number): Promise<EnrichedCart | null> {
  const item = await db.orm.public.CartItem.where({ id: cartItemId }).first();
  if (!item) return null;

  const cartId = item.cartId;
  await db.orm.public.CartItem.where({ id: cartItemId }).delete();
  await db.orm.public.Cart.where({ id: cartId }).update({
    updatedAt: Temporal.Now.instant(),
  });

  return await getCartById(cartId);
}

/**
 * Remove all items from a cart
 */
export async function clearCart(cartId: number): Promise<EnrichedCart> {
  await db.orm.public.CartItem.where({ cartId }).delete();
  await db.orm.public.Cart.where({ id: cartId }).update({
    updatedAt: Temporal.Now.instant(),
  });

  const updated = await getCartById(cartId);
  if (!updated) {
    throw new Error("Failed to load updated cart");
  }
  return updated;
}

/**
 * Delete a cart and its items entirely
 */
export async function deleteCart(cartId: number): Promise<void> {
  await db.orm.public.CartItem.where({ cartId }).delete();
  await db.orm.public.Cart.where({ id: cartId }).delete();
}

// ── Cart Merging & Sync ──────────────────────────────────────────────────────

/**
 * Merge a guest cart into an authenticated user's cart
 * Combines quantities when variants match, respects stock limits, and removes the guest cart
 */
export async function mergeGuestCartIntoUserCart(
  guestCartIdOrInput: number | MergeCartInput,
  maybeUserId?: number
): Promise<EnrichedCart> {
  const guestCartId =
    typeof guestCartIdOrInput === "number"
      ? guestCartIdOrInput
      : guestCartIdOrInput.guestCartId;
  const userId =
    typeof guestCartIdOrInput === "number"
      ? maybeUserId!
      : guestCartIdOrInput.userId;

  if (!userId) {
    throw new Error("User ID is required for cart merging");
  }

  const guestCart = await db.orm.public.Cart.where({ id: guestCartId }).first();
  if (!guestCart) {
    return await getOrCreateUserCart(userId);
  }

  const userCart = await getOrCreateUserCart(userId);

  if (guestCart.id === userCart.id) {
    return userCart;
  }

  const guestItems = await db.orm.public.CartItem.where({ cartId: guestCartId }).all();

  await db.transaction(async (tx) => {
    for (const guestItem of guestItems) {
      const variant = await tx.orm.public.ProductVariant
        .where({ id: guestItem.variantId })
        .first();

      if (!variant || variant.stock <= 0) continue;

      const existingUserItem = await tx.orm.public.CartItem
        .where({ cartId: userCart.id, variantId: guestItem.variantId })
        .first();

      if (existingUserItem) {
        const combinedQuantity = Math.min(
          existingUserItem.quantity + guestItem.quantity,
          variant.stock
        );
        await tx.orm.public.CartItem
          .where({ id: existingUserItem.id })
          .update({
            quantity: combinedQuantity,
            updatedAt: Temporal.Now.instant(),
          });
      } else {
        const quantity = Math.min(guestItem.quantity, variant.stock);
        await tx.orm.public.CartItem.create({
          cartId: userCart.id,
          variantId: guestItem.variantId,
          quantity,
        });
      }
    }

    // Delete guest cart items and the guest cart itself
    await tx.orm.public.CartItem.where({ cartId: guestCartId }).delete();
    await tx.orm.public.Cart.where({ id: guestCartId }).delete();
  });

  const updatedUserCart = await getCartById(userCart.id);
  if (!updatedUserCart) {
    throw new Error("Failed to load merged user cart");
  }
  return updatedUserCart;
}

/**
 * Sync multiple items into a cart
 */
export async function syncCart(
  cartId: number,
  items: SyncCartItemInput[]
): Promise<EnrichedCart> {
  const cart = await db.orm.public.Cart.where({ id: cartId }).first();
  if (!cart) {
    throw new Error(`Cart with ID ${cartId} not found`);
  }

  await db.transaction(async (tx) => {
    for (const item of items) {
      if (item.quantity <= 0) continue;

      const variant = await tx.orm.public.ProductVariant
        .where({ id: item.variantId })
        .first();

      if (!variant || variant.stock <= 0) continue;

      const quantity = Math.min(item.quantity, variant.stock);

      const existing = await tx.orm.public.CartItem
        .where({ cartId, variantId: item.variantId })
        .first();

      if (existing) {
        await tx.orm.public.CartItem.where({ id: existing.id }).update({
          quantity,
          updatedAt: Temporal.Now.instant(),
        });
      } else {
        await tx.orm.public.CartItem.create({
          cartId,
          variantId: item.variantId,
          quantity,
        });
      }
    }
  });

  await db.orm.public.Cart.where({ id: cartId }).update({
    updatedAt: Temporal.Now.instant(),
  });

  const updated = await getCartById(cartId);
  if (!updated) {
    throw new Error("Failed to load synced cart");
  }
  return updated;
}

/**
 * Sync cart using schema input
 */
export async function syncCartByInput(
  cartId: number,
  input: SyncCartInput
): Promise<EnrichedCart> {
  const targetCartId = input.cartId ?? cartId;
  return await syncCart(targetCartId, input.items);
}

/**
 * Get total item count in a cart (sum of quantities)
 */
export async function getCartItemCount(cartId: number): Promise<number> {
  const items = await db.orm.public.CartItem.where({ cartId }).all();
  return items.reduce((sum: number, item) => sum + (Number(item.quantity) || 0), 0);
}
