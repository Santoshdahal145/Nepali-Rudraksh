import { z } from "zod";

// ── Schemas ──────────────────────────────────────────────────────────────────

export const addToCartSchema = z.object({
  cartId: z.number().int().positive().optional(),
  variantId: z.number().int().positive({ message: "Variant ID must be a positive integer" }),
  quantity: z
    .number()
    .int({ message: "Quantity must be an integer" })
    .min(1, { message: "Quantity must be at least 1" })
    .default(1),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;

export const updateCartItemQuantitySchema = z.object({
  cartId: z.number().int().positive().optional(),
  variantId: z.number().int().positive().optional(),
  cartItemId: z.number().int().positive().optional(),
  quantity: z
    .number()
    .int({ message: "Quantity must be an integer" })
    .min(0, { message: "Quantity cannot be negative" }),
});

export type UpdateCartItemQuantityInput = z.infer<typeof updateCartItemQuantitySchema>;

export const removeCartItemSchema = z.object({
  cartId: z.number().int().positive().optional(),
  variantId: z.number().int().positive().optional(),
  cartItemId: z.number().int().positive().optional(),
});

export type RemoveCartItemInput = z.infer<typeof removeCartItemSchema>;

export const mergeCartSchema = z.object({
  guestCartId: z.number().int().positive({ message: "Guest cart ID is required" }),
  userId: z.number().int().positive({ message: "User ID is required" }),
});

export type MergeCartInput = z.infer<typeof mergeCartSchema>;

export const syncCartItemSchema = z.object({
  variantId: z.number().int().positive({ message: "Variant ID must be a positive integer" }),
  quantity: z
    .number()
    .int({ message: "Quantity must be an integer" })
    .min(1, { message: "Quantity must be at least 1" }),
});

export type SyncCartItemInput = z.infer<typeof syncCartItemSchema>;

export const syncCartSchema = z.object({
  cartId: z.number().int().positive().optional(),
  items: z.array(syncCartItemSchema),
});

export type SyncCartInput = z.infer<typeof syncCartSchema>;
