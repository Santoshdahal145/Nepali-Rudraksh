"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  Compass,
  Globe,
  Loader2,
  MapPin,
  Sparkles,
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
import useRudrakshOriginAdminHook from "@/hooks/tanstack-hooks/useRudrakshOriginAdmin";
import { CreateOriginPayload } from "@/app/api/products/api";

const originValidationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, "Origin name must be at least 2 characters")
    .max(100, "Origin name cannot exceed 100 characters")
    .required("Origin name is required"),
  country: Yup.string()
    .trim()
    .min(2, "Country name must be at least 2 characters")
    .max(100, "Country name cannot exceed 100 characters")
    .required("Country is required"),
});

const initialValues: CreateOriginPayload = {
  name: "",
  country: "Nepal",
};

const commonOrigins = [
  { name: "Bhojpur, Eastern Region", country: "Nepal" },
  { name: "Sankhuwasabha", country: "Nepal" },
  { name: "Kathmandu Valley", country: "Nepal" },
  { name: "Java Island", country: "Indonesia" },
  { name: "Papua", country: "Indonesia" },
  { name: "Haridwar, Uttarakhand", country: "India" },
];

export default function NewRudrakshOriginPage() {
  const router = useRouter();
  const { createRudrakshOrigin } = useRudrakshOriginAdminHook();

  const handleSubmit = async (
    values: CreateOriginPayload,
    { setSubmitting, setStatus }: any
  ) => {
    try {
      await createRudrakshOrigin.mutateAsync({
        name: values.name.trim(),
        country: values.country.trim(),
      });
      toast.success(`Origin "${values.name}" created successfully`);
      router.push("/admin/all-products/origins");
    } catch (err: any) {
      const message =
        err?.message || "Failed to create origin. Please check for duplicates.";
      setStatus(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Navigation Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs">
        <Link
          href="/admin/all-products"
          className="font-semibold text-muted-foreground hover:text-[#422006]"
        >
          All Products
        </Link>
        <span className="text-muted-foreground/60">/</span>
        <Link
          href="/admin/all-products/origins"
          className="font-semibold text-muted-foreground hover:text-[#422006]"
        >
          Origins
        </Link>
        <span className="text-muted-foreground/60">/</span>
        <span className="font-bold text-[#713f12]">Add New Origin</span>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl border border-amber-900/10 bg-linear-to-r from-amber-100/70 via-orange-50/50 to-amber-50 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="gold" className="text-[10px]">
                Create Geographic Origin
              </Badge>
              <Badge variant="sacred" className="text-[10px]">
                Authentication
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#422006] tracking-tight">
              Register New Origin
            </h1>
            <p className="text-xs sm:text-sm text-[#5c3a1e]/80">
              Add a verified origin location for genuine Nepali, Indonesian, or
              Himalayan beads.
            </p>
          </div>

          <Link href="/admin/all-products/origins">
            <Button
              variant="outline"
              size="sm"
              className="border-amber-900/15 text-xs text-[#713f12] bg-white hover:bg-amber-50"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to List
            </Button>
          </Link>
        </div>
      </div>

      {/* Formik Form Card */}
      <Card className="border-amber-900/15 bg-white shadow-xs">
        <CardHeader className="border-b border-amber-900/10 pb-4 bg-amber-50/20">
          <CardTitle className="text-base font-bold text-[#422006] flex items-center gap-2">
            <Compass className="h-4 w-4 text-amber-700" />
            Origin Attributes & Provenance
          </CardTitle>
          <CardDescription className="text-xs text-[#5c3a1e]/70">
            Ensure region and country names accurately reflect the authentic
            harvest locality.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={originValidationSchema}
            onSubmit={handleSubmit}
          >
            {({
              isSubmitting,
              status,
              setFieldValue,
              values,
              errors,
              touched,
            }) => (
              <Form className="space-y-6">
                {status && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
                    {status}
                  </div>
                )}

                {/* Quick Presets */}
                <div className="rounded-2xl border border-amber-900/10 bg-amber-50/40 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#422006] flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-700" />
                      Popular Himalayan & Archipelago Origins:
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Click to auto-fill
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {commonOrigins.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setFieldValue("name", preset.name);
                          setFieldValue("country", preset.country);
                        }}
                        className="rounded-lg border border-amber-900/15 bg-white px-2.5 py-1 text-[11px] font-medium text-[#713f12] hover:bg-amber-100/70 hover:border-amber-700 transition-colors shadow-2xs"
                      >
                        {preset.name} ({preset.country})
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Origin Name Field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="name"
                      className="block text-xs font-bold text-[#422006] uppercase tracking-wide"
                    >
                      Region / Origin Name{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Field
                        as={Input}
                        id="name"
                        name="name"
                        placeholder="e.g. Nepal, Bhojpur, or Java"
                        className={`h-11 pl-10 text-xs sm:text-sm border-amber-900/15 bg-amber-50/20 focus-visible:ring-amber-700 ${
                          touched.name && errors.name
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }`}
                      />
                    </div>
                    <ErrorMessage
                      name="name"
                      component="p"
                      className="text-[11px] font-semibold text-red-600 mt-1"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Specific locality, province, or traditional region name.
                    </p>
                  </div>

                  {/* Country Field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="country"
                      className="block text-xs font-bold text-[#422006] uppercase tracking-wide"
                    >
                      Sovereign Country{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Field
                        as={Input}
                        id="country"
                        name="country"
                        placeholder="e.g. Nepal, Indonesia, India"
                        className={`h-11 pl-10 text-xs sm:text-sm border-amber-900/15 bg-amber-50/20 focus-visible:ring-amber-700 ${
                          touched.country && errors.country
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }`}
                      />
                    </div>
                    <ErrorMessage
                      name="country"
                      component="p"
                      className="text-[11px] font-semibold text-red-600 mt-1"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Official country name for certification and provenance
                      labeling.
                    </p>
                  </div>
                </div>

                {/* Country Quick Selection Pills */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground font-medium text-[11px]">
                    Quick Country:
                  </span>
                  {["Nepal", "Indonesia", "India"].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFieldValue("country", c)}
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border transition-all ${
                        values.country.toLowerCase() === c.toLowerCase()
                          ? "bg-[#713f12] text-white border-[#713f12]"
                          : "bg-white text-[#5c3a1e] border-amber-900/20 hover:bg-amber-50"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {/* Form Buttons */}
                <div className="pt-4 border-t border-amber-900/10 flex items-center justify-end gap-3">
                  <Link href="/admin/all-products/origins">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSubmitting}
                      className="border-amber-900/20 text-[#713f12] text-xs h-10 px-4"
                    >
                      Cancel
                    </Button>
                  </Link>

                  <Button
                    type="submit"
                    disabled={isSubmitting || createRudrakshOrigin.isPending}
                    className="bg-[#713f12] text-white hover:bg-[#5c3a1e] text-xs font-bold h-10 px-6 shadow-sm gap-2"
                  >
                    {isSubmitting || createRudrakshOrigin.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Registering Origin...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Create Rudraksha Origin</span>
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}
