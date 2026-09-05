"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Boxes,
  Calendar,
  Check,
  CircleDot,
  Copy,
  ExternalLink,
  Eye,
  Globe,
  Layers,
  Loader2,
  Package,
  RefreshCw,
  Ruler,
  Scale,
  Search,
  Sparkles,
  Tag,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductType, ProductVariantType } from "@/app/types";
import { useSingleProductAdmin } from "@/hooks/tanstack-hooks/useProductAdmin";
import useProductAdminHook from "@/hooks/tanstack-hooks/useProductAdmin";
import useProductVariantAdminHook from "@/hooks/tanstack-hooks/useProductVariantAdmin";

export default function SingleProductAdminPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.productId as string;
  const productId = Number(rawId);

  // TanStack Query for fetching single product
  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useSingleProductAdmin(productId);

  // Variant mutations (delete variant with instant cache update)
  const { deleteProductVariant } = useProductVariantAdminHook(productId);

  // Product delete mutation
  const { deleteProduct } = useProductAdminHook();

  // Local state for UI interactions
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [variantSearch, setVariantSearch] = useState<string>("");
  const [copiedSku, setCopiedSku] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const handleCopySku = (sku: string) => {
    navigator.clipboard.writeText(sku);
    setCopiedSku(sku);
    toast.success(`SKU "${sku}" copied to clipboard`);
    setTimeout(() => setCopiedSku(null), 2000);
  };

  const handleCopySlug = (slug: string) => {
    navigator.clipboard.writeText(slug);
    setCopiedSlug(true);
    toast.success(`Slug "${slug}" copied to clipboard`);
    setTimeout(() => setCopiedSlug(false), 2000);
  };

  const handleDeleteProduct = () => {
    if (!product) return;
    if (
      window.confirm(
        `Are you sure you want to delete product "${product.name}"? This action cannot be undone.`
      )
    ) {
      deleteProduct.mutate(
        { id: product.id },
        {
          onSuccess: () => {
            toast.success("Product deleted successfully");
            router.push("/admin/all-products");
          },
          onError: (err: any) => {
            toast.error(err?.message || "Failed to delete product. Please delete its variants first.");
          },
        }
      );
    }
  };

  const handleDeleteVariant = (variantId: number, sku: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete variant SKU "${sku}"? This action cannot be undone.`
      )
    ) {
      deleteProductVariant.mutate(
        { id: variantId },
        {
          onSuccess: () => {
            toast.success(`Variant ${sku} deleted successfully`);
          },
          onError: (err: any) => {
            toast.error(err?.message || "Failed to delete variant");
          },
        }
      );
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 rounded-full border-4 border-amber-200 border-t-amber-700 animate-spin" />
          <span className="absolute text-xl">🌿</span>
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-[#422006]">Loading Product Details</p>
          <p className="text-xs text-[#5c3a1e]/70 mt-1">
            Fetching product information, specifications and variants...
          </p>
        </div>
      </div>
    );
  }

  // Error / Not Found State
  if (isError || !product) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/all-products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#713f12] hover:text-[#422006] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to All Products
        </Link>

        <Card className="border-red-200 bg-red-50/40 p-8 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600 mb-3">
            ⚠️
          </div>
          <h2 className="text-xl font-black text-red-900">Product Not Found</h2>
          <p className="text-xs sm:text-sm text-red-700/80 mt-1 max-w-md mx-auto">
            {error instanceof Error
              ? error.message
              : `Unable to find product with ID #${productId}. It may have been deleted or the ID is invalid.`}
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="gap-1.5 border-amber-900/20 text-[#713f12]"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Try Again
            </Button>
            <Link href="/admin/all-products">
              <Button size="sm" className="bg-[#713f12] text-white hover:bg-[#5c3a1e]">
                Return to Product List
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Aggregate Calculations
  const variants: ProductVariantType[] = product.productVariants ?? [];
  const images = product.productImages ?? [];
  const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  const prices = variants.map((v) => v.price).filter((p) => p !== undefined && p !== null);
  const minPrice = prices.length ? Math.min(...prices) : null;
  const maxPrice = prices.length ? Math.max(...prices) : null;
  const isOutOfStock = totalStock === 0;
  const isLowStock = totalStock > 0 && totalStock <= 4;

  // Filtered variants for search
  const filteredVariants = variants.filter((v) => {
    const query = variantSearch.toLowerCase().trim();
    if (!query) return true;
    const matchSku = v.sku.toLowerCase().includes(query);
    const matchOrigin = v.origin?.name?.toLowerCase().includes(query) || v.origin?.country?.toLowerCase().includes(query);
    const matchColor = v.color?.toLowerCase().includes(query);
    return matchSku || matchOrigin || matchColor;
  });

  // Active product image
  const activeImage = images[selectedImageIndex] || images[0] || null;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb & Quick Actions Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/admin/all-products"
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-900/15 bg-white px-3 py-1.5 text-xs font-bold text-[#713f12] shadow-2xs hover:bg-amber-50 hover:text-[#422006] transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Products
          </Link>
          <span className="text-xs text-muted-foreground/60">/</span>
          <span className="text-xs font-medium text-muted-foreground truncate max-w-64">
            {product.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="xs"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-8 gap-1 border-amber-900/15 text-xs text-[#713f12] hover:bg-amber-100/60"
            title="Refresh Product Data"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            variant="ghost"
            size="xs"
            onClick={handleDeleteProduct}
            disabled={deleteProduct.isPending}
            className="h-8 gap-1 text-red-700 hover:bg-red-50 hover:text-red-900"
          >
            {deleteProduct.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">Delete Product</span>
          </Button>
        </div>
      </div>

      {/* Main Product Banner */}
      <div className="rounded-3xl border border-amber-900/10 bg-linear-to-r from-amber-100/70 via-orange-50/50 to-amber-50 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="space-y-3 flex-1 min-w-0">
            {/* Badges line */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="gold" className="text-[11px] font-bold">
                Product #{product.id}
              </Badge>

              {product.type === "INDIVIDUAL_RUDRAKSHA" ? (
                <Badge variant="gold" className="text-[11px]">
                  🌿 Individual Rudraksha
                </Badge>
              ) : (
                <Badge variant="sacred" className="text-[11px]">
                  📿 Rudraksha Mala
                </Badge>
              )}

              {product.individualRudrakshaDetail && (
                <Badge variant="outline" className="text-[11px] font-semibold bg-white/80 border-amber-900/20 text-[#713f12]">
                  ✨ {product.individualRudrakshaDetail.mukhi} Mukhi
                </Badge>
              )}

              {product.rudrakshaMalaDetail?.mukhi && (
                <Badge variant="outline" className="text-[11px] font-semibold bg-white/80 border-amber-900/20 text-[#713f12]">
                  ✨ {product.rudrakshaMalaDetail.mukhi} Mukhi
                </Badge>
              )}

              <Badge
                variant={isOutOfStock ? "destructive" : isLowStock ? "warning" : "success"}
                className="text-[11px] gap-1"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isOutOfStock
                      ? "bg-red-500"
                      : isLowStock
                        ? "bg-amber-500 animate-pulse"
                        : "bg-emerald-500"
                  }`}
                />
                {isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock"}
              </Badge>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#422006] tracking-tight">
              {product.name}
            </h1>

            {/* Slug & Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#5c3a1e]/80">
              <button
                type="button"
                onClick={() => handleCopySlug(product.slug)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-900/5 px-2.5 py-1 font-mono text-[11px] text-[#713f12] hover:bg-amber-900/10 transition-colors"
                title="Click to copy slug"
              >
                <span>/{product.slug}</span>
                {copiedSlug ? (
                  <Check className="h-3 w-3 text-emerald-700" />
                ) : (
                  <Copy className="h-3 w-3 text-[#713f12]/70" />
                )}
              </button>

              <span className="text-muted-foreground/50">•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-amber-800/60" />
                Added {new Date(product.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>

              {product.updatedAt && (
                <>
                  <span className="text-muted-foreground/50">•</span>
                  <span className="text-[#5c3a1e]/70">
                    Updated {new Date(product.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-4 shadow-2xs border-amber-900/10 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Variants
            </p>
            <Layers className="h-4 w-4 text-amber-700/60" />
          </div>
          <p className="text-2xl font-black text-[#422006] mt-1">
            {variants.length} <span className="text-xs font-normal text-muted-foreground">configured</span>
          </p>
        </Card>

        <Card className="p-4 shadow-2xs border-amber-900/10 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Cumulative Stock
            </p>
            <Boxes className="h-4 w-4 text-emerald-700/60" />
          </div>
          <p className="text-2xl font-black text-emerald-950 mt-1">
            {totalStock} <span className="text-xs font-normal text-muted-foreground">units</span>
          </p>
        </Card>

        <Card className="p-4 shadow-2xs border-amber-900/10 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Price Range
            </p>
            <Tag className="h-4 w-4 text-amber-700/60" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-950 mt-1 truncate">
            {minPrice !== null ? (
              minPrice === maxPrice ? (
                `Rs. ${minPrice.toLocaleString()}`
              ) : (
                `Rs. ${minPrice.toLocaleString()} - ${maxPrice?.toLocaleString()}`
              )
            ) : (
              <span className="text-xs font-medium text-muted-foreground italic">No price</span>
            )}
          </p>
        </Card>

        <Card className="p-4 shadow-2xs border-amber-900/10 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Mukhi / Type
            </p>
            <Sparkles className="h-4 w-4 text-amber-700/60" />
          </div>
          <p className="text-lg sm:text-xl font-black text-[#422006] mt-1 truncate">
            {product.individualRudrakshaDetail?.mukhi
              ? `${product.individualRudrakshaDetail.mukhi} Mukhi`
              : product.rudrakshaMalaDetail?.mukhi
                ? `${product.rudrakshaMalaDetail.mukhi} Mukhi Mala`
                : product.type === "INDIVIDUAL_RUDRAKSHA"
                  ? "Individual"
                  : "Mala"}
          </p>
        </Card>
      </div>

      {/* Main Two-Column Layout: Product Info & Images */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Images & Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="overflow-hidden border-amber-900/10 shadow-xs bg-white">
            <CardHeader className="pb-3 border-b border-amber-900/10 bg-amber-50/30">
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
            <CardContent className="p-4 space-y-3">
              {/* Main Featured Image Display */}
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-amber-900/10 bg-amber-50/50 flex items-center justify-center">
                {activeImage ? (
                  <Image
                    src={activeImage.url}
                    alt={activeImage.altText || product.name}
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
                    <span className="text-5xl mb-2">🌿</span>
                    <p className="text-xs font-semibold text-[#5c3a1e]">No product image uploaded</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Images configured in Step 1</p>
                  </div>
                )}

                {activeImage && (
                  <div className="absolute bottom-2 left-2 rounded-lg bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold text-white">
                    {activeImage.altText || `Position ${activeImage.position}`}
                  </div>
                )}
              </div>

              {/* Thumbnails Gallery Strip */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={img.id ?? idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                        selectedImageIndex === idx
                          ? "border-[#713f12] shadow-xs scale-105"
                          : "border-amber-900/15 opacity-70 hover:opacity-100"
                      }`}
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
        </div>

        {/* Right Column: Detailed Product Specs & Description */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-amber-900/10 shadow-xs bg-white">
            <CardHeader className="pb-3 border-b border-amber-900/10 bg-amber-50/30">
              <CardTitle className="text-sm font-bold text-[#422006] flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-amber-700" />
                Product Overview & Description
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Description
                </p>
                <div className="rounded-xl border border-amber-900/10 bg-amber-50/20 p-4 text-xs sm:text-sm text-[#422006]/90 leading-relaxed whitespace-pre-line">
                  {product.description || (
                    <span className="italic text-muted-foreground">No description provided for this product.</span>
                  )}
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Sacred Specifications
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="rounded-xl border border-amber-900/10 bg-white p-3 shadow-2xs">
                    <span className="text-[11px] font-semibold text-muted-foreground block">Product Category</span>
                    <span className="text-xs font-bold text-[#422006]">
                      {product.type === "INDIVIDUAL_RUDRAKSHA"
                        ? "Individual Sacred Rudraksha"
                        : "Rudraksha Sacred Mala"}
                    </span>
                  </div>

                  <div className="rounded-xl border border-amber-900/10 bg-white p-3 shadow-2xs">
                    <span className="text-[11px] font-semibold text-muted-foreground block">Mukhi Grade</span>
                    <span className="text-xs font-bold text-[#422006]">
                      {product.individualRudrakshaDetail?.mukhi
                        ? `${product.individualRudrakshaDetail.mukhi} Mukhi`
                        : product.rudrakshaMalaDetail?.mukhi
                          ? `${product.rudrakshaMalaDetail.mukhi} Mukhi`
                          : "Standard / Multi-Mukhi"}
                    </span>
                  </div>

                  <div className="rounded-xl border border-amber-900/10 bg-white p-3 shadow-2xs">
                    <span className="text-[11px] font-semibold text-muted-foreground block">Permanent URL Slug</span>
                    <span className="text-xs font-mono font-bold text-[#713f12] truncate block">
                      {product.slug}
                    </span>
                  </div>

                  <div className="rounded-xl border border-amber-900/10 bg-white p-3 shadow-2xs">
                    <span className="text-[11px] font-semibold text-muted-foreground block">System Identifier</span>
                    <span className="text-xs font-mono font-bold text-[#422006]">
                      ID #{product.id}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* Product Variants Section */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#422006]">
                Product Variants
              </h2>
              <Badge variant="gold" className="text-xs">
                {variants.length} {variants.length === 1 ? "Variant" : "Variants"}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-[#5c3a1e]/80 mt-0.5">
              Available sizes, weights, bead materials, origin sources, and stock levels.
            </p>
          </div>

          {/* Controls: Search & View Mode */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Filter by SKU or Origin..."
                value={variantSearch}
                onChange={(e) => setVariantSearch(e.target.value)}
                className="h-9 w-48 sm:w-64 pl-9 text-xs border-amber-900/15 bg-white focus-visible:ring-amber-700"
              />
            </div>

            <div className="flex rounded-xl border border-amber-900/15 bg-white p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                  viewMode === "cards"
                    ? "bg-amber-100/70 text-[#713f12]"
                    : "text-muted-foreground hover:text-[#422006]"
                }`}
              >
                Cards
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                  viewMode === "table"
                    ? "bg-amber-100/70 text-[#713f12]"
                    : "text-muted-foreground hover:text-[#422006]"
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Empty Variants State */}
        {variants.length === 0 ? (
          <Card className="border-dashed border-amber-900/20 bg-amber-50/20 p-12 text-center shadow-none">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100/70 text-2xl text-[#713f12] mb-3">
              📦
            </div>
            <h3 className="text-base font-bold text-[#422006]">No Variants Configured Yet</h3>
            <p className="text-xs text-[#5c3a1e]/80 max-w-md mx-auto mt-1">
              This product exists in the catalog but has no active inventory variants. Create a variant
              with SKU, size, origin, and pricing to make it purchasable.
            </p>
          </Card>
        ) : filteredVariants.length === 0 ? (
          <Card className="p-8 text-center border-amber-900/10 bg-white">
            <p className="text-xs font-semibold text-muted-foreground">
              No variants matching &quot;{variantSearch}&quot;
            </p>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setVariantSearch("")}
              className="mt-2 text-xs text-[#713f12]"
            >
              Clear Filter
            </Button>
          </Card>
        ) : viewMode === "cards" ? (
          /* Cards View */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredVariants.map((variant) => {
              const variantImg = variant.variantImages?.[0]?.url || activeImage?.url || null;
              const isVarOutOfStock = variant.stock === 0;
              const isVarLowStock = variant.stock > 0 && variant.stock <= 4;

              return (
                <Card
                  key={variant.id}
                  className="group overflow-hidden border-amber-900/15 bg-white shadow-xs transition-all hover:shadow-md hover:border-amber-900/25"
                >
                  {/* Card Header with SKU & Stock status */}
                  <div className="border-b border-amber-900/10 bg-linear-to-r from-amber-50/80 to-orange-50/40 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-mono text-xs font-black text-[#422006] tracking-wide truncate">
                          {variant.sku}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopySku(variant.sku)}
                          className="text-muted-foreground/70 hover:text-[#713f12] transition-colors p-0.5 rounded"
                          title="Copy SKU"
                        >
                          {copiedSku === variant.sku ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>

                      <Badge
                        variant={
                          isVarOutOfStock
                            ? "destructive"
                            : isVarLowStock
                              ? "warning"
                              : "success"
                        }
                        className="text-[10px] gap-1 shrink-0"
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isVarOutOfStock
                              ? "bg-red-500"
                              : isVarLowStock
                                ? "bg-amber-500 animate-pulse"
                                : "bg-emerald-500"
                          }`}
                        />
                        {isVarOutOfStock
                          ? "Out of Stock"
                          : isVarLowStock
                            ? `${variant.stock} left`
                            : `${variant.stock} in stock`}
                      </Badge>
                    </div>

                    {/* Price banner */}
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-lg sm:text-xl font-black text-[#713f12]">
                        Rs. {variant.price.toLocaleString()}
                      </span>
                      {variant.origin && (
                        <Badge variant="outline" className="text-[10px] bg-white/90 border-amber-900/20 text-[#5c3a1e] gap-1">
                          <Globe className="h-3 w-3 text-amber-700" />
                          {variant.origin.name}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Card Body with image & attributes */}
                  <CardContent className="p-4 space-y-3">
                    <div className="flex gap-3">
                      {/* Variant Thumbnail */}
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-amber-900/10 bg-amber-50/60 shadow-2xs">
                        {variantImg ? (
                          <Image
                            src={variantImg}
                            alt={`Variant ${variant.sku}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xl">
                            🌿
                          </div>
                        )}
                      </div>

                      {/* Attribute Pills */}
                      <div className="flex-1 space-y-1.5 min-w-0">
                        {/* Individual Attributes */}
                        {variant.individualVariantAttrs && (
                          <div className="flex items-center gap-1.5 text-xs text-[#5c3a1e]">
                            <Ruler className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                            <span className="font-semibold text-muted-foreground text-[11px]">Size:</span>
                            <span className="font-bold text-[#422006]">
                              {variant.individualVariantAttrs.size} mm
                            </span>
                          </div>
                        )}

                        {/* Mala Attributes */}
                        {variant.malaVariantAttrs && (
                          <>
                            {variant.malaVariantAttrs.beadCount && (
                              <div className="flex items-center gap-1.5 text-xs text-[#5c3a1e]">
                                <CircleDot className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                                <span className="font-semibold text-muted-foreground text-[11px]">Beads:</span>
                                <span className="font-bold text-[#422006]">
                                  {variant.malaVariantAttrs.beadCount} beads
                                </span>
                              </div>
                            )}
                            {variant.malaVariantAttrs.material && (
                              <div className="flex items-center gap-1.5 text-xs text-[#5c3a1e]">
                                <Sparkles className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                                <span className="font-semibold text-muted-foreground text-[11px]">Material:</span>
                                <span className="font-bold text-[#422006] truncate">
                                  {variant.malaVariantAttrs.material}
                                </span>
                              </div>
                            )}
                          </>
                        )}

                        {/* Weight */}
                        {variant.weightGrams !== null && variant.weightGrams !== undefined && (
                          <div className="flex items-center gap-1.5 text-xs text-[#5c3a1e]">
                            <Scale className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                            <span className="font-semibold text-muted-foreground text-[11px]">Weight:</span>
                            <span className="font-bold text-[#422006]">
                              {variant.weightGrams} grams
                            </span>
                          </div>
                        )}

                        {/* Color */}
                        {variant.color && (
                          <div className="flex items-center gap-1.5 text-xs text-[#5c3a1e]">
                            <span className="h-3 w-3 rounded-full border border-amber-900/20 bg-amber-700 shrink-0" />
                            <span className="font-semibold text-muted-foreground text-[11px]">Color:</span>
                            <span className="font-bold text-[#422006] truncate">
                              {variant.color}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Variant Footer: Additional info + actions */}
                    <div className="pt-2 border-t border-amber-900/10 flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">
                        ID: #{variant.id} • {variant.variantImages?.length || 0} variant image(s)
                      </span>

                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleDeleteVariant(variant.id, variant.sku)}
                        disabled={deleteProductVariant.isPending}
                        className="h-7 px-2 text-red-700 hover:bg-red-50 hover:text-red-900 text-[11px]"
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <Card className="shadow-xs overflow-hidden border-amber-900/15 bg-white">
            <Table>
              <TableHeader>
                <TableRow className="border-amber-900/10 bg-amber-50/40">
                  <TableHead className="w-16 font-bold text-[#422006]">Image</TableHead>
                  <TableHead className="font-bold text-[#422006]">SKU</TableHead>
                  <TableHead className="font-bold text-[#422006]">Origin</TableHead>
                  <TableHead className="font-bold text-[#422006]">Specifications</TableHead>
                  <TableHead className="font-bold text-[#422006]">Stock Status</TableHead>
                  <TableHead className="text-right font-bold text-[#422006]">Price</TableHead>
                  <TableHead className="text-right font-bold text-[#422006]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVariants.map((variant) => {
                  const variantImg = variant.variantImages?.[0]?.url || activeImage?.url || null;
                  const isVarOutOfStock = variant.stock === 0;
                  const isVarLowStock = variant.stock > 0 && variant.stock <= 4;

                  return (
                    <TableRow key={variant.id} className="border-amber-900/10 hover:bg-amber-50/20">
                      {/* Image Thumbnail */}
                      <TableCell>
                        <div className="relative h-11 w-11 overflow-hidden rounded-lg border border-amber-900/10 bg-amber-50/60 shadow-2xs">
                          {variantImg ? (
                            <Image
                              src={variantImg}
                              alt={variant.sku}
                              fill
                              className="object-cover"
                              sizes="44px"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-base">
                              🌿
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* SKU */}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-xs font-bold text-[#422006]">
                            {variant.sku}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopySku(variant.sku)}
                            className="text-muted-foreground/60 hover:text-[#713f12]"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </TableCell>

                      {/* Origin */}
                      <TableCell>
                        {variant.origin ? (
                          <Badge variant="outline" className="text-[10px] bg-white border-amber-900/20 text-[#5c3a1e]">
                            {variant.origin.name} ({variant.origin.country})
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">—</span>
                        )}
                      </TableCell>

                      {/* Specifications */}
                      <TableCell>
                        <div className="space-y-0.5 text-xs">
                          {variant.individualVariantAttrs && (
                            <span className="inline-block mr-2 font-medium text-[#422006]">
                              {variant.individualVariantAttrs.size} mm
                            </span>
                          )}
                          {variant.malaVariantAttrs?.beadCount && (
                            <span className="inline-block mr-2 font-medium text-[#422006]">
                              {variant.malaVariantAttrs.beadCount} beads
                            </span>
                          )}
                          {variant.malaVariantAttrs?.material && (
                            <span className="inline-block mr-2 text-muted-foreground">
                              {variant.malaVariantAttrs.material}
                            </span>
                          )}
                          {variant.weightGrams && (
                            <span className="inline-block text-muted-foreground">
                              {variant.weightGrams}g
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Stock Status */}
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              isVarOutOfStock
                                ? "bg-red-500"
                                : isVarLowStock
                                  ? "bg-amber-500 animate-pulse"
                                  : "bg-emerald-500"
                            }`}
                          />
                          <span
                            className={`text-xs font-bold ${
                              isVarOutOfStock
                                ? "text-red-700"
                                : isVarLowStock
                                  ? "text-amber-800"
                                  : "text-emerald-800"
                            }`}
                          >
                            {variant.stock} units
                          </span>
                        </div>
                      </TableCell>

                      {/* Price */}
                      <TableCell className="text-right">
                        <span className="text-xs sm:text-sm font-black text-[#713f12]">
                          Rs. {variant.price.toLocaleString()}
                        </span>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleDeleteVariant(variant.id, variant.sku)}
                          disabled={deleteProductVariant.isPending}
                          className="h-8 text-red-700 hover:bg-red-50 hover:text-red-900"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </div>
  );
}
