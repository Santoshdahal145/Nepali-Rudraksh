import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  consultationApi,
  ConsultationRequestType,
  CreateConsultationPayload,
  UpdateConsultationPayload,
  AllConsultationsResponseType,
  ConsultationStatus,
} from "@/app/api/consultation-requests/api";
import { requestAPI } from "@/lib/requestAPI";

export const enum CONSULTATION_KEYS {
  create = "create-consultation",
  update = "update-consultation",
  getAll = "all-consultations",
  getSingle = "single-consultation",
  delete = "delete-consultation",
}

/**
 * Admin management hook for listing, updating status, and deleting consultation requests
 */
export default function useConsultationRequestHook(
  page = 1,
  limit = 10,
  debouncedSearch = "",
  status?: ConsultationStatus,
) {
  const queryClient = useQueryClient();

  // GET ALL with pagination, search, status filter
  const getRequests = useQuery({
    queryKey: [CONSULTATION_KEYS.getAll, page, limit, debouncedSearch, status],
    queryFn: async () => {
      const res = await requestAPI<AllConsultationsResponseType>(
        consultationApi.getAll({
          page,
          limit,
          search: debouncedSearch,
          status,
        }),
      );
      return res.data as AllConsultationsResponseType;
    },
  });

  // UPDATE REQUEST (status, adminNotes)
  const updateRequest = useMutation({
    mutationKey: [CONSULTATION_KEYS.update],
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateConsultationPayload;
    }) => {
      const response = await requestAPI<ConsultationRequestType>(
        consultationApi.update(id, data),
      );
      return response.data as ConsultationRequestType;
    },

    onSuccess: (updated) => {
      // Invalidate both all list and single query
      queryClient.invalidateQueries({
        queryKey: [CONSULTATION_KEYS.getAll],
      });
      queryClient.setQueryData(
        [CONSULTATION_KEYS.getSingle, updated.id],
        updated,
      );
    },
  });

  // DELETE REQUEST
  const deleteRequest = useMutation({
    mutationKey: [CONSULTATION_KEYS.delete],
    mutationFn: async ({ id }: { id: number }) => {
      const response = await requestAPI<{ success: boolean; message: string }>(
        consultationApi.delete(id),
      );
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CONSULTATION_KEYS.getAll],
      });
    },
  });

  return {
    getRequests,
    updateRequest,
    deleteRequest,
  };
}

/**
 * Hook for viewing a single consultation request (Admin)
 */
export function useSingleConsultation(id: number | null | undefined) {
  return useQuery({
    queryKey: [CONSULTATION_KEYS.getSingle, id],
    queryFn: async () => {
      if (!id) return null;
      const res = await requestAPI<ConsultationRequestType>(
        consultationApi.getById(id),
      );
      return res.data as ConsultationRequestType;
    },
    enabled: typeof id === "number" && !isNaN(id) && id > 0,
  });
}

/**
 * Public mutation hook for creating consultation requests (Devotee Form)
 */
export function useCreateConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [CONSULTATION_KEYS.create],
    mutationFn: async (payload: CreateConsultationPayload) => {
      const response = await requestAPI<ConsultationRequestType>(
        consultationApi.create(payload),
      );
      return response.data as ConsultationRequestType;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CONSULTATION_KEYS.getAll],
      });
    },
  });
}
