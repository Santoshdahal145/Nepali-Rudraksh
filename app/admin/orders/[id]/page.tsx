"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  User,
  UserCheck,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  CreditCard,
  Package,
  Copy,
  Check,
  ExternalLink,
  Save,
  RefreshCw,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import Breadcrumbs from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useSingleOrderAdmin } from "@/hooks/tanstack-hooks/useOrderAdmin";
import { OrderStatus, PaymentStatus } from "@/app/api/orders/api";

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; bg: string; border: string; icon: React.ElementType }
> = {
  PENDING: {
    label: "Pending",
    color: "text-amber-800",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "text-blue-800",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    icon: CheckCircle2,
  },
  SHIPPED: {
    label: "Shipped",
    color: "text-purple-800",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    color: "text-emerald-800",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-rose-800",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    icon: XCircle,
  },
};

export default function AdminSingleOrderPage() {
  const params = useParams();
  const router = useRouter();

  const idParam = params?.id || params?.orderId;
  const orderId = idParam ? parseInt(String(idParam), 10) : null;

  const { getOrder, updateStatus } = useSingleOrderAdmin(orderId);
  const { data: order, isLoading, isError, refetch } = getOrder;

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("PENDING");
  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState<PaymentStatus>("PENDING");
  const [paymentRefInput, setPaymentRefInput] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync state once order data is loaded
  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
      setSelectedPaymentStatus(order.paymentStatus);
      setPaymentRefInput(order.paymentRef || "");
      setNotesInput(order.notes || "");
    }
  }, [order]);

  const handleSaveChanges = async () => {
    if (!orderId) return;
    try {
      await updateStatus.mutateAsync({
        status: selectedStatus,
        paymentStatus: selectedPaymentStatus,
        paymentRef: paymentRefInput || null,
        notes: notesInput || null,
      });
      toast.success("Order status and details updated successfully");
    } catch {
      toast.error("Failed to update order details");
    }
  };

  const guestTrackingUrl =
    typeof window !== "undefined" && order?.guestToken
      ? `${window.location.origin}/orders/guest/${order.guestToken}/${order.id}`
      : "";

  const handleCopyTrackingLink = () => {
    if (guestTrackingUrl) {
      navigator.clipboard.writeText(guestTrackingUrl);
      setCopiedLink(true);
      toast.success("Public guest tracking link copied to clipboard");
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[50vh]">
        <RefreshCw className="w-8 h-8 animate-spin text-[#713f12] mb-3" />
        <p className="text-sm text-[#78350f]/80">Loading order details...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center space-y-4">
        <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-[#422006]">Order Not Found</h2>
        <p className="text-sm text-[#78350f]/80">
          The requested order could not be located or may have been removed.
        </p>
        <Button
          onClick={() => router.push("/admin/orders")}
          className="bg-[#713f12] hover:bg-[#854d0e] text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
        </Button>
      </div>
    );
  }

  const currentStatusMeta = statusConfig[order.status];
  const StatusIcon = currentStatusMeta.icon;
  const isGuest = !order.userId;

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Orders", href: "/admin/orders" },
          { label: order.orderNumber },
        ]}
      />

      {/* Header with Navigation and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-900/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Link href="/admin/orders">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 border-amber-900/20 text-[#713f12]"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#422006] tracking-tight">
              Order {order.orderNumber}
            </h1>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${currentStatusMeta.bg} ${currentStatusMeta.color} border ${currentStatusMeta.border}`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              {currentStatusMeta.label}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#78350f]/80 pl-11">
            <span>
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
            <span>•</span>
            {isGuest ? (
              <Badge
                variant="secondary"
                className="text-[10px] py-0 px-1.5 bg-amber-100 text-[#713f12]"
              >
                <User className="w-2.5 h-2.5 mr-1" /> Guest Order
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="text-[10px] py-0 px-1.5 bg-blue-100 text-blue-800"
              >
                <UserCheck className="w-2.5 h-2.5 mr-1" /> Registered Devotee
              </Badge>
            )}
          </div>
        </div>

        {/* Public Tracking Link Button (especially helpful for guest orders) */}
        {order.guestToken && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyTrackingLink}
            className="border-amber-900/20 text-[#713f12] hover:bg-amber-100/60 self-start sm:self-auto"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                Copied Public Link
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Copy Public Tracking URL
              </>
            )}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Left Columns: Items & Shipping */}
        <div className="lg:col-span-2 space-y-6">
          {/* Purchased Items Card */}
          <Card className="border-amber-900/10 shadow-xs">
            <CardHeader className="pb-3 border-b border-amber-900/10 bg-amber-900/5">
              <CardTitle className="text-base font-bold text-[#422006] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#92400e]" />
                Purchased Sacred Items ({order.items?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-amber-900/10">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-amber-50/30 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="font-semibold text-sm text-[#422006]">
                        {item.productName}
                      </div>
                      <div className="text-xs text-[#78350f]/70">
                        SKU: <span className="font-mono">{item.sku}</span>
                      </div>
                      <div className="text-xs text-[#78350f]/60">
                        Rs. {item.unitPrice.toLocaleString()} × {item.quantity}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-sm text-[#713f12]">
                        Rs. {(item.unitPrice * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Cost Breakdown */}
              <div className="p-4 bg-amber-50/40 border-t border-amber-900/10 space-y-2 text-sm">
                <div className="flex justify-between text-[#78350f]/80">
                  <span>Subtotal</span>
                  <span>Rs. {order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#78350f]/80">
                  <span>Shipping Fee</span>
                  <span>
                    {order.shippingFee > 0
                      ? `Rs. ${order.shippingFee.toLocaleString()}`
                      : "Free Delivery"}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base text-[#422006] pt-2 border-t border-amber-900/10">
                  <span>Total Payable</span>
                  <span className="text-[#713f12]">
                    Rs. {order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping & Delivery Address Card */}
          <Card className="border-amber-900/10 shadow-xs">
            <CardHeader className="pb-3 border-b border-amber-900/10 bg-amber-900/5">
              <CardTitle className="text-base font-bold text-[#422006] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#92400e]" />
                Shipping & Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-sm">
              <div>
                <div className="font-semibold text-[#422006]">
                  {order.shippingAddress}
                </div>
                <div className="text-[#78350f]/80">
                  City / Location: <strong>{order.shippingCity}</strong>, Nepal
                </div>
              </div>

              {order.notes && (
                <div className="pt-3 border-t border-amber-900/10">
                  <span className="text-xs font-semibold text-[#78350f] flex items-center gap-1 mb-1">
                    <FileText className="w-3.5 h-3.5" /> Customer Notes:
                  </span>
                  <p className="text-xs bg-amber-100/50 p-2.5 rounded-md text-[#5c3a1e] italic">
                    &ldquo;{order.notes}&rdquo;
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Customer Details & Order Status Controls */}
        <div className="space-y-6">
          {/* Admin Management & Status Update Panel */}
          <Card className="border-amber-900/20 shadow-sm bg-linear-to-b from-white to-amber-50/40">
            <CardHeader className="pb-3 border-b border-amber-900/10">
              <CardTitle className="text-base font-bold text-[#422006]">
                Manage Order Status
              </CardTitle>
              <CardDescription className="text-xs text-[#78350f]/80">
                Update fulfillment and payment stages
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-sm">
              {/* Order Status Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#422006]">
                  Order Fulfillment Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value as OrderStatus)
                  }
                  className="w-full text-xs font-medium border border-amber-900/20 rounded-md p-2 bg-white text-[#422006] focus:outline-none focus:ring-1 focus:ring-[#713f12]"
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              {/* Payment Status Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#422006]">
                  Payment Status
                </label>
                <select
                  value={selectedPaymentStatus}
                  onChange={(e) =>
                    setSelectedPaymentStatus(e.target.value as PaymentStatus)
                  }
                  className="w-full text-xs font-medium border border-amber-900/20 rounded-md p-2 bg-white text-[#422006] focus:outline-none focus:ring-1 focus:ring-[#713f12]"
                >
                  <option value="PENDING">Pending (Unpaid)</option>
                  <option value="PAID">Paid</option>
                  <option value="FAILED">Failed</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>

              {/* Payment Reference ID Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#422006]">
                  Gateway Transaction Ref (eSewa / Khalti)
                </label>
                <Input
                  value={paymentRefInput}
                  onChange={(e) => setPaymentRefInput(e.target.value)}
                  placeholder="e.g. TXN-92837482"
                  className="text-xs border-amber-900/20 bg-white"
                />
              </div>

              {/* Admin Internal Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#422006]">
                  Internal / Customer Notes
                </label>
                <textarea
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Add notes about courier tracking number or dispatch..."
                  rows={3}
                  className="w-full text-xs border border-amber-900/20 rounded-md p-2 bg-white text-[#422006] focus:outline-none focus:ring-1 focus:ring-[#713f12]"
                />
              </div>

              <Button
                onClick={handleSaveChanges}
                disabled={updateStatus.isPending}
                className="w-full bg-[#713f12] hover:bg-[#854d0e] text-white font-semibold text-xs"
              >
                {updateStatus.isPending ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Devotee / Customer Information Card */}
          <Card className="border-amber-900/10 shadow-xs">
            <CardHeader className="pb-3 border-b border-amber-900/10 bg-amber-900/5">
              <CardTitle className="text-base font-bold text-[#422006] flex items-center gap-2">
                <User className="w-4 h-4 text-[#92400e]" />
                Customer Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-[#713f12] font-bold text-xs shrink-0">
                  {order.customerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-[#422006]">
                    {order.customerName}
                  </div>
                  <div className="text-xs text-[#78350f]/70">
                    {isGuest ? "Guest Checkout" : "Registered User"}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-amber-900/10 text-xs">
                <div className="flex items-center gap-2 text-[#78350f]">
                  <Mail className="w-3.5 h-3.5 text-amber-900/60" />
                  <a
                    href={`mailto:${order.customerEmail}`}
                    className="hover:underline text-[#713f12] font-medium"
                  >
                    {order.customerEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-[#78350f]">
                  <Phone className="w-3.5 h-3.5 text-amber-900/60" />
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="hover:underline text-[#713f12] font-medium"
                  >
                    {order.customerPhone}
                  </a>
                </div>
              </div>

              {/* Payment Method Details */}
              <div className="pt-2 border-t border-amber-900/10 text-xs space-y-1">
                <div className="font-semibold text-[#422006] flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-amber-900/60" />
                  Payment: {order.paymentMethod}
                </div>
                {order.paymentRef && (
                  <div className="text-[#78350f]/75 font-mono text-[11px]">
                    Ref: {order.paymentRef}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
