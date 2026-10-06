"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserDataErrorProps {
  userId: string;
  error?: unknown;
  onRetry: () => void;
}

export default function UserDataError({
  userId,
  error,
  onRetry,
}: UserDataErrorProps) {
  return (
    <div className="p-12 text-center max-w-lg mx-auto bg-white rounded-3xl border border-amber-900/10 shadow-xs mt-10">
      <ShieldAlert className="mx-auto h-12 w-12 text-red-600" />
      <h2 className="mt-4 text-xl font-extrabold text-[#422006]">
        Devotee Account Not Found
      </h2>
      <p className="mt-2 text-xs text-muted-foreground">
        {(error as { message?: string })?.message ||
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
          onClick={onRetry}
          className="bg-[#713f12] text-white hover:bg-[#5c3a1e]"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Retry
        </Button>
      </div>
    </div>
  );
}
