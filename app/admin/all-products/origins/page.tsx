"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RudrakshOriginType } from "@/app/types";
import useRudrakshOriginAdminHook from "@/hooks/tanstack-hooks/useRudrakshOriginAdmin";
import OriginTopHeader from "./OriginTopHeader";
import SearchFilterOrigin from "./SearchFilterOrigin";
import AllOriginContent from "./AllOriginContent";

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
        `Are you sure you want to delete origin "${name}" (${country})? This action cannot be undone.`,
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
          "Failed to delete origin. It may be assigned to one or more product variants.",
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
    new Set(rawOrigins.map((o) => o.country.trim())),
  );

  return (
    <div className="space-y-6 pb-12">
      <OriginTopHeader
        totalOrigins={rawOrigins.length}
        uniqueCountriesCount={uniqueCountries.length}
        isLoading={getRudrakshOrigins.isLoading}
        isFetching={getRudrakshOrigins.isFetching}
        onRefetch={() => getRudrakshOrigins.refetch()}
      />

      <SearchFilterOrigin
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <AllOriginContent
        origins={filteredOrigins}
        totalRawOrigins={rawOrigins.length}
        isLoading={getRudrakshOrigins.isLoading}
        isError={getRudrakshOrigins.isError}
        error={getRudrakshOrigins.error}
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery("")}
        onRefetch={() => getRudrakshOrigins.refetch()}
        onDelete={handleDelete}
        deletingId={deletingId}
        viewMode={viewMode}
      />
    </div>
  );
}
