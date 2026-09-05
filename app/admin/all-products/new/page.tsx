"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Image as ImageIcon,
  Loader2,
  Package,
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
import { CreateProductPayload } from "@/app/api/products/api";
import useProductAdminHook from "@/hooks/tanstack-hooks/useProductAdmin";
import { uploadToCloud } from "@/lib/uploadToCloud";

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface ProductCreateFormValues {
  name: string;
  slug: string;
  description: string;
  type: "INDIVIDUAL_RUDRAKSHA" | "RUDRAKSHA_MALA";
  mukhi: number | "";
  imageFiles: File[];
}

const productValidationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(3, "Product name must be at least 3 characters")
    .max(120, "Product name cannot exceed 120 characters")
    .required("Product name is required"),
  slug: Yup.string()
    .trim()
    .matches(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    )
    .optional(),
  description: Yup.string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .required("Description is required"),
  type: Yup.string()
    .oneOf(
      ["INDIVIDUAL_RUDRAKSHA", "RUDRAKSHA_MALA"],
      "Please select a valid product type"
    )
    .required("Product type is required"),
  mukhi: Yup.number().when("type", {
    is: "INDIVIDUAL_RUDRAKSHA",
    then: (schema) =>
      schema
        .typeError("Mukhi must be a valid number")
        .integer("Mukhi must be an integer (e.g. 5 for 5 Mukhi)")
        .positive("Mukhi must be a positive integer")
        .required("Mukhi count is required for Individual Rudraksha"),
    otherwise: (schema) =>
      schema
        .typeError("Mukhi must be a valid number")
        .integer("Mukhi must be an integer")
        .positive("Mukhi must be a positive integer")
        .nullable(),
  }),
});

