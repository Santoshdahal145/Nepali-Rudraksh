"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Home, Share2, Check } from "lucide-react";
import { BlogType } from "@/app/types";

interface BlogBreadcrumbsProps {
  blog: BlogType;
}

export default function BlogBreadcrumbs({ blog }: BlogBreadcrumbsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.shortDescription,
          url: window.location.href,
        });
        return;
      } catch (err) {
        // User aborted share or fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Article link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
      icon: <Home className="h-3.5 w-3.5" />,
    },
    {
      label: "Articles & Wisdom",
      href: "/blogs",
    },
    {
      label: blog.title,
    },
  ];

  const rightActions = (
    <button
      type="button"
      onClick={handleShare}
      title="Share this sacred article"
      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-900/15 bg-white px-2.5 py-1 text-xs font-semibold text-[#5c3a1e] shadow-2xs transition-all hover:border-amber-900/30 hover:bg-amber-50/50 hover:text-[#713f12] active:scale-95 cursor-pointer"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-600" />
      ) : (
        <Share2 className="h-3.5 w-3.5" />
      )}
      <span className="hidden sm:inline">
        {copied ? "Copied" : "Share"}
      </span>
    </button>
  );

  return (
    <Breadcrumbs
      items={breadcrumbItems}
      rightContent={rightActions}
      className="border-b border-amber-900/10 pb-4"
    />
  );
}
