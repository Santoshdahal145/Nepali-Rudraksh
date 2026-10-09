import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface OrdersTopHeaderProps {
  onRefresh?: () => void;
  isFetching?: boolean;
}

export default function OrdersTopHeader({
  onRefresh,
  isFetching,
}: OrdersTopHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-amber-900/10 bg-linear-to-r from-amber-100/70 via-orange-50/50 to-amber-50 p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold text-[#422006] sm:text-3xl">
          Order Management
        </h1>
        <p className="mt-1 max-w-2xl text-xs text-[#5c3a1e]/80 sm:text-sm">
          Track, process, and manage devotee orders, shipments, and consecration requests.
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
          Refresh Orders
        </Button>
      </div>
    </div>
  );
}
