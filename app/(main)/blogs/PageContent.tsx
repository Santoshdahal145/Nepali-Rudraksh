"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Home } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Pagination } from "@/components/ui/pagination";
import { BlogType, PaginationType } from "@/app/types";
import PublicBlogsHeader from "./PublicBlogsHeader";
import PublicBlogSearch from "./PublicBlogSearch";
import PublicBlogCard from "./PublicBlogCard";
import BlogsEmptyState from "./BlogsEmptyState";
import { AllBlogsSearchParamsPublic } from "./types";

interface PageContentProps {
  blogs: BlogType[];
  pagination: PaginationType;
  searchParams: Awaited<AllBlogsSearchParamsPublic>;
}

export default function PageContent({
  blogs,
  pagination,
  searchParams,
}: PageContentProps) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();

  const navigateToPage = (newPage: number) => {
    const params = new URLSearchParams(currentSearchParams.toString());
    params.set("page", String(newPage));
    router.push(`/blogs?${params.toString()}`);
  };

  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
      icon: <Home className="h-3.5 w-3.5" />,
    },
    {
      label: "Articles & Wisdom",
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf7f2] pb-24">
      {/* Top Banner and Breadcrumb Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-amber-900/10 pb-6 sm:pb-8">
          <PublicBlogsHeader />
          <PublicBlogSearch initialSearch={searchParams.search} />
        </div>

        {/* Blog Cards Grid */}
        {blogs.length === 0 ? (
          <BlogsEmptyState hasSearch={Boolean(searchParams.search)} />
        ) : (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {blogs.map((blog) => (
                <PublicBlogCard key={blog.id} blog={blog} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="pt-6 border-t border-amber-900/10">
                <Pagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  hasNextPage={pagination.hasNextPage}
                  hasPrevPage={pagination.hasPrevPage}
                  onPageChange={navigateToPage}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
