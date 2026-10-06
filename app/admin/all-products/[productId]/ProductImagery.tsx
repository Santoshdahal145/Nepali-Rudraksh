"use client";

import Image from "next/image";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductImageType } from "@/app/types";

interface ProductImageryProps {
  images: ProductImageType[];
  productName: string;
  selectedImageIndex: number;
  onSelectImage: (index: number) => void;
}

export default function ProductImagery({
  images,
  productName,
  selectedImageIndex,
  onSelectImage,
}: ProductImageryProps) {
  const activeImage = images[selectedImageIndex] || images[0] || null;

  return (
    <Card className="overflow-hidden border-amber-900/10 shadow-xs bg-white">
      <CardHeader className="p-4 sm:p-5 pb-3 border-b border-amber-900/10 bg-amber-50/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-[#422006] flex items-center gap-1.5">
            <Package className="h-4 w-4 text-amber-700" />
            Product Imagery
          </CardTitle>
          <Badge variant="sacred" className="text-[10px]">
            {images.length} {images.length === 1 ? "Image" : "Images"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-3.5 sm:p-4 space-y-3">
        {/* Main Featured Image Display */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl sm:rounded-2xl border border-amber-900/10 bg-amber-50/50 flex items-center justify-center">
          {activeImage ? (
            <Image
              src={activeImage.url}
              alt={activeImage.altText || productName}
              fill
              className="object-cover transition-all duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 450px"
              priority
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
              <span className="text-4xl sm:text-5xl mb-2">🌿</span>
              <p className="text-xs font-semibold text-[#5c3a1e]">
                No product image uploaded
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Images configured in Step 1
              </p>
            </div>
          )}

          {activeImage && (
            <div className="absolute bottom-2 left-2 max-w-[80%] rounded-lg bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold text-white truncate">
              {activeImage.altText || `Position ${activeImage.position}`}
            </div>
          )}
        </div>

        {/* Thumbnails Gallery Strip */}
        {images.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
            {images.map((img, idx) => (
              <button
                key={img.id ?? idx}
                type="button"
                onClick={() => onSelectImage(idx)}
                className={`relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                  selectedImageIndex === idx
                    ? "border-[#713f12] shadow-xs scale-105"
                    : "border-amber-900/15 opacity-70 hover:opacity-100"
                }`}
                title={img.altText || `Image ${idx + 1}`}
              >
                <Image
                  src={img.url}
                  alt={img.altText || `Image ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
