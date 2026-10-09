import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  orderApi,
  OrderType,
  AllOrdersAdminResponse,
  UpdateOrderStatusPayload,
  OrderStatus,
  PaymentStatus,
} from "@/app/api/orders/api";
import { requestAPI } from "@/lib/requestAPI";

export const enum ORDER_KEYS {
  create = "create-order",
  updateStatus = "update-order-status",
  getAll = "all-orders-admin",
  getSingle = "single-order-admin",
  myOrders = "my-orders",
}

/**
 * Admin management hook for listing, filtering, and updating orders
 */
export default function useOrderAdmin(
  page = 1,
  limit = 10,
  debouncedSearch = "",
  status?: OrderStatus,
  paymentStatus?: PaymentStatus,
  sortBy: "createdAt" | "totalAmount" | "orderNumber" = "createdAt",
  sortOrder: "asc" | "desc" = "desc",
) {
  const queryClient = useQueryClient();

  // GET ALL with pagination, search, status and paymentStatus filters
  const getOrders = useQuery({
    queryKey: [
      ORDER_KEYS.getAll,
      page,
      limit,
      debouncedSearch,
      status,
      paymentStatus,
      sortBy,
      sortOrder,
    ],
    queryFn: async () => {
      const res = await requestAPI<AllOrdersAdminResponse>(
        orderApi.getAllAdmin({
          page,
          limit,
          search: debouncedSearch,
          status,
          paymentStatus,
          sortBy,
          sortOrder,
        }),
      );
      return res.data as AllOrdersAdminResponse;
    },
  });

  // UPDATE ORDER STATUS (status, paymentStatus, paymentRef, notes)
  const updateStatus = useMutation({
    mutationKey: [ORDER_KEYS.updateStatus],
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateOrderStatusPayload;
    }) => {
      const response = await requestAPI<OrderType>(
        orderApi.updateStatus(id, data),
      );
      return response.data as OrderType;
    },

    onSuccess: (updated) => {
      // Invalidate list and update cached single item
      queryClient.invalidateQueries({
        queryKey: [ORDER_KEYS.getAll],
      });
      queryClient.setQueryData([ORDER_KEYS.getSingle, updated.id], updated);
    },
  });

  return {
    getOrders,
    updateStatus,
  };
}

/**
 * Hook for viewing and managing a single order in admin panel
 */
export function useSingleOrderAdmin(id: number | null | undefined) {
  const queryClient = useQueryClient();

  const getOrder = useQuery({
    queryKey: [ORDER_KEYS.getSingle, id],
    queryFn: async () => {
      if (!id) return null;
      const res = await requestAPI<OrderType>(orderApi.getById(id));
      return res.data as OrderType;
    },
    enabled: typeof id === "number" && !isNaN(id),
  });

  const updateStatus = useMutation({
    mutationKey: [ORDER_KEYS.updateStatus, id],
    mutationFn: async (data: UpdateOrderStatusPayload) => {
      if (!id) throw new Error("Order ID is required");
      const response = await requestAPI<OrderType>(
        orderApi.updateStatus(id, data),
      );
      return response.data as OrderType;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({
        queryKey: [ORDER_KEYS.getAll],
      });
      queryClient.setQueryData([ORDER_KEYS.getSingle, updated.id], updated);
    },
  });

  return {
    getOrder,
    updateStatus,
  };
}
