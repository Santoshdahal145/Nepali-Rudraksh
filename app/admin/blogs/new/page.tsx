"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useBlogAdminHook from "@/hooks/tanstack-hooks/useBlogAdmin";
import BlogForm from "../BlogForm";
import { CreateBlogPayload } from "@/app/api/blogs/api";

export default function NewBlogPage() {
  const router = useRouter();
  const { createBlog } = useBlogAdminHook();

  const handleCreate = async (payload: CreateBlogPayload) => {
    try {
      const created = await createBlog.mutateAsync(payload);
      toast.success("Blog published successfully!");
      if (created?.id) {
        router.push(`/admin/blogs/${created.id}`);
      } else {
        router.push("/admin/blogs");
      }
    } catch (err) {
      console.error("Failed to create blog:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to create blog post",
      );
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create New Article</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Draft and publish sacred Rudraksha knowledge, articles, and guides.
        </p>
      </div>

      <BlogForm
        isSubmitting={createBlog.isPending}
        onSubmit={handleCreate}
      />
    </div>
  );
}
