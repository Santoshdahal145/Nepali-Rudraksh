"use client";

import {
  ArrowLeft,
  Calendar,
  Compass,
  Edit,
  Globe,
  Loader2,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { RudrakshOriginType } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useRudrakshOriginAdminHook from "@/hooks/tanstack-hooks/useRudrakshOriginAdmin";

export default function RudrakshOriginsPage() {
  const { getRudrakshOrigins, deleteRudrakshOrigin } =
    useRudrakshOriginAdminHook();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Normalize API response: supports array or paginated object
  const data = getRudrakshOrigins.data;
  const rawOrigins: RudrakshOriginType[] = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.origins)
      ? (data as any).origins
      : [];

  const handleDelete = async (id: number, name: string, country: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete origin "${name}" (${country})? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteRudrakshOrigin.mutateAsync({ id });
    } catch (err: any) {
      toast.error(
        err?.message ||
          "Failed to delete origin. It may be assigned to one or more product variants."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Filter origins based on search
  const filteredOrigins = rawOrigins.filter((origin) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      origin.name.toLowerCase().includes(q) ||
      origin.country.toLowerCase().includes(q) ||
      String(origin.id).includes(q)
    );
  });

  // Calculate unique countries
  const uniqueCountries = Array.from(
    new Set(rawOrigins.map((o) => o.country.trim()))
  );

  return (
    <div className="space-y-6 pb-12">
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
            onClick={() => getRudrakshOrigins.refetch()}
            disabled={getRudrakshOrigins.isFetching}
            className="h-8 gap-1.5 border-amber-900/15 text-xs text-[#713f12] hover:bg-amber-100/60"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                getRudrakshOrigins.isFetching ? "animate-spin" : ""
              }`}
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
            {getRudrakshOrigins.isLoading ? (
              <span className="text-sm font-normal text-muted-foreground">
                Loading...
              </span>
            ) : (
              `${rawOrigins.length} Regions`
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
            {getRudrakshOrigins.isLoading ? (
              <span className="text-sm font-normal text-muted-foreground">
                Loading...
              </span>
            ) : (
              `${uniqueCountries.length} Countries`
            )}
          </p>
        </Card>
      </div>

      {/* Filter and View Controls Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-amber-900/10 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by region name or country (e.g. Nepal, Indonesia)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-10 text-xs sm:text-sm border-amber-900/15 focus-visible:ring-amber-700 bg-amber-50/20"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-amber-900/15 bg-white p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                viewMode === "cards"
                  ? "bg-amber-100/70 text-[#713f12]"
                  : "text-muted-foreground hover:text-[#422006]"
              }`}
            >
              Cards View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                viewMode === "table"
                  ? "bg-amber-100/70 text-[#713f12]"
                  : "text-muted-foreground hover:text-[#422006]"
              }`}
            >
              Table View
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {getRudrakshOrigins.isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20">
          <div className="relative flex items-center justify-center">
            <div className="h-14 w-14 rounded-full border-4 border-amber-200 border-t-amber-700 animate-spin" />
            <span className="absolute text-lg">🌍</span>
          </div>
          <p className="text-sm font-semibold text-[#5c3a1e]/70 mt-2">
            Loading Rudraksha origins…
          </p>
        </div>
      ) : getRudrakshOrigins.isError ? (
        <Card className="border-red-200 bg-red-50/40 p-8 text-center shadow-xs">
          <span className="text-3xl">⚠️</span>
          <h3 className="text-base font-bold text-red-900 mt-2">
            Failed to load origins
          </h3>
          <p className="text-xs text-red-700 mt-1">
            {getRudrakshOrigins.error instanceof Error
              ? getRudrakshOrigins.error.message
              : "An unexpected error occurred while loading origins."}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => getRudrakshOrigins.refetch()}
            className="mt-4 border-amber-900/20 text-[#713f12]"
          >
            Retry
          </Button>
        </Card>
      ) : rawOrigins.length === 0 ? (
        <Card className="border-dashed border-amber-900/20 bg-amber-50/20 p-12 text-center shadow-none">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100/70 text-2xl text-[#713f12] mb-3">
            🌍
          </div>
          <h3 className="text-base font-bold text-[#422006]">
            No Origins Registered Yet
          </h3>
          <p className="text-xs text-[#5c3a1e]/80 max-w-md mx-auto mt-1">
            Rudraksha origins specify the geographic region where beads and
            trees grow (e.g. Nepal, Indonesia, India). Add your first origin to
            link with variants.
          </p>
          <div className="mt-5">
            <Link href="/admin/all-products/origins/new">
              <Button
                size="sm"
                className="bg-[#713f12] text-white hover:bg-[#5c3a1e] font-semibold"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Your First Origin
              </Button>
            </Link>
          </div>
        </Card>
      ) : filteredOrigins.length === 0 ? (
        <Card className="p-8 text-center border-amber-900/10 bg-white">
          <p className="text-xs font-semibold text-muted-foreground">
            No origins found matching &quot;{searchQuery}&quot;
          </p>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setSearchQuery("")}
            className="mt-2 text-xs text-[#713f12]"
          >
            Clear Search Filter
          </Button>
        </Card>
      ) : viewMode === "cards" ? (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrigins.map((origin) => {
            const isDeleting = deletingId === origin.id;
            const flagEmoji = origin.country.toLowerCase().includes("nepal")
              ? "🇳🇵"
              : origin.country.toLowerCase().includes("indonesia")
                ? "🇮🇩"
                : origin.country.toLowerCase().includes("india")
                  ? "🇮🇳"
                  : "🌍";

            return (
              <Card
                key={origin.id}
                className="group overflow-hidden border-amber-900/15 bg-white shadow-xs transition-all hover:shadow-md hover:border-amber-900/30"
              >
                {/* Header */}
                <div className="border-b border-amber-900/10 bg-linear-to-r from-amber-50/80 via-orange-50/40 to-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div>
                        <h3 className="font-extrabold text-[#422006] text-base group-hover:text-[#713f12] transition-colors">
                          {origin.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className="mt-0.5 text-[10px] bg-white border-amber-900/20 text-[#5c3a1e]"
                        >
                          {origin.country}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-4 space-y-3">
                  {/* Actions */}
                  <div className="pt-2 border-t border-amber-900/10 flex items-center justify-between">
                    <Link
                      href={`/admin/all-products/origins/${origin.id}/edit`}
                    >
                      <Button
                        variant="outline"
                        size="xs"
                        className="h-8 gap-1 border-amber-900/15 text-xs text-[#713f12] hover:bg-amber-100/60"
                      >
                        <Edit className="h-3.5 w-3.5" /> Edit Origin
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() =>
                        handleDelete(origin.id, origin.name, origin.country)
                      }
                      disabled={isDeleting}
                      className="h-8 text-red-700 hover:bg-red-50 hover:text-red-900 text-xs"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                      <span className="ml-1">Delete</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <Card className="shadow-xs overflow-hidden border-amber-900/15 bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-amber-900/10 bg-amber-50/40">
                <TableHead className="w-16 font-bold text-[#422006]">
                  ID
                </TableHead>
                <TableHead className="font-bold text-[#422006]">
                  Region / Name
                </TableHead>
                <TableHead className="font-bold text-[#422006]">
                  Country
                </TableHead>
                <TableHead className="font-bold text-[#422006]">
                  Registered Date
                </TableHead>
                <TableHead className="text-right font-bold text-[#422006]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrigins.map((origin) => {
                const isDeleting = deletingId === origin.id;
                const flagEmoji = origin.country.toLowerCase().includes("nepal")
                  ? "🇳🇵"
                  : origin.country.toLowerCase().includes("indonesia")
                    ? "🇮🇩"
                    : origin.country.toLowerCase().includes("india")
                      ? "🇮🇳"
                      : "🌍";

                return (
                  <TableRow
                    key={origin.id}
                    className="border-amber-900/10 hover:bg-amber-50/20"
                  >
                    <TableCell className="font-mono text-xs font-bold text-[#713f12]">
                      #{origin.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#422006] text-xs sm:text-sm">
                          {origin.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-xs bg-white border-amber-900/20 text-[#5c3a1e]"
                      >
                        {origin.country}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {origin.createdAt
                        ? new Date(origin.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/all-products/origins/${origin.id}/edit`}
                        >
                          <Button
                            variant="outline"
                            size="xs"
                            className="h-8 gap-1 border-amber-900/15 text-xs text-[#713f12] hover:bg-amber-100/60"
                          >
                            <Edit className="h-3.5 w-3.5" /> Edit
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() =>
                            handleDelete(origin.id, origin.name, origin.country)
                          }
                          disabled={isDeleting}
                          className="h-8 text-red-700 hover:bg-red-50 hover:text-red-900"
                        >
                          {isDeleting ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
