"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Layers,
  Star,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Copy,
  Check,
  BookOpen,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { useSingleBlogAdmin } from "@/hooks/tanstack-hooks/useBlogAdmin";
import useBlogAdminHook from "@/hooks/tanstack-hooks/useBlogAdmin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prepareSafeHtml } from "@/lib/sanititzeHtml";
import { SectionRenderer } from "@/components/SectionRenderer";
import { SingleSectionType } from "@/app/types";

export default function SingleBlogAdminPage() {
  const params = useParams();
  const router = useRouter();
  const blogId = Number(params?.id);

  const {
    data: blog,
    isLoading,
    isError,
    refetch,
  } = useSingleBlogAdmin(blogId);
  const { updateBlog, deleteBlog } = useBlogAdminHook();

  const [copiedSlug, setCopiedSlug] = useState(false);

  const handleCopySlug = (slug: string) => {
    navigator.clipboard.writeText(slug);
    setCopiedSlug(true);
    toast.success("Slug copied to clipboard");
    setTimeout(() => setCopiedSlug(false), 2000);
  };

  const handleToggleActive = async () => {
    if (!blog) return;
    try {
      await updateBlog.mutateAsync({
        id: blog.id,
        data: { isActive: !blog.isActive },
      });
      toast.success(
        !blog.isActive ? "Article published live!" : "Article moved to draft.",
      );
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleToggleFeatured = async () => {
    if (!blog) return;
    try {
      await updateBlog.mutateAsync({
        id: blog.id,
        data: { isFeatured: !blog.isFeatured },
      });
      toast.success(
        !blog.isFeatured
          ? "Article marked as featured!"
          : "Article removed from featured.",
      );
    } catch {
      toast.error("Failed to update featured flag");
    }
  };

  const handleDelete = async () => {
    if (!blog) return;
    if (
      window.confirm(
        `Are you sure you want to permanently delete "${blog.title}"?`,
      )
    ) {
      try {
        await deleteBlog.mutateAsync({ id: blog.id });
        toast.success("Blog deleted successfully");
        router.push("/admin/blogs");
      } catch {
        toast.error("Failed to delete blog");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Loading article details...
        </p>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <Link href="/admin/blogs">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="size-4" />
            Back to Blogs
          </Button>
        </Link>
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="size-5" />
              <CardTitle>Article Not Found</CardTitle>
            </div>
            <CardDescription>
              The blog article with ID #{blogId} could not be loaded or may have
              been deleted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="sm" onClick={() => refetch()}>
              Retry Loading
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/blogs">
            <Button variant="ghost" size="icon-sm">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight line-clamp-1">
                {blog.title}
              </h1>
              <Badge
                variant={blog.variant === "EXTENDED" ? "default" : "secondary"}
                className="text-xs uppercase"
              >
                {blog.variant}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mt-0.5">
              <span>slug: /{blog.slug}</span>
              <button
                type="button"
                onClick={() => handleCopySlug(blog.slug)}
                className="hover:text-foreground inline-flex items-center"
              >
                {copiedSlug ? (
                  <Check className="size-3 text-emerald-500" />
                ) : (
                  <Copy className="size-3" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Direct Status Toggle */}
          <Button
            variant={blog.isActive ? "default" : "outline"}
            size="sm"
            onClick={handleToggleActive}
            disabled={updateBlog.isPending}
            className={`gap-1.5 ${
              blog.isActive
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : ""
            }`}
          >
            {blog.isActive ? (
              <>
                <CheckCircle2 className="size-3.5" />
                Active (Published)
              </>
            ) : (
              <>
                <XCircle className="size-3.5" />
                Draft (Offline)
              </>
            )}
          </Button>

          {/* Direct Featured Toggle */}
          <Button
            variant={blog.isFeatured ? "default" : "outline"}
            size="sm"
            onClick={handleToggleFeatured}
            disabled={updateBlog.isPending}
            className={`gap-1.5 ${
              blog.isFeatured
                ? "bg-amber-500 hover:bg-amber-600 text-white"
                : ""
            }`}
          >
            <Star
              className={`size-3.5 ${blog.isFeatured ? "fill-current" : ""}`}
            />
            {blog.isFeatured ? "Featured" : "Mark Featured"}
          </Button>

          {/* Edit button */}
          <Link href={`/admin/blogs/${blog.id}/edit`}>
            <Button variant="secondary" size="sm" className="gap-1.5">
              <Edit className="size-3.5" />
              Edit
            </Button>
          </Link>

          {/* Delete button */}
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleteBlog.isPending}
            className="gap-1.5"
          >
            <Trash2 className="size-3.5" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left (2/3): Content, Summary & Structured Blocks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary / Excerpt */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Short Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {blog.shortDescription}
              </p>
            </CardContent>
          </Card>

          {/* Main Description (Rich Text) */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Main Article Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="w-full prose prose-sm max-w-full dark:prose-invert leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: prepareSafeHtml(blog.mainDescription),
                }}
              />
            </CardContent>
          </Card>

          {/* Structured Sections (Extended Only) */}
          {blog.variant === "EXTENDED" ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Layers className="size-4 text-primary" />
                    Structured Content Blocks
                  </CardTitle>
                  <CardDescription>
                    Additional modular sections configured for this article
                  </CardDescription>
                </div>
                <Badge variant="outline" className="font-mono text-xs">
                  {blog.sections?.length ?? 0} Blocks
                </Badge>
              </CardHeader>

              <CardContent className="space-y-6">
                {!blog.sections || blog.sections.length === 0 ? (
                  <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-lg bg-muted/10">
                    No additional structured sections added to this extended blog.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {blog.sections.map(
                      (section: SingleSectionType, index: number) => (
                        <div
                          key={section.id || index}
                          className="border rounded-lg p-4 bg-card/60 shadow-xs space-y-3"
                        >
                          <div className="flex items-center justify-between border-b pb-2 text-xs text-muted-foreground">
                            <span className="font-bold">Block #{index + 1}</span>
                            <Badge
                              variant="secondary"
                              className="text-[11px] uppercase"
                            >
                              {section.type.replace("_", " ")}
                            </Badge>
                          </div>

                          {/* Render block with SectionRenderer */}
                          <SectionRenderer section={section} />
                        </div>
                      ),
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed bg-muted/15">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                    <Layers className="size-4" />
                    Structured Sections Disabled
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    Standard Layout
                  </Badge>
                </div>
                <CardDescription>
                  This article is published using the Standard layout. Modular content sections are only permitted and rendered on Extended layout articles.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>

        {/* Right (1/3): Thumbnail & Meta Overview */}
        <div className="space-y-6">
          {/* Thumbnail preview */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Cover Thumbnail</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full h-52 bg-muted">
                {blog.thumbnailImage ? (
                  <Image
                    src={blog.thumbnailImage}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <BookOpen className="size-10" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Metadata Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Metadata & Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b">
                <span className="text-muted-foreground">
                  Publication Status:
                </span>
                {blog.isActive ? (
                  <Badge className="bg-emerald-600 text-white">Active</Badge>
                ) : (
                  <Badge variant="outline">Draft</Badge>
                )}
              </div>

              <div className="flex items-center justify-between py-1.5 border-b">
                <span className="text-muted-foreground">
                  Featured Spotlight:
                </span>
                {blog.isFeatured ? (
                  <Badge className="bg-amber-500 text-white">Featured</Badge>
                ) : (
                  <span className="text-muted-foreground">No</span>
                )}
              </div>

              <div className="flex items-center justify-between py-1.5 border-b">
                <span className="text-muted-foreground">Created On:</span>
                <span>
                  {blog.createdAt
                    ? new Date(blog.createdAt).toLocaleString()
                    : "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b">
                <span className="text-muted-foreground">Last Updated:</span>
                <span>
                  {blog.updatedAt
                    ? new Date(blog.updatedAt).toLocaleString()
                    : "N/A"}
                </span>
              </div>

              {/* Tags */}
              <div className="pt-2">
                <span className="text-muted-foreground block mb-1.5">
                  Assigned Tags:
                </span>
                {blog.customTags && blog.customTags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {blog.customTags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-muted px-2 py-0.5 rounded-sm text-[11px] text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">None</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
