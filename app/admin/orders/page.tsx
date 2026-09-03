"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  Sparkles,
  DollarSign,
  Calendar,
  ChevronRight,
  Printer,
  ShieldCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdmin } from "../../../providers/AdminContext";

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleStatusChange = (orderId: string, newStatus: any) => {
    updateOrderStatus(orderId, newStatus);
    showToast(`Order status updated to "${newStatus}".`);
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingAddress.city
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.items.some((i) =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" ||
      order.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesPayment =
      paymentFilter === "all" ||
      order.paymentStatus.toLowerCase() === paymentFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const pendingCount = orders.filter(
    (o) => o.status === "Pending" || o.status === "Processing"
  ).length;
  const blessedCount = orders.filter((o) => o.status === "Blessed").length;
  const shippedCount = orders.filter((o) => o.status === "Shipped").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return <Badge variant="success">Delivered</Badge>;
      case "Shipped":
        return <Badge variant="gold">Shipped</Badge>;
      case "Blessed":
        return <Badge variant="warning">Blessed at Temple</Badge>;
      case "Processing":
        return <Badge variant="secondary">Processing</Badge>;
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#713f12] px-4 py-3 text-xs font-bold text-white shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-4 w-4 text-amber-300" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-amber-900/10 bg-linear-to-r from-amber-100/70 via-orange-50/50 to-amber-50 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" className="text-[10px]">
              Fulfillment & Consecration
            </Badge>
            <span className="text-xs text-muted-foreground">
              {orders.length} Active Orders
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#422006]">
            Sacred Orders Management
          </h1>
          <p className="text-xs sm:text-sm text-[#5c3a1e]/80 mt-1 max-w-2xl">
            Review incoming orders, coordinate Vedic temple consecrations, print
            invoices, and update courier shipments.
          </p>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-4 shadow-2xs">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Awaiting Fulfillment
          </p>
          <p className="text-2xl font-black text-[#422006] mt-1">
            {pendingCount}
          </p>
        </Card>
        <Card className="p-4 shadow-2xs">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
            Temple Blessed
          </p>
          <p className="text-2xl font-black text-amber-900 mt-1">
            {blessedCount}
          </p>
        </Card>
        <Card className="p-4 shadow-2xs">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
            In Transit (Shipped)
          </p>
          <p className="text-2xl font-black text-amber-950 mt-1">
            {shippedCount}
          </p>
        </Card>
        <Card className="p-4 shadow-2xs">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Delivered
          </p>
          <p className="text-2xl font-black text-emerald-900 mt-1">
            {deliveredCount}
          </p>
        </Card>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col gap-3 rounded-2xl border border-amber-900/10 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by order #, devotee name, email, bead item, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-10 text-xs sm:text-sm border-amber-900/15 focus-visible:ring-amber-700 bg-amber-50/20"
          />
        </div>

        {/* Status & Payment filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-xl border border-amber-900/15 bg-white px-3 text-xs font-semibold text-[#422006] outline-none focus:border-amber-700"
          >
            <option value="all">Fulfillment: All</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="blessed">Blessed at Temple</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="h-10 rounded-xl border border-amber-900/15 bg-white px-3 text-xs font-semibold text-[#422006] outline-none focus:border-amber-700"
          >
            <option value="all">Payment: All</option>
            <option value="paid">Paid</option>
            <option value="pending">Payment Pending</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <Card className="shadow-xs overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Orders List</CardTitle>
          <CardDescription>
            Showing {filteredOrders.length} of {orders.length} total orders
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <span className="text-4xl">📦</span>
              <p className="mt-2 text-sm font-bold text-[#422006]">
                No orders match query
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try searching with another order number or resetting status
                filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setPaymentFilter("all");
                }}
                className="mt-4 border-amber-900/20 text-xs text-[#713f12]"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer / Devotee</TableHead>
                    <TableHead>Items Ordered</TableHead>
                    <TableHead>Total & Payment</TableHead>
                    <TableHead>Fulfillment Status</TableHead>
                    <TableHead>Quick Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      {/* Order Number & Date */}
                      <TableCell>
                        <Link
                          href={`/admin/orders/${order.orderNumber}`}
                          className="font-bold text-[#713f12] text-xs sm:text-sm hover:underline"
                        >
                          #{order.orderNumber}
                        </Link>
                        <div className="text-[10px] text-muted-foreground">
                          {order.date}
                        </div>
                      </TableCell>

                      {/* Customer */}
                      <TableCell>
                        <div className="font-semibold text-xs text-[#422006]">
                          {order.customerName}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.country}
                        </div>
                      </TableCell>

                      {/* Items */}
                      <TableCell>
                        <div className="text-xs font-medium text-[#422006] flex items-center gap-1.5">
                          <span>{order.items[0]?.emoji}</span>
                          <span className="truncate max-w-[140px]">
                            {order.items[0]?.name}
                          </span>
                        </div>
                        {order.items.length > 1 && (
                          <div className="text-[10px] text-amber-800 font-semibold">
                            +{order.items.length - 1} additional item(s)
                          </div>
                        )}
                      </TableCell>

                      {/* Total & Payment */}
                      <TableCell>
                        <div className="font-black text-xs sm:text-sm text-[#422006]">
                          ${order.total}
                        </div>
                        <div className="flex items-center gap-1 text-[10px]">
                          <Badge
                            variant={
                              order.paymentStatus === "Paid"
                                ? "success"
                                : "warning"
                            }
                            className="text-[9px] px-1 py-0"
                          >
                            {order.paymentStatus}
                          </Badge>
                          <span className="text-muted-foreground">
                            ({order.paymentMethod})
                          </span>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>{getStatusBadge(order.status)}</TableCell>

                      {/* Quick Status Dropdown */}
                      <TableCell>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          className="h-7 rounded-lg border border-amber-900/15 bg-white px-2 text-[11px] font-semibold text-[#422006] outline-none focus:border-amber-700"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Blessed">Blessed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </TableCell>

                      {/* Action */}
                      <TableCell className="text-right">
                        <Link href={`/admin/orders/${order.orderNumber}`}>
                          <Button
                            variant="outline"
                            size="xs"
                            className="h-8 gap-1 border-amber-900/15 text-xs text-[#713f12] hover:bg-amber-100/60"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Details
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
