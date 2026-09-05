"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Crown,
  Eye,
  Mail,
  Phone,
  Filter,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Calendar,
  Sparkles,
  ArrowUpDown,
  RefreshCw,
  UserCheck,
  UserX,
} from "lucide-react";
import { toast } from "sonner";

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
import { Pagination } from "@/components/ui/pagination";
import useUserAdminHook from "@/hooks/tanstack-hooks/useUserAdmin";
import { UserType } from "@/app/types";

export default function AdminAllUsersPage() {
  // Query parameters state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "createdAt" | "firstName" | "lastName" | "email"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Handle filter changes
  const handleRoleChange = (val: string) => {
    setRoleFilter(val);
    setPage(1);
  };

  const handleVerifiedChange = (val: string) => {
    setVerifiedFilter(val);
    setPage(1);
  };

  const handleSortChange = (val: string) => {
    if (val === "newest") {
      setSortBy("createdAt");
      setSortOrder("desc");
    } else if (val === "oldest") {
      setSortBy("createdAt");
      setSortOrder("asc");
    } else if (val === "name-asc") {
      setSortBy("firstName");
      setSortOrder("asc");
    } else if (val === "name-desc") {
      setSortBy("firstName");
      setSortOrder("desc");
    } else if (val === "email-asc") {
      setSortBy("email");
      setSortOrder("asc");
    }
    setPage(1);
  };

  // TanStack Query
  const { getUsers, updateUser } = useUserAdminHook(
    page,
    limit,
    debouncedSearch,
    roleFilter !== "all" ? (roleFilter as "ADMIN" | "USER") : undefined,
    verifiedFilter !== "all" ? verifiedFilter === "true" : undefined,
    sortBy,
    sortOrder
  );

  const users: UserType[] = getUsers.data?.users ?? [];
  const pagination = getUsers.data?.pagination;

  // Format date helper
  const formatDate = (dateVal?: any) => {
    if (!dateVal) return "—";
    try {
      const d = new Date(dateVal.toString());
      if (isNaN(d.getTime())) return "—";
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(d);
    } catch {
      return "—";
    }
  };

  // Quick action: Toggle Admin Role
  const handleToggleRole = async (user: UserType) => {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    const actionText =
      newRole === "ADMIN" ? "promote to Admin" : "demote to Devotee";

    if (
      !window.confirm(
        `Are you sure you want to ${actionText} ${user.firstName} ${user.lastName}?`
      )
    ) {
      return;
    }

    try {
      await updateUser.mutateAsync({
        id: user.id,
        data: { role: newRole },
      });
      toast.success(
        `${user.firstName} ${user.lastName} is now ${newRole === "ADMIN" ? "an Administrator" : "a Devotee"}.`
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to update user role");
    }
  };

  // Quick action: Toggle Email Verification
  const handleToggleVerification = async (user: UserType) => {
    const newStatus = !user.isEmailVerified;
    try {
      await updateUser.mutateAsync({
        id: user.id,
        data: { isEmailVerified: newStatus },
      });
      toast.success(
        `${user.firstName}'s email is now ${newStatus ? "verified" : "marked unverified"}.`
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to update verification status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-amber-900/10 bg-linear-to-r from-amber-100/70 via-orange-50/50 to-amber-50 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" className="text-[10px]">
              Devotee Directory
            </Badge>
            <span className="text-xs text-muted-foreground">
              {pagination ? `${pagination.total} registered accounts` : "Live Catalog"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#422006]">
            All Users & Devotee Management
          </h1>
          <p className="text-xs sm:text-sm text-[#5c3a1e]/80 mt-1 max-w-2xl">
            Search devotee directory, manage administrator privileges, check
            linked authentication accounts, and verify devotee details.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => getUsers.refetch()}
            disabled={getUsers.isFetching}
            className="h-10 border-amber-900/20 bg-white text-xs font-bold text-[#713f12] hover:bg-amber-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 mr-1.5 ${
                getUsers.isFetching ? "animate-spin text-amber-700" : ""
              }`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* User Stats Quick Pills */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-4 shadow-2xs hover:border-amber-900/20 transition">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Total Devotees
          </p>
          <p className="text-2xl font-black text-[#422006] mt-1">
            {getUsers.isLoading ? "—" : pagination?.total ?? 0}
          </p>
        </Card>

        <Card className="p-4 shadow-2xs hover:border-amber-900/20 transition">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
            Current Page
          </p>
          <p className="text-2xl font-black text-amber-950 mt-1">
            {getUsers.isLoading
              ? "—"
              : `${pagination?.page ?? 1} / ${pagination?.totalPages ?? 1}`}
          </p>
        </Card>

        <Card className="p-4 shadow-2xs hover:border-amber-900/20 transition">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Page Limit
          </p>
          <p className="text-2xl font-black text-emerald-900 mt-1">
            {limit} / page
          </p>
        </Card>

        <Card className="p-4 shadow-2xs hover:border-amber-900/20 transition">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-800">
            Filter Status
          </p>
          <p className="text-sm font-bold text-blue-950 mt-2 truncate">
            {roleFilter !== "all"
              ? `Role: ${roleFilter}`
              : verifiedFilter !== "all"
                ? `Verified: ${verifiedFilter}`
                : "Showing All"}
          </p>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-amber-900/10 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by first name, last name, email, or phone number..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-10 pl-10 text-xs sm:text-sm border-amber-900/15 focus-visible:ring-amber-700 bg-amber-50/20"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-[#422006]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="h-10 rounded-xl border border-amber-900/15 bg-white px-3 text-xs font-semibold text-[#422006] outline-none focus:border-amber-700 shadow-2xs"
          >
            <option value="all">Role: All Devotees</option>
            <option value="ADMIN">👑 Administrators</option>
            <option value="USER">🌿 Standard Devotees</option>
          </select>

          {/* Verification Filter */}
          <select
            value={verifiedFilter}
            onChange={(e) => handleVerifiedChange(e.target.value)}
            className="h-10 rounded-xl border border-amber-900/15 bg-white px-3 text-xs font-semibold text-[#422006] outline-none focus:border-amber-700 shadow-2xs"
          >
            <option value="all">Email: All</option>
            <option value="true">✓ Verified Email</option>
            <option value="false">⚠ Unverified Email</option>
          </select>

          {/* Sort By */}
          <select
            value={
              sortBy === "createdAt" && sortOrder === "desc"
                ? "newest"
                : sortBy === "createdAt" && sortOrder === "asc"
                  ? "oldest"
                  : sortBy === "firstName" && sortOrder === "asc"
                    ? "name-asc"
                    : sortBy === "firstName" && sortOrder === "desc"
                      ? "name-desc"
                      : "email-asc"
            }
            onChange={(e) => handleSortChange(e.target.value)}
            className="h-10 rounded-xl border border-amber-900/15 bg-white px-3 text-xs font-semibold text-[#422006] outline-none focus:border-amber-700 shadow-2xs"
          >
            <option value="newest">Sort: Newest Joined</option>
            <option value="oldest">Sort: Oldest Joined</option>
            <option value="name-asc">Sort: First Name (A-Z)</option>
            <option value="name-desc">Sort: First Name (Z-A)</option>
            <option value="email-asc">Sort: Email (A-Z)</option>
          </select>

          {/* Per Page Limit */}
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="h-10 rounded-xl border border-amber-900/15 bg-white px-3 text-xs font-semibold text-[#422006] outline-none focus:border-amber-700 shadow-2xs"
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>

      {/* Users Table Card */}
      <Card className="shadow-xs overflow-hidden border-amber-900/10">
        <CardHeader className="pb-3 border-b border-amber-900/5 bg-amber-50/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-base sm:text-lg text-[#422006]">
                Devotee Directory
              </CardTitle>
              <CardDescription className="text-xs text-[#5c3a1e]/70 mt-0.5">
                {pagination
                  ? `Showing page ${pagination.page} of ${pagination.totalPages} (${pagination.total} total devotees)`
                  : "Loading directory..."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Loading state */}
          {getUsers.isLoading && (
            <div className="p-16 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-amber-700" />
              <p className="mt-3 text-xs font-bold text-[#5c3a1e]">
                Loading devotees from sacred repository...
              </p>
            </div>
          )}

          {/* Error state */}
          {getUsers.isError && (
            <div className="p-12 text-center">
              <ShieldAlert className="mx-auto h-10 w-10 text-red-600" />
              <p className="mt-2 text-sm font-bold text-red-950">
                Failed to load user directory
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                {(getUsers.error as any)?.message ||
                  "An unexpected error occurred while querying devotee records."}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => getUsers.refetch()}
                className="mt-4 border-amber-900/20 text-xs text-[#713f12]"
              >
                Retry Request
              </Button>
            </div>
          )}

          {/* Empty state */}
          {!getUsers.isLoading && !getUsers.isError && users.length === 0 && (
            <div className="p-14 text-center">
              <Users className="mx-auto h-10 w-10 text-amber-700/40" />
              <p className="mt-3 text-sm font-bold text-[#422006]">
                No devotees match your criteria
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try searching for a different keyword or resetting applied filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchInput("");
                  setDebouncedSearch("");
                  setRoleFilter("all");
                  setVerifiedFilter("all");
                  setPage(1);
                }}
                className="mt-4 border-amber-900/20 text-xs text-[#713f12]"
              >
                Reset All Filters
              </Button>
            </div>
          )}

          {/* Data Table */}
          {!getUsers.isLoading && !getUsers.isError && users.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-amber-900/10 bg-amber-50/40">
                    <TableHead className="font-bold text-[#422006] text-xs">
                      Devotee / Name
                    </TableHead>
                    <TableHead className="font-bold text-[#422006] text-xs">
                      Contact Information
                    </TableHead>
                    <TableHead className="font-bold text-[#422006] text-xs">
                      Role
                    </TableHead>
                    <TableHead className="font-bold text-[#422006] text-xs">
                      Email Verified
                    </TableHead>
                    <TableHead className="font-bold text-[#422006] text-xs">
                      Joined Date
                    </TableHead>
                    <TableHead className="text-right font-bold text-[#422006] text-xs">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const isAdmin = user.role === "ADMIN";
                    const isVerified = Boolean(user.isEmailVerified);
                    const initials = `${user.firstName?.[0] || ""}${
                      user.lastName?.[0] || ""
                    }`.toUpperCase() || "D";

                    return (
                      <TableRow
                        key={user.id}
                        className="hover:bg-amber-50/30 transition-colors border-amber-900/5"
                      >
                        {/* Name & Avatar */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white shadow-xs ${
                                isAdmin
                                  ? "bg-linear-to-tr from-[#713f12] via-[#b45309] to-amber-500 shadow-amber-900/20"
                                  : "bg-[#713f12]"
                              }`}
                            >
                              {initials}
                            </div>
                            <div>
                              <Link
                                href={`/admin/all-users/${user.id}`}
                                className="font-bold text-[#422006] text-xs sm:text-sm hover:text-[#713f12] hover:underline flex items-center gap-1.5"
                              >
                                <span>
                                  {user.firstName} {user.lastName}
                                </span>
                                {isAdmin && (
                                  <Crown className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                                )}
                              </Link>
                              <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <span>ID: #{user.id}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Contact */}
                        <TableCell>
                          <div className="text-xs text-[#422006] flex items-center gap-1.5">
                            <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span className="truncate max-w-[180px] sm:max-w-[240px]">
                              {user.email}
                            </span>
                          </div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span>{user.phoneNumber || "No phone provided"}</span>
                          </div>
                        </TableCell>

                        {/* Role */}
                        <TableCell>
                          {isAdmin ? (
                            <Badge
                              variant="gold"
                              className="text-[10px] font-extrabold flex items-center gap-1 w-fit shadow-2xs"
                            >
                              <Crown className="h-3 w-3 text-amber-800" />
                              ADMIN
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-[10px] font-semibold text-[#5c3a1e] border-amber-900/20 w-fit"
                            >
                              DEVOTEE
                            </Badge>
                          )}
                        </TableCell>

                        {/* Email Verification */}
                        <TableCell>
                          {isVerified ? (
                            <Badge
                              variant="success"
                              className="text-[10px] font-bold flex items-center gap-1 w-fit"
                            >
                              <CheckCircle2 className="h-3 w-3 text-emerald-700" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge
                              variant="destructive"
                              className="text-[10px] font-bold flex items-center gap-1 w-fit bg-amber-100 text-amber-900 border-amber-300"
                            >
                              <XCircle className="h-3 w-3 text-amber-700" />
                              Unverified
                            </Badge>
                          )}
                        </TableCell>

                        {/* Joined Date */}
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(user.createdAt)}
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

                            {/* Role Toggle Action */}
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => handleToggleRole(user)}
                              disabled={updateUser.isPending}
                              title={
                                isAdmin
                                  ? "Demote to standard Devotee"
                                  : "Promote to Administrator"
                              }
                              className={`h-8 gap-1 text-xs font-semibold ${
                                isAdmin
                                  ? "text-stone-600 hover:bg-stone-100"
                                  : "text-amber-800 hover:bg-amber-100"
                              }`}
                            >
                              {isAdmin ? (
                                <>
                                  <UserX className="h-3.5 w-3.5 text-stone-500" />
                                  <span className="hidden sm:inline">Demote</span>
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-3.5 w-3.5 text-amber-700" />
                                  <span className="hidden sm:inline">Make Admin</span>
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

          {/* Real Pagination Component */}
          {pagination && pagination.totalPages > 1 && (
            <div className="border-t border-amber-900/10 px-4 py-2 bg-white">
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                hasNextPage={
                  pagination.hasNextPage ??
                  pagination.page < pagination.totalPages
                }
                hasPrevPage={pagination.hasPrevPage ?? pagination.page > 1}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
