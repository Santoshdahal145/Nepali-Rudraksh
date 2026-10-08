"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  MessageCircle,
  Mail,
  Phone,
  Sparkles,
  CheckCircle2,
  Clock3,
  XCircle,
  Trash2,
  Save,
  Loader2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useSingleConsultation,
} from "@/hooks/tanstack-hooks/useConsultationRequest";
import useConsultationRequestHook from "@/hooks/tanstack-hooks/useConsultationRequest";
import { ConsultationStatus } from "@/app/api/consultation-requests/api";

const statusConfig: Record<
  ConsultationStatus,
  {
    label: string;
    description: string;
    color: string;
    bg: string;
    border: string;
    icon: React.ElementType;
  }
> = {
  PENDING: {
    label: "Pending Review",
    description: "New inquiry received. Kundali and devotee details awaiting initial review.",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: Clock3,
  },
  CONTACTED: {
    label: "Contacted / In Progress",
    description: "Devotee has been reached via WhatsApp/Call. Vedic assessment in progress.",
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    icon: MessageCircle,
  },
  COMPLETED: {
    label: "Completed",
    description: "Consultation finished, Mukhi recommendations provided, and guidance delivered.",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-rose-700 dark:text-rose-400",
    description: "Inquiry was cancelled, duplicate, or devotee could not be reached.",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    icon: XCircle,
  },
};

export default function SingleConsultationRequestAdminPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = Number(params?.id);

  const { data: request, isLoading, isError, refetch } = useSingleConsultation(requestId);
  const { updateRequest, deleteRequest } = useConsultationRequestHook();

  const [adminNotes, setAdminNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  useEffect(() => {
    if (request) {
      setAdminNotes(request.adminNotes || "");
    }
  }, [request]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Loading consultation details...
        </p>
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <Link href="/admin/consultation-requests">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="size-4" />
            Back to Inquiries
          </Button>
        </Link>
        <Card className="border-destructive/30 bg-destructive/5 text-center p-8">
          <AlertCircle className="size-8 mx-auto text-destructive" />
          <CardTitle className="text-destructive text-base mt-2">
            Consultation Request Not Found
          </CardTitle>
          <CardDescription className="text-xs mt-1">
            The inquiry with ID #{requestId} could not be loaded or may have been deleted.
          </CardDescription>
          <div className="mt-4">
            <Button size="sm" onClick={() => refetch()}>
              Retry Loading
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentStatusMeta = statusConfig[request.status] || statusConfig.PENDING;
  const CurrentStatusIcon = currentStatusMeta.icon;

  const handleStatusUpdate = async (newStatus: ConsultationStatus) => {
    try {
      await updateRequest.mutateAsync({
        id: request.id,
        data: { status: newStatus },
      });
      toast.success(`Status updated to ${statusConfig[newStatus].label}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleSaveAdminNotes = async () => {
    setIsSavingNotes(true);
    try {
      await updateRequest.mutateAsync({
        id: request.id,
        data: { adminNotes },
      });
      toast.success("Astrologer notes saved successfully");
    } catch {
      toast.error("Failed to save notes");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete the consultation request for ${request.fullName}?`,
      )
    ) {
      try {
        await deleteRequest.mutateAsync({ id: request.id });
        toast.success("Consultation request deleted successfully");
        router.push("/admin/consultation-requests");
      } catch {
        toast.error("Failed to delete request");
      }
    }
  };

  const whatsappDirectUrl = `https://wa.me/${request.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Namaste ${request.fullName}, this is Ujwal Bhandari from Nepali Rudraksh. I reviewed your consultation request regarding ${request.intention}. How can I best guide you today?`,
  )}`;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/consultation-requests">
            <Button variant="ghost" size="icon-sm">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {request.fullName}
              </h1>
              <span className="text-xs text-muted-foreground font-mono">
                #{request.id}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Received on{" "}
              {new Date(request.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Current Status Pill */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${currentStatusMeta.bg} ${currentStatusMeta.color} ${currentStatusMeta.border}`}
          >
            <CurrentStatusIcon className="size-4" />
            <span>{currentStatusMeta.label}</span>
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="gap-1.5 text-xs"
          >
            <Trash2 className="size-3.5" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Grid: Devotee & Astrological Details on Left (2/3), Status & Admin Notes on Right (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3): Devotee Profile & Astrological Data */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Contact & Action Card */}
          <Card className="border-primary/20 bg-linear-to-br from-card to-amber-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="size-4 text-primary" />
                Devotee Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1 p-3 rounded-xl bg-background border">
                  <span className="text-muted-foreground block text-[11px] font-semibold uppercase">
                    Phone Number
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{request.phone}</span>
                    <a
                      href={`tel:${request.phone}`}
                      className="text-primary hover:underline font-medium"
                    >
                      Call Devotee
                    </a>
                  </div>
                </div>

                <div className="space-y-1 p-3 rounded-xl bg-background border">
                  <span className="text-muted-foreground block text-[11px] font-semibold uppercase">
                    Email Address
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm truncate max-w-[170px]">
                      {request.email}
                    </span>
                    <a
                      href={`mailto:${request.email}`}
                      className="text-primary hover:underline font-medium"
                    >
                      Send Email
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp CTA Button */}
              <div className="pt-2">
                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold gap-2">
                    <MessageCircle className="size-4 fill-white" />
                    Open WhatsApp Chat with {request.fullName}
                    <ExternalLink className="size-3.5 ml-auto" />
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Astrological & Birth Information (Kundali Data) */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="size-4 text-amber-600" />
                Astrological & Janma Kundali Details
              </CardTitle>
              <CardDescription className="text-xs">
                Essential planetary coordinates provided by the devotee for Rudraksha selection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-muted/20 border space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                    <Calendar className="size-3.5 text-amber-600" />
                    Date of Birth (DOB)
                  </div>
                  <p className="font-bold text-sm text-foreground">
                    {request.dob || "Not provided"}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-muted/20 border space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                    <Clock className="size-3.5 text-blue-600" />
                    Time of Birth (TOB)
                  </div>
                  <p className="font-bold text-sm text-foreground">
                    {request.tob || "Not provided"}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-muted/20 border space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                    <MapPin className="size-3.5 text-rose-600" />
                    Place of Birth (POB)
                  </div>
                  <p className="font-bold text-sm text-foreground truncate">
                    {request.pob || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Consultation Intention & Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                    Spiritual Life Intention
                  </span>
                  <p className="font-bold text-sm text-foreground">
                    🎯 {request.intention}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1">
                  <span className="text-[11px] font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wider block">
                    Preferred Mode of Consultation
                  </span>
                  <p className="font-bold text-sm text-foreground">
                    📡 {request.preferredMode}
                  </p>
                </div>
              </div>

              {/* Devotee's Questions / Notes */}
              <div className="space-y-1.5 pt-2">
                <span className="font-bold text-foreground block">
                  Devotee&apos;s Specific Questions & Inquiries:
                </span>
                <div className="p-4 rounded-xl bg-muted/30 border text-foreground leading-relaxed whitespace-pre-wrap">
                  {request.notes ? (
                    request.notes
                  ) : (
                    <span className="text-muted-foreground italic">
                      No additional notes provided by devotee.
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3): Workflow Status Controller & Astrologer Notes */}
        <div className="space-y-6">
          {/* Status Switcher Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Consultation Status</CardTitle>
              <CardDescription className="text-xs">
                Update devotee workflow and review stage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(["PENDING", "CONTACTED", "COMPLETED", "CANCELLED"] as const).map(
                (st) => {
                  const meta = statusConfig[st];
                  const Icon = meta.icon;
                  const isCurrent = request.status === st;

                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusUpdate(st)}
                      disabled={updateRequest.isPending}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                        isCurrent
                          ? `${meta.bg} ${meta.border} shadow-xs ring-1 ring-primary/30`
                          : "bg-card hover:bg-muted/40 border-border"
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                          isCurrent
                            ? `${meta.color} bg-background`
                            : "text-muted-foreground bg-muted"
                        }`}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold ${
                              isCurrent ? meta.color : "text-foreground"
                            }`}
                          >
                            {meta.label}
                          </span>
                          {isCurrent && (
                            <Badge variant="outline" className="text-[10px] uppercase font-mono">
                              Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-tight">
                          {meta.description}
                        </p>
                      </div>
                    </button>
                  );
                },
              )}
            </CardContent>
          </Card>

          {/* Astrologer / Admin Kundali Notes Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-600" />
                Astrologer Internal Notes
              </CardTitle>
              <CardDescription className="text-xs">
                Private notes by Ujwal Bhandari on chart assessment and recommended Mukhis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <textarea
                rows={5}
                placeholder="e.g. Strong Surya influence, recommended 12 Mukhi + 5 Mukhi mala for solar vitality. Reached out on WhatsApp on Oct 9..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring leading-relaxed"
              />

              <Button
                size="sm"
                onClick={handleSaveAdminNotes}
                disabled={isSavingNotes || updateRequest.isPending}
                className="w-full gap-1.5 text-xs"
              >
                {isSavingNotes ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Saving Notes...
                  </>
                ) : (
                  <>
                    <Save className="size-3.5" />
                    Save Astrologer Notes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
