"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import {
  ArrowLeft,
  Boxes,
  Check,
  CircleDot,
  DollarSign,
  Globe,
  Loader2,
  Package,
  RefreshCw,
  Ruler,
  Scale,
  Sparkles,
  Tag,
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
import { ImagePicker } from "@/components/ui/imagePicker";
import { RudrakshOriginType } from "@/app/types";
import { useSingleProductAdmin } from "@/hooks/tanstack-hooks/useProductAdmin";
import useProductVariantAdminHook, {
  useSingleProductVariantAdmin,
} from "@/hooks/tanstack-hooks/useProductVariantAdmin";
import useRudrakshOriginAdminHook from "@/hooks/tanstack-hooks/useRudrakshOriginAdmin";
import { uploadToCloud } from "@/lib/uploadToCloud";

export interface VariantEditFormValues {
  sku: string;
  price: number | "";
  stock: number | "";
  originId: number | "";
  color: string;
  weightGrams: number | "";
  size: number | "";
  beadCount: number | "";
  material: string;
  imageFile: File | null;
  existingImageUrl: string | null;
}

export default function EditProductVariantPage() {
  const params = useParams();
  const router = useRouter();
  const rawProductId = params?.productId as string;
  const rawVariantId = params?.variantId as string;
  const productId = Number(rawProductId);
  const variantId = Number(rawVariantId);

  const { data: product, isLoading: isProductLoading } =
    useSingleProductAdmin(productId);
  const {
    data: variant,
    isLoading: isVariantLoading,
    isError: isVariantError,
    error: variantError,
    refetch: refetchVariant,
  } = useSingleProductVariantAdmin(variantId);

  const { updateProductVariant } = useProductVariantAdminHook(productId);
  const { getRudrakshOrigins } = useRudrakshOriginAdminHook();

  const [isUploading, setIsUploading] = useState(false);

  // Normalize origins
  const originData = getRudrakshOrigins.data;
  const origins: RudrakshOriginType[] = Array.isArray(originData)
    ? originData
    : Array.isArray((originData as any)?.origins)
      ? (originData as any).origins
      : [];

  const isIndividual = product?.type === "INDIVIDUAL_RUDRAKSHA";

  const validationSchema = Yup.object().shape({
    sku: Yup.string()
      .trim()
      .min(2, "SKU must be at least 2 characters")
      .max(60, "SKU cannot exceed 60 characters")
      .required("SKU is required"),
    price: Yup.number()
      .typeError("Price must be a valid number")
      .min(0, "Price cannot be negative")
      .required("Price is required"),
    stock: Yup.number()
      .typeError("Stock must be a valid number")
      .integer("Stock must be a whole number")
      .min(0, "Stock cannot be negative")
      .required("Stock is required"),
    originId: Yup.number().nullable(),
    color: Yup.string().trim().nullable(),
    weightGrams: Yup.number()
      .typeError("Weight must be a number")
      .positive("Weight must be greater than 0")
      .nullable(),
    size: Yup.number().when([], {
      is: () => isIndividual,
      then: (schema) =>
        schema
          .typeError("Size must be a valid number")
          .integer("Size must be a whole number (mm)")
          .positive("Size must be greater than 0")
          .required("Size in mm is required for individual Rudraksha"),
      otherwise: (schema) => schema.nullable(),
    }),
    beadCount: Yup.number()
      .typeError("Bead count must be a number")
      .integer("Bead count must be an integer")
      .positive("Bead count must be positive")
      .nullable(),
    material: Yup.string().trim().nullable(),
  });

  const formik = useFormik<VariantEditFormValues>({
    enableReinitialize: true,
    initialValues: {
      sku: variant?.sku || "",
      price: variant?.price ?? "",
      stock: variant?.stock ?? 0,
      originId: variant?.originId ?? "",
      color: variant?.color || "",
      weightGrams: variant?.weightGrams ?? "",
      size: variant?.individualVariantAttrs?.size ?? "",
      beadCount: variant?.malaVariantAttrs?.beadCount ?? "",
      material: variant?.malaVariantAttrs?.material || "",
      imageFile: null,
      existingImageUrl: variant?.variantImages?.[0]?.url || null,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let imageUrl = values.existingImageUrl;

        if (values.imageFile) {
          setIsUploading(true);
          const uploadRes = await uploadToCloud(values.imageFile);
          if (!uploadRes.success || !uploadRes.url) {
            toast.error(uploadRes.error || "Failed to upload variant photo");
            setIsUploading(false);
            setSubmitting(false);
            return;
          }
          imageUrl = uploadRes.url;
          setIsUploading(false);
        }

        const imagesPayload = imageUrl
          ? [
              {
                url: imageUrl,
                altText: `Variant ${values.sku}`,
                position: 0,
              },
            ]
          : undefined;

        await updateProductVariant.mutateAsync({
          variantId,
          data: {
            sku: values.sku.trim(),
            price: Number(values.price),
            stock: Number(values.stock),
            originId: values.originId ? Number(values.originId) : null,
            color: values.color.trim() || null,
            weightGrams: values.weightGrams ? Number(values.weightGrams) : null,
            individualAttrs:
              isIndividual && values.size
                ? { size: Number(values.size) }
                : null,
            malaAttrs:
              !isIndividual && (values.beadCount || values.material)
                ? {
                    beadCount: values.beadCount ? Number(values.beadCount) : null,
                    material: values.material.trim() || null,
                  }
                : null,
            images: imagesPayload,
          },
        });

        toast.success(`Variant "${values.sku}" updated successfully!`);
        router.push(`/admin/all-products/${productId}`);
      } catch (err: any) {
        toast.error(err?.message || "Failed to update variant");
      } finally {
        setSubmitting(false);
        setIsUploading(false);
      }
    },
  });

  const isBusy =
    formik.isSubmitting || isUploading || updateProductVariant.isPending;

  if (isProductLoading || isVariantLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 py-16">
        <div className="relative flex items-center justify-center">
          <div className="h-14 w-14 rounded-full border-4 border-amber-200 border-t-amber-700 animate-spin" />
          <span className="absolute text-lg">📦</span>
        </div>
        <p className="text-sm font-semibold text-[#5c3a1e]/70 mt-2">
          Loading variant details…
        </p>
      </div>
    );
  }

  if (isVariantError || !variant || !product) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto p-4">
        <Link
          href={`/admin/all-products/${productId}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#713f12]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Product
        </Link>
        <Card className="border-red-200 bg-red-50/40 p-8 text-center shadow-xs">
          <span className="text-3xl">⚠️</span>
          <h2 className="text-lg font-bold text-red-900 mt-2">
            Variant Not Found
          </h2>
          <p className="text-xs text-red-700 mt-1">
            {variantError instanceof Error
              ? variantError.message
              : `Unable to locate variant #${variantId} for product #${productId}.`}
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchVariant()}
              className="gap-1.5 border-amber-900/20 text-[#713f12]"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </Button>
            <Link href={`/admin/all-products/${productId}`}>
              <Button size="sm" className="bg-[#713f12] text-white">
                Back to Product
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs">
        <Link
          href="/admin/all-products"
          className="font-semibold text-muted-foreground hover:text-[#422006] transition-colors"
        >
          All Products
        </Link>
        <span className="text-muted-foreground/60">/</span>
        <Link
          href={`/admin/all-products/${product.id}`}
          className="font-semibold text-muted-foreground hover:text-[#422006] truncate max-w-50"
        >
          {product.name}
        </Link>
        <span className="text-muted-foreground/60">/</span>
        <span className="font-bold text-[#713f12]">Edit Variant: {variant.sku}</span>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl border border-amber-900/10 bg-linear-to-r from-amber-100/70 via-orange-50/50 to-amber-50 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="gold" className="text-[10px]">
                Variant #{variant.id}
              </Badge>
              <Badge variant="sacred" className="text-[10px]">
                {product.name}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#422006] tracking-tight">
              Edit Variant: {variant.sku}
            </h1>
            <p className="text-xs sm:text-sm text-[#5c3a1e]/80 max-w-xl">
              Modify inventory pricing, stock quantities, and physical specifications.
            </p>
          </div>

          <Link href={`/admin/all-products/${product.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="border-amber-900/15 text-xs text-[#713f12] bg-white hover:bg-amber-50"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Formik Form */}
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Card 1: Core Inventory & Price */}
        <Card className="border-amber-900/15 bg-white shadow-xs">
          <CardHeader className="border-b border-amber-900/10 pb-4 bg-amber-50/20">
            <CardTitle className="text-base font-bold text-[#422006] flex items-center gap-2">
              <Tag className="h-4 w-4 text-amber-700" />
              SKU & Inventory Pricing
            </CardTitle>
            <CardDescription className="text-xs text-[#5c3a1e]/70">
              Set unique SKU identifier, price in NPR, and current stock count.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* SKU */}
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-bold uppercase tracking-wide text-[#422006]">
                  SKU Identifier <span className="text-red-500">*</span>
                </label>
                <Input
                  name="sku"
                  placeholder="e.g. NR-5M-001"
                  value={formik.values.sku}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-11 text-xs sm:text-sm font-mono font-bold border-amber-900/15 bg-amber-50/20 focus-visible:ring-amber-700 ${
                    formik.touched.sku && formik.errors.sku
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {formik.touched.sku && formik.errors.sku && (
                  <p className="text-[11px] font-semibold text-red-600">
                    {formik.errors.sku}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-bold uppercase tracking-wide text-[#422006]">
                  Price (NPR) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                    Rs.
                  </span>
                  <Input
                    type="number"
                    name="price"
                    placeholder="4500"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`h-11 pl-9 text-xs sm:text-sm font-bold border-amber-900/15 bg-amber-50/20 focus-visible:ring-amber-700 ${
                      formik.touched.price && formik.errors.price
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                </div>
                {formik.touched.price && formik.errors.price && (
                  <p className="text-[11px] font-semibold text-red-600">
                    {formik.errors.price}
                  </p>
                )}
              </div>

              {/* Stock */}
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-bold uppercase tracking-wide text-[#422006]">
                  Available Stock <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  name="stock"
                  placeholder="10"
                  value={formik.values.stock}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-11 text-xs sm:text-sm border-amber-900/15 bg-amber-50/20 focus-visible:ring-amber-700 ${
                    formik.touched.stock && formik.errors.stock
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {formik.touched.stock && formik.errors.stock && (
                  <p className="text-[11px] font-semibold text-red-600">
                    {formik.errors.stock}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Physical & Sacred Attributes */}
        <Card className="border-amber-900/15 bg-white shadow-xs">
          <CardHeader className="border-b border-amber-900/10 pb-4 bg-amber-50/20">
            <CardTitle className="text-base font-bold text-[#422006] flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-700" />
              Physical Dimensions & Provenance
            </CardTitle>
            <CardDescription className="text-xs text-[#5c3a1e]/70">
              Dimensions, geographic origin terroir, and aesthetic properties.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Origin Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-[#422006] flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5 text-amber-700" /> Geographic
                  Terroir Origin
                </label>
                <select
                  name="originId"
                  value={formik.values.originId}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "originId",
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  onBlur={formik.handleBlur}
                  className="h-11 w-full rounded-md border border-amber-900/15 bg-amber-50/20 px-3 text-xs sm:text-sm text-[#422006] font-medium outline-none focus:border-amber-700"
                >
                  <option value="">Select an Origin Source...</option>
                  {origins.map((origin) => (
                    <option key={origin.id} value={origin.id}>
                      {origin.name} ({origin.country})
                    </option>
                  ))}
                </select>
                {formik.touched.originId && formik.errors.originId && (
                  <p className="text-[11px] font-semibold text-red-600">
                    {formik.errors.originId}
                  </p>
                )}
              </div>

              {/* Weight */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-[#422006] flex items-center gap-1">
                  <Scale className="h-3.5 w-3.5 text-amber-700" /> Weight
                  (Grams)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  name="weightGrams"
                  placeholder="e.g. 14.5"
                  value={formik.values.weightGrams}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-11 text-xs sm:text-sm border-amber-900/15 bg-amber-50/20 focus-visible:ring-amber-700"
                />
                {formik.touched.weightGrams && formik.errors.weightGrams && (
                  <p className="text-[11px] font-semibold text-red-600">
                    {formik.errors.weightGrams}
                  </p>
                )}
              </div>

              {/* Individual Rudraksha: Size in mm */}
              {isIndividual && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wide text-[#422006] flex items-center gap-1">
                    <Ruler className="h-3.5 w-3.5 text-amber-700" /> Bead Size
                    (mm) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    name="size"
                    placeholder="e.g. 18"
                    value={formik.values.size}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`h-11 text-xs sm:text-sm border-amber-900/15 bg-amber-50/20 focus-visible:ring-amber-700 ${
                      formik.touched.size && formik.errors.size
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {formik.touched.size && formik.errors.size && (
                    <p className="text-[11px] font-semibold text-red-600">
                      {formik.errors.size}
                    </p>
                  )}
                </div>
              )}

              {/* Mala: Bead Count */}
              {!isIndividual && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wide text-[#422006] flex items-center gap-1">
                    <CircleDot className="h-3.5 w-3.5 text-amber-700" /> Bead
                    Count
                  </label>
                  <Input
                    type="number"
                    name="beadCount"
                    placeholder="e.g. 108"
                    value={formik.values.beadCount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-11 text-xs sm:text-sm border-amber-900/15 bg-amber-50/20 focus-visible:ring-amber-700"
                  />
                  {formik.touched.beadCount && formik.errors.beadCount && (
                    <p className="text-[11px] font-semibold text-red-600">
                      {formik.errors.beadCount}
                    </p>
                  )}
                </div>
              )}

              {/* Mala: Material */}
              {!isIndividual && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wide text-[#422006]">
                    Stringing Material
                  </label>
                  <Input
                    name="material"
                    placeholder="e.g. Pure Silk Thread, Silver Wire"
                    value={formik.values.material}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-11 text-xs sm:text-sm border-amber-900/15 bg-amber-50/20 focus-visible:ring-amber-700"
                  />
                  {formik.touched.material && formik.errors.material && (
                    <p className="text-[11px] font-semibold text-red-600">
                      {formik.errors.material}
                    </p>
                  )}
                </div>
              )}

              {/* Color */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-[#422006]">
                  Natural Color / Tone
                </label>
                <Input
                  name="color"
                  placeholder="e.g. Natural Dark Brown"
                  value={formik.values.color}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-11 text-xs sm:text-sm border-amber-900/15 bg-amber-50/20 focus-visible:ring-amber-700"
                />
                {formik.touched.color && formik.errors.color && (
                  <p className="text-[11px] font-semibold text-red-600">
                    {formik.errors.color}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Variant Image */}
        <Card className="border-amber-900/15 bg-white shadow-xs">
          <CardHeader className="border-b border-amber-900/10 pb-4 bg-amber-50/20">
            <CardTitle className="text-base font-bold text-[#422006] flex items-center gap-2">
              <Package className="h-4 w-4 text-amber-700" />
              Variant Photo
            </CardTitle>
            <CardDescription className="text-xs text-[#5c3a1e]/70">
              Specific photograph representing this bead size grade or Mala.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <ImagePicker
              type="single"
              label="Update Variant Photo"
              initialUrl={formik.values.existingImageUrl}
              onChange={(file) => formik.setFieldValue("imageFile", file)}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-amber-900/10">
          <Link href={`/admin/all-products/${product.id}`}>
            <Button
              type="button"
              variant="outline"
              disabled={isBusy}
              className="border-amber-900/15 text-[#713f12] text-xs h-11 px-5"
            >
              Cancel
            </Button>
          </Link>

          <Button
            type="submit"
            disabled={isBusy}
            className="bg-[#713f12] text-white hover:bg-[#5c3a1e] font-bold text-xs h-11 px-8 shadow-md gap-2"
          >
            {isBusy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>
                  {isUploading ? "Uploading Image..." : "Saving Changes..."}
                </span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
