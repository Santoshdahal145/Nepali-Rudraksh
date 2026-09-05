import { CreateVariantPayload, productVariantApi, UpdateVariantPayload } from "@/app/api/products/api";
import { ProductType, ProductVariantType } from "@/app/types";
import { requestAPI } from "@/lib/requestAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PRODUCT_KEYS } from "./useProductAdmin";

export const enum PRODUCT_VARIANT_KEYS {
  create = "create-product-variant",
  update = "update-product-variant",
  delete = "delete-product-variant",
}

export default function useProductVariantAdminHook(productId: number) {
  const queryClient = useQueryClient();

  // CREATE
  const createProductVariant = useMutation({
    mutationKey: [PRODUCT_VARIANT_KEYS.create],
    mutationFn: async (payload: Omit<CreateVariantPayload, "productId">) => {
      const response = await requestAPI(
        productVariantApi.createProductVariant({ ...payload, productId }),
      );
      return response.data as ProductVariantType;
    },

    onSuccess: (newVariant) => {
      queryClient.setQueryData(
        [PRODUCT_KEYS.getSingle, productId],
        (oldData: ProductType | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            variants: [...oldData.variants, newVariant],
          };
        },
      );
    },
  });

  // UPDATE
  const updateProductVariant = useMutation({
    mutationKey: [PRODUCT_VARIANT_KEYS.update],
    mutationFn: async ({
      variantId,
      data,
    }: {
      variantId: number;
      data: UpdateVariantPayload;
    }) => {
      const response = await requestAPI(
        productVariantApi.updateProductVariant(variantId, data),
      );
      return response.data as ProductVariantType;
    },

    onSuccess: (updatedVariant) => {
      queryClient.setQueryData(
        [PRODUCT_KEYS.getSingle, productId],
        (oldData: ProductType | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            variants: oldData.variants.map((v) =>
              v.id === updatedVariant.id ? updatedVariant : v,
            ),
          };
        },
      );
    },
  });

  // DELETE
  const deleteProductVariant = useMutation({
    mutationKey: [PRODUCT_VARIANT_KEYS.delete],
    mutationFn: async ({ id }: { id: number }) => {
      await requestAPI(productVariantApi.deleteProductVariant(id));
      return id;
    },

    onSuccess: (deletedId) => {
      queryClient.setQueryData(
        [PRODUCT_KEYS.getSingle, productId],
        (oldData: ProductType | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            variants: oldData.variants.filter((v) => v.id !== deletedId),
          };
        },
      );
    },
  });

  return {
    deleteProductVariant,
    createProductVariant,
    updateProductVariant,
  };
}