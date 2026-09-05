import { userAdminApi } from "@/app/api/users/api";
import {
  AllUsersResponseType,
  SingleUserResponseType,
  UserType,
} from "@/app/types";
import { requestAPI } from "@/lib/requestAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const enum USER_KEYS {
  getAll = "all-users",
  getSingle = "single-user",
  update = "update-user",
}

export default function useUserAdminHook(
  page = 1,
  limit = 10,
  debouncedSearch = "",
  role?: "ADMIN" | "USER",
  isEmailVerified?: boolean,
  sortBy: "createdAt" | "firstName" | "lastName" | "email" = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
) {
  const queryClient = useQueryClient();

  // GET ALL USERS (with server pagination, search, role filters, sorting)
  const getUsers = useQuery({
    queryKey: [
      USER_KEYS.getAll,
      page,
      limit,
      debouncedSearch,
      role,
      isEmailVerified,
      sortBy,
      sortOrder,
    ],
    queryFn: async () => {
      const res = await requestAPI<AllUsersResponseType>(
        userAdminApi.getAllUsers({
          page,
          limit,
          search: debouncedSearch || undefined,
          role: role || undefined,
          isEmailVerified,
          sortBy,
          sortOrder,
        })
      );
      return res.data as AllUsersResponseType;
    },
  });

  // UPDATE USER (e.g. role, name, verification)
  const updateUser = useMutation({
    mutationKey: [USER_KEYS.update],
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<UserType>;
    }) => {
      const response = await requestAPI(userAdminApi.updateUser(id, data));
      return response.data as UserType;
    },
    onSuccess: (updatedUser) => {
      // Invalidate queries so lists and single view sync up
      queryClient.invalidateQueries({ queryKey: [USER_KEYS.getAll] });
      queryClient.invalidateQueries({
        queryKey: [USER_KEYS.getSingle, updatedUser.id],
      });
    },
  });

  return {
    getUsers,
    updateUser,
  };
}

export function useSingleUserAdmin(userId: number | string) {
  const numericId = typeof userId === "string" ? parseInt(userId, 10) : userId;

  return useQuery({
    queryKey: [USER_KEYS.getSingle, numericId],
    queryFn: async () => {
      const res = await requestAPI<SingleUserResponseType>(
        userAdminApi.getUserById(numericId)
      );
      return res.data as SingleUserResponseType;
    },
    enabled: !isNaN(numericId) && numericId > 0,
  });
}
