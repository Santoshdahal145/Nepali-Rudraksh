import {
  CreateOriginPayload,
  rudrakshOriginApi,
  UpdateOriginPayload,
} from "@/app/api/products/api";
import { AllRudrakshOriginResponseType, RudrakshOriginType } from "@/app/types";
import { requestAPI } from "@/lib/requestAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const enum RUDRAKSH_ORIGIN_KEYS {
  create = "create-rudraksh-origin",
  update = "update-rudraksh-origin",
  getAll = "all-rudraksh-origin",
  getSingle = "single-rudraksh-origin",
  delete = "delete-rudraksh-origin",
}

export default function useRudrakshOriginAdminHook() {
  const queryClient = useQueryClient();

  // GET ALL
  const getRudrakshOrigins = useQuery({
    queryKey: [RUDRAKSH_ORIGIN_KEYS.getAll],
    queryFn: async () => {
      const response = await requestAPI<
        RudrakshOriginType[] | AllRudrakshOriginResponseType
      >(rudrakshOriginApi.getRudrakshOrigins());
      return response.data;
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
      queryClient.invalidateQueries({
        queryKey: [RUDRAKSH_ORIGIN_KEYS.getAll],
      });
      queryClient.setQueryData(
        [RUDRAKSH_ORIGIN_KEYS.getAll],
        (oldData: any) => {
          if (!oldData) return oldData;
          if (Array.isArray(oldData)) {
            return [newOrigin, ...oldData];
          }
          if (oldData.origins) {
            return {
              ...oldData,
              origins: [newOrigin, ...oldData.origins],
              pagination: oldData.pagination
                ? {
                    ...oldData.pagination,
                    total: oldData.pagination.total + 1,
                  }
                : undefined,
            };
          }
          return oldData;
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
      data: UpdateOriginPayload;
    }) => {
      const response = await requestAPI(
        rudrakshOriginApi.updateRudrakshOrigin(id, data),
      );
      return response.data as RudrakshOriginType;
    },

    onSuccess: (updatedItem) => {
      queryClient.invalidateQueries({
        queryKey: [RUDRAKSH_ORIGIN_KEYS.getAll],
      });
      queryClient.setQueryData(
        [RUDRAKSH_ORIGIN_KEYS.getSingle, updatedItem.id],
        updatedItem,
      );
      queryClient.setQueryData(
        [RUDRAKSH_ORIGIN_KEYS.getAll],
        (oldData: any) => {
          if (!oldData) return oldData;
          if (Array.isArray(oldData)) {
            return oldData.map((o) => (o.id === updatedItem.id ? updatedItem : o));
          }
          if (oldData.origins) {
            return {
              ...oldData,
              origins: oldData.origins.map((o: RudrakshOriginType) =>
                o.id === updatedItem.id ? updatedItem : o,
              ),
            };
          }
          return oldData;
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
      queryClient.invalidateQueries({
        queryKey: [RUDRAKSH_ORIGIN_KEYS.getAll],
      });
      queryClient.setQueryData(
        [RUDRAKSH_ORIGIN_KEYS.getAll],
        (oldData: any) => {
          if (!oldData) return oldData;
          if (Array.isArray(oldData)) {
            return oldData.filter((o) => o.id !== deletedId);
          }
          if (oldData.origins) {
            return {
              ...oldData,
              origins: oldData.origins.filter(
                (o: RudrakshOriginType) => o.id !== deletedId,
              ),
              pagination: oldData.pagination
                ? {
                    ...oldData.pagination,
                    total: Math.max(0, oldData.pagination.total - 1),
                  }
                : undefined,
            };
          }
          return oldData;
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

export function useSingleRudrakshOriginAdmin(id: number) {
  return useQuery({
    queryKey: [RUDRAKSH_ORIGIN_KEYS.getSingle, id],
    queryFn: async () => {
      const response = await requestAPI<RudrakshOriginType>(
        rudrakshOriginApi.getRudrakshOriginById(id),
      );
      return response.data as RudrakshOriginType;
    },
    enabled: !isNaN(id) && id > 0,
  });
}