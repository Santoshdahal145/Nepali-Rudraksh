"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  MessageCircle,
  Mail,
  Phone,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  CheckCircle2,
  Clock3,
  XCircle,
  HelpCircle,
  User,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useConsultationRequestHook from "@/hooks/tanstack-hooks/useConsultationRequest";
import {
  ConsultationRequestType,
  ConsultationStatus,
} from "@/app/api/consultation-requests/api";

const statusConfig: Record<
  ConsultationStatus,
  { label: string; color: string; bg: string; border: string; icon: React.ElementType }
> = {
  PENDING: {
    label: "Pending Review",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: Clock3,
  },
  CONTACTED: {
    label: "Contacted / In Progress",
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    icon: MessageCircle,
  },
  COMPLETED: {
    label: "Completed",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-rose-700 dark:text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    icon: XCircle,
  },
};

export default function ConsultationRequestsAdminPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ConsultationStatus | "ALL">("ALL");

  const activeStatus = statusFilter === "ALL" ? undefined : statusFilter;

  const { getRequests, updateRequest, deleteRequest } = useConsultationRequestHook(
    page,
    10,
    search,
    activeStatus,
  );

  const { data, isLoading, isError, refetch } = getRequests;
  const requests = data?.requests || [];
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };

  const handleStatusChange = async (
    id: number,
    newStatus: ConsultationStatus,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    try {
      await updateRequest.mutateAsync({
        id,
        data: { status: newStatus },
      });
      toast.success(`Request #${id} marked as ${statusConfig[newStatus].label}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: number, devoteeName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the consultation request for ${devoteeName}?`)) {
      try {
        await deleteRequest.mutateAsync({ id });
        toast.success("Consultation request deleted successfully");
      } catch {
        toast.error("Failed to delete consultation request");
      }
    }
  };

  // Filter tabs
  const tabs: Array<{ key: ConsultationStatus | "ALL"; label: string }> = [
    { key: "ALL", label: "All Inquiries" },
    { key: "PENDING", label: "Pending" },
    { key: "CONTACTED", label: "Contacted" },
    { key: "COMPLETED", label: "Completed" },
    { key: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              <Sparkles className="size-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Vedic Consultations
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Manage devotee astrological inquiries, Janma Kundali reviews, and Mukhi guidance requests.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs px-3 py-1 font-mono">
            {pagination.total} Total Inquiry{pagination.total === 1 ? "" : "s"}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-muted/40 rounded-xl border">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setStatusFilter(tab.key);
                setPage(1);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === tab.key
                  ? "bg-background text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by devotee, email, phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* Content State */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl border bg-muted/20 animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <Card className="border-destructive/30 bg-destructive/5 text-center p-8">
          <CardTitle className="text-destructive text-base">
            Failed to Load Consultations
          </CardTitle>
          <CardDescription className="text-xs mt-1">
            An error occurred while fetching consultation requests. Please try again.
          </CardDescription>
          <div className="mt-4">
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </Card>
      ) : requests.length === 0 ? (
        <Card className="border-dashed bg-muted/10 text-center py-16 px-4">
          <CardContent className="space-y-3">
            <div className="mx-auto size-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Sparkles className="size-6" />
            </div>
            <h3 className="text-base font-bold">No Consultation Requests Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {search || statusFilter !== "ALL"
                ? "No inquiries matched your current filter criteria. Try adjusting your search."
                : "No devotees have submitted consultation forms yet. Requests will appear here once submitted."}
            </p>
            {(search || statusFilter !== "ALL") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                  setPage(1);
                }}
                className="mt-2 text-xs"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const statusMeta = statusConfig[req.status] || statusConfig.PENDING;
            const StatusIcon = statusMeta.icon;

            const whatsappUrl = `https://wa.me/${req.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
              `Namaste ${req.fullName}, this is Ujwal Bhandari from Nepali Rudraksh regarding your consultation request for ${req.intention}.`,
            )}`;

            return (
              <div
                key={req.id}
                className="rounded-2xl border bg-card p-5 sm:p-6 shadow-xs hover:border-primary/40 hover:shadow-md transition-all space-y-4"
              >
                {/* Top Row: Name, Status, Date & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold flex items-center justify-center text-sm border border-amber-500/20">
                      {req.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/consultation-requests/${req.id}`}
                          className="font-bold text-base hover:text-primary transition-colors hover:underline"
                        >
                          {req.fullName}
                        </Link>
                        <span className="text-xs text-muted-foreground font-mono">
                          #{req.id}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3 text-muted-foreground/70" />
                          {new Date(req.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge & Quick Toggles */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusMeta.bg} ${statusMeta.color} ${statusMeta.border}`}
                    >
                      <StatusIcon className="size-3.5" />
                      <span>{statusMeta.label}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Link href={`/admin/consultation-requests/${req.id}`}>
                        <Button variant="outline" size="xs" className="gap-1.5 text-xs">
                          <Eye className="size-3.5" />
                          View
                        </Button>
                      </Link>

                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={(e) => handleDelete(req.id, req.fullName, e)}
                        title="Delete inquiry"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Middle Grid: Contact & Astrological Essentials */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Contact Info */}
                  <div className="space-y-1.5 bg-muted/20 p-3 rounded-xl border border-muted/50">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Contact Devotee
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-foreground font-medium">
                        <Phone className="size-3.5 text-primary shrink-0" />
                        <span>{req.phone}</span>
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-semibold"
                          title="Message on WhatsApp"
                        >
                          <MessageCircle className="size-3" />
                          WhatsApp
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="size-3.5 text-muted-foreground shrink-0" />
                        <a
                          href={`mailto:${req.email}`}
                          className="hover:underline truncate"
                        >
                          {req.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Janma Kundali / Birth Info */}
                  <div className="space-y-1.5 bg-muted/20 p-3 rounded-xl border border-muted/50">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Birth Details (Kundali)
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-foreground">
                        <Calendar className="size-3.5 text-amber-600 shrink-0" />
                        <span>
                          DOB: <span className="font-medium">{req.dob || "Not provided"}</span>
                        </span>
                        {req.tob && (
                          <span className="text-muted-foreground">
                            ({req.tob})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground truncate">
                        <MapPin className="size-3.5 text-rose-500 shrink-0" />
                        <span>POB: {req.pob || "Not provided"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Spiritual Intention & Mode */}
                  <div className="space-y-1.5 bg-muted/20 p-3 rounded-xl border border-muted/50">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Spiritual Focus & Channel
                    </span>
                    <div className="space-y-1">
                      <div className="font-semibold text-foreground line-clamp-1">
                        🎯 {req.intention}
                      </div>
                      <div className="text-muted-foreground line-clamp-1">
                        📡 Mode: {req.preferredMode}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Devotee Notes preview (if any) */}
                {req.notes && (
                  <div className="bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-900/10 text-xs">
                    <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 block mb-0.5">
                      Devotee&apos;s Questions / Special Notes:
                    </span>
                    <p className="text-muted-foreground italic whitespace-pre-wrap line-clamp-2">
                      &quot;{req.notes}&quot;
                    </p>
                  </div>
                )}

                {/* Quick 1-Click Status Bar */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-muted-foreground text-[11px] mr-1">
                      Set Status:
                    </span>
                    {(["PENDING", "CONTACTED", "COMPLETED", "CANCELLED"] as const).map(
                      (st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={(e) => handleStatusChange(req.id, st, e)}
                          className={`px-2 py-1 rounded-md text-[11px] font-semibold border transition-all ${
                            req.status === st
                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                              : "bg-background text-muted-foreground hover:bg-muted border-border"
                          }`}
                        >
                          {statusConfig[st].label.split(" ")[0]}
                        </button>
                      ),
                    )}
                  </div>

                  <Link
                    href={`/admin/consultation-requests/${req.id}`}
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    View Details & Add Admin Kundali Notes &rarr;
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t">
              <span className="text-xs text-muted-foreground">
                Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="gap-1 text-xs"
                >
                  <ChevronLeft className="size-3.5" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="gap-1 text-xs"
                >
                  Next
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
