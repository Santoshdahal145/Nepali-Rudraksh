"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Loader2,
  FileText,
  Image as ImageIcon,
  Link2,
  Code,
  Layers,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImagePicker } from "@/components/ui/imagePicker";
import { RichTextInput } from "@/components/RichTextInput";
import { uploadToCloud } from "@/lib/uploadToCloud";
import {
  CreateBlogPayload,
  SectionPayload,
  SectionType,
  BlogVariant,
} from "@/app/api/blogs/api";
import { BlogType, SingleSectionType } from "@/app/types";

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type FormSectionItem = {
  tempId: string;
  type: SectionType;
  title: string;
  description: string;
  imageFile: File | null;
  existingImageUrl?: string | null;
  link: string;
  html: string;
  position: number;
};

interface BlogFormProps {
  initialBlog?: BlogType | null;
  isEdit?: boolean;
  isSubmitting: boolean;
  onSubmit: (payload: CreateBlogPayload) => Promise<void>;
}

export const blogValidationSchema = Yup.object().shape({
  title: Yup.string().trim().required("Title is required"),
  slug: Yup.string().trim().optional(),
  shortDescription: Yup.string()
    .trim()
    .required("Short description is required"),
  mainDescription: Yup.string()
    .trim()
    .required("Main description is required"),
  variant: Yup.string()
    .oneOf(["STANDARD", "EXTENDED"])
    .required("Variant is required"),
  isActive: Yup.boolean().default(true),
  isFeatured: Yup.boolean().default(false),
  customTags: Yup.string().optional(),
});

