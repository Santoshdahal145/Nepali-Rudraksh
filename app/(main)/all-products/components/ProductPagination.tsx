import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductPaginationProps {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  currentParams: Record<string, string | undefined>;
}

export function ProductPagination({
  page,
  totalPages,
  hasNextPage,
  hasPrevPage,
  currentParams,
}: ProductPaginationProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    Object.entries(currentParams).forEach(([k, v]) => {
      if (v !== undefined && v !== "" && k !== "page") {
        params.set(k, v);
      }
    });
    params.set("page", String(targetPage));
    return `/all-products?${params.toString()}`;
  };

  // Generate visible page numbers
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-amber-900/10 pt-6">
      <p className="text-xs text-[#5c3a1e]/70">
        Showing page <span className="font-bold text-[#422006]">{page}</span> of{" "}
        <span className="font-bold text-[#422006]">{totalPages}</span>
      </p>

      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        {hasPrevPage ? (
          <Link href={createPageUrl(page - 1)}>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1 rounded-xl border-amber-900/15 text-[#713f12] hover:bg-amber-50 text-xs font-bold px-3"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Prev</span>
            </Button>
          </Link>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="h-9 gap-1 rounded-xl border-amber-900/10 text-stone-300 text-xs font-bold px-3"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Prev</span>
          </Button>
        )}

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-xs text-muted-foreground"
                >
                  …
                </span>
              );
            }

            const isCurrent = p === page;
            return isCurrent ? (
              <span
                key={p}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#713f12] text-xs font-bold text-white shadow-xs"
              >
                {p}
              </span>
            ) : (
              <Link key={p} href={createPageUrl(p)}>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-900/15 bg-white text-xs font-semibold text-[#5c3a1e] hover:bg-amber-50 hover:text-[#713f12] transition-colors">
                  {p}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Next Button */}
        {hasNextPage ? (
          <Link href={createPageUrl(page + 1)}>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1 rounded-xl border-amber-900/15 text-[#713f12] hover:bg-amber-50 text-xs font-bold px-3"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="h-9 gap-1 rounded-xl border-amber-900/10 text-stone-300 text-xs font-bold px-3"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
