import { ApiRequestType } from "@/lib/requestAPI";
import type {
  GetUsersParams,
  UserType,
  SingleUserResponseType,
  AllUsersResponseType,
} from "@/app/types";

export type {
  GetUsersParams,
  UserType,
  SingleUserResponseType,
  AllUsersResponseType,
};

// ─────────────────────────────────────────────────────────────────────────────
// Users API Requests
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/users
 * Fetch paginated list of users with optional search, role filter, and sorting
 */
const getAllUsers = (params?: GetUsersParams): ApiRequestType => ({
  method: "get",
  route: "/users",
  params,
  showToast: false,
});

/**
 * GET /api/users/[id]
 * Fetch a single user by ID with full detailed information
 */
const getUserById = (id: number | string): ApiRequestType => ({
  method: "get",
  route: `/users/${id}`,
  showToast: false,
});

/**
 * PATCH /api/users/[id]
 * Update user fields (e.g. role, details, verification)
 */
const updateUser = (
  id: number | string,
  data: Partial<UserType>
): ApiRequestType => ({
  method: "patch",
  route: `/users/${id}`,
  payload: data,
  showToast: true,
  successMessage: "Devotee details updated successfully",
});

export const userAdminApi = {
  getAllUsers,
  getUserById,
  updateUser,
};

export { getAllUsers, getUserById, updateUser };

