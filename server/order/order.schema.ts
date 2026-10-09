import { z } from "zod";

/**
 * Order Status Lifecycle Enum
 */
export const OrderStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);
export type OrderStatus = z.infer<typeof OrderStatusEnum>;

/**
 * Payment Status Enum
 */
export const PaymentStatusEnum = z.enum([
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
]);
export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;

/**
 * Payment Gateway / Method Enum
 */
export const PaymentMethodEnum = z.enum([
  "ESEWA",
  "KHALTI",
  "STRIPE",
  "COD",
]);
export type PaymentMethod = z.infer<typeof PaymentMethodEnum>;

/**
 * Single line item payload when creating an order
 */
export const orderItemInputSchema = z.object({
  variantId: z.number().int().positive().optional().nullable(),
  productName: z.string().trim().min(1, { message: "Product name is required" }),
  sku: z.string().trim().min(1, { message: "SKU is required" }),
  unitPrice: z.number().int().min(0, { message: "Unit price cannot be negative" }),
  quantity: z.number().int().min(1, { message: "Quantity must be at least 1" }).default(1),
});
export type OrderItemInput = z.infer<typeof orderItemInputSchema>;

/**
 * Create Order Payload (Supports both Guest and Logged-in checkouts)
 */
export const createOrderSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, { message: "Customer full name must be at least 2 characters" }),
  customerEmail: z
    .string()
    .trim()
    .email({ message: "Please provide a valid email address" }),
  customerPhone: z
    .string()
    .trim()
    .min(5, { message: "Please provide a valid phone number" }),
  shippingAddress: z
    .string()
    .trim()
    .min(3, { message: "Shipping address line is required" }),
  shippingCity: z
    .string()
    .trim()
    .min(2, { message: "Shipping city is required" }),

  paymentMethod: PaymentMethodEnum,
  paymentRef: z.string().trim().optional().nullable(),

  shippingFee: z.number().int().min(0).default(0),
  notes: z.string().trim().optional().nullable(),

  items: z
    .array(orderItemInputSchema)
    .min(1, { message: "At least one item is required to place an order" }),
});
export type CreateOrderInput = z.infer<typeof createOrderSchema>;

/**
 * Admin Status Update Payload
 */
export const updateOrderStatusSchema = z.object({
  status: OrderStatusEnum.optional(),
  paymentStatus: PaymentStatusEnum.optional(),
  paymentRef: z.string().trim().optional().nullable(),
  notes: z.string().trim().optional().nullable(),
});
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

/**
 * Filter & Pagination Query Schema for Admin
 */
export const getOrdersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  status: OrderStatusEnum.optional(),
  paymentStatus: PaymentStatusEnum.optional(),
  sortBy: z
    .enum(["createdAt", "totalAmount", "orderNumber"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
export type GetOrdersQueryInput = z.infer<typeof getOrdersQuerySchema>;
