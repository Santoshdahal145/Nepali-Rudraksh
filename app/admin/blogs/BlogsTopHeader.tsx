import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import Link from "next/link";

interface BlogsTopHeaderProps {
  onRefresh?: () => void;
  isFetching?: boolean;
}

export default function BlogsTopHeader({
  onRefresh,
  isFetching,
}: BlogsTopHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-amber-900/10 bg-linear-to-r from-amber-100/70 via-orange-50/50 to-amber-50 p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold text-[#422006] sm:text-3xl">
          Blog Management
        </h1>
        <p className="mt-1 max-w-2xl text-xs text-[#5c3a1e]/80 sm:text-sm">
          Publish, edit, and organize spiritual articles and sacred Rudraksha knowledge.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isFetching}
          className="h-10 gap-2 border-amber-900/15 bg-white text-xs font-bold text-[#713f12] shadow-2xs hover:bg-amber-50 hover:text-[#422006]"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>

        <Link href="/admin/blogs/new">
          <Button
            size="sm"
            className="h-10 gap-2 bg-[#713f12] text-white hover:bg-[#5c3a1e] text-xs font-bold shadow-xs"
          >
            <Plus className="h-4 w-4" />
            New Blog
          </Button>
        </Link>
      </div>
    </div>
  );
}
