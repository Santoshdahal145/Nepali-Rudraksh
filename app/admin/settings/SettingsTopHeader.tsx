"use client";

import { Badge } from "@/components/ui/badge";

export default function SettingsTopHeader() {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-amber-900/10 bg-linear-to-r from-amber-100/70 via-orange-50/50 to-amber-50 p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <Badge variant="gold" className="text-[10px]">
            System Administration
          </Badge>
        </div>

        <h1 className="text-2xl font-extrabold text-[#422006] sm:text-3xl">
          Admin Settings & Security
        </h1>

        <p className="mt-1 max-w-2xl text-xs text-[#5c3a1e]/80 sm:text-sm">
          Update administrator passwords, Vedic consecration pricing rules, and
          payment gateways.
        </p>
      </div>
    </div>
  );
}
