"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface OriginErrorProps {
  originId: number;
  error?: unknown;
  onRetry: () => void;
}

export default function OriginError({
  originId,
  error,
  onRetry,
}: OriginErrorProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link
        href="/admin/all-products/origins"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#713f12] hover:text-[#422006]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Origins List
      </Link>

      <Card className="border-red-200 bg-red-50/40 p-8 text-center shadow-xs">
        <span className="text-3xl">⚠️</span>
        <h2 className="text-lg font-bold text-red-900 mt-2">
          Origin Not Found
        </h2>
        <p className="text-xs text-red-700/80 mt-1 max-w-md mx-auto">
          {error instanceof Error
            ? error.message
            : `Unable to locate origin with ID #${originId}.`}
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="gap-1.5 border-amber-900/20 text-[#713f12]"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </Button>
          <Link href="/admin/all-products/origins">
            <Button size="sm" className="bg-[#713f12] text-white">
              Back to Origins List
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
