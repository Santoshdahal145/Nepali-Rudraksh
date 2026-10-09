"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  CreditCard,
  Sparkles,
  ShoppingBag,
  RefreshCw,
  PhoneCall,
  Mail,
} from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { OrderType, OrderStatus } from "@/app/api/orders/api";

const statusSteps: Array<{
  status: OrderStatus;
  label: string;
  desc: string;
  icon: React.ElementType;
}> = [
  {
    status: "PENDING",
    label: "Order Placed",
    desc: "Order received & temple preparation queued",
    icon: Clock,
  },
  {
    status: "CONFIRMED",
    label: "Consecrated & Confirmed",
    desc: "Vedic verification & packaging completed",
    icon: CheckCircle2,
  },
  {
    status: "SHIPPED",
    label: "In Transit",
    desc: "Handed over to courier service",
    icon: Truck,
  },
  {
    status: "DELIVERED",
    label: "Delivered",
    desc: "Received with sacred blessings",
    icon: Sparkles,
  },
];

export default function SingleOrderCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [order, setOrder] = useState<OrderType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load order");
        }
        setOrder(data);
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setIsLoading(false);
      }
    }
    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center p-8">
        <RefreshCw className="w-8 h-8 animate-spin text-[#713f12] mb-3" />
        <p className="text-sm text-[#78350f]">Retrieving your order details...</p>
      </main>
    );
  }

  if (errorMsg || !order) {
    return (
      <main className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-[#422006]">Unable to View Order</h2>
        <p className="text-sm text-[#78350f]/80 max-w-sm">
          {errorMsg || "The order could not be loaded."}
        </p>
        <Link href="/orders">
          <Button className="bg-[#713f12] hover:bg-[#854d0e] text-white text-xs">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
          </Button>
        </Link>
      </main>
    );
  }

  // Calculate current step index for the timeline
  const currentStepIndex =
    order.status === "CANCELLED"
      ? -1
      : statusSteps.findIndex((s) => s.status === order.status);

  return (
    <main className="min-h-screen bg-[#faf7f2] pb-24 pt-6 sm:pt-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "My Orders", href: "/orders" },
            { label: order.orderNumber },
          ]}
        />

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-900/10 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Link href="/orders">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 border-amber-900/20 text-[#713f12]"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-black text-[#422006] tracking-tight">
                Order {order.orderNumber}
              </h1>
            </div>
            <p className="text-xs text-[#78350f]/80 pl-11">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString(undefined, {
                dateStyle: "full",
              })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-xs border-[#713f12]/30 text-[#713f12] bg-amber-100/50"
            >
              Payment: {order.paymentMethod} ({order.paymentStatus})
            </Badge>
          </div>
        </div>

        {/* Visual Fulfillment Tracker */}
        <Card className="border-amber-900/15 shadow-xs bg-white overflow-hidden">
          <CardHeader className="bg-amber-900/5 border-b border-amber-900/10 pb-4">
            <CardTitle className="text-sm font-bold text-[#422006] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#92400e]" />
              Fulfillment Journey & Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {order.status === "CANCELLED" ? (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
                <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                <div>
                  <div className="font-bold">This order has been cancelled</div>
                  <div className="text-xs text-rose-700">
                    If you have questions or require a refund, please contact support.
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {statusSteps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const StepIcon = step.icon;

                  return (
                    <div
                      key={step.status}
                      className={`relative flex md:flex-col items-center md:items-start gap-3 p-3 rounded-xl transition-all ${
                        isCurrent
                          ? "bg-amber-500/10 border border-amber-500/30"
                          : isCompleted
                          ? "bg-emerald-500/5"
                          : "opacity-40"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          isCompleted
                            ? "bg-[#713f12] text-white"
                            : "bg-amber-100 text-[#713f12]"
                        }`}
                      >
                        <StepIcon className="w-4 h-4" />
                      </div>

                      <div className="space-y-0.5">
                        <div className="font-bold text-xs text-[#422006]">
                          {step.label}
                        </div>
                        <div className="text-[11px] text-[#78350f]/75 leading-tight">
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Details & Summary Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Purchased Items List */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-amber-900/10 shadow-xs bg-white">
              <CardHeader className="border-b border-amber-900/10 pb-3">
                <CardTitle className="text-sm font-bold text-[#422006] flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#92400e]" />
                  Items in this Order ({order.items?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-amber-900/10">
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="font-semibold text-sm text-[#422006]">
                          {item.productName}
                        </div>
                        <div className="text-xs text-[#78350f]/70">
                          SKU: {item.sku} • Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="text-right font-bold text-sm text-[#713f12]">
                        Rs. {(item.unitPrice * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals Breakdown */}
                <div className="p-4 bg-amber-50/40 border-t border-amber-900/10 space-y-2 text-xs text-[#5c3a1e]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rs. {order.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span>
                      {order.shippingFee > 0
                        ? `Rs. ${order.shippingFee.toLocaleString()}`
                        : "Free Delivery"}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-[#422006] pt-2 border-t border-amber-900/10">
                    <span>Total Amount Paid</span>
                    <span className="text-[#713f12]">
                      Rs. {order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery & Support Info */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <Card className="border-amber-900/10 shadow-xs bg-white">
              <CardHeader className="border-b border-amber-900/10 pb-3">
                <CardTitle className="text-sm font-bold text-[#422006] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#92400e]" />
                  Delivery Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2 text-xs">
                <div className="font-semibold text-sm text-[#422006]">
                  {order.customerName}
                </div>
                <div className="text-[#5c3a1e]">{order.shippingAddress}</div>
                <div className="text-[#5c3a1e]">
                  City: <strong>{order.shippingCity}</strong>, Nepal
                </div>
                <div className="text-[#78350f]/80 pt-1">
                  Phone: {order.customerPhone}
                </div>
                <div className="text-[#78350f]/80">Email: {order.customerEmail}</div>
              </CardContent>
            </Card>

            {/* Devotee Assistance */}
            <Card className="border-amber-900/15 shadow-xs bg-linear-to-br from-amber-100/50 to-white">
              <CardContent className="p-4 space-y-2 text-xs">
                <div className="font-bold text-[#422006] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#92400e]" />
                  Need Help With Your Order?
                </div>
                <p className="text-[#78350f]/80 leading-relaxed">
                  Our temple coordinators are available to answer queries about
                  energization, tracking, or delivery.
                </p>
                <div className="pt-2 flex flex-col gap-1.5">
                  <a
                    href="mailto:support@nepalirudraksha.com"
                    className="flex items-center gap-1.5 text-[#713f12] font-semibold hover:underline"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    support@nepalirudraksha.com
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
