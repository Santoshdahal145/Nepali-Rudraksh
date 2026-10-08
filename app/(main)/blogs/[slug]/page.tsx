import { Metadata } from "next";
import { BlogType } from "@/app/types";
import BlogDetailPageError from "./BlogDetailPageError";
import BlogDetailContent from "./BlogDetailContent";
import { BlogDetailPageProps } from "./types";

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/blogs/public/${slug}`, {
      next: { revalidate: 60, tags: ["blogs", `blog-${slug}`] },
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const blog: BlogType = await res.json();
      const title = `${blog.title} | Nepali Rudraksh`;
      const description =
        blog.shortDescription ||
        "Authentic Vedic knowledge, scripture citations, and sacred Rudraksha insights blessed at Pashupatinath Temple.";

      return {
        title,
        description,
        keywords: [
          blog.title,
          ...(blog.customTags || []),
          "Rudraksha Articles",
          "Vedic Insights",
          "Shiva Purana",
          "Pashupatinath Consecrated",
          "Nepali Rudraksh",
        ],
        openGraph: {
          title,
          description,
          type: "article",
          siteName: "Nepali Rudraksh",
          images: blog.thumbnailImage
            ? [{ url: blog.thumbnailImage, alt: blog.title }]
            : undefined,
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: blog.thumbnailImage ? [blog.thumbnailImage] : undefined,
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata for blog slug:", slug, error);
  }

  return {
    title: "Sacred Article | Nepali Rudraksh",
    description: "Explore authentic Vedic knowledge and Rudraksha insights.",
  };
}

export default async function SingleBlogPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;

  let blog: BlogType | undefined;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const endpoint = `${baseUrl}/api/blogs/public/${slug}`;

  try {
    const fetchResponse = await fetch(endpoint, {
      next: { revalidate: 60, tags: ["blogs", `blog-${slug}`] },
      headers: {
        Accept: "application/json",
      },
    });

    if (fetchResponse.ok) {
      blog = await fetchResponse.json();
    }
  } catch (error) {
    console.error(`Error fetching blog by slug "${slug}":`, error);
  }

  if (!blog) {
    return <BlogDetailPageError slug={slug} />;
  }

  return <BlogDetailContent blog={blog} />;
}
