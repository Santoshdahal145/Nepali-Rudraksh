import React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AllProductsPageError() {
  return (
    <main className="min-h-[70vh] bg-[#faf7f2] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center rounded-3xl border border-amber-900/15 bg-white p-8 sm:p-10 shadow-lg space-y-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100/80 text-red-700">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#422006]">
            Unable to Load Sacred Items
          </h2>
          <p className="text-xs sm:text-sm text-[#5c3a1e]/80 leading-relaxed">
            We encountered a momentary disturbance while connecting to the temple registry. Please refresh or try again in a moment.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/all-products" className="w-full sm:w-auto">
            <Button
              className="w-full sm:w-auto h-11 gap-2 rounded-xl bg-[#713f12] text-white hover:bg-[#5c3a1e] font-bold text-xs px-5 shadow-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto h-11 gap-2 rounded-xl border-amber-900/20 text-[#713f12] hover:bg-amber-50 font-bold text-xs px-5"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
