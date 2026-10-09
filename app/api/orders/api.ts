import { ApiRequestType } from "@/lib/requestAPI";

// ── Types ─────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type PaymentMethod = "ESEWA" | "KHALTI" | "STRIPE" | "COD";

export interface OrderItemType {
  id: number;
  orderId: number;
  variantId?: number | null;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
}

export interface OrderType {
  id: number;
  orderNumber: string;
  userId?: number | null;
  guestToken?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentRef?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  items?: OrderItemType[];
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string | null;
  } | null;
}

export interface CreateOrderItemPayload {
  variantId?: number | null;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
}

export interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  paymentMethod: PaymentMethod;
  paymentRef?: string | null;
  shippingFee?: number;
  notes?: string | null;
  items: CreateOrderItemPayload[];
}

export interface UpdateOrderStatusPayload {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentRef?: string | null;
  notes?: string | null;
}

export interface OrderFilterParams {
  [key: string]: unknown;
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  sortBy?: "createdAt" | "totalAmount" | "orderNumber";
  sortOrder?: "asc" | "desc";
}

export interface OrderStatsType {
  totalOrders: number;
  pending: number;
  confirmed: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
}

export interface AllOrdersAdminResponse {
  orders: OrderType[];
  stats: OrderStatsType;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ── Route Endpoints Registry ─────────────────────────────────────────────────

export const ORDER_API_ROUTES = {
  CREATE: "/orders",
  ADMIN_LIST: "/orders",
  ADMIN_GET_BY_ID: (id: number | string) => `/orders/${id}`,
  ADMIN_UPDATE_STATUS: (id: number | string) => `/orders/${id}`,
  MY_ORDERS: "/orders/my-orders",
  GUEST_TRACK: (guestToken: string, id: number | string) =>
    `/orders/guest/${guestToken}/${id}`,
  TRACK_BY_NUMBER: "/orders/track",
} as const;

// ── API Request Builders ─────────────────────────────────────────────────────

/** POST /api/orders — Create new order (Guest or Logged in) */
const createOrder = (data: CreateOrderPayload): ApiRequestType => ({
  method: "post",
  route: ORDER_API_ROUTES.CREATE,
  payload: data,
  showToast: true,
  successMessage: "Order placed successfully!",
});

/** GET /api/orders — Admin list with filters & pagination */
const getAllOrdersAdmin = (params?: OrderFilterParams): ApiRequestType => ({
  method: "get",
  route: ORDER_API_ROUTES.ADMIN_LIST,
  params,
  showToast: false,
});

/** GET /api/orders/[id] — Single order view */
const getOrderById = (id: number | string): ApiRequestType => ({
  method: "get",
  route: ORDER_API_ROUTES.ADMIN_GET_BY_ID(id),
  showToast: false,
});

/** PATCH /api/orders/[id] — Admin status update */
const updateOrderStatus = (
  id: number | string,
  data: UpdateOrderStatusPayload,
): ApiRequestType => ({
  method: "patch",
  route: ORDER_API_ROUTES.ADMIN_UPDATE_STATUS(id),
  payload: data,
  showToast: true,
  successMessage: "Order status updated successfully",
});

/** GET /api/orders/my-orders — Logged-in user's orders */
const getMyOrders = (): ApiRequestType => ({
  method: "get",
  route: ORDER_API_ROUTES.MY_ORDERS,
  showToast: false,
});

/** GET /api/orders/guest/[guestToken]/[id] — Public guest order view */
const getGuestOrder = (
  guestToken: string,
  id: number | string,
): ApiRequestType => ({
  method: "get",
  route: ORDER_API_ROUTES.GUEST_TRACK(guestToken, id),
  showToast: false,
});

/** POST /api/orders/track — Public lookup by number & contact */
const trackOrderByNumber = (
  orderNumber: string,
  contact: string,
): ApiRequestType => ({
  method: "post",
  route: ORDER_API_ROUTES.TRACK_BY_NUMBER,
  payload: { orderNumber, contact },
  showToast: false,
});

export const orderApi = {
  create: createOrder,
  getAllAdmin: getAllOrdersAdmin,
  getById: getOrderById,
  updateStatus: updateOrderStatus,
  getMyOrders,
  getGuestOrder,
  trackOrderByNumber,
};
