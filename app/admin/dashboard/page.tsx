"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ShieldCheck,
  Eye,
  Plus,
  Sliders,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdmin } from "../../../providers/AdminContext";
import { initialOrders, initialProducts, initialUsers } from "../data/mockData";

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
    "month"
  );

  // Compute live stats
  const totalRevenue = initialOrders.reduce(
    (sum, o) => sum + (o.paymentStatus === "Paid" ? o.total : 0),
    48290
  );
  const totalOrdersCount = initialOrders.length + 1420;
  const activeCustomersCount = initialUsers.length + 3834;
  const totalStockCount = initialProducts.reduce((sum, p) => sum + p.stock, 0);

  // Revenue chart data bars for visual graph
  const revenueData = [
    { label: "Jan", value: 32000, height: "45%" },
    { label: "Feb", value: 38500, height: "55%" },
    { label: "Mar", value: 41200, height: "60%" },
    { label: "Apr", value: 36000, height: "52%" },
    { label: "May", value: 44000, height: "68%" },
    { label: "Jun", value: 49200, height: "78%" },
    { label: "Jul", value: 54100, height: "88%" },
    { label: "Aug (Now)", value: 58900, height: "96%", highlight: true },
  ];

  const categoryStats = [
    {
      name: "Collector & Rare Mukhi",
      share: "45%",
      amount: "$26,500",
      color: "bg-amber-800",
    },
    {
      name: "Siddh Japa Malas",
      share: "28%",
      amount: "$16,490",
      color: "bg-[#713f12]",
    },
    {
      name: "Individual Mukhis (1-14)",
      share: "18%",
      amount: "$10,600",
      color: "bg-amber-600",
    },
    {
      name: "Silver Bracelets & Accessories",
      share: "9%",
      amount: "$5,300",
      color: "bg-amber-400",
    },
  ];

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
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-amber-900/10 bg-linear-to-r from-amber-100/70 via-orange-50/50 to-amber-50 p-5 sm:p-7 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge
              variant="gold"
              className="text-[10px] uppercase tracking-wider"
            >
              Live Business Intelligence
            </Badge>
            <span className="text-xs text-muted-foreground">
              Updated just now
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#422006]">
            Welcome to Temple Administration 🌿
          </h1>
          <p className="text-xs sm:text-sm text-[#5c3a1e]/80 max-w-2xl">
            Real-time analytics for sacred Himalayan Rudraksha orders, inventory
            levels, devotee consultations, and consecration schedules.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/admin/all-products">
            <Button className="h-10 gap-1.5 bg-[#713f12] text-xs font-bold text-white shadow-xs hover:bg-[#5c330e]">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
          <Link href="/admin/home-control">
            <Button
              variant="outline"
              className="h-10 gap-1.5 border-amber-900/20 bg-white text-xs font-bold text-[#713f12] hover:bg-amber-50"
            >
              <Sliders className="h-4 w-4" />
              Home Control
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card className="hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#5c3a1e]/80">
              Total Revenue
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-[#713f12]">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-[#422006]">
              ${totalRevenue.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs">
              <span className="flex items-center text-emerald-700 font-bold">
                <ArrowUpRight className="h-3.5 w-3.5" /> +18.4%
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card className="hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#5c3a1e]/80">
              Sacred Orders
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-900">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-[#422006]">
              {totalOrdersCount.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs">
              <span className="flex items-center text-emerald-700 font-bold">
                <ArrowUpRight className="h-3.5 w-3.5" /> +12.1%
              </span>
              <span className="text-muted-foreground">all-time orders</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Devotees / Customers */}
        <Card className="hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#5c3a1e]/80">
              Active Devotees
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-[#422006]">
              {activeCustomersCount.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs">
              <span className="flex items-center text-emerald-700 font-bold">
                <ArrowUpRight className="h-3.5 w-3.5" /> +8.2%
              </span>
              <span className="text-muted-foreground">across 32 countries</span>
            </div>
          </CardContent>
        </Card>

        {/* Inventory In Stock */}
        <Card className="hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#5c3a1e]/80">
              Sacred Beads In Stock
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-200 text-amber-950">
              <Package className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-[#422006]">
              {totalStockCount} Beads
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs">
              <span className="text-amber-800 font-bold">
                {initialProducts.length} Varieties
              </span>
              <span className="text-muted-foreground">1 to 21 Mukhi</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Charts & Category Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Analytics Graph */}
        <Card className="lg:col-span-2 shadow-xs">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4">
            <div>
              <CardTitle className="text-base sm:text-lg">
                Revenue & Demand Trajectory
              </CardTitle>
              <CardDescription>
                Monthly gross revenue from verified Rudraksha sales & Vedic
                consecration
              </CardDescription>
            </div>

            {/* Time toggle */}
            <div className="flex items-center rounded-xl bg-amber-100/50 p-1 border border-amber-900/10">
              <button
                onClick={() => setTimeRange("week")}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                  timeRange === "week"
                    ? "bg-white text-[#713f12] shadow-2xs"
                    : "text-[#5c3a1e]/70"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeRange("month")}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                  timeRange === "month"
                    ? "bg-white text-[#713f12] shadow-2xs"
                    : "text-[#5c3a1e]/70"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setTimeRange("year")}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                  timeRange === "year"
                    ? "bg-white text-[#713f12] shadow-2xs"
                    : "text-[#5c3a1e]/70"
                }`}
              >
                Year
              </button>
            </div>
          </CardHeader>

          <CardContent>
            {/* Visual Bar Chart */}
            <div className="pt-4">
              <div className="flex h-56 items-end justify-between gap-2 sm:gap-4 border-b border-amber-900/10 pb-2">
                {revenueData.map((bar) => (
                  <div
                    key={bar.label}
                    className="flex flex-1 flex-col items-center gap-2 group h-full justify-end"
                  >
                    <div className="text-[10px] sm:text-xs font-bold text-[#713f12] opacity-0 group-hover:opacity-100 transition-opacity">
                      ${(bar.value / 1000).toFixed(1)}k
                    </div>
                    <div
                      style={{ height: bar.height }}
                      className={`w-full rounded-t-xl transition-all duration-300 group-hover:opacity-90 ${
                        bar.highlight
                          ? "bg-gradient-to-t from-[#713f12] to-amber-500 shadow-md shadow-amber-950/20"
                          : "bg-amber-200/80 hover:bg-amber-300"
                      }`}
                    />
                    <span className="text-[10px] sm:text-xs font-semibold text-[#5c3a1e]/70 truncate">
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-linear-to-t from-[#713f12] to-amber-500" />
                  <span>Current Month Peak ($58.9k)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-amber-200" />
                  <span>Historical Average</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Share & High Demand Breakdown */}
        <Card className="shadow-xs flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Sales by Sacred Category
            </CardTitle>
            <CardDescription>
              Volume share across collector beads and malas
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {categoryStats.map((cat) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#422006]">
                  <span className="truncate">{cat.name}</span>
                  <span>
                    {cat.share} ({cat.amount})
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-amber-100">
                  <div
                    style={{ width: cat.share }}
                    className={`h-full rounded-full ${cat.color}`}
                  />
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-amber-900/10 bg-amber-50/60 p-3.5 mt-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#713f12]">
                <Sparkles className="h-4 w-4 text-amber-700" />
                <span>Vedic Trend Insight</span>
              </div>
              <p className="text-[11px] text-[#5c3a1e]/80 mt-1 leading-relaxed">
                Demand for <strong>Gauri Shankar</strong> and{" "}
                <strong>14 Mukhi</strong> increased by 34% this month ahead of
                the holy festival season.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid: Recent Orders & Top Selling Sacred Products */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Orders Table */}
        <Card className="lg:col-span-2 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg">
                Recent Orders
              </CardTitle>
              <CardDescription>
                Latest sacred bead purchases and consecration orders
              </CardDescription>
            </div>
            <Link href="/admin/orders">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 border-amber-900/15 text-xs text-[#713f12]"
              >
                <span>All Orders</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialOrders.slice(0, 5).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-bold text-[#713f12]">
                        <Link
                          href={`/admin/orders/${order.orderNumber}`}
                          className="hover:underline"
                        >
                          #{order.orderNumber}
                        </Link>
                        <div className="text-[10px] text-muted-foreground">
                          {order.date.split(" ")[0]}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-[#422006] text-xs">
                          {order.customerName}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.country}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-xs text-[#422006]">
                        ${order.total}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/orders/${order.orderNumber}`}>
                          <Button
                            variant="ghost"
                            size="xs"
                            className="text-[#713f12] hover:bg-amber-100/60"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Top Products & Stock Watch */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg">
                Sacred Catalog
              </CardTitle>
              <CardDescription>Top beads & inventory health</CardDescription>
            </div>
            <Link href="/admin/all-products">
              <Button
                variant="ghost"
                size="xs"
                className="text-xs text-[#713f12]"
              >
                Manage
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="space-y-3">
            {initialProducts.slice(0, 5).map((prod) => (
              <Link
                key={prod.id}
                href={`/admin/all-products/${prod.id}`}
                className="flex items-center justify-between rounded-xl p-2.5 border border-amber-900/10 hover:bg-amber-50/60 transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100/70 text-xl">
                    {prod.emoji}
                  </div>
                  <div className="min-w-0 truncate">
                    <p className="text-xs font-bold text-[#422006] truncate group-hover:text-[#713f12]">
                      {prod.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      ${prod.price} • {prod.salesCount} sold
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      prod.stock <= 4
                        ? "bg-red-100 text-red-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {prod.stock} in stock
                  </span>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
