import { querySetter } from "./querySetter";
import {
  AllProductsPublicResponseType,
  AllProductsSearchParamsPublic,
} from "./types";
import { Metadata } from "next";
import AllProductsPageError from "./AllProductsPageError";
import AllProductsFilterEmpty from "./AllProductsFilterEmpty";
import PageContent from "./PageContent";

//META DATA FUNCTION

export async function generateMetadata({
  searchParams,
}: {
  searchParams: AllProductsSearchParamsPublic;
}): Promise<Metadata> {
  const params = await searchParams;

  let title = "Sacred Himalayan Rudraksha Beads & Japa Malas | Nepali Rudraksh";
  let description =
    "Explore authentic 1 to 21 Mukhi Nepali Rudraksha beads, hand-knotted 108+1 Japa Malas, and lab-certified spiritual artifacts blessed at Pashupatinath Temple.";

  if (params.type === "INDIVIDUAL_RUDRAKSHA") {
    title =
      "Individual Himalayan Rudraksha Beads (1-21 Mukhi) | Nepali Rudraksh";
    description =
      "Browse certified individual Nepali Rudraksha beads with naturally formed Mukhi lines. Ethically harvested in Sankhuwasabha & Bhojpur.";
  } else if (params.type === "RUDRAKSHA_MALA") {
    title =
      "Hand-Knotted Sacred Rudraksha Japa Malas (108+1) | Nepali Rudraksh";
    description =
      "Authentic Nepali Rudraksha Japa Malas crafted with silk cord for meditation, mantra chanting, and Shiva sadhana.";
  }

  if (params.search) {
    title = `Search Results for "${params.search}" | Nepali Rudraksh`;
  }

  return {
    title,
    description,
    keywords: [
      "Nepali Rudraksha",
      "Pashupatinath Rudraksha",
      "Authentic Rudraksha beads",
      "1 Mukhi to 21 Mukhi",
      "Japa Mala 108",
      "Consecrated Rudraksha",
      "Nepal Certified",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Nepali Rudraksh",
    },
  };
}

export default async function AllProductsPage({
  searchParams,
}: {
  searchParams: AllProductsSearchParamsPublic;
}) {
  const params = await searchParams;

  const queryParams = querySetter(params);

  let response: AllProductsPublicResponseType | undefined;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const endpoint = `${baseUrl}/api/products/public?${queryParams.toString()}`;

  try {
    const fetchResponse = await fetch(endpoint, {
      next: { revalidate: 60, tags: ["products"] },
      headers: {
        Accept: "application/json",
      },
    });

    if (fetchResponse.ok) {
      response = await fetchResponse.json();
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  if (!response) {
    return <AllProductsPageError />;
  }

  const products = response.products || [];

  if (products.length === 0) {
    return <AllProductsFilterEmpty />;
  }

  return (
    <PageContent
      products={products}
      pagination={response.pagination}
      searchParams={params}
    />
  );
}
