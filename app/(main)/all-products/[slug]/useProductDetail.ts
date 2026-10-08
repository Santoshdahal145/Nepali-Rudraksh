"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProductType, ProductVariantType } from "@/app/types";
import useCart from "@/hooks/tanstack-hooks/useCart";
import { ProductDetailHookReturn, GalleryImageItem } from "./types";

export function useProductDetail(product: ProductType): ProductDetailHookReturn {
  const router = useRouter();
  const { addToCart, isAdding } = useCart();

  const variants = useMemo(() => product.productVariants ?? [], [product]);

  // Initial selected variant: prefer first variant with stock > 0, otherwise first variant
  const initialVariant = useMemo(() => {
    if (variants.length === 0) return null;
    const inStock = variants.find((v) => v.stock > 0);
    return inStock ?? variants[0];
  }, [variants]);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariantType | null>(
    initialVariant
  );

  // Gallery images: Include ALL product images AND ALL variant images across all variants
  const galleryImages = useMemo<GalleryImageItem[]>(() => {
    const list: GalleryImageItem[] = [];
    const seenUrls = new Set<string>();

    // 1. Add ALL product main images first (sorted by position)
    const productImgs = (product.productImages ?? [])
      .slice()
      .sort((a, b) => a.position - b.position);

    productImgs.forEach((img) => {
      if (img.url && !seenUrls.has(img.url)) {
        seenUrls.add(img.url);
        list.push({
          id: img.id,
          url: img.url,
          altText: img.altText || product.name,
          position: img.position,
          isVariantImage: false,
          label: "Product Image",
        });
      }
    });

    // 2. Add ALL variant images across ALL variants
    variants.forEach((v) => {
      const vImages = (v.variantImages ?? [])
        .slice()
        .sort((a, b) => a.position - b.position);

      const size = v.individualVariantAttrs?.size;
      const beadCount = v.malaVariantAttrs?.beadCount;
      const originName = v.origin?.name;

      const variantLabel = size
        ? `${size}mm${originName ? ` (${originName})` : ""}`
        : beadCount
        ? `${beadCount} Beads`
        : `SKU: ${v.sku}`;

      vImages.forEach((img) => {
        if (img.url && !seenUrls.has(img.url)) {
          seenUrls.add(img.url);
          list.push({
            id: img.id,
            url: img.url,
            altText: img.altText || `${product.name} - ${variantLabel}`,
            position: img.position,
            isVariantImage: true,
            variantId: v.id,
            variant: v,
            label: variantLabel,
            variantSize: size,
            variantBeadCount: beadCount ?? undefined,
          });
        }
      });
    });

    return list;
  }, [product.productImages, product.name, variants]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Make sure activeImageIndex doesn't exceed bounds
  const safeActiveIndex =
    activeImageIndex >= galleryImages.length ? 0 : activeImageIndex;
  const activeImage = galleryImages[safeActiveIndex];

  // Handler for selecting an image from the gallery
  // If a variant image is clicked -> automatically select that variant!
  // If a product image is clicked -> do NOT change the selected variant!
  const handleSelectGalleryImage = useCallback(
    (index: number) => {
      setActiveImageIndex(index);
      const item = galleryImages[index];
      if (!item) return;

      if (item.isVariantImage && item.variant) {
        setSelectedVariant(item.variant);
      }
    },
    [galleryImages]
  );

  // Handler for selecting a variant from card / modal
  // Also synchronizes the active gallery image to that variant's image if available
  const handleSelectVariant = useCallback(
    (variant: ProductVariantType) => {
      setSelectedVariant(variant);

      // Find first image for this variant in gallery
      const variantImgIndex = galleryImages.findIndex(
        (img) => img.isVariantImage && img.variantId === variant.id
      );

      if (variantImgIndex !== -1) {
        setActiveImageIndex(variantImgIndex);
      }
    },
    [galleryImages]
  );

  // Quantity Management
  const [quantity, setQuantityState] = useState(1);
  const stockCount = selectedVariant?.stock ?? 0;
  const isInStock = stockCount > 0;
  const isLowStock = isInStock && stockCount <= 5;
  const currentPrice = selectedVariant?.price ?? 0;

  const setQuantity = useCallback(
    (qty: number) => {
      if (!isInStock) {
        setQuantityState(1);
        return;
      }
      const clamped = Math.max(1, Math.min(qty, stockCount));
      setQuantityState(clamped);
    },
    [isInStock, stockCount]
  );

  const increaseQuantity = useCallback(() => {
    if (quantity < stockCount) {
      setQuantityState((prev) => prev + 1);
    } else {
      toast.warning(`Maximum available stock is ${stockCount} units.`);
    }
  }, [quantity, stockCount]);

  const decreaseQuantity = useCallback(() => {
    setQuantityState((prev) => Math.max(1, prev - 1));
  }, []);

  // Cart actions
  const handleAddToCart = useCallback(async () => {
    if (!selectedVariant) {
      toast.error("Please select a product variant.");
      return;
    }

    if (!isInStock) {
      toast.error("This variant is currently out of stock.");
      return;
    }

    try {
      await addToCart(selectedVariant.id, quantity);
      toast.success(
        `Added ${quantity} × ${product.name} to your sacred cart.`
      );
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Could not add item to cart. Please try again.");
    }
  }, [selectedVariant, isInStock, addToCart, quantity, product.name]);

  const handleBuyNow = useCallback(async () => {
    if (!selectedVariant) {
      toast.error("Please select a product variant.");
      return;
    }

    if (!isInStock) {
      toast.error("This variant is currently out of stock.");
      return;
    }

    try {
      await addToCart(selectedVariant.id, quantity);
      router.push("/cart");
    } catch (error) {
      console.error("Buy now error:", error);
      toast.error("Could not proceed to cart. Please try again.");
    }
  }, [selectedVariant, isInStock, addToCart, quantity, router]);

  // Share action
  const handleShare = useCallback(() => {
    if (typeof window !== "undefined") {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          toast.success("Sacred product link copied to clipboard!");
        })
        .catch(() => {
          toast.info(window.location.href);
        });
    }
  }, []);

  return {
    selectedVariant,
    setSelectedVariant,
    handleSelectVariant,
    galleryImages,
    activeImage,
    activeImageIndex: safeActiveIndex,
    handleSelectGalleryImage,
    quantity,
    increaseQuantity,
    decreaseQuantity,
    setQuantity,
    isInStock,
    isLowStock,
    stockCount,
    currentPrice,
    isAddingToCart: isAdding,
    handleAddToCart,
    handleBuyNow,
    handleShare,
  };
}
