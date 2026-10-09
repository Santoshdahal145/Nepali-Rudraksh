import { db } from "../../src/prisma/db";
import { AppError } from "../../lib/error";
import crypto from "crypto";
import {
  CreateOrderInput,
  UpdateOrderStatusInput,
  GetOrdersQueryInput,
} from "./order.schema";

/**
 * Generate a clean, human-readable order number.
 * e.g., NR-202610-8492
 */
function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `NR-${dateStr}-${randomSuffix}`;
}

/**
 * Create a new Order (Supports both Guest and Logged-in users)
 */
export async function createOrder(
  data: CreateOrderInput,
  userId?: number | null,
) {
  if (!data.items || data.items.length === 0) {
    throw new AppError("Order must contain at least one item", 400);
  }

  // Calculate financial totals
  const subtotal = data.items.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0,
  );
  const shippingFee = data.shippingFee || 0;
  const totalAmount = subtotal + shippingFee;

  const orderNumber = generateOrderNumber();
  const guestToken = crypto.randomUUID();

  // Create order and line items inside a database transaction
  const createdOrder = await db.transaction(async (tx) => {
    // 1. Create Order record
    const order = await tx.orm.public.Order.create({
      orderNumber,
      userId: userId ?? null,
      guestToken,
      customerName: data.customerName,
      customerEmail: data.customerEmail.toLowerCase(),
      customerPhone: data.customerPhone,
      shippingAddress: data.shippingAddress,
      shippingCity: data.shippingCity,
      subtotal,
      shippingFee,
      totalAmount,
      status: "PENDING",
      paymentStatus: data.paymentMethod === "COD" ? "PENDING" : "PENDING",
      paymentMethod: data.paymentMethod,
      paymentRef: data.paymentRef || null,
      notes: data.notes || null,
    });

    // 2. Create Order Items
    for (const item of data.items) {
      await tx.orm.public.OrderItem.create({
        orderId: order.id,
        variantId: item.variantId ?? null,
        productName: item.productName,
        sku: item.sku,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
      });

      // Optionally deduct stock if variantId is attached
      if (item.variantId) {
        const variant = await tx.orm.public.ProductVariant
          .where({ id: item.variantId })
          .first();
        if (variant && variant.stock >= item.quantity) {
          await tx.orm.public.ProductVariant
            .where({ id: item.variantId })
            .update({ stock: variant.stock - item.quantity });
        }
      }
    }

    return order;
  });

  // Return full order with items
  return await getOrderById(createdOrder.id);
}

/**
 * Get single order by ID with line items and user details
 */
export async function getOrderById(id: number) {
  const order = await db.orm.public.Order
    .where({ id })
    .include("items")
    .include("user")
    .first();

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  return order;
}

/**
 * Public/Guest: Get order by guest token and ID for secure guest tracking
 */
export async function getOrderByGuestToken(guestToken: string, id: number) {
  const order = await db.orm.public.Order
    .where({ guestToken, id })
    .include("items")
    .first();

  if (!order) {
    throw new AppError("Order not found or invalid access token", 404);
  }

  return order;
}

/**
 * Public/Guest: Lookup order by orderNumber + email/phone
 */
export async function trackOrderByNumberAndContact(
  orderNumber: string,
  contact: string,
) {
  const cleanNumber = orderNumber.trim();
  const cleanContact = contact.trim().toLowerCase();

  const allOrders = await db.orm.public.Order
    .where({ orderNumber: cleanNumber })
    .include("items")
    .all();

  const matching = allOrders.find(
    (o) =>
      o.customerEmail.toLowerCase() === cleanContact ||
      o.customerPhone.trim() === cleanContact,
  );

  if (!matching) {
    throw new AppError(
      "No order found matching the provided order number and contact detail",
      404,
    );
  }

  return matching;
}

/**
 * Customer: Get all orders placed by a specific logged-in user
 */
export async function getUserOrders(userId: number) {
  const orders = await db.orm.public.Order
    .where({ userId })
    .include("items")
    .orderBy((o) => o.createdAt.desc())
    .all();

  return orders;
}

/**
 * Admin: Get all orders with search, filters, sorting, and pagination
 */
export async function getAllOrdersAdmin(
  params: GetOrdersQueryInput = {
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
) {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    paymentStatus,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const offset = (page - 1) * limit;

  let collection = db.orm.public.Order.include("items").include("user");

  if (status) {
    collection = collection.where({ status });
  }

  if (paymentStatus) {
    collection = collection.where({ paymentStatus });
  }

  if (sortBy === "totalAmount") {
    collection = collection.orderBy((o) =>
      sortOrder === "asc" ? o.totalAmount.asc() : o.totalAmount.desc(),
    );
  } else if (sortBy === "orderNumber") {
    collection = collection.orderBy((o) =>
      sortOrder === "asc" ? o.orderNumber.asc() : o.orderNumber.desc(),
    );
  } else {
    collection = collection.orderBy((o) =>
      sortOrder === "asc" ? o.createdAt.asc() : o.createdAt.desc(),
    );
  }

  let allOrders = await collection.all();

  // Search filtering in memory if provided
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    allOrders = allOrders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.toLowerCase().includes(q),
    );
  }

  const total = allOrders.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginated = allOrders.slice(offset, offset + limit);

  // Compute quick summary statistics for dashboard cards
  const stats = {
    totalOrders: total,
    pending: allOrders.filter((o) => o.status === "PENDING").length,
    confirmed: allOrders.filter((o) => o.status === "CONFIRMED").length,
    shipped: allOrders.filter((o) => o.status === "SHIPPED").length,
    delivered: allOrders.filter((o) => o.status === "DELIVERED").length,
    cancelled: allOrders.filter((o) => o.status === "CANCELLED").length,
    totalRevenue: allOrders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((sum, o) => sum + o.totalAmount, 0),
  };

  return {
    orders: paginated,
    stats,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

/**
 * Admin: Update order status, payment status, payment ref, or internal notes
 */
export async function updateOrderStatusAdmin(
  id: number,
  data: UpdateOrderStatusInput,
) {
  const existing = await db.orm.public.Order.where({ id }).first();
  if (!existing) {
    throw new AppError("Order not found", 404);
  }

  await db.orm.public.Order.where({ id }).update({
    ...(data.status ? { status: data.status } : {}),
    ...(data.paymentStatus ? { paymentStatus: data.paymentStatus } : {}),
    ...(data.paymentRef !== undefined ? { paymentRef: data.paymentRef } : {}),
    ...(data.notes !== undefined ? { notes: data.notes } : {}),
    updatedAt: new Date(),
  });

  return await getOrderById(id);
}
