import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Sliders } from "lucide-react";
import Link from "next/link";

export default function DashboardTopWelcome() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-amber-900/10 bg-linear-to-r from-amber-100/70 via-orange-50/50 to-amber-50 p-5 sm:p-7 shadow-xs">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge
            variant="gold"
            className="text-[10px] uppercase tracking-wider"
          >
            Live Business Intelligence
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#422006]">
          Welcome to Temple Administration 🌿
        </h1>
        <p className="text-xs sm:text-sm text-[#5c3a1e]/80 max-w-2xl">
          Real-time analytics for sacred Himalayan Rudraksha orders, inventory
          levels, devotee consultations, and consecration schedules.
        </p>
      </div>

      <div className="flex  flex-row items-center gap-2.5">
        <Link href="/admin/all-products">
          <Button className="h-10 gap-1.5 bg-[#713f12] text-xs font-bold text-white shadow-xs hover:bg-[#5c330e]">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
        <Link href="/admin/home-control">
          <Button
            variant="outline"
            className="h-10 gap-1.5 border-amber-900/20 bg-white text-xs font-bold text-[#713f12] hover:bg-amber-50"
          >
            <Sliders className="h-4 w-4" />
            Home Control
          </Button>
        </Link>
      </div>
    </div>
  );
}
