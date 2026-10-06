"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  Edit,
  ImageIcon,
  Info,
  Loader2,
  Lock,
  Package,
  Sparkles,
  Tag,
  Trash2,
  X,
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
import { ProductImageType } from "@/app/types";
import { useSingleProductAdmin } from "@/hooks/tanstack-hooks/useProductAdmin";
import useProductAdminHook from "@/hooks/tanstack-hooks/useProductAdmin";
import { uploadToCloud } from "@/lib/uploadToCloud";

import EditProductLoading from "./EditProductLoading";
import EditProductError from "./EditProductError";

interface ProductEditFormValues {
  name: string;
  description: string;
  newImageFiles: File[];
}

const productEditValidationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(3, "Product name must be at least 3 characters")
    .max(120, "Product name cannot exceed 120 characters")
    .required("Product name is required"),
  description: Yup.string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .required("Description is required"),
});

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.productId as string;
  const productId = Number(rawId);

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useSingleProductAdmin(productId);

  const { updateProduct } = useProductAdminHook();

  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [existingImages, setExistingImages] = useState<ProductImageType[]>([]);

  // Synchronize existing images when product data loads
  useEffect(() => {
    if (product?.productImages) {
      setExistingImages(product.productImages);
    }
  }, [product?.productImages]);

  const handleRemoveExistingImage = (indexToRemove: number) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const formik = useFormik<ProductEditFormValues>({
    enableReinitialize: true,
    initialValues: {
      name: product?.name || "",
      description: product?.description || "",
      newImageFiles: [],
    },
    validationSchema: productEditValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let uploadedUrls: string[] = [];

        // Upload any new image files if selected
        if (values.newImageFiles.length > 0) {
          setIsUploadingImages(true);
          const uploadPromises = values.newImageFiles.map((file) =>
            uploadToCloud(file)
          );
          const uploadResults = await Promise.all(uploadPromises);

          const failed = uploadResults.find((r) => !r.success || !r.url);
          if (failed) {
            toast.error(failed.error || "Failed to upload one or more images");
            setIsUploadingImages(false);
            setSubmitting(false);
            return;
          }

          uploadedUrls = uploadResults
            .map((r) => r.url)
            .filter((url): url is string => Boolean(url));
          setIsUploadingImages(false);
        }

        // Combine remaining existing images with newly uploaded images
        const allImageUrls = [
          ...existingImages.map((img) => img.url),
          ...uploadedUrls,
        ];

        const payloadImages = allImageUrls.map((url, index) => ({
          url,
          altText: `${values.name} - Photo ${index + 1}`,
          position: index,
        }));

        // Only allow updating name, description, and images
        await updateProduct.mutateAsync({
          id: productId,
          data: {
            name: values.name.trim(),
            description: values.description.trim(),
            images: payloadImages,
          },
        });

        toast.success(`Product "${values.name}" updated successfully!`);
        router.push(`/admin/all-products/${productId}`);
      } catch (err: any) {
        toast.error(err?.message || "Failed to update product");
      } finally {
        setSubmitting(false);
        setIsUploadingImages(false);
      }
    },
  });

  const isBusy =
    formik.isSubmitting || isUploadingImages || updateProduct.isPending;

  // Loading State
  if (isLoading) {
    return <EditProductLoading />;
  }

  // Error / Not Found State
  if (isError || !product) {
    return (
      <EditProductError
        productId={productId}
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  const isIndividual = product.type === "INDIVIDUAL_RUDRAKSHA";
  const mukhiCount =
    product.individualRudrakshaDetail?.mukhi ??
    product.rudrakshaMalaDetail?.mukhi ??
    null;

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Top Breadcrumb */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
        <Link
          href="/admin/all-products"
          className="font-semibold text-muted-foreground hover:text-[#422006] transition-colors"
        >
          All Products
        </Link>
        <span className="text-muted-foreground/60">/</span>
        <Link
          href={`/admin/all-products/${product.id}`}
          className="font-semibold text-muted-foreground hover:text-[#422006] truncate max-w-44 sm:max-w-64"
        >
          {product.name}
        </Link>
        <span className="text-muted-foreground/60">/</span>
        <span className="font-bold text-[#713f12]">Edit Product</span>
      </div>

      {/* Header Banner */}
      <div className="rounded-2xl sm:rounded-3xl border border-amber-900/10 bg-linear-to-r from-amber-100/70 via-orange-50/50 to-amber-50 p-4 sm:p-6 md:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
              <Badge variant="gold" className="text-[10px]">
                Product #{product.id}
              </Badge>
              <Badge variant="sacred" className="text-[10px]">
                {isIndividual ? "Individual Rudraksha" : "Rudraksha Mala"}
              </Badge>
              {mukhiCount && (
                <Badge
                  variant="outline"
                  className="text-[10px] bg-white/80 border-amber-900/20 text-[#713f12]"
                >
                  ✨ {mukhiCount} Mukhi
                </Badge>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#422006] tracking-tight break-words">
              Edit Product: {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#5c3a1e]/80 max-w-xl">
              Modify product display name, descriptive overview, and imagery.
            </p>
          </div>

          <Link
            href={`/admin/all-products/${product.id}`}
            className="self-start sm:self-auto shrink-0"
          >
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

      {/* Immutable Sacred Attributes Notice */}
      <Card className="border-amber-900/15 bg-amber-50/30 shadow-2xs">
        <CardHeader className="p-4 sm:p-5 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-200/60 text-amber-900">
              <Lock className="h-3.5 w-3.5" />
            </div>
            <div>
              <CardTitle className="text-xs sm:text-sm font-bold text-[#422006]">
                Permanent Sacred Identifiers (Locked)
              </CardTitle>
              <CardDescription className="text-[11px] text-[#5c3a1e]/80">
                Product classification, Mukhi grade, and URL slug are permanent and cannot be altered once created.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="rounded-xl border border-amber-900/10 bg-white p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Product Type
              </span>
              <span className="text-xs font-bold text-[#422006] mt-0.5 block truncate">
                {isIndividual ? "Individual Rudraksha" : "Rudraksha Mala"}
              </span>
            </div>

            <div className="rounded-xl border border-amber-900/10 bg-white p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Mukhi Grade
              </span>
              <span className="text-xs font-bold text-[#422006] mt-0.5 block truncate">
                {mukhiCount ? `${mukhiCount} Mukhi` : "Standard / Mala"}
              </span>
            </div>

            <div className="rounded-xl border border-amber-900/10 bg-white p-3 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Permanent Slug
              </span>
              <span className="text-xs font-mono font-bold text-[#713f12] truncate mt-0.5 block">
                /{product.slug}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Edit Form */}
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Card 1: Core Editable Information */}
        <Card className="border-amber-900/15 bg-white shadow-xs">
          <CardHeader className="border-b border-amber-900/10 pb-4 bg-amber-50/20">
            <CardTitle className="text-base font-bold text-[#422006] flex items-center gap-2">
              <Tag className="h-4 w-4 text-amber-700" />
              General Information
            </CardTitle>
            <CardDescription className="text-xs text-[#5c3a1e]/70">
              Update the product title and customer-facing description.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-[#422006]">
                Product Title / Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="name"
                placeholder="e.g. Nepali 5 Mukhi Rudraksha"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-11 text-xs sm:text-sm font-semibold border-amber-900/15 bg-amber-50/20 focus-visible:ring-amber-700 ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-[11px] font-semibold text-red-600">
                  {formik.errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-[#422006]">
                Product Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                rows={5}
                placeholder="Write detailed background, spiritual significance, and craftsmanship details..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full rounded-md border border-amber-900/15 bg-amber-50/20 p-3 text-xs sm:text-sm text-[#422006] placeholder:text-muted-foreground outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 ${
                  formik.touched.description && formik.errors.description
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-[11px] font-semibold text-red-600">
                  {formik.errors.description}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Product Imagery */}
        <Card className="border-amber-900/15 bg-white shadow-xs">
          <CardHeader className="border-b border-amber-900/10 pb-4 bg-amber-50/20">
            <CardTitle className="text-base font-bold text-[#422006] flex items-center gap-2">
              <Package className="h-4 w-4 text-amber-700" />
              Product Imagery
            </CardTitle>
            <CardDescription className="text-xs text-[#5c3a1e]/70">
              Manage existing photos and attach new photos for this product.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 space-y-5">
            {/* Existing Images Gallery */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wide text-[#422006]">
                  Current Photos ({existingImages.length})
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Click &times; to remove an image
                </span>
              </div>

              {existingImages.length === 0 ? (
                <div className="rounded-xl border border-dashed border-amber-900/20 bg-amber-50/20 p-6 text-center text-xs text-muted-foreground">
                  No existing photos retained. You can upload new ones below.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {existingImages.map((img, idx) => (
                    <div
                      key={img.id ?? idx}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-amber-900/15 bg-amber-50/40 shadow-2xs"
                    >
                      <Image
                        src={img.url}
                        alt={img.altText || `Product Image ${idx + 1}`}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 640px) 45vw, 150px"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(idx)}
                        className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-600/90 text-white shadow-xs hover:bg-red-700 transition-colors"
                        title="Remove image"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <div className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white">
                        Pos #{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload New Photos */}
            <div className="pt-2 border-t border-amber-900/10">
              <ImagePicker
                type="multiple"
                maxFiles={5}
                label="Add New Product Photos"
                onChange={(files) =>
                  formik.setFieldValue("newImageFiles", files)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-amber-900/10">
          <Link
            href={`/admin/all-products/${product.id}`}
            className="w-full sm:w-auto"
          >
            <Button
              type="button"
              variant="outline"
              disabled={isBusy}
              className="w-full sm:w-auto border-amber-900/15 text-[#713f12] text-xs h-11 px-5"
            >
              Cancel
            </Button>
          </Link>

          <Button
            type="submit"
            disabled={isBusy}
            className="w-full sm:w-auto bg-[#713f12] text-white hover:bg-[#5c3a1e] font-bold text-xs h-11 px-8 shadow-md gap-2"
          >
            {isBusy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>
                  {isUploadingImages
                    ? "Uploading Images..."
                    : "Saving Changes..."}
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
