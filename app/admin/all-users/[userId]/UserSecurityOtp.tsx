"use client";

import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OtpItem {
  id: number | string;
  type: string;
  createdAt?: unknown;
  expiresAt?: unknown;
  attempts?: number | null;
  consumedAt?: unknown;
}

interface UserSecurityOtpProps {
  otps: OtpItem[];
  formatDateTime: (dateVal?: unknown) => string;
}

export default function UserSecurityOtp({
  otps,
  formatDateTime,
}: UserSecurityOtpProps) {
  return (
    <Card className="shadow-xs border-amber-900/10">
      <CardHeader className="pb-3 border-b border-amber-900/5 bg-amber-50/20">
        <CardTitle className="text-sm sm:text-base font-bold text-[#422006] flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-700" />
          Security & OTP Audit History ({otps.length})
        </CardTitle>
        <CardDescription className="text-xs text-[#5c3a1e]/70">
          Historical record of one-time password verifications for email and security.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {otps.length === 0 ? (
          <div className="p-8 text-center">
            <ShieldCheck className="mx-auto h-8 w-8 text-amber-700/30" />
            <p className="mt-2 text-xs font-bold text-[#422006]">
              No OTP History Found
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              No verification codes have been generated for this account.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-amber-900/10 bg-amber-50/30">
                  <TableHead className="text-xs font-bold text-[#422006]">
                    Type
                  </TableHead>
                  <TableHead className="text-xs font-bold text-[#422006]">
                    Created
                  </TableHead>
                  <TableHead className="text-xs font-bold text-[#422006]">
                    Expires
                  </TableHead>
                  <TableHead className="text-xs font-bold text-[#422006]">
                    Attempts
                  </TableHead>
                  <TableHead className="text-right text-xs font-bold text-[#422006]">
                    Verification Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {otps.map((otp) => {
                  const isConsumed = Boolean(otp.consumedAt);
                  const isExpired =
                    !isConsumed &&
                    otp.expiresAt &&
                    new Date(String(otp.expiresAt)).getTime() < Date.now();

                  return (
                    <TableRow key={otp.id} className="border-amber-900/5">
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-[10px] font-bold text-[#5c3a1e] border-amber-900/20"
                        >
                          {otp.type.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDateTime(otp.createdAt)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDateTime(otp.expiresAt)}
                      </TableCell>
                      <TableCell className="text-xs font-mono font-bold text-[#422006]">
                        {otp.attempts ?? 0}
                      </TableCell>
                      <TableCell className="text-right">
                        {isConsumed ? (
                          <Badge variant="success" className="text-[10px]">
                            Verified{" "}
                            {otp.consumedAt
                              ? `(${formatDateTime(otp.consumedAt)})`
                              : ""}
                          </Badge>
                        ) : isExpired ? (
                          <Badge
                            variant="outline"
                            className="text-[10px] text-stone-500 bg-stone-50"
                          >
                            Expired
                          </Badge>
                        ) : (
                          <Badge variant="gold" className="text-[10px]">
                            Pending Active
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
