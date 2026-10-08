import { Metadata } from "next";
import { querySetter } from "./querySetter";
import {
  AllBlogsPublicResponseType,
  AllBlogsSearchParamsPublic,
} from "./types";
import BlogsPageError from "./BlogsPageError";
import BlogsEmptyState from "./BlogsEmptyState";
import PageContent from "./PageContent";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: AllBlogsSearchParamsPublic;
}): Promise<Metadata> {
  const params = await searchParams;

  let title = "Sacred Himalayan Rudraksha Articles & Vedic Wisdom | Nepali Rudraksh";
  let description =
    "Read comprehensive guides on Nepali Rudraksha bead mukhis, astrological significance, Shiva Purana references, consecration rituals, and mantra sadhana.";

  if (params.search) {
    title = `Search Results for "${params.search}" | Sacred Rudraksha Articles`;
  }

  return {
    title,
    description,
    keywords: [
      "Rudraksha Articles",
      "Vedic Knowledge",
      "Mukhi Guides",
      "Shiva Purana Rudraksha",
      "Pashupatinath Consecration",
      "Spiritual Bead Wisdom",
      "Nepali Rudraksh Blog",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Nepali Rudraksh",
    },
  };
}

export default async function AllBlogsPage({
  searchParams,
}: {
  searchParams: AllBlogsSearchParamsPublic;
}) {
  const params = await searchParams;
  const queryParams = querySetter(params);

  let response: AllBlogsPublicResponseType | undefined;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const endpoint = `${baseUrl}/api/blogs/public?${queryParams.toString()}`;

  try {
    const fetchResponse = await fetch(endpoint, {
      next: { revalidate: 60, tags: ["blogs"] },
      headers: {
        Accept: "application/json",
      },
    });

    if (fetchResponse.ok) {
      response = await fetchResponse.json();
    }
  } catch (error) {
    console.error("Error fetching public blogs:", error);
  }

  if (!response) {
    return <BlogsPageError />;
  }

  const blogs = response?.blogs || [];

  if (blogs.length === 0 && !params.search) {
    return <BlogsEmptyState hasSearch={false} />;
  }

  return (
    <PageContent
      blogs={blogs}
      pagination={response.pagination}
      searchParams={params}
    />
  );
}
