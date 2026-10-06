"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProductVariantType } from "@/app/types";
import { useSingleProductAdmin } from "@/hooks/tanstack-hooks/useProductAdmin";
import useProductAdminHook from "@/hooks/tanstack-hooks/useProductAdmin";
import useProductVariantAdminHook from "@/hooks/tanstack-hooks/useProductVariantAdmin";

import ProductLoading from "./ProductLoading";
import ProductError from "./ProductError";
import ProductTopHeader from "./ProductTopHeader";
import ProductKpis from "./ProductKpis";
import ProductImagery from "./ProductImagery";
import ProductOverview from "./ProductOverview";
import ProductVariantsSection from "./ProductVariantsSection";

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
        `Are you sure you want to delete product "${product.name}"? This action cannot be undone.`,
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
            toast.error(
              err?.message ||
                "Failed to delete product. Please delete its variants first.",
            );
          },
        },
      );
    }
  };

  const handleDeleteVariant = (variantId: number, sku: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete variant SKU "${sku}"? This action cannot be undone.`,
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
        },
      );
    }
  };

  // Loading State
  if (isLoading) {
    return <ProductLoading />;
  }

  // Error / Not Found State
  if (isError || !product) {
    return (
      <ProductError
        productId={productId}
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  // Aggregate Calculations
  const variants: ProductVariantType[] = product.productVariants ?? [];
  const images = product.productImages ?? [];
  const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  const prices = variants
    .map((v) => v.price)
    .filter((p) => p !== undefined && p !== null);
  const minPrice = prices.length ? Math.min(...prices) : null;
  const maxPrice = prices.length ? Math.max(...prices) : null;
  const isOutOfStock = totalStock === 0;
  const isLowStock = totalStock > 0 && totalStock <= 4;
  const activeImage = images[selectedImageIndex] || images[0] || null;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb & Quick Actions Bar */}
      <ProductTopHeader
        product={product}
        isDeleting={deleteProduct.isPending}
        onDelete={handleDeleteProduct}
        isOutOfStock={isOutOfStock}
        isLowStock={isLowStock}
        copiedSlug={copiedSlug}
        onCopySlug={handleCopySlug}
      />

      {/* KPI Stats Grid */}
      <ProductKpis
        variantsCount={variants.length}
        totalStock={totalStock}
        minPrice={minPrice}
        maxPrice={maxPrice}
        product={product}
      />

      {/* Main Two-Column Layout: Product Info & Images */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Images & Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <ProductImagery
            images={images}
            productName={product.name}
            selectedImageIndex={selectedImageIndex}
            onSelectImage={setSelectedImageIndex}
          />
        </div>

        {/* Right Column: Detailed Product Specs & Description */}
        <div className="lg:col-span-7 space-y-4">
          <ProductOverview product={product} />
        </div>
      </div>

      {/* Product Variants Section */}
      <ProductVariantsSection
        productId={product.id}
        variants={variants}
        activeImageUrl={activeImage?.url || null}
        variantSearch={variantSearch}
        onSearchChange={setVariantSearch}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        copiedSku={copiedSku}
        onCopySku={handleCopySku}
        onDeleteVariant={handleDeleteVariant}
        isDeletingVariant={deleteProductVariant.isPending}
      />
    </div>
  );
}
