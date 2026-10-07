"use client";

import React, { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Check } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface AllProductsMobileFilterProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { label: "All Sacred Items", value: "" },
  { label: "Individual Beads (1-21 Mukhi)", value: "INDIVIDUAL_RUDRAKSHA" },
  { label: "Sacred Japa Malas (108+1)", value: "RUDRAKSHA_MALA" },
];

const MUKHIS = [
  { label: "All", value: "" },
  { label: "1 Mukhi", value: "1" },
  { label: "2 Mukhi", value: "2" },
  { label: "3 Mukhi", value: "3" },
  { label: "4 Mukhi", value: "4" },
  { label: "5 Mukhi", value: "5" },
  { label: "6 Mukhi", value: "6" },
  { label: "7 Mukhi", value: "7" },
  { label: "8 Mukhi", value: "8" },
  { label: "9 Mukhi", value: "9" },
  { label: "10 Mukhi", value: "10" },
  { label: "11 Mukhi", value: "11" },
  { label: "12 Mukhi", value: "12" },
  { label: "14 Mukhi", value: "14" },
  { label: "21 Mukhi", value: "21" },
];

export default function AllProductsMobileFilter({
  isOpen,
  onClose,
}: AllProductsMobileFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentType = searchParams.get("type") || "";
  const currentMukhi = searchParams.get("mukhi") || "";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`/all-products?${params.toString()}`);
    });
  };

  const clearAll = () => {
    startTransition(() => {
      router.push("/all-products");
      onClose();
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="max-h-[85vh] rounded-t-3xl bg-[#faf7f2] p-5 text-[#422006] overflow-y-auto"
      >
        <SheetHeader className="flex flex-row items-center justify-between pb-4 border-b border-amber-900/10">
          <SheetTitle className="text-lg font-bold text-[#422006]">
            Filter Sacred Products
          </SheetTitle>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-[#5c3a1e]/70 hover:bg-amber-100/50"
          >
            <X className="size-5" />
          </button>
        </SheetHeader>

        <div className="space-y-6 pt-4">
          {/* Category Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#713f12]">
              Category
            </h4>
            <div className="space-y-1.5">
              {CATEGORIES.map((cat) => {
                const isSelected = currentType === cat.value;
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => updateParam("type", cat.value)}
                    className={`flex w-full items-center justify-between rounded-xl p-3 text-left text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-amber-100 text-[#713f12] border border-amber-900/20"
                        : "bg-white border border-amber-900/10 text-[#422006] hover:bg-amber-50"
                    }`}
                  >
                    <span>{cat.label}</span>
                    {isSelected && <Check className="size-4 text-[#713f12]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mukhi Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#713f12]">
              Mukhi (Facets)
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {MUKHIS.map((m) => {
                const isSelected = currentMukhi === m.value;
                return (
                  <button
                    key={m.label}
                    type="button"
                    onClick={() => updateParam("mukhi", m.value)}
                    className={`rounded-xl py-2 px-1 text-center text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-[#713f12] text-white shadow-xs"
                        : "bg-white border border-amber-900/15 text-[#5c3a1e] hover:bg-amber-50"
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={clearAll}
              className="flex-1 h-11 rounded-xl border-amber-900/20 text-[#713f12] font-bold text-xs"
            >
              Reset Filters
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl bg-[#713f12] text-white hover:bg-[#5c330e] font-bold text-xs"
            >
              Done
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
