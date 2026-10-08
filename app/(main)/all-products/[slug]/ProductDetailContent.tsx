"use client";

import { ProductType } from "@/app/types";
import ProductBreadcrumbs from "./ProductBreadcrumbs";
import ProductImageGallery from "./ProductImageGallery";
import ProductPurchaseCard from "./ProductPurchaseCard";
import ProductSpecifications from "./ProductSpecifications";
import ProductTrustBanner from "./ProductTrustBanner";
import { useProductDetail } from "./useProductDetail";

interface ProductDetailContentProps {
  product: ProductType;
}

export default function ProductDetailContent({
  product,
}: ProductDetailContentProps) {
  const detail = useProductDetail(product);

  const mukhi =
    product.individualRudrakshaDetail?.mukhi ??
    product.rudrakshaMalaDetail?.mukhi;

  const variants = product.productVariants ?? [];

  return (
    <div className="min-h-screen w-full bg-[#faf7f2] pb-24 pt-4 sm:pt-6 md:pt-8">
      <main className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        <ProductBreadcrumbs product={product} onShare={detail.handleShare} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5 w-full">
            <ProductImageGallery
              productName={product.name}
              mukhi={mukhi}
              selectedVariant={detail.selectedVariant}
              galleryImages={detail.galleryImages}
              activeImage={detail.activeImage}
              activeImageIndex={detail.activeImageIndex}
              onSelectImage={detail.handleSelectGalleryImage}
            />
          </div>
          <div className="lg:col-span-7 w-full">
            <ProductPurchaseCard
              product={product}
              variants={variants}
              selectedVariant={detail.selectedVariant}
              onSelectVariant={detail.handleSelectVariant}
              quantity={detail.quantity}
              onIncreaseQuantity={detail.increaseQuantity}
              onDecreaseQuantity={detail.decreaseQuantity}
              currentPrice={detail.currentPrice}
              isAddingToCart={detail.isAddingToCart}
              onAddToCart={detail.handleAddToCart}
              onBuyNow={detail.handleBuyNow}
            />
          </div>
        </div>

        <ProductSpecifications
          product={product}
          selectedVariant={detail.selectedVariant}
        />

        <ProductTrustBanner />
      </main>
    </div>
  );
}
