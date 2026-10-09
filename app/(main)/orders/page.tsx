"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Package,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  MapPin,
  RefreshCw,
  User,
  History,
} from "lucide-react";
import { toast } from "sonner";
import Breadcrumbs from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderType, OrderStatus } from "@/app/api/orders/api";

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; bg: string; border: string; icon: React.ElementType }
> = {
  PENDING: {
    label: "Processing",
    color: "text-amber-800",
    bg: "bg-amber-100/70",
    border: "border-amber-300",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "text-blue-800",
    bg: "bg-blue-100/70",
    border: "border-blue-300",
    icon: CheckCircle2,
  },
  SHIPPED: {
    label: "In Transit",
    color: "text-purple-800",
    bg: "bg-purple-100/70",
    border: "border-purple-300",
    icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    color: "text-emerald-800",
    bg: "bg-emerald-100/70",
    border: "border-emerald-300",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-rose-800",
    bg: "bg-rose-100/70",
    border: "border-rose-300",
    icon: XCircle,
  },
};

interface LocalGuestOrder {
  id: number;
  orderNumber: string;
  guestToken: string;
  totalAmount: number;
  createdAt: string;
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<"account" | "guest">("account");
  const [loggedInOrders, setLoggedInOrders] = useState<OrderType[]>([]);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isLoadingUserOrders, setIsLoadingUserOrders] = useState(true);

  // Guest lookup state
  const [orderNumberInput, setOrderNumberInput] = useState("");
  const [contactInput, setContactInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchedOrder, setSearchedOrder] = useState<OrderType | null>(null);

  // Local device guest order history
  const [savedGuestOrders, setSavedGuestOrders] = useState<LocalGuestOrder[]>([]);

  // Load logged-in user orders & local guest orders
  useEffect(() => {
    // 1. Fetch user orders
    async function fetchUserOrders() {
      try {
        const res = await fetch("/api/orders/my-orders");
        if (res.ok) {
          const json = await res.json();
          setLoggedInOrders(json.orders || []);
          setIsUserLoggedIn(true);
        } else {
          setIsUserLoggedIn(false);
        }
      } catch {
        setIsUserLoggedIn(false);
      } finally {
        setIsLoadingUserOrders(false);
      }
    }
    fetchUserOrders();

    // 2. Load cached guest orders from localStorage
    try {
      const raw = localStorage.getItem("nepali_rudraksha_guest_orders");
      if (raw) {
        setSavedGuestOrders(JSON.parse(raw));
      }
    } catch {
      // ignore JSON error
    }
  }, []);

  // Handle manual tracking lookup
  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumberInput.trim() || !contactInput.trim()) {
      toast.error("Please enter both Order Number and your Email or Phone");
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: orderNumberInput.trim(),
          contact: contactInput.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Order not found");
      }

      setSearchedOrder(json);
      toast.success("Order located successfully!");

      // Save to localStorage for convenience
      if (json.guestToken) {
        const newEntry: LocalGuestOrder = {
          id: json.id,
          orderNumber: json.orderNumber,
          guestToken: json.guestToken,
          totalAmount: json.totalAmount,
          createdAt: json.createdAt,
        };
        const updatedList = [
          newEntry,
          ...savedGuestOrders.filter((o) => o.id !== json.id),
        ].slice(0, 10);
        setSavedGuestOrders(updatedList);
        localStorage.setItem(
          "nepali_rudraksha_guest_orders",
          JSON.stringify(updatedList),
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Order not found";
      toast.error(msg);
      setSearchedOrder(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf7f2] pb-24 pt-6 sm:pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "My Orders & Tracking" }]}
        />

        {/* Header Banner */}
        <header className="space-y-3 border-b border-amber-900/10 pb-6 sm:pb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#92400e]">
            <Sparkles className="w-4 h-4" />
            Sacred Fulfillment & Blessings
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#422006] leading-tight">
            Track & View Your{" "}
            <span className="bg-linear-to-r from-[#713f12] via-[#92400e] to-[#b45309] bg-clip-text text-transparent">
              Sacred Rudraksha Orders
            </span>
          </h1>
          <p className="max-w-2xl text-xs sm:text-sm text-[#5c3a1e]/80 leading-relaxed">
            Follow the journey of your authentic Himalayan Rudraksha beads from temple
            sanctification and Vedic energization to safe doorstep delivery.
          </p>
        </header>

        {/* Navigation Tabs (Account vs Guest Tracking) */}
        <div className="flex border-b border-amber-900/10 gap-4">
          <button
            onClick={() => setActiveTab("account")}
            className={`pb-3 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "account"
                ? "border-[#713f12] text-[#422006]"
                : "border-transparent text-[#78350f]/60 hover:text-[#713f12]"
            }`}
          >
            <User className="w-4 h-4" />
            Account Orders
            {loggedInOrders.length > 0 && (
              <Badge variant="secondary" className="text-xs bg-amber-100 text-[#713f12]">
                {loggedInOrders.length}
              </Badge>
            )}
          </button>

          <button
            onClick={() => setActiveTab("guest")}
            className={`pb-3 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "guest"
                ? "border-[#713f12] text-[#422006]"
                : "border-transparent text-[#78350f]/60 hover:text-[#713f12]"
            }`}
          >
            <Search className="w-4 h-4" />
            Guest Order Lookup & History
            {savedGuestOrders.length > 0 && (
              <Badge variant="secondary" className="text-xs bg-amber-100 text-[#713f12]">
                {savedGuestOrders.length}
              </Badge>
            )}
          </button>
        </div>

        {/* Tab 1: Logged-in Account Orders */}
        {activeTab === "account" && (
          <div className="space-y-6">
            {isLoadingUserOrders ? (
              <div className="py-16 text-center text-[#78350f]/70 space-y-2">
                <RefreshCw className="w-7 h-7 animate-spin mx-auto text-[#713f12]" />
                <p className="text-sm">Retrieving your orders...</p>
              </div>
            ) : !isUserLoggedIn ? (
              <Card className="border-amber-900/10 bg-white/70 shadow-xs text-center p-8 sm:p-10 space-y-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-[#713f12]">
                  <User className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#422006]">
                    Please Sign In to View Your Account Orders
                  </h3>
                  <p className="text-xs sm:text-sm text-[#78350f]/70 max-w-md mx-auto">
                    Sign in with your devotee credentials to see full order histories,
                    or use the Guest Lookup tab to view orders placed without an account.
                  </p>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                  <Link href="/auth/login">
                    <Button className="bg-[#713f12] hover:bg-[#854d0e] text-white text-xs px-5">
                      Sign In Now
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("guest")}
                    className="border-amber-900/20 text-[#713f12] text-xs"
                  >
                    Track as Guest
                  </Button>
                </div>
              </Card>
            ) : loggedInOrders.length === 0 ? (
              <Card className="border-amber-900/10 bg-white/70 shadow-xs text-center p-8 sm:p-12 space-y-4">
                <ShoppingBag className="w-12 h-12 text-amber-900/30 mx-auto" />
                <h3 className="text-lg font-bold text-[#422006]">No Orders Placed Yet</h3>
                <p className="text-xs sm:text-sm text-[#78350f]/70 max-w-sm mx-auto">
                  Your sacred collection awaits. Explore authentic energized Nepali
                  Rudraksha and malas.
                </p>
                <Link href="/all-products">
                  <Button className="bg-[#713f12] hover:bg-[#854d0e] text-white text-xs mt-2">
                    Explore Sacred Beads
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {loggedInOrders.map((order) => {
                  const statusMeta = statusConfig[order.status];
                  const StatusIcon = statusMeta.icon;

                  return (
                    <Card
                      key={order.id}
                      className="border-amber-900/10 shadow-xs hover:border-amber-900/25 transition-all bg-white/90 overflow-hidden"
                    >
                      <CardContent className="p-5 sm:p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-900/10 pb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-base text-[#422006]">
                                {order.orderNumber}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusMeta.bg} ${statusMeta.color} border ${statusMeta.border}`}
                              >
                                <StatusIcon className="w-3 h-3" />
                                {statusMeta.label}
                              </span>
                            </div>
                            <div className="text-xs text-[#78350f]/70 mt-1">
                              Ordered on{" "}
                              {new Date(order.createdAt).toLocaleDateString(undefined, {
                                dateStyle: "medium",
                              })}
                            </div>
                          </div>

                          <div className="text-right sm:text-right">
                            <div className="text-base font-bold text-[#713f12]">
                              Rs. {order.totalAmount.toLocaleString()}
                            </div>
                            <div className="text-xs text-[#78350f]/60 uppercase font-semibold">
                              {order.paymentMethod} • {order.paymentStatus}
                            </div>
                          </div>
                        </div>

                        {/* Items list */}
                        <div className="divide-y divide-amber-900/5 text-xs text-[#5c3a1e]">
                          {order.items?.map((item) => (
                            <div
                              key={item.id}
                              className="py-2 flex items-center justify-between"
                            >
                              <div className="font-medium text-[#422006]">
                                {item.productName} × {item.quantity}
                              </div>
                              <div className="font-semibold text-[#713f12]">
                                Rs. {(item.unitPrice * item.quantity).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Action Link */}
                        <div className="pt-2 flex justify-end">
                          <Link href={`/orders/${order.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs border-amber-900/20 text-[#713f12] hover:bg-amber-100"
                            >
                              View Full Order Details & Receipt
                              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Guest Order Lookup & Recent Guest History */}
        {activeTab === "guest" && (
          <div className="space-y-8">
            {/* Guest Order Search Card */}
            <Card className="border-amber-900/15 shadow-sm bg-linear-to-br from-white to-amber-50/40">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-[#422006] flex items-center gap-2">
                  <Search className="w-5 h-5 text-[#92400e]" />
                  Instant Guest Order Tracking
                </CardTitle>
                <CardDescription className="text-xs text-[#78350f]/80">
                  Enter your order number and contact detail provided during guest checkout.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTrackSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#422006]">
                        Order Number
                      </label>
                      <Input
                        placeholder="e.g. NR-261009-8492"
                        value={orderNumberInput}
                        onChange={(e) => setOrderNumberInput(e.target.value)}
                        className="bg-white border-amber-900/20 text-xs text-[#422006]"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#422006]">
                        Customer Email or Phone
                      </label>
                      <Input
                        placeholder="e.g. devotee@example.com or 98..."
                        value={contactInput}
                        onChange={(e) => setContactInput(e.target.value)}
                        className="bg-white border-amber-900/20 text-xs text-[#422006]"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSearching}
                    className="w-full sm:w-auto bg-[#713f12] hover:bg-[#854d0e] text-white text-xs px-6 font-semibold"
                  >
                    {isSearching ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" />
                        Locating Order...
                      </>
                    ) : (
                      <>
                        <Search className="w-3.5 h-3.5 mr-2" />
                        Track Sacred Order
                      </>
                    )}
                  </Button>
                </form>

                {/* Search Result Card if found */}
                {searchedOrder && (
                  <div className="mt-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#422006]">
                        {searchedOrder.orderNumber}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {searchedOrder.status}
                      </span>
                    </div>
                    <div className="text-xs text-[#78350f]">
                      Customer: <strong>{searchedOrder.customerName}</strong> • Total:{" "}
                      <strong>Rs. {searchedOrder.totalAmount.toLocaleString()}</strong>
                    </div>
                    <div className="pt-2">
                      <Link
                        href={
                          searchedOrder.guestToken
                            ? `/orders/guest/${searchedOrder.guestToken}/${searchedOrder.id}`
                            : `/orders/${searchedOrder.id}`
                        }
                      >
                        <Button
                          size="sm"
                          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs w-full sm:w-auto"
                        >
                          View Live Tracking & Details
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Saved Recent Guest Orders on this Device */}
            {savedGuestOrders.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#422006] flex items-center gap-2">
                  <History className="w-4 h-4 text-[#92400e]" />
                  Recent Orders Placed From This Device
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedGuestOrders.map((guestOrder) => (
                    <Card
                      key={guestOrder.id}
                      className="border-amber-900/10 shadow-xs hover:border-amber-900/30 transition-all bg-white"
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-sm text-[#422006]">
                            {guestOrder.orderNumber}
                          </div>
                          <div className="text-xs text-[#78350f]/70">
                            Rs. {guestOrder.totalAmount.toLocaleString()} •{" "}
                            {new Date(guestOrder.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <Link
                          href={`/orders/guest/${guestOrder.guestToken}/${guestOrder.id}`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs border-amber-900/20 text-[#713f12] hover:bg-amber-100"
                          >
                            Track <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
