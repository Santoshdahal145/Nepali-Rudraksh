"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartErrorStateProps {
  onRetry: () => void;
}

export function CartErrorState({ onRetry }: CartErrorStateProps) {
  return (
    <div className="mt-12 rounded-3xl border border-red-200 bg-red-50/50 p-8 text-center max-w-lg mx-auto">
      <AlertCircle className="h-10 w-10 text-red-600 mx-auto mb-3" />
      <h2 className="text-lg font-bold text-red-950">Unable to load your cart</h2>
      <p className="mt-1 text-xs text-red-800/80">
        We encountered an issue fetching your sacred cart. Please check your connection and try again.
      </p>
      <Button
        onClick={onRetry}
        className="mt-4 bg-[#713f12] text-xs font-semibold text-white hover:bg-[#5c330e]"
      >
        <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Retry Fetching
      </Button>
    </div>
  );
}
