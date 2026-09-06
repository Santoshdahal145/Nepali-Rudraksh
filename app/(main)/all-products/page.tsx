import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ShieldCheck, Gem, Leaf, CheckCircle2, PackageSearch } from "lucide-react";
import { getPublicProductsData } from "@/server/product/public.data";
import { ProductType as ProductTypeEnum } from "@/server/product/product.schema";
import { ProductCard } from "./components/ProductCard";
import { ProductFilterBar } from "./components/ProductFilterBar";
import { ProductCategoryNav } from "./components/ProductCategoryNav";
import { ProductPagination } from "./components/ProductPagination";
import { Button } from "@/components/ui/button";

export const revalidate = 60; // ISR revalidate every 60 seconds

type PageProps = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    type?: string;
    mukhi?: string;
    originId?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;

  let title = "Sacred Himalayan Rudraksha Beads & Japa Malas | Nepali Rudraksh";
  let description =
    "Explore authentic 1 to 21 Mukhi Nepali Rudraksha beads, hand-knotted 108+1 Japa Malas, and lab-certified spiritual artifacts blessed at Pashupatinath Temple.";

  if (params.type === "INDIVIDUAL_RUDRAKSHA") {
    title = "Individual Himalayan Rudraksha Beads (1-21 Mukhi) | Nepali Rudraksh";
    description =
      "Browse certified individual Nepali Rudraksha beads with naturally formed Mukhi lines. Ethically harvested in Sankhuwasabha & Bhojpur.";
  } else if (params.type === "RUDRAKSHA_MALA") {
    title = "Hand-Knotted Sacred Rudraksha Japa Malas (108+1) | Nepali Rudraksh";
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

export default async function AllProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const page = params.page ? Math.max(1, parseInt(params.page, 10)) : 1;
  const limit = params.limit ? Math.max(1, parseInt(params.limit, 10)) : 12;
  const search = params.search?.trim();
  const type =
    params.type === "INDIVIDUAL_RUDRAKSHA" || params.type === "RUDRAKSHA_MALA"
      ? (params.type as ProductTypeEnum)
      : undefined;
  const mukhi = params.mukhi ? parseInt(params.mukhi, 10) : undefined;
  const originId = params.originId ? parseInt(params.originId, 10) : undefined;
  const sortBy =
    params.sortBy === "name" || params.sortBy === "price" || params.sortBy === "createdAt"
      ? params.sortBy
      : "createdAt";
  const sortOrder = params.sortOrder === "asc" ? "asc" : "desc";

  const data = await getPublicProductsData({
    page,
    limit,
    search,
    type,
    mukhi,
    originId,
    sortBy,
    sortOrder,
  });

  const { products, pagination } = data;

  const currentParamsRecord: Record<string, string | undefined> = {
    page: String(page),
    search,
    type,
    mukhi: mukhi ? String(mukhi) : undefined,
    originId: originId ? String(originId) : undefined,
    sortBy,
    sortOrder,
  };

  return (
    <main className="min-h-screen bg-[#faf7f2] pb-20 pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb & Header Banner */}
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#5c3a1e]/70">
            <Link href="/" className="hover:text-[#713f12] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#713f12] font-semibold">Sacred Collection</span>
          </div>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/70 border border-amber-900/15 px-2.5 py-0.5 rounded-full">
                  <Sparkles className="h-3 w-3 text-amber-700" />
                  Direct from Himalayan Groves
                </span>
                <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  ✓ Pashupatinath Consecrated
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#422006]">
                Authentic Himalayan Rudraksha
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[#5c3a1e]/80 max-w-2xl leading-relaxed">
                Every bead in our sacred sanctuary is 100% naturally formed, lab-certified,
                and energized according to Vedic rites at the holy Pashupatinath Temple in Kathmandu.
              </p>
            </div>

            <span className="text-xs font-bold text-[#713f12] bg-white border border-amber-900/15 px-4 py-2 rounded-xl shadow-2xs w-fit shrink-0">
              {pagination.total} {pagination.total === 1 ? "Sacred Bead" : "Sacred Beads & Malas"}
            </span>
          </div>
        </div>

        {/* Category Cards Navigation */}
        <ProductCategoryNav currentType={type} totalCount={pagination.total} />

        {/* Filter, Search & Sort Bar */}
        <ProductFilterBar
          initialSearch={search}
          initialSortBy={sortBy}
          initialSortOrder={sortOrder}
          initialMukhi={mukhi ? String(mukhi) : ""}
          totalFound={pagination.total}
        />

        {/* Products Display Grid */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-amber-900/20 bg-white p-12 sm:p-16 text-center shadow-xs">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100/70 text-[#713f12] mb-4">
              <PackageSearch className="h-8 w-8 text-[#713f12]" />
            </div>
            <h3 className="text-lg font-bold text-[#422006]">
              No Sacred Rudrakshas Match Your Search
            </h3>
            <p className="text-xs sm:text-sm text-[#5c3a1e]/75 mt-1.5 max-w-md">
              We couldn&apos;t find any beads matching your exact filters. Try adjusting your Mukhi
              selection, clearing the search term, or browsing all available categories.
            </p>
            <Link href="/all-products" className="mt-5">
              <Button className="h-10 rounded-xl bg-[#713f12] text-white hover:bg-[#5c3a1e] font-bold text-xs px-5 shadow-xs">
                View All Sacred Items
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <ProductPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
          currentParams={currentParamsRecord}
        />

        {/* Spiritual Guarantee & Trust Pillars */}
        <div className="rounded-3xl border border-amber-900/15 bg-gradient-to-br from-white via-amber-50/40 to-amber-100/30 p-6 sm:p-8 mt-12 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-[#713f12]">
                <ShieldCheck className="h-5 w-5 text-[#713f12]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#422006]">100% Genuine & Natural</h4>
                <p className="text-xs text-[#5c3a1e]/75 mt-1 leading-relaxed">
                  Every bead is tested for density and internal seed compartments with zero synthetic carving.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-[#713f12]">
                <Sparkles className="h-5 w-5 text-[#713f12]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#422006]">Pashupatinath Blessed</h4>
                <p className="text-xs text-[#5c3a1e]/75 mt-1 leading-relaxed">
                  Consecrated with authentic Shaivite rituals, Panchamrit snan, and personalized Beej mantras.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-[#713f12]">
                <Leaf className="h-5 w-5 text-[#713f12]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#422006]">Ethically Harvested</h4>
                <p className="text-xs text-[#5c3a1e]/75 mt-1 leading-relaxed">
                  Direct partnership with local indigenous farmers in Eastern Nepal hills supporting Himalayan communities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
