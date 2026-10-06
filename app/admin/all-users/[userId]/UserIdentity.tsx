"use client";

import { Calendar, Clock, Copy, Mail, Phone } from "lucide-react";
import { UserType } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface UserIdentityProps {
  user: UserType;
  onCopy: (text: string, fieldName: string) => void;
  formatDateTime: (dateVal?: unknown) => string;
}

export default function UserIdentity({
  user,
  onCopy,
  formatDateTime,
}: UserIdentityProps) {
  const isAdmin = user.role === "ADMIN";
  const isVerified = Boolean(user.isEmailVerified);
  const initials =
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
    "D";

  return (
    <Card className="shadow-xs overflow-hidden border-amber-900/10">
      <CardContent className="pt-6 space-y-6">
        {/* Devotee Avatar & Status Header */}
        <div className="flex flex-col items-center text-center">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-md ${
              isAdmin
                ? "bg-linear-to-tr from-[#713f12] via-[#b45309] to-amber-500 shadow-amber-900/20"
                : "bg-[#713f12]"
            }`}
          >
            {initials}
          </div>
          <h2 className="mt-3 text-lg font-bold text-[#422006]">
            {user.firstName} {user.lastName}
          </h2>
          <div className="mt-1 flex items-center gap-1.5 flex-wrap justify-center">
            {isAdmin ? (
              <Badge variant="gold" className="text-[10px] font-extrabold">
                👑 Admin Privileges
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px]">
                🌿 Devotee
              </Badge>
            )}

            {isVerified ? (
              <Badge variant="success" className="text-[10px]">
                ✓ Email Verified
              </Badge>
            ) : (
              <Badge
                variant="destructive"
                className="text-[10px] bg-amber-100 text-amber-900 border-amber-300"
              >
                ⚠ Unverified
              </Badge>
            )}
          </div>
        </div>

        {/* Devotee Identity Fields */}
        <div className="space-y-3 pt-4 border-t border-amber-900/10 text-xs">
          {/* Email */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Email Address
            </label>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/50 border border-amber-900/10">
              <div className="flex items-center gap-2 truncate min-w-0">
                <Mail className="h-3.5 w-3.5 text-amber-800 shrink-0" />
                <span className="truncate font-semibold text-[#422006]">
                  {user.email}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onCopy(user.email, "Email")}
                className="p-1 hover:text-[#713f12] text-muted-foreground transition"
                title="Copy Email"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Phone Number
            </label>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/50 border border-amber-900/10">
              <div className="flex items-center gap-2 truncate min-w-0">
                <Phone className="h-3.5 w-3.5 text-amber-800 shrink-0" />
                <span className="truncate font-semibold text-[#422006]">
                  {user.phoneNumber || "Not provided"}
                </span>
              </div>
              {user.phoneNumber && (
                <button
                  type="button"
                  onClick={() => onCopy(user.phoneNumber!, "Phone")}
                  className="p-1 hover:text-[#713f12] text-muted-foreground transition"
                  title="Copy Phone"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="p-2.5 rounded-xl bg-amber-50/30 border border-amber-900/10">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
                <Calendar className="h-3 w-3" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Joined
                </span>
              </div>
              <p className="text-[11px] font-bold text-[#422006]">
                {formatDateTime(user.createdAt)}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50/30 border border-amber-900/10">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
                <Clock className="h-3 w-3" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Updated
                </span>
              </div>
              <p className="text-[11px] font-bold text-[#422006]">
                {formatDateTime(user.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
