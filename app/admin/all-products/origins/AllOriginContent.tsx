"use client";

import Link from "next/link";
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { RudrakshOriginType } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AllOriginContentProps {
  origins: RudrakshOriginType[];
  totalRawOrigins: number;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  searchQuery: string;
  onClearSearch: () => void;
  onRefetch: () => void;
  onDelete: (id: number, name: string, country: string) => void;
  deletingId: number | null;
  viewMode: "cards" | "table";
}

export default function AllOriginContent({
  origins,
  totalRawOrigins,
  isLoading,
  isError,
  error,
  searchQuery,
  onClearSearch,
  onRefetch,
  onDelete,
  deletingId,
  viewMode,
}: AllOriginContentProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <div className="relative flex items-center justify-center">
          <div className="h-14 w-14 rounded-full border-4 border-amber-200 border-t-amber-700 animate-spin" />
          <span className="absolute text-lg">🌍</span>
        </div>
        <p className="text-sm font-semibold text-[#5c3a1e]/70 mt-2">
          Loading Rudraksha origins…
        </p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <Card className="border-red-200 bg-red-50/40 p-8 text-center shadow-xs">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-base font-bold text-red-900 mt-2">
          Failed to load origins
        </h3>
        <p className="text-xs text-red-700 mt-1">
          {error instanceof Error
            ? error.message
            : "An unexpected error occurred while loading origins."}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefetch}
          className="mt-4 border-amber-900/20 text-[#713f12]"
        >
          Retry
        </Button>
      </Card>
    );
  }

  // No origins in database yet
  if (totalRawOrigins === 0) {
    return (
      <Card className="border-dashed border-amber-900/20 bg-amber-50/20 p-12 text-center shadow-none">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100/70 text-2xl text-[#713f12] mb-3">
          🌍
        </div>
        <h3 className="text-base font-bold text-[#422006]">
          No Origins Registered Yet
        </h3>
        <p className="text-xs text-[#5c3a1e]/80 max-w-md mx-auto mt-1">
          Rudraksha origins specify the geographic region where beads and trees
          grow (e.g. Nepal, Indonesia, India). Add your first origin to link with
          variants.
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
    );
  }

  // Filter yielded 0 results
  if (origins.length === 0) {
    return (
      <Card className="p-8 text-center border-amber-900/10 bg-white">
        <p className="text-xs font-semibold text-muted-foreground">
          No origins found matching &quot;{searchQuery}&quot;
        </p>
        <Button
          variant="ghost"
          size="xs"
          onClick={onClearSearch}
          className="mt-2 text-xs text-[#713f12]"
        >
          Clear Search Filter
        </Button>
      </Card>
    );
  }

  // Cards View
  if (viewMode === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {origins.map((origin) => {
          const isDeleting = deletingId === origin.id;

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
                  <Link href={`/admin/all-products/origins/${origin.id}/edit`}>
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
                      onDelete(origin.id, origin.name, origin.country)
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
    );
  }

  // Table View
  return (
    <Card className="shadow-xs overflow-hidden border-amber-900/15 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-amber-900/10 bg-amber-50/40">
            <TableHead className="w-16 font-bold text-[#422006]">ID</TableHead>
            <TableHead className="font-bold text-[#422006]">
              Region / Name
            </TableHead>
            <TableHead className="font-bold text-[#422006]">Country</TableHead>
            <TableHead className="font-bold text-[#422006]">
              Registered Date
            </TableHead>
            <TableHead className="text-right font-bold text-[#422006]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {origins.map((origin) => {
            const isDeleting = deletingId === origin.id;

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
                    ? new Date(origin.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link href={`/admin/all-products/origins/${origin.id}/edit`}>
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
                        onDelete(origin.id, origin.name, origin.country)
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
  );
}
