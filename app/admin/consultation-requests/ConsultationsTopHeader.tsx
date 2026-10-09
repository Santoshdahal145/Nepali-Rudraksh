import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ConsultationsTopHeaderProps {
  totalInquiries?: number;
  onRefresh?: () => void;
  isFetching?: boolean;
}

export default function ConsultationsTopHeader({
  totalInquiries = 0,
  onRefresh,
  isFetching,
}: ConsultationsTopHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-amber-900/10 bg-linear-to-r from-amber-100/70 via-orange-50/50 to-amber-50 p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold text-[#422006] sm:text-3xl">
          Vedic Consultations
        </h1>
        <p className="mt-1 max-w-2xl text-xs text-[#5c3a1e]/80 sm:text-sm">
          Manage devotee astrological inquiries, Janma Kundali reviews, and Mukhi guidance requests.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <Badge
          variant="outline"
          className="border-amber-900/20 bg-white/70 text-[#713f12] text-xs font-semibold px-3 py-1.5 shadow-2xs"
        >
          {totalInquiries} Total Inquiry{totalInquiries === 1 ? "" : "s"}
        </Badge>
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
      </div>
    </div>
  );
}
