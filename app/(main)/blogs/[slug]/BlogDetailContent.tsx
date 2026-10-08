"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Star,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import { BlogType, SingleSectionType } from "@/app/types";
import { prepareSafeHtml } from "@/lib/sanititzeHtml";
import { SectionRenderer } from "@/components/SectionRenderer";
import BlogBreadcrumbs from "./BlogBreadcrumbs";
import { Button } from "@/components/ui/button";

interface BlogDetailContentProps {
  blog: BlogType;
}

export default function BlogDetailContent({ blog }: BlogDetailContentProps) {
  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  // Reading time estimate based on words
  const textContent = (blog.mainDescription || "") + (blog.shortDescription || "");
  const wordCount = textContent.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen w-full bg-[#faf7f2] pb-24 pt-4 sm:pt-6 md:pt-8">
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Breadcrumb Navigation with Share */}
        <BlogBreadcrumbs blog={blog} />

        {/* Article Header & Metadata */}
        <header className="space-y-4 sm:space-y-6">
          {/* Top badges bar */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#713f12]/10 border border-[#713f12]/20 px-3 py-1 text-xs font-bold text-[#713f12] uppercase tracking-wider">
              {blog.variant} Article
            </span>

            {blog.isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-600 px-3 py-1 text-xs font-bold text-white shadow-2xs">
                <Star className="size-3 fill-current" />
                Featured Guide
              </span>
            )}

            <div className="flex items-center gap-3 text-xs text-[#5c3a1e]/70 font-medium ml-auto">
              {formattedDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5 text-[#713f12]" />
                  {formattedDate}
                </span>
              )}
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5 text-[#713f12]" />
                {readingTime} min read
              </span>
            </div>
          </div>

          {/* Main H1 Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-[#422006] leading-[1.2]">
            {blog.title}
          </h1>

          {/* Short Excerpt Summary Box */}
          {blog.shortDescription && (
            <div className="rounded-2xl border-l-4 border-[#713f12] bg-[#f5ede2]/70 p-4 sm:p-5 shadow-2xs">
              <p className="text-sm sm:text-base text-[#5c3a1e]/90 font-medium leading-relaxed italic">
                &ldquo;{blog.shortDescription}&rdquo;
              </p>
            </div>
          )}
        </header>

        {/* Cover Hero Image */}
        {blog.thumbnailImage && (
          <div className="relative aspect-16/9 w-full overflow-hidden rounded-3xl bg-[#f3eee7] shadow-md border border-amber-900/10">
            <Image
              src={blog.thumbnailImage}
              alt={blog.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        {/* Primary Article Content (Rich Text) */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-900/10 shadow-xs space-y-6">
          <div
            className="prose prose-base sm:prose-lg max-w-none text-[#5c3a1e] leading-relaxed
              prose-headings:font-black prose-headings:text-[#422006] prose-headings:tracking-tight
              prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:border-b prose-h2:border-amber-900/10 prose-h2:pb-2
              prose-h3:text-xl sm:prose-h3:text-2xl
              prose-p:leading-relaxed prose-p:text-[#5c3a1e]/90
              prose-strong:text-[#422006] prose-strong:font-bold
              prose-a:text-[#713f12] prose-a:underline hover:prose-a:text-[#b45309]
              prose-blockquote:border-l-[#713f12] prose-blockquote:text-[#5c3a1e]
              prose-img:rounded-2xl prose-img:shadow-md"
            dangerouslySetInnerHTML={{
              __html: prepareSafeHtml(blog.mainDescription),
            }}
          />
        </section>

        {/* Modular Structured Content Sections — ONLY visible for EXTENDED articles */}
        {blog.variant === "EXTENDED" && blog.sections && blog.sections.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-amber-900/15 pb-3">
              <Sparkles className="size-5 text-[#713f12]" />
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#422006]">
                Deeper Vedic Insights
              </h2>
            </div>

            <div className="space-y-6">
              {blog.sections.map((section: SingleSectionType, index: number) => (
                <div
                  key={section.id || index}
                  className="rounded-3xl border border-amber-900/15 bg-white p-5 sm:p-8 shadow-xs overflow-hidden"
                >
                  <SectionRenderer section={section} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sacred Authenticity & Consecration Card */}
        <section className="rounded-3xl bg-linear-to-br from-[#422006] via-[#5c3a1e] to-[#713f12] p-6 sm:p-8 text-white shadow-lg space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-amber-200">
                Pashupatinath Consecrated Wisdom
              </h3>
              <p className="text-xs text-amber-100/70">
                Certified Himalayan Rudraksha Purveyors
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-amber-50/85 leading-relaxed">
            All spiritual information and Mukhi descriptions published by Nepali Rudraksh are cross-verified against classical Vedic scriptures, including the Shiva Purana, Padma Purana, and Srimad Devi Bhagavatam.
          </p>
        </section>

        {/* Tags & Return Footer */}
        <footer className="pt-4 border-t border-amber-900/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {blog.customTags && blog.customTags.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-[#5c3a1e]/70 mr-1">
                Topics:
              </span>
              {blog.customTags.map((tag, i) => (
                <Link
                  key={i}
                  href={`/blogs?search=${encodeURIComponent(tag)}`}
                  className="rounded-lg bg-white border border-amber-900/15 px-2.5 py-1 text-xs font-medium text-[#713f12] hover:bg-amber-50 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          ) : (
            <div />
          )}

          <Link href="/blogs">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl border-amber-900/20 text-[#713f12] hover:bg-amber-50 font-bold"
            >
              <ArrowLeft className="size-4" />
              <span>All Articles</span>
            </Button>
          </Link>
        </footer>
      </main>
    </div>
  );
}
