import React from "react";
import { ProductType, ProductVariantType } from "@/app/types";
import { Layers, MapPin, Scale, Ruler, Award, Sparkles, Hash } from "lucide-react";

interface ProductSpecificationsProps {
  product: ProductType;
  selectedVariant: ProductVariantType | null;
}

export default function ProductSpecifications({
  product,
  selectedVariant,
}: ProductSpecificationsProps) {
  const mukhi =
    product.individualRudrakshaDetail?.mukhi ??
    product.rudrakshaMalaDetail?.mukhi;

  const size = selectedVariant?.individualVariantAttrs?.size;
  const beadCount = selectedVariant?.malaVariantAttrs?.beadCount;
  const material = selectedVariant?.malaVariantAttrs?.material;
  const weight = selectedVariant?.weightGrams;
  const origin = selectedVariant?.origin?.name;
  const country = selectedVariant?.origin?.country;
  const color = selectedVariant?.color;
  const sku = selectedVariant?.sku;

  const specs = [
    {
      label: "Sacred Form / Mukhi",
      value: mukhi ? `${mukhi} Mukhi (Natural Grooves)` : "Multi-Mukhi Sacred Japa Bead",
      icon: <Award className="h-4 w-4 text-[#713f12]" />,
    },
    {
      label: "Classification",
      value:
        product.type === "RUDRAKSHA_MALA"
          ? "Spiritual Japa Mala (108+1)"
          : "Individual Himalayan Rudraksha Bead",
      icon: <Layers className="h-4 w-4 text-[#713f12]" />,
    },
    {
      label: "Origin & Region",
      value: origin
        ? `${origin}, ${country || "Nepal"}`
        : "Himalayan Belt, Eastern Nepal",
      icon: <MapPin className="h-4 w-4 text-[#713f12]" />,
    },
    ...(size
      ? [
          {
            label: "Bead Dimension",
            value: `${size} mm (Collector Grade Diameter)`,
            icon: <Ruler className="h-4 w-4 text-[#713f12]" />,
          },
        ]
      : []),
    ...(weight
      ? [
          {
            label: "Approx. Weight",
            value: `${weight} Grams (Dense Natural Himalayan Core)`,
            icon: <Scale className="h-4 w-4 text-[#713f12]" />,
          },
        ]
      : []),
    ...(beadCount
      ? [
          {
            label: "Bead Count",
            value: `${beadCount} Sacred Beads`,
            icon: <Sparkles className="h-4 w-4 text-[#713f12]" />,
          },
        ]
      : []),
    ...(material
      ? [
          {
            label: "Cording / Material",
            value: material,
            icon: <Layers className="h-4 w-4 text-[#713f12]" />,
          },
        ]
      : []),
    ...(color
      ? [
          {
            label: "Natural Shade",
            value: color,
            icon: <Sparkles className="h-4 w-4 text-[#713f12]" />,
          },
        ]
      : []),
    ...(sku
      ? [
          {
            label: "Temple Inventory SKU",
            value: sku,
            icon: <Hash className="h-4 w-4 text-[#713f12]" />,
          },
        ]
      : []),
    {
      label: "Consecration Venue",
      value: "Pashupatinath Temple, Kathmandu, Nepal",
      icon: <Sparkles className="h-4 w-4 text-[#713f12]" />,
    },
  ];

  return (
    <div className="rounded-3xl border border-amber-900/12 bg-white p-6 sm:p-8 shadow-xs">
      <div className="mb-6 space-y-1">
        <h2 className="text-lg sm:text-xl font-extrabold text-[#422006]">
          Sacred Specifications & Attributes
        </h2>
        <p className="text-xs sm:text-sm text-[#5c3a1e]/75">
          Verified physical dimensions, origin records, and botanical characteristics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {specs.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3.5 rounded-2xl border border-amber-900/10 bg-[#faf7f2]/70 p-4 transition-colors hover:border-amber-900/25"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100/70">
              {item.icon}
            </div>
            <div className="min-w-0">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#5c3a1e]/60">
                {item.label}
              </span>
              <span className="block text-sm font-bold text-[#422006] mt-0.5">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
