"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  /** Show compact variant (no first/last jump buttons). Defaults to false. */
  compact?: boolean;
}

/**
 * Generates an array of page numbers (and "…" gaps) to display.
 * E.g. for page=5, total=12:  [1, "…", 4, 5, 6, "…", 12]
 */
function buildPageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const range: (number | "…")[] = [];

  // Always show first page
  range.push(1);

  if (current > 3) range.push("…");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  if (current < total - 2) range.push("…");

  // Always show last page
  range.push(total);

  return range;
}

export function Pagination({
  page,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  compact = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageRange = buildPageRange(page, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-1 py-3">
      {/* Page info */}
      <p className="text-xs font-semibold text-[#5c3a1e]/70">
        Page{" "}
        <span className="font-black text-[#422006]">{page}</span>{" "}
        of{" "}
        <span className="font-black text-[#422006]">{totalPages}</span>
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* First page */}
        {!compact && (
          <Button
            variant="outline"
            size="xs"
            onClick={() => onPageChange(1)}
            disabled={!hasPrevPage}
            className="h-8 w-8 p-0 border-amber-900/15 text-[#713f12] hover:bg-amber-50 disabled:opacity-40"
            aria-label="First page"
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </Button>
        )}

        {/* Prev */}
        <Button
          variant="outline"
          size="xs"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          className="h-8 w-8 p-0 border-amber-900/15 text-[#713f12] hover:bg-amber-50 disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>

        {/* Page numbers */}
        {pageRange.map((p, idx) =>
          p === "…" ? (
            <span
              key={`gap-${idx}`}
              className="flex h-8 w-8 items-center justify-center text-xs font-semibold text-[#5c3a1e]/50 select-none"
            >
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              size="xs"
              onClick={() => onPageChange(p as number)}
              className={
                p === page
                  ? "h-8 w-8 p-0 bg-[#422006] text-amber-50 hover:bg-[#5c3a1e] border-transparent font-black text-xs"
                  : "h-8 w-8 p-0 border-amber-900/15 text-[#713f12] hover:bg-amber-50 font-semibold text-xs"
              }
              aria-label={`Page ${p}`}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </Button>
          )
        )}

        {/* Next */}
        <Button
          variant="outline"
          size="xs"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className="h-8 w-8 p-0 border-amber-900/15 text-[#713f12] hover:bg-amber-50 disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>

        {/* Last page */}
        {!compact && (
          <Button
            variant="outline"
            size="xs"
            onClick={() => onPageChange(totalPages)}
            disabled={!hasNextPage}
            className="h-8 w-8 p-0 border-amber-900/15 text-[#713f12] hover:bg-amber-50 disabled:opacity-40"
            aria-label="Last page"
          >
            <ChevronsRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
