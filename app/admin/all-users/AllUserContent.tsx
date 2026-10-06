"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Crown,
  Eye,
  Loader2,
  Mail,
  Phone,
  ShieldAlert,
  Users,
  XCircle,
} from "lucide-react";
import { UserType, PaginationType } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AllUserContentProps {
  users: UserType[];
  pagination?: PaginationType;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  onRefetch: () => void;
  onPageChange: (newPage: number) => void;
  onResetFilters: () => void;
}

export default function AllUserContent({
  users,
  pagination,
  isLoading,
  isError,
  error,
  onRefetch,
  onPageChange,
  onResetFilters,
}: AllUserContentProps) {
  // Format date helper
  const formatDate = (dateVal?: unknown) => {
    if (!dateVal) return "—";
    try {
      const d = new Date(String(dateVal));
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

  return (
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
        {isLoading && (
          <div className="p-16 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-amber-700" />
            <p className="mt-3 text-xs font-bold text-[#5c3a1e]">
              Loading devotees from sacred repository...
            </p>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="p-12 text-center">
            <ShieldAlert className="mx-auto h-10 w-10 text-red-600" />
            <p className="mt-2 text-sm font-bold text-red-950">
              Failed to load user directory
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
              {(error as { message?: string })?.message ||
                "An unexpected error occurred while querying devotee records."}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefetch}
              className="mt-4 border-amber-900/20 text-xs text-[#713f12]"
            >
              Retry Request
            </Button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && users.length === 0 && (
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
              onClick={onResetFilters}
              className="mt-4 border-amber-900/20 text-xs text-[#713f12]"
            >
              Reset All Filters
            </Button>
          </div>
        )}

        {/* User List Content */}
        {!isLoading && !isError && users.length > 0 && (
          <>
            {/* Desktop / Tablet View: Full Table */}
            <div className="hidden md:block overflow-x-auto">
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
                    const initials =
                      `${user.firstName?.[0] || ""}${
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
                            <span className="truncate max-w-45 sm:max-w-60">
                              {user.email}
                            </span>
                          </div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span>
                              {user.phoneNumber || "No phone provided"}
                            </span>
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
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile View: Clean Card View */}
            <div className="md:hidden divide-y divide-amber-900/10">
              {users.map((user) => {
                const isAdmin = user.role === "ADMIN";
                const isVerified = Boolean(user.isEmailVerified);
                const initials =
                  `${user.firstName?.[0] || ""}${
                    user.lastName?.[0] || ""
                  }`.toUpperCase() || "D";

                return (
                  <div
                    key={user.id}
                    className="p-3.5 space-y-3 bg-white hover:bg-amber-50/20 transition-colors"
                  >
                    {/* Header: Avatar, Name, ID, Badges */}
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white shadow-xs ${
                            isAdmin
                              ? "bg-linear-to-tr from-[#713f12] via-[#b45309] to-amber-500"
                              : "bg-[#713f12]"
                          }`}
                        >
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/all-users/${user.id}`}
                            className="font-bold text-[#422006] text-xs hover:text-[#713f12] truncate block"
                          >
                            {user.firstName} {user.lastName}
                          </Link>
                          <span className="text-[10px] text-muted-foreground">
                            ID: #{user.id}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {isAdmin ? (
                          <Badge
                            variant="gold"
                            className="text-[9px] px-1.5 py-0 h-5 font-bold"
                          >
                            ADMIN
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-[9px] px-1.5 py-0 h-5 border-amber-900/20"
                          >
                            DEVOTEE
                          </Badge>
                        )}
                        {isVerified ? (
                          <Badge
                            variant="success"
                            className="text-[9px] px-1.5 py-0 h-5"
                          >
                            ✓
                          </Badge>
                        ) : (
                          <Badge
                            variant="destructive"
                            className="text-[9px] px-1.5 py-0 h-5 bg-amber-100 text-amber-900 border-amber-300"
                          >
                            ⚠
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Email & Contact Details */}
                    <div className="space-y-1 text-xs text-[#5c3a1e]">
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="truncate text-[11px]">
                          {user.email}
                        </span>
                      </div>
                      {user.phoneNumber && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span className="text-[11px] text-muted-foreground">
                            {user.phoneNumber}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Footer: Date & Details Button */}
                    <div className="flex items-center justify-between pt-1 border-t border-amber-900/5 text-[11px]">
                      <span className="text-muted-foreground">
                        Joined {formatDate(user.createdAt)}
                      </span>
                      <Link href={`/admin/all-users/${user.id}`}>
                        <Button
                          variant="outline"
                          size="xs"
                          className="h-7 text-[11px] gap-1 border-amber-900/20 text-[#713f12]"
                        >
                          <Eye className="h-3 w-3" />
                          Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
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
              onPageChange={onPageChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
