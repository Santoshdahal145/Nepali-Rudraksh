"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";

import { useSingleBlogAdmin } from "@/hooks/tanstack-hooks/useBlogAdmin";
import useBlogAdminHook from "@/hooks/tanstack-hooks/useBlogAdmin";
import BlogForm from "../../BlogForm";
import { CreateBlogPayload } from "@/app/api/blogs/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const blogId = Number(params?.id);

  const { data: blog, isLoading, isError, refetch } = useSingleBlogAdmin(blogId);
  const { updateBlog } = useBlogAdminHook();

  const handleUpdate = async (payload: CreateBlogPayload) => {
    if (!blog) return;
    try {
      await updateBlog.mutateAsync({
        id: blog.id,
        data: payload,
      });
      toast.success("Blog updated successfully!");
      router.push(`/admin/blogs/${blog.id}`);
    } catch (err) {
      console.error("Failed to update blog:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to update blog article",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading article for editing...</p>
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
              The blog article with ID #{blogId} could not be loaded for editing.
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
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Article</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update content, adjust structured blocks, or modify publication status.
        </p>
      </div>

      <BlogForm
        initialBlog={blog}
        isEdit={true}
        isSubmitting={updateBlog.isPending}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
