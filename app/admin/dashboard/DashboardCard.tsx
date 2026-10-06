import { Card } from "@/components/ui/card";
import React from "react";

export type DashboardCardType = {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  loading: boolean;
};

export default function DashboardCard({
  title,
  value,
  icon,
  color,
  loading,
}: DashboardCardType) {
  return (
    <Card className="flex flex-col justify-between rounded-xl border border-[#e7ded4] bg-white p-3.5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:rounded-2xl sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <div
          className={`flex size-8 shrink-0 items-center justify-center rounded-lg sm:size-9 sm:rounded-xl sm:[&_svg]:size-4.5 ${color}`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-3 space-y-1 sm:mt-4">
        {loading ? (
          <div className="h-7 w-24 sm:h-8 sm:w-28 animate-pulse rounded-md bg-[#e7ded4]/70" />
        ) : (
          <div className="text-lg font-black tracking-tight text-[#422006] sm:text-2xl">
            {value.toLocaleString()}
          </div>
        )}

        <p
          className="line-clamp-1 text-[11px] font-semibold uppercase tracking-wider text-[#5c3a1e]/75 sm:text-xs"
          title={title}
        >
          {title}
        </p>
      </div>
    </Card>
  );
}
