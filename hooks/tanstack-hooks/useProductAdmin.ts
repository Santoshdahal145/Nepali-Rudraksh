import { CreateProductPayload, productApi, UpdateProductPayload } from "@/app/api/products/api";
import {  AllProductsResponseType, ProductType } from "@/app/types";
import {  requestAPI } from "@/lib/requestAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const enum PRODUCT_KEYS {
  create = "create-product",
  update = "update-product",
  getAll = "all-products",
  getSingle = "single-product",
  delete = "delete-product",
}

export default function useProductAdminHook(
  page = 1,
  limit = 10,
  debouncedSearch = "",
) {
  const queryClient = useQueryClient();

  // GET ALL (with pagination)
  const getProducts = useQuery({
    queryKey: [PRODUCT_KEYS.getAll, page, limit, debouncedSearch],
    queryFn: async () => {
      const res = await requestAPI<AllProductsResponseType>(
        productApi.getProducts({
          page,
          limit,
          search: debouncedSearch,
        }),
      );
      return res.data as AllProductsResponseType;
    },
  });

  // CREATE
  const createProduct = useMutation({
    mutationKey: [PRODUCT_KEYS.create],
    mutationFn: async (payload: CreateProductPayload) => {
      const response = await requestAPI(
        productApi.createProduct(payload),
      )
      return response.data as ProductType
    },

    onSuccess: (newProvider) => {
      queryClient.setQueryData(
        [PRODUCT_KEYS.getAll, page, limit, debouncedSearch],
        (oldData: AllProductsResponseType | undefined) => {
          if (!oldData) return;
          return {
            ...oldData,
            products: [newProvider, ...oldData.products], 
            pagination: {
              ...oldData.pagination,
              total: oldData.pagination.total + 1,
            },
          };
        },
      );
    },
  });

  // UPDATE
  const updateProduct = useMutation({
    mutationKey: [PRODUCT_KEYS.update],
    mutationFn: async ({ id, data }: {id:number;data:UpdateProductPayload}) => {
      const response=await requestAPI(
        productApi.updateProduct(id, data),
      ) ;
      return response.data as ProductType
    },

    onSuccess: (updatedItem) => {
      queryClient.setQueryData(
        [PRODUCT_KEYS.getAll, page, limit, debouncedSearch],
        (oldData: AllProductsResponseType | undefined) => {
          if (!oldData) return;

          return {
            ...oldData,
            products: oldData.products.map((p) =>
              p.id === updatedItem.id ? updatedItem : p,
            ),
          };
        },
      );
    },
  });

  // DELETE
  const deleteProduct = useMutation({
    mutationKey: [PRODUCT_KEYS.delete],
    mutationFn: async ({ id }: { id: number }) => {
      return await requestAPI(productApi.deleteProduct(id));
    },

    onSuccess: (_, { id }) => {
      queryClient.setQueryData(
        [PRODUCT_KEYS.getAll, page, limit, debouncedSearch],
        (oldData: AllProductsResponseType | undefined) => {
          if (!oldData) return;

          return {
            ...oldData,
            products: oldData.products.filter((p) => p.id !== id),
            pagination: {
              ...oldData.pagination,
              total: oldData.pagination.total - 1,
            },
          };
        },
      );
    },
  });

  return {
    getProducts,
    deleteProduct,
    createProduct,
    updateProduct,
  };
}

export function useSingleProductAdmin(productId: number) {
  return useQuery({
    queryKey: [PRODUCT_KEYS.getSingle, productId],
    queryFn: async () => {
      const res = await requestAPI<ProductType>(
        productApi.getProductById(productId),
      );
      return res.data as ProductType;
    },
    enabled: !isNaN(productId) && productId > 0,
  });
}
