import {
  CreateOriginPayload,
  rudrakshOriginApi,
  UpdateProductPayload,
} from "@/app/api/products/api";
import { AllRudrakshOriginResponseType, RudrakshOriginType } from "@/app/types";
import { requestAPI } from "@/lib/requestAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const enum RUDRAKSH_ORIGIN_KEYS {
  create = "create-rudraksh-origin",
  update = "update-rudraksh-origin",
  getAll = "all-rudraksh-origin",
  delete = "delete-rudraksh-origin",
}

export default function useRudrakshOriginAdminHook() {
  const queryClient = useQueryClient();

  // GET ALL
  const getRudrakshOrigins = useQuery({
    queryKey: [RUDRAKSH_ORIGIN_KEYS.getAll],
    queryFn: async () => {
      const response = await requestAPI(rudrakshOriginApi.getRudrakshOrigins());
      return response.data as AllRudrakshOriginResponseType;
    },
  });

  // CREATE
  const createRudrakshOrigin = useMutation({
    mutationKey: [RUDRAKSH_ORIGIN_KEYS.create],
    mutationFn: async (payload: CreateOriginPayload) => {
      const response = await requestAPI(
        rudrakshOriginApi.createRudrakshOrigin(payload),
      );
      return response.data as RudrakshOriginType;
    },

    onSuccess: (newOrigin) => {
      queryClient.setQueryData(
        [RUDRAKSH_ORIGIN_KEYS.getAll],
        (oldData: AllRudrakshOriginResponseType | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            origins: [newOrigin, ...oldData.origins],
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
  const updateRudrakshOrigin = useMutation({
    mutationKey: [RUDRAKSH_ORIGIN_KEYS.update],
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateProductPayload;
    }) => {
      const response = await requestAPI(
        rudrakshOriginApi.updateRudrakshOrigin(id, data),
      );
      return response.data as RudrakshOriginType;
    },

    onSuccess: (updatedItem) => {
      queryClient.setQueryData(
        [RUDRAKSH_ORIGIN_KEYS.getAll],
        (oldData: AllRudrakshOriginResponseType | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            origins: oldData.origins.map((o) =>
              o.id === updatedItem.id ? updatedItem : o,
            ),
          };
        },
      );
    },
  });

  // DELETE
  const deleteRudrakshOrigin = useMutation({
    mutationKey: [RUDRAKSH_ORIGIN_KEYS.delete],
    mutationFn: async ({ id }: { id: number }) => {
      await requestAPI(rudrakshOriginApi.deleteRudrakshOrigin(id));
      return id;
    },

    onSuccess: (deletedId) => {
      queryClient.setQueryData(
        [RUDRAKSH_ORIGIN_KEYS.getAll],
        (oldData: AllRudrakshOriginResponseType | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            origins: oldData.origins.filter((o) => o.id !== deletedId),
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
    getRudrakshOrigins,
    deleteRudrakshOrigin,
    createRudrakshOrigin,
    updateRudrakshOrigin,
  };
}