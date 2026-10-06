"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useUserAdminHook, {
  useSingleUserAdmin,
} from "@/hooks/tanstack-hooks/useUserAdmin";
import UserDataLoading from "./UserDataLoading";
import UserDataError from "./UserDataError";
import UserIdentity from "./UserIdentity";
import UserNote from "./UserNote";
import UserAccountCard from "./UserAccountCard";
import UserSecurityOtp from "./UserSecurityOtp";

export default function AdminUserDetailsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const resolvedParams = use(params);
  const userId = resolvedParams.userId;

  // Single User TanStack Query
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useSingleUserAdmin(userId);
  const { updateUser } = useUserAdminHook();

  const [notes, setNotes] = useState(user?.adminNote || "");

  useEffect(() => {
    setNotes(user?.adminNote || "");
  }, [user]);

  // Copy helper
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${fieldName} copied to clipboard`);
  };

  // Format date helper
  const formatDateTime = (dateVal?: unknown) => {
    if (!dateVal) return "—";
    try {
      const d = new Date(String(dateVal));
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

  // Save notes
  const handleSaveNotes = async () => {
    if (!user) return;
    try {
      await updateUser.mutateAsync({
        id: user.id,
        data: { adminNote: notes },
      });
      toast.success("Notes saved successfully");
    } catch (err: unknown) {
      toast.error((err as { message?: string })?.message || "Failed to save notes");
    }
  };

  // Loading Screen
  if (isLoading) {
    return <UserDataLoading />;
  }

  // Error / Not Found Screen
  if (isError || !user) {
    return <UserDataError userId={userId} error={error} onRetry={() => refetch()} />;
  }

  const isAdmin = user.role === "ADMIN";
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
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Identity & Profile Card */}
        <div className="space-y-6 lg:col-span-1">
          <UserIdentity
            user={user}
            onCopy={handleCopy}
            formatDateTime={formatDateTime}
          />

          <UserNote
            notes={notes}
            setNotes={setNotes}
            onSaveNotes={handleSaveNotes}
            isSaving={updateUser.isPending}
          />
        </div>

        {/* Right Column: Accounts & Security Audit Trail */}
        <div className="space-y-6 lg:col-span-2">
          <UserAccountCard accounts={accounts} />
          <UserSecurityOtp otps={otps} formatDateTime={formatDateTime} />
        </div>
      </div>
    </div>
  );
}
