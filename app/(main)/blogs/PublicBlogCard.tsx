import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Calendar, Star, Sparkles, BookOpen } from "lucide-react";
import { BlogType } from "@/app/types";

interface PublicBlogCardProps {
  blog: BlogType;
}

export default function PublicBlogCard({ blog }: PublicBlogCardProps) {
  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <article className="group flex flex-col min-w-0 transition-all">
      {/* Thumbnail Container */}
      <Link
        href={`/blogs/${blog.slug}`}
        className="relative block overflow-hidden rounded-2xl bg-[#f3eee7] aspect-16/10 w-full"
      >
        {blog.thumbnailImage ? (
          <Image
            src={blog.thumbnailImage}
            alt={blog.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-[#5c3a1e]/40">
            <BookOpen className="size-8" />
          </div>
        )}

        {/* Badges on Thumbnail */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {blog.isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-600/95 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs backdrop-blur-xs">
              <Star className="size-2.5 fill-current" />
              Featured
            </span>
          )}
          <span className="inline-flex items-center rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-xs uppercase tracking-wider">
            {blog.variant}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="pt-3 sm:pt-4 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1.5">
          {/* Metadata row */}
          <div className="flex items-center gap-2 text-[11px] text-[#5c3a1e]/60 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="size-3 text-[#713f12]" />
              {formattedDate}
            </span>
            {blog.variant === "EXTENDED" &&
              blog.sections &&
              blog.sections.length > 0 && (
                <>
                  <span>•</span>
                  <span>{blog.sections.length} insights</span>
                </>
              )}
          </div>

          {/* Title */}
          <Link href={`/blogs/${blog.slug}`} className="block">
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-[#422006] transition-colors group-hover:text-[#713f12] line-clamp-2 leading-snug">
              {blog.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-xs sm:text-sm text-[#5c3a1e]/75 line-clamp-2 leading-relaxed">
            {blog.shortDescription}
          </p>
        </div>

        {/* Footer: Tags and Read Link */}
        <div className="pt-2 flex items-center justify-between border-t border-amber-900/10 text-xs">
          {blog.customTags && blog.customTags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {blog.customTags.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-md bg-amber-900/5 px-2 py-0.5 text-[10px] font-medium text-[#713f12]"
                >
                  #{tag}
                </span>
              ))}
              {blog.customTags.length > 2 && (
                <span className="text-[10px] text-[#5c3a1e]/60">
                  +{blog.customTags.length - 2}
                </span>
              )}
            </div>
          ) : (
            <div />
          )}

          <Link
            href={`/blogs/${blog.slug}`}
            className="inline-flex items-center gap-0.5 text-xs font-bold text-[#713f12] group-hover:text-[#b45309] transition-colors ml-auto"
          >
            <span>Read Article</span>
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