export default function NewProductPage() {
  const router = useRouter();
  const { createProduct } = useProductAdminHook();

  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [slugTouchedManually, setSlugTouchedManually] = useState(false);
  const [imageError, setImageError] = useState<string | undefined>();

  const formik = useFormik<ProductCreateFormValues>({
    initialValues: {
      name: "",
      slug: "",
      description: "",
      type: "INDIVIDUAL_RUDRAKSHA",
      mukhi: 5,
      imageFiles: [],
    },
    validationSchema: productValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let uploadedImageUrls: string[] = [];

        // Upload images if any selected
        if (values.imageFiles.length > 0) {
          setIsUploadingImages(true);
          const uploadPromises = values.imageFiles.map((file) =>
            uploadToCloud(file)
          );
          const uploadResults = await Promise.all(uploadPromises);

          const failed = uploadResults.find((r) => !r.success || !r.url);
          if (failed) {
            setImageError(
              failed.error || "Failed to upload one or more images"
            );
            toast.error(failed.error || "Failed to upload images");
            setIsUploadingImages(false);
            setSubmitting(false);
            return;
          }

          uploadedImageUrls = uploadResults
            .map((r) => r.url)
            .filter((url): url is string => Boolean(url));
          setIsUploadingImages(false);
        }

        const resolvedSlug = values.slug.trim() || slugify(values.name);

        const payload: CreateProductPayload = {
          name: values.name.trim(),
          slug: resolvedSlug,
          description: values.description.trim(),
          type: values.type,
          individualDetail:
            values.type === "INDIVIDUAL_RUDRAKSHA" && values.mukhi
              ? { mukhi: Number(values.mukhi) }
              : null,
          malaDetail:
            values.type === "RUDRAKSHA_MALA"
              ? { mukhi: values.mukhi ? Number(values.mukhi) : null }
              : null,
          images: uploadedImageUrls.map((url, index) => ({
            url,
            altText: `${values.name} - Photo ${index + 1}`,
            position: index,
          })),
        };

        const newProduct = await createProduct.mutateAsync(payload);
        toast.success(
          `Product "${newProduct.name}" created! Now configure its variants.`
        );

        // Programmatically navigate to single product page for Step 2
        router.push(`/admin/all-products/${newProduct.id}`);
      } catch (err: any) {
        toast.error(err?.message || "Failed to create product");
      } finally {
        setSubmitting(false);
        setIsUploadingImages(false);
      }
    },
  });

  // Automatically generate slug when typing name (if slug hasn't been modified manually)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    if (!slugTouchedManually) {
      formik.setFieldValue("slug", slugify(e.target.value));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugTouchedManually(true);
    formik.setFieldValue("slug", slugify(e.target.value));
  };

  const isBusy =
    formik.isSubmitting || isUploadingImages || createProduct.isPending;

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs">
        <Link
          href="/admin/all-products"
          className="font-semibold text-muted-foreground hover:text-[#422006] transition-colors"
        >
          All Products
        </Link>
        <span className="text-muted-foreground/60">/</span>
        <span className="font-bold text-[#713f12]">Create New Product</span>
      </div>

      {/* Top Banner & Stepper Progress */}
      <div className="rounded-3xl border border-amber-900/10 bg-linear-to-r from-amber-100/70 via-orange-50/50 to-amber-50 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="gold" className="text-[10px]">
                Step 1 of 2
              </Badge>
              <Badge variant="sacred" className="text-[10px]">
                Product Foundation
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#422006] tracking-tight">
              Create New Sacred Product
            </h1>
            <p className="text-xs sm:text-sm text-[#5c3a1e]/80 max-w-xl">
              Establish core product metadata and gallery photos first. In Step
              2, you will configure inventory sizes, weights, and price
              variants.
            </p>
          </div>

          <Link href="/admin/all-products">
            <Button
              variant="outline"
              size="sm"
              className="border-amber-900/15 text-xs text-[#713f12] bg-white hover:bg-amber-50"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Catalog
            </Button>
          </Link>
        </div>

        {/* Stepper Visualization */}
        <div className="mt-6 pt-5 border-t border-amber-900/10 grid grid-cols-2 gap-3 sm:gap-6">
          <div className="flex items-center gap-3 rounded-2xl bg-white/80 p-3 shadow-2xs border border-amber-900/10">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#713f12] text-xs font-bold text-white shadow-xs">
              1
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#422006] truncate">
                Product Details & Imagery
              </p>
              <p className="text-[10px] text-amber-800/80">
                In Progress (Current)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-amber-50/50 p-3 border border-amber-900/10 opacity-70">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-xs font-bold text-[#713f12]">
              2
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#422006] truncate">
                Variants, SKU & Inventory
              </p>
              <p className="text-[10px] text-muted-foreground">
                Next on Single Page
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Formik Form */}
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Card 1: Identity & Categorization */}
        <Card className="border-amber-900/15 bg-white shadow-xs">
          <CardHeader className="border-b border-amber-900/10 pb-4 bg-amber-50/20">
            <CardTitle className="text-base font-bold text-[#422006] flex items-center gap-2">
              <Package className="h-4 w-4 text-amber-700" />
              Product Identity & Classification
            </CardTitle>
            <CardDescription className="text-xs text-[#5c3a1e]/70">
              Basic identification information displayed in the catalog and
              store.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Product Name */}
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-bold uppercase tracking-wide text-[#422006]">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="name"
                  placeholder="e.g. 5 Mukhi Nepali Rudraksha Bead"
                  value={formik.values.name}
                  onChange={handleNameChange}
                  onBlur={formik.handleBlur}
                  className={`h-11 text-xs sm:text-sm border-amber-900/15 bg-amber-50/20 focus-visible:ring-amber-700 ${
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

              {/* URL Slug */}
              <div className="space-y-1.5 sm:col-span-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wide text-[#422006]">
                    URL Slug
                  </label>
                  <span className="text-[10px] text-muted-foreground">
                    Auto-generated from name
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">
                    /
                  </span>
                  <Input
                    name="slug"
                    placeholder="5-mukhi-nepali-rudraksha-bead"
                    value={formik.values.slug}
                    onChange={handleSlugChange}
                    onBlur={formik.handleBlur}
                    className={`h-11 pl-6 text-xs sm:text-sm font-mono border-amber-900/15 bg-amber-50/20 focus-visible:ring-amber-700 ${
                      formik.touched.slug && formik.errors.slug
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                </div>
                {formik.touched.slug && formik.errors.slug && (
                  <p className="text-[11px] font-semibold text-red-600">
                    {formik.errors.slug}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {/* Product Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-[#422006]">
                  Product Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-11 w-full rounded-md border border-amber-900/15 bg-amber-50/20 px-3 text-xs sm:text-sm text-[#422006] font-semibold outline-none focus:border-amber-700"
                >
                  <option value="INDIVIDUAL_RUDRAKSHA">
                    🌿 Individual Rudraksha Bead
                  </option>
                  <option value="RUDRAKSHA_MALA">
                    📿 Rudraksha Mala / Garland
                  </option>
                </select>
                {formik.touched.type && formik.errors.type && (
                  <p className="text-[11px] font-semibold text-red-600">
                    {formik.errors.type}
                  </p>
                )}
              </div>

              {/* Mukhi Grade */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-[#422006]">
                  Mukhi Grade{" "}
                  {formik.values.type === "INDIVIDUAL_RUDRAKSHA" && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <Input
                  type="number"
                  name="mukhi"
                  placeholder="e.g. 5"
                  value={formik.values.mukhi}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-11 text-xs sm:text-sm border-amber-900/15 bg-amber-50/20 focus-visible:ring-amber-700 ${
                    formik.touched.mukhi && formik.errors.mukhi
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {formik.touched.mukhi && formik.errors.mukhi && (
                  <p className="text-[11px] font-semibold text-red-600">
                    {formik.errors.mukhi}
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground">
                  Number of natural clefts/facets (1 through 21 Mukhi).
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold uppercase tracking-wide text-[#422006]">
                Product Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                rows={4}
                placeholder="Describe the spiritual significance, ruling deity, natural attributes, and energization ritual of this sacred item..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full rounded-md border border-amber-900/15 bg-amber-50/20 p-3 text-xs sm:text-sm text-[#422006] outline-none focus:border-amber-700 leading-relaxed ${
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

        {/* Card 2: Imagery */}
        <Card className="border-amber-900/15 bg-white shadow-xs">
          <CardHeader className="border-b border-amber-900/10 pb-4 bg-amber-50/20">
            <CardTitle className="text-base font-bold text-[#422006] flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-amber-700" />
              Product Catalog Imagery
            </CardTitle>
            <CardDescription className="text-xs text-[#5c3a1e]/70">
              Upload up to 5 high-resolution photographs showcasing the bead,
              textures, and authentic mukhi lines.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <ImagePicker
              type="multiple"
              maxFiles={5}
              label="Select Product Images (Drag & Drop or Browse)"
              errorMsg={imageError}
              onChange={(files) => {
                setImageError(undefined);
                formik.setFieldValue("imageFiles", files);
              }}
            />
          </CardContent>
        </Card>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-amber-900/10">
          <Link href="/admin/all-products">
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
                  {isUploadingImages
                    ? "Uploading Images..."
                    : "Creating Product..."}
                </span>
              </>
            ) : (
              <>
                <span>Save & Continue to Step 2</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
