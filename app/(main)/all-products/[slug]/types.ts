import { ProductType, ProductVariantType, ProductImageType } from "@/app/types";

export type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export interface MukhiVedicInfo {
  mukhi: number;
  deity: string;
  planet: string;
  beejMantra: string;
  benefits: string[];
  recommendedChant: string;
}

export interface GalleryImageItem {
  id?: number;
  url: string;
  altText?: string | null;
  position?: number;
  isVariantImage: boolean;
  variantId?: number;
  variant?: ProductVariantType;
  label?: string;
  variantSize?: number;
  variantBeadCount?: number;
}

export interface ProductDetailHookReturn {
  selectedVariant: ProductVariantType | null;
  setSelectedVariant: (variant: ProductVariantType) => void;
  handleSelectVariant: (variant: ProductVariantType) => void;
  galleryImages: GalleryImageItem[];
  activeImage: GalleryImageItem | undefined;
  activeImageIndex: number;
  handleSelectGalleryImage: (index: number) => void;
  quantity: number;
  increaseQuantity: () => void;
  decreaseQuantity: () => void;
  setQuantity: (qty: number) => void;
  isInStock: boolean;
  isLowStock: boolean;
  stockCount: number;
  currentPrice: number;
  isAddingToCart: boolean;
  handleAddToCart: () => Promise<void>;
  handleBuyNow: () => Promise<void>;
  handleShare: () => void;
}
