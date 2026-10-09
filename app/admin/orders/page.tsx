"use client";

import React, { useState, useDeferredValue } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  CreditCard,
  User,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import Breadcrumbs from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import useOrderAdmin from "@/hooks/tanstack-hooks/useOrderAdmin";
import { OrderStatus, PaymentStatus } from "@/app/api/orders/api";

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; bg: string; border: string; icon: React.ElementType }
> = {
  PENDING: {
    label: "Pending",
    color: "text-amber-800 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "text-blue-800 dark:text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    icon: CheckCircle2,
  },
  SHIPPED: {
    label: "Shipped",
    color: "text-purple-800 dark:text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    color: "text-emerald-800 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-rose-800 dark:text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    icon: XCircle,
  },
};

const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; color: string; bg: string }
> = {
  PENDING: {
    label: "Unpaid",
    color: "text-amber-700",
    bg: "bg-amber-100 dark:bg-amber-950/40",
  },
  PAID: {
    label: "Paid",
    color: "text-emerald-700",
    bg: "bg-emerald-100 dark:bg-emerald-950/40",
  },
  FAILED: {
    label: "Failed",
    color: "text-rose-700",
    bg: "bg-rose-100 dark:bg-rose-950/40",
  },
  REFUNDED: {
    label: "Refunded",
    color: "text-zinc-700",
    bg: "bg-zinc-100 dark:bg-zinc-800",
  },
};

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | "ALL">("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const deferredSearch = useDeferredValue(search);

  const activeStatus = statusFilter === "ALL" ? undefined : statusFilter;
  const activePayment = paymentFilter === "ALL" ? undefined : paymentFilter;

  const { getOrders, updateStatus } = useOrderAdmin(
    page,
    10,
    deferredSearch,
    activeStatus,
    activePayment,
    "createdAt",
    "desc",
  );

  const { data, isLoading, isError, refetch } = getOrders;
  const orders = data?.orders || [];
  const stats = data?.stats || {
    totalOrders: 0,
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
  };
  const pagination = data?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  const handleCopyOrderNumber = (e: React.MouseEvent, num: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(num);
    setCopiedId(num);
    toast.success("Order number copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Orders Management" },
        ]}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-900/10 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#422006] tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-7 h-7 text-[#92400e]" />
            Order Management
          </h1>
          <p className="text-sm text-[#78350f]/80 mt-1">
            Track, process, and manage both devotee accounts and guest customer orders.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="self-start sm:self-auto border-amber-900/20 text-[#713f12] hover:bg-amber-100/50"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Orders
        </Button>
      </div>

      {/* Statistical Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-amber-900/10 shadow-xs bg-linear-to-br from-white to-amber-50/30">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-[#78350f]/70 font-medium">
              Total Orders
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-[#422006]">
              {stats.totalOrders}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Rs. {stats.totalRevenue.toLocaleString()} Revenue</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-900/10 shadow-xs bg-linear-to-br from-white to-amber-50/30">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-amber-700 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" /> Pending Orders
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-amber-900">
              {stats.pending}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-[#78350f]/60">Awaiting processing</span>
          </CardContent>
        </Card>

        <Card className="border-amber-900/10 shadow-xs bg-linear-to-br from-white to-blue-50/30">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-blue-700 font-medium flex items-center gap-1">
              <Truck className="w-3 h-3" /> In Transit / Confirmed
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-blue-900">
              {stats.confirmed + stats.shipped}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-[#78350f]/60">Active fulfillment</span>
          </CardContent>
        </Card>

        <Card className="border-amber-900/10 shadow-xs bg-linear-to-br from-white to-emerald-50/30">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Delivered
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-900">
              {stats.delivered}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-[#78350f]/60">Successfully received</span>
          </CardContent>
        </Card>
      </div>

      {/* Filters Toolbar */}
      <Card className="border-amber-900/10 shadow-xs">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-900/40" />
              <Input
                placeholder="Search by order #, devotee name, email, or phone..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 border-amber-900/20 focus:border-[#713f12] bg-white text-sm"
              />
            </div>

            {/* Payment Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#78350f] whitespace-nowrap">
                Payment:
              </span>
              <select
                value={paymentFilter}
                onChange={(e) => {
                  setPaymentFilter(e.target.value as PaymentStatus | "ALL");
                  setPage(1);
                }}
                className="text-xs font-medium border border-amber-900/20 rounded-md px-2.5 py-1.5 bg-white text-[#422006] focus:outline-none focus:ring-1 focus:ring-[#713f12]"
              >
                <option value="ALL">All Payments</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending Payment</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-amber-900/5">
            <span className="text-xs font-semibold text-[#78350f] mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Status:
            </span>
            {(["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const).map(
              (st) => {
                const isActive = statusFilter === st;
                return (
                  <button
                    key={st}
                    onClick={() => {
                      setStatusFilter(st);
                      setPage(1);
                    }}
                    className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                      isActive
                        ? "bg-[#713f12] text-white shadow-xs"
                        : "bg-amber-100/60 hover:bg-amber-200/60 text-[#713f12]"
                    }`}
                  >
                    {st === "ALL" ? "All" : statusConfig[st as OrderStatus]?.label || st}
                  </button>
                );
              },
            )}
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-amber-900/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-amber-900/5 border-b border-amber-900/10 text-xs font-semibold text-[#78350f]">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer / Contact</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/10">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#78350f]/60">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#713f12]" />
                    Loading orders...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-rose-600">
                    Failed to load orders. Please refresh and try again.
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#78350f]/60">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const statusMeta = statusConfig[order.status];
                  const StatusIcon = statusMeta.icon;
                  const paymentMeta = paymentStatusConfig[order.paymentStatus];
                  const isGuest = !order.userId;

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-amber-50/50 transition-colors"
                    >
                      {/* Order Number & Type */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-semibold text-[#422006]">
                          <span>{order.orderNumber}</span>
                          <button
                            onClick={(e) =>
                              handleCopyOrderNumber(e, order.orderNumber)
                            }
                            className="p-1 text-amber-900/40 hover:text-amber-900 rounded transition-colors"
                            title="Copy Order #"
                          >
                            {copiedId === order.orderNumber ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {isGuest ? (
                            <Badge
                              variant="secondary"
                              className="text-[10px] py-0 px-1.5 bg-amber-100 text-[#713f12]"
                            >
                              <User className="w-2.5 h-2.5 mr-1" /> Guest
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="text-[10px] py-0 px-1.5 bg-blue-100 text-blue-800"
                            >
                              <UserCheck className="w-2.5 h-2.5 mr-1" /> Registered
                            </Badge>
                          )}
                          <span className="text-[11px] text-[#78350f]/60">
                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Customer / Devotee Details */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#422006]">
                          {order.customerName}
                        </div>
                        <div className="text-xs text-[#78350f]/75">
                          {order.customerPhone}
                        </div>
                        <div className="text-xs text-[#78350f]/60 truncate max-w-[180px]">
                          {order.customerEmail}
                        </div>
                      </td>

                      {/* Line Items Count */}
                      <td className="py-3.5 px-4 text-xs text-[#78350f]">
                        <span className="font-semibold text-[#422006]">
                          {order.items?.length || 0}
                        </span>{" "}
                        item(s)
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#713f12]">
                          Rs. {order.totalAmount.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-[#78350f]/60">
                          {order.shippingFee > 0
                            ? `+ Rs. ${order.shippingFee} shipping`
                            : "Free Delivery"}
                        </div>
                      </td>

                      {/* Payment Status & Method */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${paymentMeta.bg} ${paymentMeta.color}`}
                          >
                            {paymentMeta.label}
                          </span>
                          <span className="text-xs font-semibold text-[#78350f]/80 uppercase">
                            {order.paymentMethod}
                          </span>
                        </div>
                      </td>

                      {/* Order Lifecycle Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusMeta.bg} ${statusMeta.color} border ${statusMeta.border}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusMeta.label}
                        </span>
                      </td>

                      {/* Action Links */}
                      <td className="py-3.5 px-4 text-right">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs border-amber-900/20 text-[#713f12] hover:bg-amber-100"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1.5" />
                            Manage
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-amber-900/10 bg-amber-900/5">
            <span className="text-xs text-[#78350f]">
              Showing page <strong className="text-[#422006]">{pagination.page}</strong> of{" "}
              <strong className="text-[#422006]">{pagination.totalPages}</strong> (
              {pagination.total} total orders)
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-8 w-8 p-0 border-amber-900/20"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                className="h-8 w-8 p-0 border-amber-900/20"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
