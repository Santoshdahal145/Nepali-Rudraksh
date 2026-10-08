import React from "react";
import Link from "next/link";
import { BookOpen, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogsEmptyState({ hasSearch = false }: { hasSearch?: boolean }) {
  return (
    <main className="min-h-[60vh] bg-[#faf7f2] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg text-center rounded-3xl border border-dashed border-amber-900/20 bg-white p-8 sm:p-14 shadow-xs space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100/70 text-[#713f12]">
          <BookOpen className="h-8 w-8 text-[#713f12]" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-black text-[#422006]">
            {hasSearch
              ? "No Articles Match Your Search"
              : "No Articles Published Yet"}
          </h2>
          <p className="text-xs sm:text-sm text-[#5c3a1e]/75 max-w-md mx-auto leading-relaxed">
            {hasSearch
              ? "We couldn't find any sacred articles matching your keywords. Try checking for spelling errors or searching for broader topics."
              : "Our scholars and priests are currently preparing authentic sacred scriptures and articles. Please check back shortly."}
          </p>
        </div>

        {hasSearch && (
          <div className="pt-2">
            <Link href="/blogs">
              <Button className="h-11 gap-2 rounded-xl bg-[#713f12] text-white hover:bg-[#5c3a1e] font-bold text-xs px-6 shadow-xs">
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Search & View All</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
