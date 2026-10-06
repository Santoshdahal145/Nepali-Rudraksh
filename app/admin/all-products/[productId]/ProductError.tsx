"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProductErrorProps {
  productId: number;
  error?: unknown;
  onRetry: () => void;
}

export default function ProductError({
  productId,
  error,
  onRetry,
}: ProductErrorProps) {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/all-products"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#713f12] hover:text-[#422006] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to All Products
      </Link>

      <Card className="border-red-200 bg-red-50/40 p-6 sm:p-8 text-center shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600 mb-3">
          ⚠️
        </div>
        <h2 className="text-xl font-black text-red-900">Product Not Found</h2>
        <p className="text-xs sm:text-sm text-red-700/80 mt-1 max-w-md mx-auto">
          {error instanceof Error
            ? error.message
            : `Unable to find product with ID #${productId}. It may have been deleted or the ID is invalid.`}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="gap-1.5 border-amber-900/20 text-[#713f12] hover:bg-amber-100/50"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Try Again
          </Button>
          <Link href="/admin/all-products">
            <Button size="sm" className="bg-[#713f12] text-white hover:bg-[#5c3a1e]">
              Return to Product List
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
