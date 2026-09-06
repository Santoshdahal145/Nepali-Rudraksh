import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth.utils";
import {
  addToCartSchema,
  updateCartItemQuantitySchema,
  syncCartSchema,
} from "@/server/cart/cart.schema";
import {
  getCartById,
  getOrCreateUserCart,
  createGuestCart,
  addItemToCart,
  updateCartItemQuantity,
  updateCartItemQuantityById,
  removeCartItem,
  removeCartItemById,
  clearCart,
  mergeGuestCartIntoUserCart,
  syncCart,
} from "@/server/cart/cart.service";

/**
 * GET /api/cart
 * Fetch active cart for authenticated user or guest by cartId
 */
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const cartIdParam = searchParams.get("cartId");
    const cartId = cartIdParam ? parseInt(cartIdParam, 10) : undefined;

    // 1. Authenticated user
    if (user?.userId) {
      const userCart = await getOrCreateUserCart(user.userId);

      // If a guest cartId was provided alongside, automatically merge it into user cart
      if (cartId && !isNaN(cartId) && cartId !== userCart.id) {
        const mergedCart = await mergeGuestCartIntoUserCart(cartId, user.userId);
        return NextResponse.json(mergedCart, { status: 200 });
      }

      return NextResponse.json(userCart, { status: 200 });
    }

    // 2. Guest user with existing cartId
    if (cartId && !isNaN(cartId)) {
      const existingCart = await getCartById(cartId);
      if (existingCart) {
        return NextResponse.json(existingCart, { status: 200 });
      }
    }

    // 3. Guest user without cartId or not found -> initialize a new guest cart
    const newGuestCart = await createGuestCart();
    return NextResponse.json(newGuestCart, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch cart:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch cart";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/cart
 * Add an item, merge carts, or batch sync items
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const user = await getCurrentUser();

    // Action A: Merge guest cart into user cart
    if (body.action === "merge" || (body.guestCartId && !body.variantId)) {
      if (!user?.userId) {
        return NextResponse.json(
          { error: "Authentication required to merge cart" },
          { status: 401 }
        );
      }
      const guestCartId = Number(body.guestCartId);
      if (!guestCartId || isNaN(guestCartId)) {
        return NextResponse.json(
          { error: "Valid guestCartId is required" },
          { status: 400 }
        );
      }
      const merged = await mergeGuestCartIntoUserCart(guestCartId, user.userId);
      return NextResponse.json(merged, { status: 200 });
    }

    // Action B: Batch sync cart items
    if (body.action === "sync" || (Array.isArray(body.items) && !body.variantId)) {
      const parsedSync = syncCartSchema.safeParse(body);
      if (!parsedSync.success) {
        return NextResponse.json(
          { error: "Invalid sync cart data", details: parsedSync.error.flatten().fieldErrors },
          { status: 400 }
        );
      }

      let cartId = parsedSync.data.cartId;
      if (user?.userId) {
        const userCart = await getOrCreateUserCart(user.userId);
        cartId = userCart.id;
      } else if (!cartId) {
        const newCart = await createGuestCart();
        cartId = newCart.id;
      }

      const synced = await syncCart(cartId, parsedSync.data.items);
      return NextResponse.json(synced, { status: 200 });
    }

    // Action C: Add single item to cart
    const validation = addToCartSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid cart item data", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { variantId, quantity, cartId: inputCartId } = validation.data;
    let targetCartId = inputCartId;

    if (user?.userId) {
      const userCart = await getOrCreateUserCart(user.userId);
      targetCartId = userCart.id;
    } else if (!targetCartId) {
      const newCart = await createGuestCart();
      targetCartId = newCart.id;
    } else {
      const existing = await getCartById(targetCartId);
      if (!existing) {
        const newCart = await createGuestCart();
        targetCartId = newCart.id;
      }
    }

    const updatedCart = await addItemToCart(targetCartId, { variantId, quantity });
    return NextResponse.json(updatedCart, { status: 200 });
  } catch (error) {
    console.error("Cart add error:", error);
    const message = error instanceof Error ? error.message : "Failed to add item to cart";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/**
 * PATCH /api/cart
 * Update cart item quantity
 */
export async function PATCH(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const user = await getCurrentUser();

    const validation = updateCartItemQuantitySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid update data", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { cartItemId, variantId, quantity, cartId: inputCartId } = validation.data;

    // 1. Update by CartItem ID
    if (cartItemId) {
      const updated = await updateCartItemQuantityById(cartItemId, quantity);
      return NextResponse.json(updated, { status: 200 });
    }

    // 2. Update by Variant ID
    if (variantId) {
      let targetCartId = inputCartId;
      if (user?.userId) {
        const userCart = await getOrCreateUserCart(user.userId);
        targetCartId = userCart.id;
      }

      if (!targetCartId) {
        return NextResponse.json(
          { error: "Cart ID is required when updating by variant ID" },
          { status: 400 }
        );
      }

      const updated = await updateCartItemQuantity(targetCartId, variantId, quantity);
      return NextResponse.json(updated, { status: 200 });
    }

    return NextResponse.json(
      { error: "Either cartItemId or (cartId and variantId) must be provided" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Cart update error:", error);
    const message = error instanceof Error ? error.message : "Failed to update cart item";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/**
 * DELETE /api/cart
 * Remove an item or clear the entire cart
 */
export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(request.url);

    const cartItemIdParam = searchParams.get("cartItemId");
    const variantIdParam = searchParams.get("variantId");
    const cartIdParam = searchParams.get("cartId");
    const isClear = searchParams.get("clear") === "true";

    let body: Record<string, unknown> = {};
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      // Body may be empty on DELETE
    }

    const cartItemId = cartItemIdParam
      ? parseInt(cartItemIdParam, 10)
      : typeof body.cartItemId === "number"
      ? body.cartItemId
      : undefined;

    const variantId = variantIdParam
      ? parseInt(variantIdParam, 10)
      : typeof body.variantId === "number"
      ? body.variantId
      : undefined;

    const inputCartId = cartIdParam
      ? parseInt(cartIdParam, 10)
      : typeof body.cartId === "number"
      ? body.cartId
      : undefined;

    const shouldClear = isClear || body.clear === true;

    // Resolve target cart ID
    let targetCartId = inputCartId;
    if (user?.userId) {
      const userCart = await getOrCreateUserCart(user.userId);
      targetCartId = userCart.id;
    }

    // 1. Clear cart
    if (shouldClear) {
      if (!targetCartId) {
        return NextResponse.json(
          { error: "Cart ID is required to clear cart" },
          { status: 400 }
        );
      }
      const cleared = await clearCart(targetCartId);
      return NextResponse.json(cleared, { status: 200 });
    }

    // 2. Remove by cartItemId
    if (cartItemId) {
      const updated = await removeCartItemById(cartItemId);
      return NextResponse.json(updated, { status: 200 });
    }

    // 3. Remove by variantId
    if (variantId) {
      if (!targetCartId) {
        return NextResponse.json(
          { error: "Cart ID is required when removing by variant ID" },
          { status: 400 }
        );
      }
      const updated = await removeCartItem(targetCartId, variantId);
      return NextResponse.json(updated, { status: 200 });
    }

    return NextResponse.json(
      { error: "Provide cartItemId, variantId, or clear=true to perform a deletion" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Cart delete error:", error);
    const message = error instanceof Error ? error.message : "Failed to remove item from cart";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
