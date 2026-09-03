"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Printer,
  Truck,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  User,
  ShieldCheck,
  Package,
  Calendar,
  AlertCircle,
  FileText,
  DollarSign,
  Save,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdmin } from "../../../../providers/AdminContext";

const STATUS_STEPS = [
  "Pending",
  "Processing",
  "Blessed",
  "Shipped",
  "Delivered",
];

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { orders, updateOrderStatus } = useAdmin();

  // Find order by ID or orderNumber
  const order =
    orders.find(
      (o) =>
        o.id === resolvedParams.orderId ||
        o.orderNumber === resolvedParams.orderId
    ) || orders[0];

  const [currentStatus, setCurrentStatus] = useState<any>(
    order?.status || "Pending"
  );
  const [carrier, setCarrier] = useState(
    order?.tracking?.carrier || "Nepal Express Logistics"
  );
  const [trackingNumber, setTrackingNumber] = useState(
    order?.tracking?.trackingNumber || "NEX-891044"
  );
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  if (!order) {
    return (
      <div className="p-8 text-center">
        <p className="text-base font-bold text-[#422006]">Order not found</p>
        <Link href="/admin/orders">
          <Button className="mt-4 bg-[#713f12] text-white">
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  const handleUpdateStatus = (newStatus: any) => {
    setCurrentStatus(newStatus);
    updateOrderStatus(order.id, newStatus);
    showToast(`Order status updated to "${newStatus}".`);
  };

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Shipping tracking number saved and notified to devotee.");
  };

  const handlePrint = () => {
    window.print();
  };

  const getStepIndex = (st: string) => {
    const idx = STATUS_STEPS.indexOf(st);
    return idx === -1 ? 0 : idx;
  };

  const activeIndex = getStepIndex(currentStatus);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#713f12] px-4 py-3 text-xs font-bold text-white shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-4 w-4 text-amber-300" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders">
            <Button
              variant="outline"
              size="icon-sm"
              className="border-amber-900/15 text-[#713f12] hover:bg-amber-50"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#5c3a1e]/70">
                Order Reference:
              </span>
              <code className="text-xs font-mono bg-amber-100/70 px-1.5 py-0.5 rounded text-[#422006]">
                #{order.orderNumber}
              </code>
              <Badge variant="gold" className="text-[10px]">
                {order.paymentStatus} via {order.paymentMethod}
              </Badge>
            </div>
            <h1 className="text-2xl font-extrabold text-[#422006]">
              Order #{order.orderNumber}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="h-9 gap-1.5 border-amber-900/20 text-xs font-bold text-[#713f12] hover:bg-amber-50"
          >
            <Printer className="h-4 w-4" />
            Print Temple Invoice
          </Button>
        </div>
      </div>

      {/* Progress Stepper Card */}
      <Card className="shadow-xs p-6">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#422006]">
              Fulfillment & Consecration Progress
            </h3>
            <p className="text-xs text-muted-foreground">
              Current Phase:{" "}
              <strong className="text-[#713f12]">{currentStatus}</strong>
            </p>
          </div>

          {/* Quick change buttons */}
          <div className="flex flex-wrap gap-1.5">
            {STATUS_STEPS.map((step) => (
              <Button
                key={step}
                variant={currentStatus === step ? "default" : "outline"}
                size="xs"
                onClick={() => handleUpdateStatus(step)}
                className={`text-[11px] font-bold ${
                  currentStatus === step
                    ? "bg-[#713f12] text-white"
                    : "border-amber-900/15 text-[#5c3a1e]"
                }`}
              >
                {step}
              </Button>
            ))}
          </div>
        </div>

        {/* Visual Stepper */}
        <div className="mt-6 flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-amber-200 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-[#713f12] -translate-y-1/2 z-0 transition-all duration-300"
            style={{
              width: `${(activeIndex / (STATUS_STEPS.length - 1)) * 100}%`,
            }}
          />

          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx <= activeIndex;
            const isCurrent = idx === activeIndex;

            return (
              <div
                key={step}
                onClick={() => handleUpdateStatus(step)}
                className="relative z-10 flex flex-col items-center cursor-pointer group"
              >
                <div
                  className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-xs font-bold transition-all shadow-xs ${
                    isCompleted
                      ? "bg-[#713f12] text-white"
                      : "bg-white border-2 border-amber-200 text-muted-foreground"
                  } ${isCurrent ? "ring-4 ring-amber-300/60" : ""}`}
                >
                  {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                </div>
                <span
                  className={`mt-1.5 text-[10px] sm:text-xs font-bold text-center ${
                    isCompleted ? "text-[#713f12]" : "text-muted-foreground"
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Items & Consecration Notes */}
        <div className="space-y-6 lg:col-span-2">
          {/* Ordered Items Table */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Package className="h-4 w-4 text-[#713f12]" />
                Items Ordered ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sacred Item</TableHead>
                    <TableHead>Mukhi</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100/70 text-lg">
                            {item.emoji}
                          </span>
                          <span className="font-bold text-xs text-[#422006]">
                            {item.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-amber-800">
                        {item.mukhiType}
                      </TableCell>
                      <TableCell className="text-xs">${item.price}</TableCell>
                      <TableCell className="text-xs font-bold">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right font-black text-xs text-[#713f12]">
                        ${item.total}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Devotee Consecration & Sankalp Details */}
          <Card className="shadow-xs border-amber-900/20 bg-gradient-to-br from-amber-50/70 to-orange-50/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-[#713f12]">
                <Sparkles className="h-5 w-5 text-amber-700" />
                Vedic Consecration & Sankalp Details
              </CardTitle>
              <CardDescription>
                Pashupatinath Temple Head Priest ritual prayers for this order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="rounded-xl bg-white/80 p-3 border border-amber-900/10">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">
                    Devotee Name for Sankalp
                  </span>
                  <p className="font-bold text-[#422006] text-sm mt-0.5">
                    {order.sankalpDetails?.devoteeName || order.customerName}
                  </p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 border border-amber-900/10">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">
                    Gotra Lineage
                  </span>
                  <p className="font-bold text-[#422006] text-sm mt-0.5">
                    {order.sankalpDetails?.gotra || "Kashyap Gotra"}
                  </p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 border border-amber-900/10">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">
                    Birth Star / Nakshatra
                  </span>
                  <p className="font-bold text-[#422006] text-sm mt-0.5">
                    {order.sankalpDetails?.birthStar || "Rohini Nakshatra"}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-white/80 p-3 border border-amber-900/10">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">
                  Special Puja Intentions & Blessings
                </span>
                <p className="text-xs text-[#5c3a1e] mt-1 leading-relaxed">
                  {order.sankalpDetails?.specialPrayers ||
                    "Chanting of Mahamrityunjaya Mantra (108 repetitions) for health, peace, obstacle removal, and divine spiritual awakening."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Shipping & Tracking Updater */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Truck className="h-5 w-5 text-[#713f12]" />
                Courier & Shipment Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveTracking} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#422006]">
                      Courier Carrier
                    </label>
                    <Input
                      type="text"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#422006]">
                      Tracking Number
                    </label>
                    <Input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="h-10 font-mono font-bold"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="h-9 gap-1.5 bg-[#713f12] text-xs font-bold text-white hover:bg-[#5c330e]"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save & Dispatch Tracking
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Customer & Pricing Summary */}
        <div className="space-y-6 lg:col-span-1">
          {/* Pricing Breakdown */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({order.items.length} items)</span>
                <span className="font-semibold text-[#422006]">
                  ${order.subtotal}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Consecration & Energization</span>
                <span className="font-semibold text-[#422006]">
                  {order.consecrationFee > 0
                    ? `$${order.consecrationFee}`
                    : "Free Temple Blessing"}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Himalayan Shipping Fee</span>
                <span className="font-semibold text-[#422006]">
                  {order.shippingFee > 0
                    ? `$${order.shippingFee}`
                    : "Free Express Shipping"}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Festival Discount</span>
                  <span>-${order.discount}</span>
                </div>
              )}
              <div className="pt-3 border-t border-amber-900/10 flex justify-between items-baseline">
                <span className="text-sm font-bold text-[#422006]">
                  Total Amount
                </span>
                <span className="text-xl font-black text-[#713f12]">
                  ${order.total}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Devotee Info */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="h-4 w-4 text-[#713f12]" />
                Customer / Devotee
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div>
                <p className="font-bold text-sm text-[#422006]">
                  {order.customerName}
                </p>
                <Link
                  href={`/admin/all-users/${order.userId}`}
                  className="text-[11px] text-[#713f12] font-semibold hover:underline"
                >
                  View Devotee Profile →
                </Link>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-amber-900/10">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="text-[#422006] font-medium">
                    {order.customerEmail}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  <span className="text-[#422006] font-medium">
                    {order.customerPhone}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#713f12]" />
                Shipping Destination
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1 text-[#5c3a1e]">
              <p className="font-bold text-[#422006]">
                {order.shippingAddress.street}
              </p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
              </p>
              <p className="font-bold text-amber-900">
                {order.shippingAddress.country}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
