"use client";

import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UserNoteProps {
  notes: string;
  setNotes: (value: string) => void;
  onSaveNotes: () => Promise<void>;
  isSaving?: boolean;
}

export default function UserNote({
  notes,
  setNotes,
  onSaveNotes,
  isSaving = false,
}: UserNoteProps) {
  return (
    <Card className="shadow-xs border-amber-900/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold text-[#422006] flex items-center gap-1.5">
          <FileText className="h-4 w-4 text-amber-800" />
          Administrative Notes
        </CardTitle>
        <CardDescription className="text-xs">
          Internal remarks or consultation history for this devotee.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="E.g. Prefers 5-Mukhi Nepali beads, consulted on horoscope alignment..."
          className="w-full rounded-xl border border-amber-900/15 p-3 text-xs text-[#422006] outline-none bg-amber-50/20"
        />
        <Button
          size="sm"
          disabled={isSaving}
          onClick={onSaveNotes}
          className="w-full bg-[#713f12] text-white hover:bg-[#5c3a1e] text-xs font-bold"
        >
          {isSaving ? "Saving..." : "Save Notes"}
        </Button>
      </CardContent>
    </Card>
  );
}
