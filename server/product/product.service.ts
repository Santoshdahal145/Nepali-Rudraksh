import { db } from "../../src/prisma/db";
import {
  CreateProductInput,
  UpdateProductInput,
  CreateProductVariantInput,
  UpdateProductVariantInput,
  GetProductsQueryInput,
  GetFeaturedProductsQueryInput,
  GetTopSellingProductsQueryInput,
} from "./product.schema";

// ── Helpers ───────────────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Fetch products for public listing with pagination, filtering, and sorting
 */
export async function getAllProductsPublic(
  params: GetProductsQueryInput = {
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
) {
  const {
    page = 1,
    limit = 20,
    search,
    type,
    originId,
    minPrice,
    maxPrice,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const offset = (page - 1) * limit;

  let collection = db.orm.public.Product.include("individualRudrakshaDetail")
    .include("rudrakshaMalaDetail")
    .include("productImages", (img) => img.orderBy((i) => i.position.asc()))
    .include("productVariants", (pv) =>
      pv
        .include("individualVariantAttrs")
        .include("malaVariantAttrs")
        .include("origin")
        .include("variantImages", (vi) => vi.orderBy((i) => i.position.asc())),
    );

  if (type) {
    collection = collection.where({ type });
  }

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    collection = collection.where((p) => p.name.ilike(term));
  }

  if (sortBy === "name") {
    collection = collection.orderBy((p) =>
      sortOrder === "asc" ? p.name.asc() : p.name.desc(),
    );
  } else {
    collection = collection.orderBy((p) =>
      sortOrder === "asc" ? p.createdAt.asc() : p.createdAt.desc(),
    );
  }

  let products = await collection.all();

  // Relational filters
  if (originId !== undefined) {
    products = products.filter((p) =>
      p.productVariants?.some((v) => v.originId === originId),
    );
  }

  if (params.mukhi !== undefined) {
    products = products.filter((p) => {
      if (p.type === "INDIVIDUAL_RUDRAKSHA") {
        return p.individualRudrakshaDetail?.mukhi === params.mukhi;
      }
      if (p.type === "RUDRAKSHA_MALA") {
        return p.rudrakshaMalaDetail?.mukhi === params.mukhi;
      }
      return false;
    });
  }

  if (minPrice !== undefined) {
    products = products.filter((p) =>
      p.productVariants?.some((v) => Number(v.price) >= minPrice),
    );
  }

  if (maxPrice !== undefined) {
    products = products.filter((p) =>
      p.productVariants?.some((v) => Number(v.price) <= maxPrice),
    );
  }

  if (sortBy === "price") {
    products.sort((a, b) => {
      const getMinPrice = (p: typeof a) => {
        if (!p.productVariants || p.productVariants.length === 0) return 0;
        return Math.min(...p.productVariants.map((v) => Number(v.price) || 0));
      };
      const priceA = getMinPrice(a);
      const priceB = getMinPrice(b);
      return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
    });
  }

  const total = products.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginatedProducts = products.slice(offset, offset + limit);

  return {
    products: paginatedProducts,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

/**
 * Fetch a single product by unique slug
 */
export async function getSingleProductBySlug(slug: string) {
  const product = await db.orm.public.Product.where({ slug })
    .include("individualRudrakshaDetail")
    .include("rudrakshaMalaDetail")
    .include("productImages", (img) => img.orderBy((i) => i.position.asc()))
    .include("productVariants", (pv) =>
      pv
        .include("individualVariantAttrs")
        .include("malaVariantAttrs")
        .include("origin")
        .include("variantImages", (vi) => vi.orderBy((i) => i.position.asc())),
    )
    .first();

  return product;
}

/**
 * Fetch similar products based on the current product's slug
 * Prioritizes products with the same type and closest mukhi, excluding the current product
 */
export async function getSimilarProductsAccordingToCurrentSlug(
  slug: string,
  limit: number = 4,
) {
  const currentProduct = await getSingleProductBySlug(slug);
  if (!currentProduct) {
    return [];
  }

  const allProducts = await db.orm.public.Product.include("individualRudrakshaDetail")
    .include("rudrakshaMalaDetail")
    .include("productImages", (img) => img.orderBy((i) => i.position.asc()))
    .include("productVariants", (pv) =>
      pv
        .include("individualVariantAttrs")
        .include("malaVariantAttrs")
        .include("origin")
        .include("variantImages", (vi) => vi.orderBy((i) => i.position.asc())),
    )
    .orderBy((p) => p.createdAt.desc())
    .all();

  // Exclude current product
  const otherProducts = allProducts.filter((p) => p.id !== currentProduct.id);

  const currentMukhi =
    currentProduct.type === "INDIVIDUAL_RUDRAKSHA"
      ? currentProduct.individualRudrakshaDetail?.mukhi
      : currentProduct.rudrakshaMalaDetail?.mukhi;

  // Rank products:
  // 1. Same product type
  // 2. Proximity in mukhi count (if available)
  // 3. Newest first (already ordered by createdAt desc)
  const sorted = [...otherProducts].sort((a, b) => {
    const aTypeMatch = a.type === currentProduct.type ? 1 : 0;
    const bTypeMatch = b.type === currentProduct.type ? 1 : 0;
    if (aTypeMatch !== bTypeMatch) {
      return bTypeMatch - aTypeMatch;
    }

    if (currentMukhi !== undefined && currentMukhi !== null) {
      const aMukhi =
        a.type === "INDIVIDUAL_RUDRAKSHA"
          ? a.individualRudrakshaDetail?.mukhi
          : a.rudrakshaMalaDetail?.mukhi;
      const bMukhi =
        b.type === "INDIVIDUAL_RUDRAKSHA"
          ? b.individualRudrakshaDetail?.mukhi
          : b.rudrakshaMalaDetail?.mukhi;

      const aDiff = aMukhi != null ? Math.abs(aMukhi - currentMukhi) : 999;
      const bDiff = bMukhi != null ? Math.abs(bMukhi - currentMukhi) : 999;

      if (aDiff !== bDiff) {
        return aDiff - bDiff;
      }
    }

    return 0;
  });

  return sorted.slice(0, limit);
}

/**
 * Fetch featured products for the storefront.
 * Can filter by product type and limit the result count (default: 8).
 */
export async function getFeaturedProducts(
  params: GetFeaturedProductsQueryInput = { limit: 8 },
) {
  const limit = params.limit && params.limit > 0 ? params.limit : 8;

  let collection = db.orm.public.Product
    .include("individualRudrakshaDetail")
    .include("rudrakshaMalaDetail")
    .include("productImages", (img) => img.orderBy((i) => i.position.asc()))
    .include("productVariants", (pv) =>
      pv
        .include("individualVariantAttrs")
        .include("malaVariantAttrs")
        .include("origin")
        .include("variantImages", (vi) => vi.orderBy((i) => i.position.asc())),
    )
    .orderBy((p) => p.createdAt.desc());

  if (params.type) {
    collection = collection.where({ type: params.type });
  }

  const products = await collection.all();
  return products.slice(0, limit);
}

/**
 * Fetch top selling products based on order volumes, falling back to newest products.
 * Limits the result count (default: 4).
 */
export async function getTopSellingProducts(
  params: GetTopSellingProductsQueryInput = { limit: 4 },
) {
  const limit = params.limit && params.limit > 0 ? params.limit : 4;

  const allProducts = await db.orm.public.Product
    .include("individualRudrakshaDetail")
    .include("rudrakshaMalaDetail")
    .include("productImages", (img) => img.orderBy((i) => i.position.asc()))
    .include("productVariants", (pv) =>
      pv
        .include("individualVariantAttrs")
        .include("malaVariantAttrs")
        .include("origin")
        .include("variantImages", (vi) => vi.orderBy((i) => i.position.asc())),
    )
    .orderBy((p) => p.createdAt.desc())
    .all();

  // Aggregate sales count from OrderItems
  const salesByVariant = new Map<number, number>();
  const salesByName = new Map<string, number>();

  try {
    const orderItems = await db.orm.public.OrderItem.all();
    for (const item of orderItems) {
      if (item.variantId) {
        salesByVariant.set(
          item.variantId,
          (salesByVariant.get(item.variantId) || 0) + (item.quantity || 1),
        );
      }
      if (item.productName) {
        const key = item.productName.trim().toLowerCase();
        salesByName.set(
          key,
          (salesByName.get(key) || 0) + (item.quantity || 1),
        );
      }
    }
  } catch (err) {
    console.warn("Could not query OrderItems for top selling products:", err);
  }

  const productsWithSales = allProducts.map((prod) => {
    let totalSales = 0;
    if (prod.productVariants) {
      for (const variant of prod.productVariants) {
        totalSales += salesByVariant.get(variant.id) || 0;
      }
    }
    const nameSales = salesByName.get(prod.name.trim().toLowerCase()) || 0;
    const finalSales = Math.max(totalSales, nameSales);

    return {
      product: prod,
      salesCount: finalSales,
    };
  });

  // Sort primarily by salesCount desc, secondary by createdAt desc
  productsWithSales.sort((a, b) => {
    if (b.salesCount !== a.salesCount) {
      return b.salesCount - a.salesCount;
    }
    return (
      new Date(b.product.createdAt).getTime() -
      new Date(a.product.createdAt).getTime()
    );
  });

  return productsWithSales.slice(0, limit).map((item) => item.product);
}

/**
 * Admin: Fetch all products
 */
export async function getAllProductsAdmin(
  params: GetProductsQueryInput = {
    page: 1,
    limit: 50,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
) {
  return await getAllProductsPublic(params);
}

/**
 * Admin: Fetch single product by ID
 */
export async function getSingleProductById(id: number) {
  const product = await db.orm.public.Product.where({ id })
    .include("individualRudrakshaDetail")
    .include("rudrakshaMalaDetail")
    .include("productImages", (img) => img.orderBy((i) => i.position.asc()))
    .include("productVariants", (pv) =>
      pv
        .include("individualVariantAttrs")
        .include("malaVariantAttrs")
        .include("origin")
        .include("variantImages", (vi) => vi.orderBy((i) => i.position.asc())),
    )
    .first();

  return product;
}

/**
 * Admin Step 1: Create a new Product first
 * Handles product metadata, type details, and product images
 */
export async function createProduct(input: CreateProductInput) {
  let slug = input.slug ? slugify(input.slug) : slugify(input.name);

  // Ensure unique slug
  const existingProductWithSlug = await db.orm.public.Product.where({
    slug,
  }).first();
  if (existingProductWithSlug) {
    if (input.slug) {
      throw new Error(`Product with slug "${slug}" already exists`);
    }
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  // Create product and its immediate details inside transaction
  const createdId = await db.transaction(async (tx) => {
    // 1. Create main Product
    const product = await tx.orm.public.Product.create({
      name: input.name,
      slug,
      description: input.description,
      type: input.type,
    });

    // 2. Create type-specific detail
    if (input.type === "INDIVIDUAL_RUDRAKSHA" && input.individualDetail) {
      await tx.orm.public.IndividualRudrakshaDetail.create({
        productId: product.id,
        mukhi: input.individualDetail.mukhi,
      });
    } else if (input.type === "RUDRAKSHA_MALA" && input.malaDetail) {
      await tx.orm.public.RudrakshaMalaDetail.create({
        productId: product.id,
        mukhi: input.malaDetail.mukhi ?? null,
      });
    }

    // 3. Create Product Images if provided
    if (input.images && input.images.length > 0) {
      for (let i = 0; i < input.images.length; i++) {
        const img = input.images[i];
        await tx.orm.public.ProductImage.create({
          productId: product.id,
          url: img.url,
          altText: img.altText ?? null,
          position: img.position ?? i,
        });
      }
    }

    return product.id;
  });

  return await getSingleProductById(createdId);
}

/**
 * Admin: Update Product details and images
 */
export async function updateProduct(id: number, input: UpdateProductInput) {
  const existing = await db.orm.public.Product.where({ id }).first();
  if (!existing) {
    throw new Error("Product not found");
  }
  await db.transaction(async (tx) => {
    const productUpdates: {
      name?: string;
      description?: string;
    } = {};
    if (input.name !== undefined) productUpdates.name = input.name;
    if (input.description !== undefined)
      productUpdates.description = input.description;

    if (Object.keys(productUpdates).length > 0) {
      await tx.orm.public.Product.where({ id }).update(productUpdates);
    }

    if (input.images !== undefined) {
      await tx.orm.public.ProductImage.where({ productId: id }).delete();
      for (let i = 0; i < input.images.length; i++) {
        const img = input.images[i];
        await tx.orm.public.ProductImage.create({
          productId: id,
          url: img.url,
          altText: img.altText ?? null,
          position: img.position ?? i,
        });
      }
    }
  });

  return await getSingleProductById(id);
}

/**
 * Admin: Delete product by ID (cascades to details, images, and variants)
 */
export async function deleteProduct(id: number) {
  const existing = await db.orm.public.Product.where({ id }).first();
  if (!existing) {
    throw new Error("Product not found");
  }
  //check here if has exisiting product variants
  const variants = await db.orm.public.ProductVariant.where({
    productId: id,
  }).all();
  if (variants.length > 0) {
    throw new Error("Product has variants, cannot delete");
  }
  await db.orm.public.Product.where({ id }).delete();

  return { success: true, id, message: "Product deleted successfully" };
}

/**
 * Admin Step 2: Create a new Variant for an existing Product
 */
export async function createProductVariant(
  productId: number,
  input: CreateProductVariantInput,
) {
  const product = await db.orm.public.Product.where({ id: productId }).first();
  if (!product) {
    throw new Error(`Product with ID ${productId} not found`);
  }

  // Check SKU uniqueness
  const existingSku = await db.orm.public.ProductVariant.where({
    sku: input.sku,
  }).first();
  if (existingSku) {
    throw new Error(`Variant SKU "${input.sku}" already exists`);
  }

  // Create variant and its attributes inside a transaction
  const variantId = await db.transaction(async (tx) => {
    const createdVariant = await tx.orm.public.ProductVariant.create({
      productId,
      sku: input.sku,
      price: input.price,
      stock: input.stock ?? 0,
      color: input.color ?? null,
      originId: input.originId ?? null,
      weightGrams: input.weightGrams ?? null,
    });

    // Individual variant attributes
    if (input.individualAttrs) {
      await tx.orm.public.IndividualVariantAttrs.create({
        variantId: createdVariant.id,
        size: input.individualAttrs.size,
      });
    }

    // Mala variant attributes
    if (input.malaAttrs) {
      await tx.orm.public.MalaVariantAttrs.create({
        variantId: createdVariant.id,
        beadCount: input.malaAttrs.beadCount ?? null,
        material: input.malaAttrs.material ?? null,
      });
    }

    // Variant images
    if (input.images && input.images.length > 0) {
      for (let i = 0; i < input.images.length; i++) {
        const vImg = input.images[i];
        await tx.orm.public.VariantImage.create({
          variantId: createdVariant.id,
          url: vImg.url,
          altText: vImg.altText ?? null,
          position: vImg.position ?? i,
        });
      }
    }

    return createdVariant.id;
  });

  return await getSingleProductVariantById(variantId);
}

/**
 * Admin: Fetch a single Product Variant by ID
 */
export async function getSingleProductVariantById(variantId: number) {
  const variant = await db.orm.public.ProductVariant.where({ id: variantId })
    .include("individualVariantAttrs")
    .include("malaVariantAttrs")
    .include("origin")
    .include("variantImages", (vi) => vi.orderBy((i) => i.position.asc()))
    .first();

  return variant;
}

/**
 * Admin: Fetch all variants for a specific Product
 */
export async function getProductVariantsByProductId(productId: number) {
  const variants = await db.orm.public.ProductVariant.where({ productId })
    .include("individualVariantAttrs")
    .include("malaVariantAttrs")
    .include("origin")
    .include("variantImages", (vi) => vi.orderBy((i) => i.position.asc()))
    .orderBy((v) => v.createdAt.asc())
    .all();

  return variants;
}

/**
 * Admin: Update a Product Variant
 */
export async function updateProductVariant(
  variantId: number,
  input: UpdateProductVariantInput,
) {
  const existingVariant = await db.orm.public.ProductVariant.where({
    id: variantId,
  }).first();

  if (!existingVariant) {
    throw new Error("Product variant not found");
  }

  if (input.sku && input.sku !== existingVariant.sku) {
    const duplicateSku = await db.orm.public.ProductVariant.where({
      sku: input.sku,
    }).first();
    if (duplicateSku && duplicateSku.id !== variantId) {
      throw new Error(`Variant SKU "${input.sku}" already exists`);
    }
  }

  await db.transaction(async (tx) => {
    // 1. Update variant fields
    const variantUpdates: Record<string, any> = {};
    if (input.sku !== undefined) variantUpdates.sku = input.sku;
    if (input.price !== undefined) variantUpdates.price = input.price;
    if (input.stock !== undefined) variantUpdates.stock = input.stock;
    if (input.color !== undefined) variantUpdates.color = input.color;
    if (input.originId !== undefined) variantUpdates.originId = input.originId;
    if (input.weightGrams !== undefined)
      variantUpdates.weightGrams = input.weightGrams;

    if (Object.keys(variantUpdates).length > 0) {
      await tx.orm.public.ProductVariant.where({ id: variantId }).update(
        variantUpdates,
      );
    }

    // 2. Individual attributes
    if (input.individualAttrs) {
      const existingAttrs = await tx.orm.public.IndividualVariantAttrs.where({
        variantId,
      }).first();
      if (existingAttrs) {
        await tx.orm.public.IndividualVariantAttrs.where({
          id: existingAttrs.id,
        }).update({
          size: input.individualAttrs.size,
        });
      } else {
        await tx.orm.public.IndividualVariantAttrs.create({
          variantId,
          size: input.individualAttrs.size,
        });
      }
    }

    // 3. Mala attributes
    if (input.malaAttrs) {
      const existingAttrs = await tx.orm.public.MalaVariantAttrs.where({
        variantId,
      }).first();
      if (existingAttrs) {
        await tx.orm.public.MalaVariantAttrs.where({
          id: existingAttrs.id,
        }).update({
          beadCount: input.malaAttrs.beadCount ?? null,
          material: input.malaAttrs.material ?? null,
        });
      } else {
        await tx.orm.public.MalaVariantAttrs.create({
          variantId,
          beadCount: input.malaAttrs.beadCount ?? null,
          material: input.malaAttrs.material ?? null,
        });
      }
    }

    // 4. Variant images if provided
    if (input.images !== undefined) {
      await tx.orm.public.VariantImage.where({ variantId }).delete();
      for (let vi = 0; vi < input.images.length; vi++) {
        const vImg = input.images[vi];
        await tx.orm.public.VariantImage.create({
          variantId,
          url: vImg.url,
          altText: vImg.altText ?? null,
          position: vImg.position ?? vi,
        });
      }
    }
  });

  return await getSingleProductVariantById(variantId);
}

/**
 * Admin: Delete a Product Variant
 */
export async function deleteProductVariant(variantId: number) {
  const existing = await db.orm.public.ProductVariant.where({
    id: variantId,
  }).first();

  if (!existing) {
    throw new Error("Product variant not found");
  }

  await db.orm.public.ProductVariant.where({ id: variantId }).delete();

  return { success: true, variantId, message: "Variant deleted successfully" };
}
