import Link from "next/link";
import { Sparkles, Gem, Layers } from "lucide-react";

interface ProductCategoryNavProps {
  currentType?: string;
  totalCount: number;
}

const CATEGORIES = [
  {
    id: "all",
    label: "All Sacred Items",
    typeParam: undefined,
    icon: Sparkles,
    desc: "Every blessed Himalayan bead & mala",
  },
  {
    id: "individual",
    label: "Individual Rudraksha",
    typeParam: "INDIVIDUAL_RUDRAKSHA",
    icon: Gem,
    desc: "1 to 21 Mukhi collector and personal beads",
  },
  {
    id: "mala",
    label: "Sacred Japa Malas",
    typeParam: "RUDRAKSHA_MALA",
    icon: Layers,
    desc: "108+1 hand-knotted prayer and mantra malas",
  },
];

export function ProductCategoryNav({ currentType, totalCount }: ProductCategoryNavProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {CATEGORIES.map((cat) => {
        const isActive =
          cat.typeParam === undefined
            ? !currentType
            : currentType === cat.typeParam;

        const href = cat.typeParam
          ? `/all-products?type=${cat.typeParam}`
          : "/all-products";

        const Icon = cat.icon;

        return (
          <Link
            key={cat.id}
            href={href}
            className={`group relative flex flex-col justify-between rounded-2xl border p-4 sm:p-5 transition-all duration-300 ${
              isActive
                ? "border-amber-900/40 bg-gradient-to-br from-amber-50 to-amber-100/60 shadow-xs"
                : "border-amber-900/10 bg-white hover:border-amber-900/25 hover:bg-amber-50/30"
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                  isActive
                    ? "bg-[#713f12] text-white"
                    : "bg-amber-100/70 text-[#713f12] group-hover:bg-[#713f12] group-hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>

              {isActive && (
                <span className="rounded-full bg-[#713f12] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  Active
                </span>
              )}
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-[#422006] group-hover:text-[#713f12] transition-colors">
                {cat.label}
              </h3>
              <p className="text-[11px] text-[#5c3a1e]/75 mt-0.5 leading-snug">
                {cat.desc}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
