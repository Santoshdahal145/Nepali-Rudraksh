"use client";

import { KeyRound, Lock } from "lucide-react";
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

interface LinkedAccount {
  id: number | string;
  provider: string;
  providerAccountId: string;
}

interface UserAccountCardProps {
  accounts: LinkedAccount[];
}

export default function UserAccountCard({ accounts }: UserAccountCardProps) {
  return (
    <Card className="shadow-xs border-amber-900/10">
      <CardHeader className="pb-3 border-b border-amber-900/5 bg-amber-50/20">
        <CardTitle className="text-sm sm:text-base font-bold text-[#422006] flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-amber-800" />
          Linked Authentication Accounts ({accounts.length})
        </CardTitle>
        <CardDescription className="text-xs text-[#5c3a1e]/70">
          Third-party OAuth identity providers connected to this devotee profile.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {accounts.length === 0 ? (
          <div className="p-8 text-center">
            <Lock className="mx-auto h-8 w-8 text-amber-700/30" />
            <p className="mt-2 text-xs font-bold text-[#422006]">
              Direct Email & Password Account
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              No external OAuth accounts (such as Google) are currently linked.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-amber-900/10 bg-amber-50/30">
                  <TableHead className="text-xs font-bold text-[#422006]">
                    Provider
                  </TableHead>
                  <TableHead className="text-xs font-bold text-[#422006]">
                    Provider Account ID
                  </TableHead>
                  <TableHead className="text-right text-xs font-bold text-[#422006]">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((acc) => (
                  <TableRow key={acc.id} className="border-amber-900/5">
                    <TableCell className="font-bold text-xs text-[#422006] uppercase">
                      {acc.provider}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {acc.providerAccountId}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="success" className="text-[10px]">
                        Connected
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
