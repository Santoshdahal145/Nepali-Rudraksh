import React from "react";
import Link from "next/link";
import { AlertTriangle, BookOpen, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogDetailPageErrorProps {
  slug?: string;
  message?: string;
}

export default function BlogDetailPageError({
  slug,
  message,
}: BlogDetailPageErrorProps) {
  return (
    <main className="min-h-[75vh] bg-[#faf7f2] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center rounded-3xl border border-amber-900/15 bg-white p-8 sm:p-10 shadow-lg space-y-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100/80 text-[#713f12]">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#422006]">
            Sacred Article Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[#5c3a1e]/80 leading-relaxed">
            {message ||
              `The sacred article "${
                slug || "requested"
              }" could not be located in our wisdom registry. It may have been updated, moved, or the link may be incomplete.`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/blogs" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto h-11 gap-2 rounded-xl bg-[#713f12] text-white hover:bg-[#5c3a1e] font-bold text-xs px-5 shadow-xs">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Browse All Articles</span>
            </Button>
          </Link>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto h-11 gap-2 rounded-xl border-amber-900/20 text-[#713f12] hover:bg-amber-50 font-bold text-xs px-5"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Temple Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
