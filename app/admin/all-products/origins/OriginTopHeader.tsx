"use client";

import Link from "next/link";
import { ArrowLeft, Compass, Globe, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface OriginTopHeaderProps {
  totalOrigins: number;
  uniqueCountriesCount: number;
  isLoading: boolean;
  isFetching: boolean;
  onRefetch: () => void;
}

export default function OriginTopHeader({
  totalOrigins,
  uniqueCountriesCount,
  isLoading,
  isFetching,
  onRefetch,
}: OriginTopHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Top Breadcrumbs & Secondary Nav */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/admin/all-products"
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-900/15 bg-white px-3 py-1.5 font-bold text-[#713f12] shadow-2xs hover:bg-amber-50 hover:text-[#422006] transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All Products
          </Link>
          <span className="text-muted-foreground/60">/</span>
          <span className="font-semibold text-muted-foreground">
            Rudraksha Origins
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="xs"
            onClick={onRefetch}
            disabled={isFetching}
            className="h-8 gap-1.5 border-amber-900/15 text-xs text-[#713f12] hover:bg-amber-100/60"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Top Banner */}
      <div className="rounded-3xl border border-amber-900/10 bg-linear-to-r from-amber-100/70 via-orange-50/50 to-amber-50 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#422006] tracking-tight">
              Rudraksha Origins
            </h1>
            <p className="text-xs sm:text-sm text-[#5c3a1e]/80 leading-relaxed">
              Maintain sacred geographic harvest origins (e.g. Nepal, Indonesia,
              India). These origins are linked directly to product variants to
              guarantee authentic provenance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/all-products/origins/new">
              <Button className="h-10 px-5 bg-[#713f12] text-white hover:bg-[#5c3a1e] font-bold text-xs gap-2 shadow-sm">
                <Plus className="h-4 w-4" /> Add Origin
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-4 shadow-2xs border-amber-900/10 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Origins
            </p>
            <Compass className="h-4 w-4 text-amber-700/60" />
          </div>
          <p className="text-2xl font-black text-[#422006] mt-1">
            {isLoading ? (
              <span className="text-sm font-normal text-muted-foreground">
                Loading...
              </span>
            ) : (
              `${totalOrigins} Regions`
            )}
          </p>
        </Card>

        <Card className="p-4 shadow-2xs border-amber-900/10 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Unique Countries
            </p>
            <Globe className="h-4 w-4 text-emerald-700/60" />
          </div>
          <p className="text-2xl font-black text-emerald-950 mt-1">
            {isLoading ? (
              <span className="text-sm font-normal text-muted-foreground">
                Loading...
              </span>
            ) : (
              `${uniqueCountriesCount} Countries`
            )}
          </p>
        </Card>
      </div>
    </div>
  );
}
