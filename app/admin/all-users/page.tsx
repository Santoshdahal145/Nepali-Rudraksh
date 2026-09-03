"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  UserCheck,
  UserX,
  ShieldAlert,
  Crown,
  Eye,
  Plus,
  Mail,
  Phone,
  Filter,
  MoreVertical,
  CheckCircle2,
  Trash2,
  Lock,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdmin } from "../../../providers/AdminContext";

export default function AdminAllUsersPage() {
  const { users, toggleBlockUser, updateUserStatus, deleteUser } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUserToBlock, setSelectedUserToBlock] = useState<string | null>(
    null
  );
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery) ||
      user.address.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      user.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesRole =
      roleFilter === "all" ||
      user.role.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesRole;
  });

  const activeCount = users.filter((u) => u.status === "Active").length;
  const vipCount = users.filter((u) => u.status === "VIP").length;
  const blockedCount = users.filter((u) => u.status === "Blocked").length;

  const handleToggleBlock = (
    userId: string,
    userName: string,
    isBlocked: boolean
  ) => {
    toggleBlockUser(userId);
    showToast(
      isBlocked
        ? `Devotee ${userName} has been unblocked successfully.`
        : `Account for ${userName} has been blocked.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Feedback Toast */}
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
              Devotee Directory
            </Badge>
            <span className="text-xs text-muted-foreground">
              {users.length} registered accounts
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#422006]">
            All Users & Devotee Management
          </h1>
          <p className="text-xs sm:text-sm text-[#5c3a1e]/80 mt-1 max-w-2xl">
            Search, manage account permissions, view consultation notes, and
            control devotee access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/settings">
            <Button
              variant="outline"
              className="h-10 border-amber-900/20 bg-white text-xs font-bold text-[#713f12] hover:bg-amber-50"
            >
              <Lock className="h-3.5 w-3.5 mr-1" />
              Security Rules
            </Button>
          </Link>
        </div>
      </div>

      {/* User Stats Quick Pills */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-4 shadow-2xs hover:border-amber-900/20 transition">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Total Users
          </p>
          <p className="text-2xl font-black text-[#422006] mt-1">
            {users.length}
          </p>
        </Card>
        <Card className="p-4 shadow-2xs hover:border-amber-900/20 transition">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Active Devotees
          </p>
          <p className="text-2xl font-black text-emerald-900 mt-1">
            {activeCount}
          </p>
        </Card>
        <Card className="p-4 shadow-2xs hover:border-amber-900/20 transition">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
            VIP Collectors
          </p>
          <p className="text-2xl font-black text-amber-950 mt-1">{vipCount}</p>
        </Card>
        <Card className="p-4 shadow-2xs hover:border-amber-900/20 transition">
          <p className="text-xs font-bold uppercase tracking-wider text-red-800">
            Blocked Accounts
          </p>
          <p className="text-2xl font-black text-red-950 mt-1">
            {blockedCount}
          </p>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-amber-900/10 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, email, phone, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-10 text-xs sm:text-sm border-amber-900/15 focus-visible:ring-amber-700 bg-amber-50/20"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-xl border border-amber-900/15 bg-white px-3 text-xs font-semibold text-[#422006] outline-none focus:border-amber-700"
          >
            <option value="all">Status: All</option>
            <option value="active">Active</option>
            <option value="vip">VIP</option>
            <option value="blocked">Blocked</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 rounded-xl border border-amber-900/15 bg-white px-3 text-xs font-semibold text-[#422006] outline-none focus:border-amber-700"
          >
            <option value="all">Role: All</option>
            <option value="customer">Customer</option>
            <option value="wholesale">Wholesale</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <Card className="shadow-xs overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">
            Devotee Directory
          </CardTitle>
          <CardDescription>
            Showing {filteredUsers.length} of {users.length} total devotees
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <span className="text-4xl">👥</span>
              <p className="mt-2 text-sm font-bold text-[#422006]">
                No devotees found
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try searching with a different name, email, or reset your
                filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setRoleFilter("all");
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
                    <TableHead>Devotee / Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Orders & Spent</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const isBlocked = user.status === "Blocked";
                    const isVIP = user.status === "VIP";

                    return (
                      <TableRow
                        key={user.id}
                        className={isBlocked ? "bg-red-50/30" : ""}
                      >
                        {/* Name & Avatar */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white shadow-xs ${
                                isBlocked
                                  ? "bg-stone-500"
                                  : isVIP
                                    ? "bg-gradient-to-tr from-amber-600 to-amber-400"
                                    : "bg-[#713f12]"
                              }`}
                            >
                              {user.avatar}
                            </div>
                            <div>
                              <Link
                                href={`/admin/all-users/${user.id}`}
                                className="font-bold text-[#422006] text-xs sm:text-sm hover:text-[#713f12] hover:underline"
                              >
                                {user.name}
                              </Link>
                              <div className="text-[11px] text-muted-foreground">
                                {user.address.city}, {user.address.country}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Contact */}
                        <TableCell>
                          <div className="text-xs text-[#422006] flex items-center gap-1.5">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span>{user.email}</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span>{user.phone}</span>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          {isBlocked ? (
                            <Badge variant="destructive">Blocked</Badge>
                          ) : isVIP ? (
                            <Badge variant="gold">
                              <Crown className="h-3 w-3 mr-1" /> VIP Devotee
                            </Badge>
                          ) : (
                            <Badge variant="success">Active</Badge>
                          )}
                        </TableCell>

                        {/* Role */}
                        <TableCell>
                          <span className="text-xs font-semibold text-[#5c3a1e]">
                            {user.role}
                          </span>
                        </TableCell>

                        {/* Orders & Spent */}
                        <TableCell>
                          <div className="font-bold text-xs text-[#422006]">
                            ${user.totalSpent}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {user.totalOrders} order(s)
                          </div>
                        </TableCell>

                        {/* Joined Date */}
                        <TableCell className="text-xs text-muted-foreground">
                          {user.joinedDate}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Details */}
                            <Link href={`/admin/all-users/${user.id}`}>
                              <Button
                                variant="outline"
                                size="xs"
                                className="h-8 gap-1 border-amber-900/15 text-xs text-[#713f12] hover:bg-amber-100/60"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                Details
                              </Button>
                            </Link>

                            {/* Block / Unblock Toggle Button */}
                            <Button
                              variant={isBlocked ? "outline" : "ghost"}
                              size="xs"
                              onClick={() =>
                                handleToggleBlock(user.id, user.name, isBlocked)
                              }
                              className={`h-8 gap-1 text-xs font-semibold ${
                                isBlocked
                                  ? "border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                                  : "text-red-700 hover:bg-red-50 hover:text-red-900"
                              }`}
                            >
                              {isBlocked ? (
                                <>
                                  <UserCheck className="h-3.5 w-3.5" />
                                  Unblock
                                </>
                              ) : (
                                <>
                                  <UserX className="h-3.5 w-3.5" />
                                  Block
                                </>
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
