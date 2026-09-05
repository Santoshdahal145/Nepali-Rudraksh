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
  Calendar,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Clock,
  KeyRound,
  FileText,
  Copy,
  ExternalLink,
  Loader2,
  Lock,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import useUserAdminHook, {
  useSingleUserAdmin,
} from "@/hooks/tanstack-hooks/useUserAdmin";
import { SingleUserResponseType } from "@/app/types";

export default function AdminUserDetailsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const userId = resolvedParams.userId;

  // Real Single User TanStack Query
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useSingleUserAdmin(userId);
  const { updateUser } = useUserAdminHook();

  const [notes, setNotes] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Copy helper
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Format date helper
  const formatDateTime = (dateVal?: any) => {
    if (!dateVal) return "—";
    try {
      const d = new Date(dateVal.toString());
      if (isNaN(d.getTime())) return "—";
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(d);
    } catch {
      return "—";
    }
  };

  // Toggle Admin Role
  const handleToggleRole = async () => {
    if (!user) return;
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    const promptText =
      newRole === "ADMIN"
        ? `Grant Administrator privileges to ${user.firstName} ${user.lastName}?`
        : `Demote ${user.firstName} ${user.lastName} to standard Devotee?`;

    if (!window.confirm(promptText)) return;

    try {
      await updateUser.mutateAsync({
        id: user.id,
        data: { role: newRole },
      });
      toast.success(
        `${user.firstName} ${user.lastName} is now ${newRole === "ADMIN" ? "an Administrator" : "a Devotee"}.`
      );
      refetch();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update role");
    }
  };

  // Toggle Email Verification
  const handleToggleVerification = async () => {
    if (!user) return;
    const newStatus = !user.isEmailVerified;

    try {
      await updateUser.mutateAsync({
        id: user.id,
        data: { isEmailVerified: newStatus },
      });
      toast.success(
        `Email for ${user.firstName} is now ${newStatus ? "verified" : "unverified"}.`
      );
      refetch();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update email verification");
    }
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-32 bg-amber-200/50 rounded-xl" />
        <div className="h-44 bg-amber-100/40 rounded-3xl" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-96 bg-white rounded-3xl border border-amber-900/10" />
          <div className="lg:col-span-2 h-96 bg-white rounded-3xl border border-amber-900/10" />
        </div>
      </div>
    );
  }

  // Error / Not Found Screen
  if (isError || !user) {
    return (
      <div className="p-12 text-center max-w-lg mx-auto bg-white rounded-3xl border border-amber-900/10 shadow-xs mt-10">
        <ShieldAlert className="mx-auto h-12 w-12 text-red-600" />
        <h2 className="mt-4 text-xl font-extrabold text-[#422006]">
          Devotee Account Not Found
        </h2>
        <p className="mt-2 text-xs text-muted-foreground">
          {(error as any)?.message ||
            `Unable to locate a devotee record associated with ID: ${userId}`}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/admin/all-users">
            <Button
              variant="outline"
              size="sm"
              className="border-amber-900/20 text-[#713f12]"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Users
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={() => refetch()}
            className="bg-[#713f12] text-white hover:bg-[#5c3a1e]"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === "ADMIN";
  const isVerified = Boolean(user.isEmailVerified);
  const initials = `${user.firstName?.[0] || ""}${
    user.lastName?.[0] || ""
  }`.toUpperCase() || "D";

  const accounts = user.accounts ?? [];
  const otps = user.otps ?? [];

  return (
    <div className="space-y-6">
      {/* Top Back Nav & Quick Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/all-users">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 border-amber-900/15 text-[#713f12] hover:bg-amber-50 rounded-xl"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#5c3a1e]/70">
                Devotee ID:
              </span>
              <code className="text-xs font-mono bg-amber-100/70 px-1.5 py-0.5 rounded text-[#422006] font-bold">
                #{user.id}
              </code>
              <Badge
                variant={isAdmin ? "gold" : "outline"}
                className="text-[10px]"
              >
                {isAdmin ? "ADMINISTRATOR" : "DEVOTEE"}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#422006] mt-0.5">
              {user.firstName} {user.lastName}
            </h1>
          </div>
        </div>

        {/* Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Toggle */}
          <Button
            variant={isAdmin ? "outline" : "default"}
            size="sm"
            onClick={handleToggleRole}
            disabled={updateUser.isPending}
            className={`h-9 gap-1.5 text-xs font-bold ${
              isAdmin
                ? "border-amber-900/20 text-[#713f12] hover:bg-amber-50"
                : "bg-[#713f12] text-white hover:bg-[#5c3a1e]"
            }`}
          >
            {isAdmin ? (
              <>
                <UserX className="h-3.5 w-3.5 text-stone-500" />
                Demote to Devotee
              </>
            ) : (
              <>
                <Crown className="h-3.5 w-3.5 text-amber-300" />
                Promote to Admin
              </>
            )}
          </Button>

          {/* Email Verification Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleVerification}
            disabled={updateUser.isPending}
            className="h-9 gap-1.5 text-xs font-bold border-amber-900/20 text-[#713f12] hover:bg-amber-50"
          >
            {isVerified ? (
              <>
                <ShieldAlert className="h-3.5 w-3.5 text-amber-700" />
                Mark Unverified
              </>
            ) : (
              <>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                Mark Verified
              </>
            )}
          </Button>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            className="h-9 w-9 border-amber-900/15 text-[#713f12] hover:bg-amber-50 rounded-xl"
            title="Refresh Devotee Data"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Identity & Profile Card */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="shadow-xs overflow-hidden border-amber-900/10">
            <CardContent className="pt-6 space-y-6">
              {/* Devotee Avatar & Status Header */}
              <div className="flex flex-col items-center text-center">
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-md ${
                    isAdmin
                      ? "bg-linear-to-tr from-[#713f12] via-[#b45309] to-amber-500 shadow-amber-900/20"
                      : "bg-[#713f12]"
                  }`}
                >
                  {initials}
                </div>
                <h2 className="mt-3 text-lg font-bold text-[#422006]">
                  {user.firstName} {user.lastName}
                </h2>
                <div className="mt-1 flex items-center gap-1.5 flex-wrap justify-center">
                  {isAdmin ? (
                    <Badge variant="gold" className="text-[10px] font-extrabold">
                      👑 Admin Privileges
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">
                      🌿 Devotee
                    </Badge>
                  )}

                  {isVerified ? (
                    <Badge variant="success" className="text-[10px]">
                      ✓ Email Verified
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-[10px] bg-amber-100 text-amber-900 border-amber-300">
                      ⚠ Unverified
                    </Badge>
                  )}
                </div>
              </div>

              {/* Devotee Identity Fields */}
              <div className="space-y-3 pt-4 border-t border-amber-900/10 text-xs">
                {/* Email */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/50 border border-amber-900/10">
                    <div className="flex items-center gap-2 truncate min-w-0">
                      <Mail className="h-3.5 w-3.5 text-amber-800 shrink-0" />
                      <span className="truncate font-semibold text-[#422006]">
                        {user.email}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(user.email, "Email")}
                      className="p-1 hover:text-[#713f12] text-muted-foreground transition"
                      title="Copy Email"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Phone Number
                  </label>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/50 border border-amber-900/10">
                    <div className="flex items-center gap-2 truncate min-w-0">
                      <Phone className="h-3.5 w-3.5 text-amber-800 shrink-0" />
                      <span className="truncate font-semibold text-[#422006]">
                        {user.phoneNumber || "Not provided"}
                      </span>
                    </div>
                    {user.phoneNumber && (
                      <button
                        onClick={() => handleCopy(user.phoneNumber!, "Phone")}
                        className="p-1 hover:text-[#713f12] text-muted-foreground transition"
                        title="Copy Phone"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Timestamps */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-2.5 rounded-xl bg-amber-50/30 border border-amber-900/10">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
                      <Calendar className="h-3 w-3" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Joined
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-[#422006]">
                      {formatDateTime(user.createdAt)}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50/30 border border-amber-900/10">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
                      <Clock className="h-3 w-3" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Updated
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-[#422006]">
                      {formatDateTime(user.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consultation Notes Card */}
          <Card className="shadow-xs border-amber-900/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-[#422006] flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-amber-800" />
                Administrative Notes
              </CardTitle>
              <CardDescription className="text-xs">
                Internal remarks or consultation history for this devotee.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="E.g. Prefers 5-Mukhi Nepali beads, consulted on horoscope alignment..."
                className="w-full rounded-xl border border-amber-900/15 p-3 text-xs text-[#422006] focus:border-amber-700 outline-none bg-amber-50/20"
              />
              <Button
                size="sm"
                onClick={() => {
                  toast.success("Devotee notes recorded locally.");
                }}
                className="w-full bg-[#713f12] text-white hover:bg-[#5c3a1e] text-xs font-bold"
              >
                Save Notes
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (2 Cols): Accounts & Security Audit Trail */}
        <div className="space-y-6 lg:col-span-2">
          {/* Card 1: Linked Accounts */}
          <Card className="shadow-xs border-amber-900/10">
            <CardHeader className="pb-3 border-b border-amber-900/5 bg-amber-50/20">
              <CardTitle className="text-sm sm:text-base font-bold text-[#422006] flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-amber-800" />
                Linked Authentication Accounts ({accounts.length})
              </CardTitle>
              <CardDescription className="text-xs text-[#5c3a1e]/70">
                Third-party OAuth identity providers connected to this devotee profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {accounts.length === 0 ? (
                <div className="p-8 text-center">
                  <Lock className="mx-auto h-8 w-8 text-amber-700/30" />
                  <p className="mt-2 text-xs font-bold text-[#422006]">
                    Direct Email & Password Account
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    No external OAuth accounts (such as Google) are currently linked.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-amber-900/10 bg-amber-50/30">
                      <TableHead className="text-xs font-bold text-[#422006]">
                        Provider
                      </TableHead>
                      <TableHead className="text-xs font-bold text-[#422006]">
                        Provider Account ID
                      </TableHead>
                      <TableHead className="text-right text-xs font-bold text-[#422006]">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map((acc) => (
                      <TableRow key={acc.id} className="border-amber-900/5">
                        <TableCell className="font-bold text-xs text-[#422006] uppercase">
                          {acc.provider}
                        </TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">
                          {acc.providerAccountId}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="success" className="text-[10px]">
                            Connected
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Security & OTP History */}
          <Card className="shadow-xs border-amber-900/10">
            <CardHeader className="pb-3 border-b border-amber-900/5 bg-amber-50/20">
              <CardTitle className="text-sm sm:text-base font-bold text-[#422006] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                Security & OTP Audit History ({otps.length})
              </CardTitle>
              <CardDescription className="text-xs text-[#5c3a1e]/70">
                Historical record of one-time password verifications for email and security.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {otps.length === 0 ? (
                <div className="p-8 text-center">
                  <ShieldCheck className="mx-auto h-8 w-8 text-amber-700/30" />
                  <p className="mt-2 text-xs font-bold text-[#422006]">
                    No OTP History Found
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    No verification codes have been generated for this account.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-amber-900/10 bg-amber-50/30">
                        <TableHead className="text-xs font-bold text-[#422006]">
                          Type
                        </TableHead>
                        <TableHead className="text-xs font-bold text-[#422006]">
                          Created
                        </TableHead>
                        <TableHead className="text-xs font-bold text-[#422006]">
                          Expires
                        </TableHead>
                        <TableHead className="text-xs font-bold text-[#422006]">
                          Attempts
                        </TableHead>
                        <TableHead className="text-right text-xs font-bold text-[#422006]">
                          Verification Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {otps.map((otp) => {
                        const isConsumed = Boolean(otp.consumedAt);
                        const isExpired =
                          !isConsumed &&
                          otp.expiresAt &&
                          new Date(otp.expiresAt.toString()).getTime() <
                            Date.now();

                        return (
                          <TableRow key={otp.id} className="border-amber-900/5">
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="text-[10px] font-bold text-[#5c3a1e] border-amber-900/20"
                              >
                                {otp.type.replace(/_/g, " ")}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {formatDateTime(otp.createdAt)}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {formatDateTime(otp.expiresAt)}
                            </TableCell>
                            <TableCell className="text-xs font-mono font-bold text-[#422006]">
                              {otp.attempts ?? 0}
                            </TableCell>
                            <TableCell className="text-right">
                              {isConsumed ? (
                                <Badge
                                  variant="success"
                                  className="text-[10px]"
                                >
                                  Verified{" "}
                                  {otp.consumedAt
                                    ? `(${formatDateTime(otp.consumedAt)})`
                                    : ""}
                                </Badge>
                              ) : isExpired ? (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] text-stone-500 bg-stone-50"
                                >
                                  Expired
                                </Badge>
                              ) : (
                                <Badge
                                  variant="gold"
                                  className="text-[10px]"
                                >
                                  Pending Active
                                </Badge>
                              )}
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
      </div>
    </div>
  );
}
