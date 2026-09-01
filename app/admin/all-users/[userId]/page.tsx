"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Crown,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
  ShoppingBag,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  KeyRound,
  FileText,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { useAdmin } from "../../data/AdminContext";

export default function AdminUserDetailsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { users, orders, toggleBlockUser, updateUserStatus, deleteUser } = useAdmin();

  // Find user by id or fallback
  const user = users.find((u) => u.id === resolvedParams.userId) || users[0];
  const userOrders = orders.filter((o) => o.userId === user?.id);

  const [notes, setNotes] = useState(user?.notes || "");
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-base font-bold text-[#422006]">User not found</p>
        <Link href="/admin/all-users">
          <Button className="mt-4 bg-[#713f12] text-white">Back to Users</Button>
        </Link>
      </div>
    );
  }

  const isBlocked = user.status === "Blocked";
  const isVIP = user.status === "VIP";

  const handleSaveNotes = () => {
    showToast("Devotee spiritual notes updated successfully.");
  };

  const handleSendResetPassword = () => {
    showToast(`Password reset link dispatched to ${user.email}`);
  };

  const handleDeleteUser = () => {
    if (window.confirm(`Are you sure you want to remove ${user.name}'s account?`)) {
      deleteUser(user.id);
      router.push("/admin/all-users");
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

      {/* Top Back Nav & Quick Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/all-users">
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
              <span className="text-xs font-bold text-[#5c3a1e]/70">Devotee ID:</span>
              <code className="text-xs font-mono bg-amber-100/70 px-1.5 py-0.5 rounded text-[#422006]">
                {user.id}
              </code>
            </div>
            <h1 className="text-2xl font-extrabold text-[#422006]">{user.name}</h1>
          </div>
        </div>

        {/* Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* VIP Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newStatus = isVIP ? "Active" : "VIP";
              updateUserStatus(user.id, newStatus);
              showToast(isVIP ? "Removed from VIP status." : "Granted VIP Devotee status!");
            }}
            className={`h-9 gap-1 text-xs font-bold ${
              isVIP
                ? "bg-amber-100 border-amber-300 text-[#713f12]"
                : "border-amber-900/20 text-[#5c3a1e] hover:bg-amber-50"
            }`}
          >
            <Crown className="h-3.5 w-3.5 text-amber-600" />
            {isVIP ? "VIP Devotee" : "Promote to VIP"}
          </Button>

          {/* Block / Unblock */}
          <Button
            variant={isBlocked ? "outline" : "destructive"}
            size="sm"
            onClick={() => {
              toggleBlockUser(user.id);
              showToast(isBlocked ? "User unblocked." : "User blocked from store.");
            }}
            className="h-9 gap-1 text-xs font-bold"
          >
            {isBlocked ? (
              <>
                <UserCheck className="h-3.5 w-3.5" />
                Unblock Account
              </>
            ) : (
              <>
                <UserX className="h-3.5 w-3.5" />
                Block Account
              </>
            )}
          </Button>

          {/* Password Reset */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSendResetPassword}
            className="h-9 gap-1 text-xs font-bold border-amber-900/20 text-[#713f12] hover:bg-amber-50"
          >
            <KeyRound className="h-3.5 w-3.5" />
            Reset Password
          </Button>
        </div>
      </div>

      {/* Profile Overview Card & Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Identity Card */}
        <Card className="shadow-xs lg:col-span-1">
          <CardContent className="pt-6 space-y-6">
            <div className="flex flex-col items-center text-center">
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-md ${
                  isBlocked
                    ? "bg-stone-500"
                    : isVIP
                    ? "bg-gradient-to-tr from-amber-600 to-amber-400"
                    : "bg-[#713f12]"
                }`}
              >
                {user.avatar}
              </div>
              <h2 className="mt-3 text-lg font-bold text-[#422006]">{user.name}</h2>
              <div className="mt-1 flex items-center gap-2">
                {isBlocked ? (
                  <Badge variant="destructive">Blocked</Badge>
                ) : isVIP ? (
                  <Badge variant="gold">
                    <Crown className="h-3 w-3 mr-1" /> VIP Devotee
                  </Badge>
                ) : (
                  <Badge variant="success">Active</Badge>
                )}
                <Badge variant="secondary">{user.role}</Badge>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-amber-900/10 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Email:
                </span>
                <span className="font-semibold text-[#422006]">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> Phone:
                </span>
                <span className="font-semibold text-[#422006]">{user.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Joined:
                </span>
                <span className="font-semibold text-[#422006]">{user.joinedDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> Last Active:
                </span>
                <span className="font-semibold text-[#422006]">{user.lastActive}</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-amber-900/10">
              <div className="rounded-xl bg-amber-50 p-3 text-center border border-amber-900/10">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Total Spent</p>
                <p className="text-base font-black text-[#713f12] mt-0.5">${user.totalSpent}</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-center border border-amber-900/10">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Orders</p>
                <p className="text-base font-black text-[#422006] mt-0.5">{user.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Address, Spiritual Focus & Notes */}
        <div className="space-y-6 lg:col-span-2">
          {/* Spiritual Focus & Address Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Spiritual Focus Card */}
            <Card className="shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-700" />
                  Spiritual Alignment & Focus
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                <p className="text-[#5c3a1e] font-medium leading-relaxed">
                  {user.spiritualFocus || "General Shiva Bhakti, Japa & Protection"}
                </p>
                <div className="inline-flex items-center gap-1 text-[11px] text-amber-800 bg-amber-100/60 px-2.5 py-1 rounded-md">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Vedic Consecration Eligible</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping & Delivery Address */}
            <Card className="shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-700" />
                  Primary Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-[#5c3a1e] space-y-1">
                <p className="font-semibold text-[#422006]">{user.address.street}</p>
                <p>{user.address.city}, {user.address.state} - {user.address.postalCode}</p>
                <p className="font-bold text-amber-900">{user.address.country}</p>
              </CardContent>
            </Card>
          </div>

          {/* Devotee Astrological / Admin Notes */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#713f12]" />
                Devotee Notes & Astrological Consultations
              </CardTitle>
              <CardDescription>
                Internal temple notes regarding Rudraksha sizing, gotra, and birth chart preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter devotee background, astrologer recommendations, or special delivery instructions..."
                rows={3}
                className="w-full rounded-xl border border-amber-900/15 bg-amber-50/20 p-3 text-xs text-[#422006] outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveNotes}
                  className="h-8 bg-[#713f12] text-xs font-semibold text-white hover:bg-[#5c330e]"
                >
                  Save Devotee Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Devotee's Sacred Order History */}
      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#713f12]" />
              Order History ({userOrders.length})
            </CardTitle>
            <CardDescription>
              All sacred beads and malas purchased by this devotee
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {userOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No recent orders found for this user.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userOrders.map((ord) => (
                    <TableRow key={ord.id}>
                      <TableCell className="font-bold text-[#713f12]">
                        <Link href={`/admin/orders/${ord.orderNumber}`} className="hover:underline">
                          #{ord.orderNumber}
                        </Link>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{ord.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#422006]">
                          <span>{ord.items[0]?.emoji}</span>
                          <span>{ord.items[0]?.name}</span>
                          {ord.items.length > 1 && (
                            <span className="text-[10px] text-muted-foreground">
                              (+{ord.items.length - 1} more)
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-xs text-[#422006]">${ord.total}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px]">
                          {ord.paymentMethod} • {ord.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            ord.status === "Delivered"
                              ? "success"
                              : ord.status === "Shipped"
                              ? "gold"
                              : ord.status === "Cancelled"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {ord.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/orders/${ord.orderNumber}`}>
                          <Button
                            variant="ghost"
                            size="xs"
                            className="text-[#713f12] hover:bg-amber-100"
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
