"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  BookOpen,
  Calendar,
  Layers,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Star,
  RefreshCw,
} from "lucide-react";
import useBlogAdminHook from "@/hooks/tanstack-hooks/useBlogAdmin";
import { useDebounce } from "@/hooks/useDebounce";
import BlogsTopHeader from "./BlogsTopHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BlogType } from "@/app/types";

export default function AdminBlogsPage() {
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(9);
  const [search, setSearch] = useState<string>("");
  const [variantFilter, setVariantFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const debouncedSearch = useDebounce(search, 400);

  const { getBlogs, deleteBlog } = useBlogAdminHook(page, limit, debouncedSearch);

  const data = getBlogs.data;
  const rawBlogs = data?.blogs ?? [];
  const pagination = data?.pagination;

  // Filter client-side for variant and status if selected
  const blogs = rawBlogs.filter((blog) => {
    if (variantFilter !== "ALL" && blog.variant !== variantFilter) {
      return false;
    }
    if (statusFilter === "ACTIVE" && !blog.isActive) {
      return false;
    }
    if (statusFilter === "DRAFT" && blog.isActive) {
      return false;
    }
    return true;
  });

  const handleDelete = (id: number, title: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete the blog "${title}"? This will delete all its sections as well.`,
      )
    ) {
      deleteBlog.mutate({ id });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <BlogsTopHeader
        onRefresh={() => getBlogs.refetch()}
        isFetching={getBlogs.isFetching}
      />

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-card p-4 rounded-lg border">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search blogs by title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 h-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Variant Filter */}
          <div className="flex items-center gap-1 border rounded-md p-1 bg-muted/30">
            <span className="text-xs font-medium text-muted-foreground px-2">Type:</span>
            {["ALL", "STANDARD", "EXTENDED"].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVariantFilter(v)}
                className={`text-xs px-2.5 py-1 rounded-sm font-medium transition-colors ${
                  variantFilter === v
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 border rounded-md p-1 bg-muted/30">
            <span className="text-xs font-medium text-muted-foreground px-2">Status:</span>
            {["ALL", "ACTIVE", "DRAFT"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`text-xs px-2.5 py-1 rounded-sm font-medium transition-colors ${
                  statusFilter === s
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Cards Grid */}
      {getBlogs.isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse flex flex-col h-88">
              <div className="h-44 bg-muted rounded-t-lg" />
              <CardHeader className="space-y-2">
                <div className="h-4 bg-muted rounded-sm w-3/4" />
                <div className="h-3 bg-muted rounded-sm w-1/2" />
              </CardHeader>
              <CardContent className="flex-1">
                <div className="h-3 bg-muted rounded-sm w-full mb-2" />
                <div className="h-3 bg-muted rounded-sm w-4/5" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="border border-dashed rounded-lg p-12 text-center flex flex-col items-center justify-center space-y-3 bg-muted/10">
          <BookOpen className="size-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No blogs found</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {search || variantFilter !== "ALL" || statusFilter !== "ALL"
              ? "No blogs match your current search or filter criteria. Try resetting filters."
              : "No blogs have been published yet. Get started by creating your first blog post."}
          </p>
          <Link href="/admin/blogs/new">
            <Button size="sm" className="mt-2 gap-1.5">
              <Plus className="size-4" />
              Create First Blog
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog: BlogType) => (
            <Card
              key={blog.id}
              className="group flex flex-col overflow-hidden transition-all hover:shadow-md border"
            >
              {/* Thumbnail Image */}
              <div className="relative h-48 w-full bg-muted overflow-hidden">
                {blog.thumbnailImage ? (
                  <Image
                    src={blog.thumbnailImage}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <BookOpen className="size-10" />
                  </div>
                )}

                {/* Badges Overlay */}
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                  <Badge
                    variant={blog.variant === "EXTENDED" ? "default" : "secondary"}
                    className="text-[10px] uppercase font-bold"
                  >
                    {blog.variant}
                  </Badge>
                  {blog.isFeatured && (
                    <Badge className="bg-amber-500 hover:bg-amber-600 text-white gap-1 text-[10px]">
                      <Star className="size-2.5 fill-current" />
                      Featured
                    </Badge>
                  )}
                </div>

                <div className="absolute top-2.5 right-2.5">
                  {blog.isActive ? (
                    <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-[10px]">
                      <CheckCircle2 className="size-2.5" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-background/90 text-muted-foreground gap-1 text-[10px]">
                      <XCircle className="size-2.5" />
                      Draft
                    </Badge>
                  )}
                </div>
              </div>

              {/* Card Header & Body */}
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold line-clamp-1 group-hover:text-primary transition-colors">
                  {blog.title}
                </CardTitle>
                <CardDescription className="text-xs line-clamp-1 text-muted-foreground font-mono">
                  /{blog.slug}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 pb-3 text-xs text-muted-foreground space-y-3">
                <p className="line-clamp-2">{blog.shortDescription}</p>

                {/* Tags */}
                {blog.customTags && blog.customTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {blog.customTags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-muted px-2 py-0.5 rounded-sm text-[10px] text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                    {blog.customTags.length > 3 && (
                      <span className="text-[10px] text-muted-foreground self-center">
                        +{blog.customTags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Meta details */}
                <div className="flex items-center justify-between text-[11px] text-muted-foreground/80 pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    <span>
                      {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Layers className="size-3" />
                    <span>
                      {blog.variant === "EXTENDED"
                        ? `${blog.sections?.length ?? 0} sections`
                        : "Standard"}
                    </span>
                  </div>
                </div>
              </CardContent>

              {/* Actions Footer */}
              <CardFooter className="pt-2 pb-3 px-4 bg-muted/20 border-t flex items-center justify-between gap-2">
                <Link href={`/admin/blogs/${blog.id}`} className="flex-1">
                  <Button variant="outline" size="xs" className="w-full gap-1">
                    <Eye className="size-3.5" />
                    View
                  </Button>
                </Link>
                <Link href={`/admin/blogs/${blog.id}/edit`}>
                  <Button variant="secondary" size="xs" className="gap-1">
                    <Edit className="size-3.5" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(blog.id, blog.title)}
                  disabled={deleteBlog.isPending}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-xs text-muted-foreground">
            Showing Page <span className="font-semibold">{pagination.page}</span> of{" "}
            <span className="font-semibold">{pagination.totalPages}</span> ({pagination.total} total blogs)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="xs"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination.hasPrevPage}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={() => setPage((p) => p + 1)}
              disabled={!pagination.hasNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
