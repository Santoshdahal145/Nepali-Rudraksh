import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Plus } from "lucide-react";
import Link from "next/link";

export default function TopHeaderAllProduct() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-amber-900/10 bg-linear-to-r from-amber-100/70 via-orange-50/50 to-amber-50 p-6 shadow-xs">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#422006]">
          All Products
        </h1>
        <p className="text-xs sm:text-sm text-[#5c3a1e]/80 mt-1 max-w-2xl">
          Track stock quantities, Mukhi grades, and pricing.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/admin/all-products/origins">
          <Button
            variant="outline"
            size="sm"
            className="h-10 gap-2 border-amber-900/15 bg-white text-xs font-bold text-[#713f12] shadow-2xs hover:bg-amber-50 hover:text-[#422006]"
          >
            <Globe className="h-4 w-4 text-amber-700" />
            Manage Origins
          </Button>
        </Link>

        <Link href="/admin/all-products/new">
          <Button
            size="sm"
            className="h-10 gap-2 bg-[#713f12] text-white hover:bg-[#5c3a1e] text-xs font-bold shadow-xs"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>
    </div>
  );
}