export default function BlogForm({
  initialBlog,
  isEdit = false,
  isSubmitting,
  onSubmit,
}: BlogFormProps) {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<string | null>(
    initialBlog?.thumbnailImage || null,
  );

  const [sections, setSections] = useState<FormSectionItem[]>(() => {
    if (!initialBlog?.sections || initialBlog.sections.length === 0) {
      return [];
    }
    return initialBlog.sections.map((s: SingleSectionType, index: number) => ({
      tempId: `sec-${s.id || index}-${Date.now()}`,
      type: (s.type as SectionType) || "INFO_BLOCK",
      title: s.title || "",
      description: s.description || "",
      imageFile: null,
      existingImageUrl: s.image || null,
      link: s.link || "",
      html: s.html || "",
      position: s.position ?? index,
    }));
  });

  const formik = useFormik({
    initialValues: {
      title: initialBlog?.title || "",
      slug: initialBlog?.slug || "",
      shortDescription: initialBlog?.shortDescription || "",
      mainDescription: initialBlog?.mainDescription || "",
      variant: (initialBlog?.variant as BlogVariant) || "STANDARD",
      isActive: initialBlog?.isActive ?? true,
      isFeatured: initialBlog?.isFeatured ?? false,
      customTags: initialBlog?.customTags ? initialBlog.customTags.join(", ") : "",
    },
    validationSchema: blogValidationSchema,
    onSubmit: async (values) => {
      // 1. Check thumbnail
      if (!thumbnailFile && !existingThumbnailUrl) {
        toast.error("Please upload a thumbnail image for the blog");
        return;
      }

      try {
        let uploadedThumbnail = existingThumbnailUrl || "";
        if (thumbnailFile) {
          toast.loading("Uploading thumbnail image...", { id: "upload-thumb" });
          const thumbRes = await uploadToCloud(thumbnailFile);
          toast.dismiss("upload-thumb");
          if (!thumbRes.success || !thumbRes.url) {
            toast.error(thumbRes.error || "Failed to upload thumbnail");
            return;
          }
          uploadedThumbnail = thumbRes.url;
        }

        // 2. Process sections and upload any new section images
        const processedSections: SectionPayload[] = [];
        for (let i = 0; i < sections.length; i++) {
          const sec = sections[i];
          let finalImage = sec.existingImageUrl || null;

          if (sec.type === "IMAGE_BLOCK" && sec.imageFile) {
            toast.loading(`Uploading image for section #${i + 1}...`, {
              id: `upload-sec-${i}`,
            });
            const secRes = await uploadToCloud(sec.imageFile);
            toast.dismiss(`upload-sec-${i}`);
            if (secRes.success && secRes.url) {
              finalImage = secRes.url;
            }
          }

          processedSections.push({
            type: sec.type,
            title: sec.title.trim() ? sec.title.trim() : null,
            description: sec.description.trim() ? sec.description.trim() : null,
            image: finalImage,
            link: sec.link.trim() ? sec.link.trim() : null,
            html: sec.html ? sec.html : null,
            position: i,
          });
        }

        // 3. Prepare payload
        const rawTags = values.customTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

        const payload: CreateBlogPayload = {
          title: values.title.trim(),
          slug: values.slug.trim() ? slugify(values.slug) : slugify(values.title),
          shortDescription: values.shortDescription.trim(),
          mainDescription: values.mainDescription,
          thumbnailImage: uploadedThumbnail,
          variant: values.variant,
          isActive: values.isActive,
          isFeatured: values.isFeatured,
          customTags: rawTags,
          sections: processedSections,
        };

        await onSubmit(payload);
      } catch (err) {
        console.error("Submit blog error:", err);
        toast.error("An unexpected error occurred while saving the blog.");
      }
    },
  });

  // Handle section management
  const handleAddSection = (type: SectionType) => {
    const newSec: FormSectionItem = {
      tempId: `sec-${Date.now()}-${Math.random()}`,
      type,
      title: "",
      description: "",
      imageFile: null,
      existingImageUrl: null,
      link: "",
      html: "",
      position: sections.length,
    };
    setSections((prev) => [...prev, newSec]);
  };

  const handleRemoveSection = (tempId: string) => {
    setSections((prev) => prev.filter((s) => s.tempId !== tempId));
  };

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === sections.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSections(updated);
  };

  const handleUpdateSection = (
    tempId: string,
    updates: Partial<FormSectionItem>,
  ) => {
    setSections((prev) =>
      prev.map((s) => (s.tempId === tempId ? { ...s, ...updates } : s)),
    );
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-8">
      {/* Top action row */}
      <div className="flex items-center justify-between pb-4 border-b">
        <Link href="/admin/blogs">
          <Button variant="ghost" size="sm" type="button" className="gap-1.5">
            <ArrowLeft className="size-4" />
            Back to Blogs
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/admin/blogs">
            <Button variant="outline" size="sm" type="button">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || formik.isSubmitting}
            className="gap-1.5"
          >
            {isSubmitting || formik.isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>{isEdit ? "Update Blog" : "Publish Blog"}</>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3): Core Information & Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Article Details</CardTitle>
              <CardDescription>
                Provide the core title, slug, and descriptions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Blog Title <span className="text-destructive">*</span>
                </label>
                <Input
                  name="title"
                  placeholder="e.g. The Sacred Science of 5 Mukhi Rudraksha"
                  value={formik.values.title}
                  onChange={(e) => {
                    formik.handleChange(e);
                    if (!isEdit && !formik.values.slug) {
                      formik.setFieldValue("slug", slugify(e.target.value));
                    }
                  }}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-xs text-destructive">{formik.errors.title}</p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Custom Slug (optional)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono">
                    /blogs/public/
                  </span>
                  <Input
                    name="slug"
                    placeholder="sacred-science-5-mukhi"
                    value={formik.values.slug}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="font-mono text-xs"
                  />
                </div>
                {formik.touched.slug && formik.errors.slug && (
                  <p className="text-xs text-destructive">{formik.errors.slug}</p>
                )}
              </div>

              {/* Short Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Short Summary / Excerpt <span className="text-destructive">*</span>
                </label>
                <textarea
                  name="shortDescription"
                  rows={3}
                  placeholder="Brief preview of the blog shown on card listings and meta tags..."
                  value={formik.values.shortDescription}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                />
                {formik.touched.shortDescription &&
                  formik.errors.shortDescription && (
                    <p className="text-xs text-destructive">
                      {formik.errors.shortDescription}
                    </p>
                  )}
              </div>

              {/* Main Description (Rich Text) */}
              <div className="space-y-1.5 pt-2">
                <label className="text-sm font-medium">
                  Main Content (Rich Text) <span className="text-destructive">*</span>
                </label>
                <RichTextInput
                  value={formik.values.mainDescription}
                  onChange={(content) =>
                    formik.setFieldValue("mainDescription", content)
                  }
                  placeholder="Write the full in-depth body content of the blog..."
                  height="350px"
                  errorMsg={
                    formik.touched.mainDescription
                      ? formik.errors.mainDescription
                      : undefined
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Sections Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="size-5 text-primary" />
                  Structured Sections
                </CardTitle>
                <CardDescription>
                  Add modular content blocks (Info, Image, Link, HTML)
                </CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                {sections.length} Block{sections.length === 1 ? "" : "s"}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-6">
              {sections.length === 0 ? (
                <div className="border border-dashed rounded-lg p-6 text-center text-muted-foreground space-y-2 bg-muted/10">
                  <Layers className="size-8 mx-auto text-muted-foreground/60" />
                  <p className="text-sm">No structured sections added yet</p>
                  <p className="text-xs text-muted-foreground/80">
                    Use the buttons below to append custom blocks to this article.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sections.map((section, idx) => (
                    <div
                      key={section.tempId}
                      className="border rounded-lg p-4 bg-card/60 shadow-xs space-y-4 transition-all"
                    >
                      {/* Section header bar */}
                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-sm">
                            #{idx + 1}
                          </span>
                          <Badge variant="secondary" className="text-xs uppercase font-semibold">
                            {section.type.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            disabled={idx === 0}
                            onClick={() => handleMoveSection(idx, "up")}
                          >
                            <MoveUp className="size-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            disabled={idx === sections.length - 1}
                            onClick={() => handleMoveSection(idx, "down")}
                          >
                            <MoveDown className="size-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveSection(section.tempId)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Common Title input */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                          Section Heading (Optional)
                        </label>
                        <Input
                          placeholder="e.g. Historical Vedic References"
                          value={section.title}
                          onChange={(e) =>
                            handleUpdateSection(section.tempId, {
                              title: e.target.value,
                            })
                          }
                          className="h-8 text-sm"
                        />
                      </div>

                      {/* Type-specific inputs */}
                      {section.type === "INFO_BLOCK" && (
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">
                            Text Description
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Write informational paragraph text..."
                            value={section.description}
                            onChange={(e) =>
                              handleUpdateSection(section.tempId, {
                                description: e.target.value,
                              })
                            }
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                          />
                        </div>
                      )}

                      {section.type === "IMAGE_BLOCK" && (
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground">
                            Section Image
                          </label>
                          <ImagePicker
                            type="single"
                            initialUrl={section.existingImageUrl}
                            onChange={(file) =>
                              handleUpdateSection(section.tempId, {
                                imageFile: file,
                              })
                            }
                          />
                        </div>
                      )}

                      {section.type === "LINK_BLOCK" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                              Link URL
                            </label>
                            <Input
                              placeholder="https://nepalirudraksh.com/products/..."
                              value={section.link}
                              onChange={(e) =>
                                handleUpdateSection(section.tempId, {
                                  link: e.target.value,
                                })
                              }
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                              Description / Subtitle
                            </label>
                            <Input
                              placeholder="Explore 1 to 21 Mukhi Rudraksha..."
                              value={section.description}
                              onChange={(e) =>
                                handleUpdateSection(section.tempId, {
                                  description: e.target.value,
                                })
                              }
                              className="h-8 text-sm"
                            />
                          </div>
                        </div>
                      )}

                      {section.type === "HTML_BLOCK" && (
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">
                            Rich Content / HTML Block
                          </label>
                          <RichTextInput
                            value={section.html}
                            onChange={(content) =>
                              handleUpdateSection(section.tempId, {
                                html: content,
                              })
                            }
                            placeholder="Enter rich HTML content..."
                            height="220px"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add block buttons bar */}
              <div className="pt-2 border-t">
                <p className="text-xs font-medium text-muted-foreground mb-3">
                  Append New Section Block:
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    className="gap-1.5"
                    onClick={() => handleAddSection("INFO_BLOCK")}
                  >
                    <FileText className="size-3.5 text-blue-500" />
                    + Info Block
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    className="gap-1.5"
                    onClick={() => handleAddSection("IMAGE_BLOCK")}
                  >
                    <ImageIcon className="size-3.5 text-emerald-500" />
                    + Image Block
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    className="gap-1.5"
                    onClick={() => handleAddSection("LINK_BLOCK")}
                  >
                    <Link2 className="size-3.5 text-purple-500" />
                    + Link Block
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    className="gap-1.5"
                    onClick={() => handleAddSection("HTML_BLOCK")}
                  >
                    <Code className="size-3.5 text-amber-500" />
                    + HTML Block
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3): Media & Configuration Settings */}
        <div className="space-y-6">
          {/* Thumbnail Image Card */}
          <Card>
            <CardHeader>
              <CardTitle>Cover Thumbnail</CardTitle>
              <CardDescription>
                Primary banner image used on blog cards and sharing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImagePicker
                type="single"
                initialUrl={existingThumbnailUrl}
                onChange={(file) => {
                  setThumbnailFile(file);
                  if (file) setExistingThumbnailUrl(null);
                }}
              />
            </CardContent>
          </Card>

          {/* Visibility & Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing Options</CardTitle>
              <CardDescription>
                Control status, variant style, and visibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Variant selection */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Article Layout Variant
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["STANDARD", "EXTENDED"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => formik.setFieldValue("variant", v)}
                      className={`text-xs py-2 px-3 rounded-md border font-semibold text-center transition-colors ${
                        formik.values.variant === v
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status toggles */}
              <div className="space-y-3 pt-3 border-t">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="text-sm font-medium">Published / Active</span>
                    <p className="text-xs text-muted-foreground">
                      Visible on public website
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formik.values.isActive}
                    onChange={formik.handleChange}
                    className="size-4 accent-primary rounded-sm"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="text-sm font-medium flex items-center gap-1.5">
                      <Sparkles className="size-3.5 text-amber-500" />
                      Featured Article
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Highlighted at top of blog listings
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formik.values.isFeatured}
                    onChange={formik.handleChange}
                    className="size-4 accent-primary rounded-sm"
                  />
                </label>
              </div>

              {/* Custom Tags */}
              <div className="space-y-1.5 pt-3 border-t">
                <label className="text-xs font-medium text-muted-foreground">
                  Custom Tags (Comma-separated)
                </label>
                <Input
                  name="customTags"
                  placeholder="rudraksha, spiritual, healing, pashupatinath"
                  value={formik.values.customTags}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="text-xs"
                />
                <p className="text-[11px] text-muted-foreground">
                  e.g. rudraksha, 5-mukhi, mantras, benefits
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
