import { ApiRequestType } from "@/lib/requestAPI";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ConsultationStatus =
  | "PENDING"
  | "CONTACTED"
  | "COMPLETED"
  | "CANCELLED";

export interface ConsultationRequestType {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  dob?: string | null;
  tob?: string | null;
  pob?: string | null;
  intention: string;
  preferredMode: string;
  notes?: string | null;
  status: ConsultationStatus;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConsultationPayload {
  fullName: string;
  email: string;
  phone: string;
  dob?: string | null;
  tob?: string | null;
  pob?: string | null;
  intention: string;
  preferredMode: string;
  notes?: string | null;
}

export type UpdateConsultationPayload = Partial<CreateConsultationPayload> & {
  status?: ConsultationStatus;
  adminNotes?: string | null;
};

export interface ConsultationFilterParams {
  [key: string]: unknown;
  page?: number;
  limit?: number;
  search?: string;
  status?: ConsultationStatus;
  sortBy?: "createdAt" | "updatedAt" | "fullName";
  sortOrder?: "asc" | "desc";
}

export interface AllConsultationsResponseType {
  requests: ConsultationRequestType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ── Route Endpoints Registry ─────────────────────────────────────────────────

export const CONSULTATION_API_ROUTES = {
  PUBLIC_CREATE: "/consultation-requests",
  ADMIN_LIST: "/consultation-requests",
  ADMIN_GET_BY_ID: (id: number | string) => `/consultation-requests/${id}`,
  ADMIN_UPDATE_BY_ID: (id: number | string) => `/consultation-requests/${id}`,
  ADMIN_DELETE_BY_ID: (id: number | string) => `/consultation-requests/${id}`,
} as const;

// ── API Request Builders ─────────────────────────────────────────────────────

/** POST /api/consultation-requests — Public devotee form submission */
const createConsultation = (
  data: CreateConsultationPayload,
): ApiRequestType => ({
  method: "post",
  route: CONSULTATION_API_ROUTES.PUBLIC_CREATE,
  payload: data,
  showToast: true,
  successMessage: "Consultation request submitted successfully!",
});

/** GET /api/consultation-requests — Admin list with pagination & filters */
const getAllConsultations = (
  params?: ConsultationFilterParams,
): ApiRequestType => ({
  method: "get",
  route: CONSULTATION_API_ROUTES.ADMIN_LIST,
  params,
  showToast: false,
});

/** GET /api/consultation-requests/[id] — Admin single view */
const getConsultationById = (id: number): ApiRequestType => ({
  method: "get",
  route: CONSULTATION_API_ROUTES.ADMIN_GET_BY_ID(id),
  showToast: false,
});

/** PATCH /api/consultation-requests/[id] — Admin update status or notes */
const updateConsultation = (
  id: number,
  data: UpdateConsultationPayload,
): ApiRequestType => ({
  method: "patch",
  route: CONSULTATION_API_ROUTES.ADMIN_UPDATE_BY_ID(id),
  payload: data,
  showToast: true,
  successMessage: "Consultation request updated successfully",
});

/** DELETE /api/consultation-requests/[id] — Admin delete request */
const deleteConsultation = (id: number): ApiRequestType => ({
  method: "delete",
  route: CONSULTATION_API_ROUTES.ADMIN_DELETE_BY_ID(id),
  showToast: true,
  successMessage: "Consultation request deleted successfully",
});

export const consultationApi = {
  create: createConsultation,
  getAll: getAllConsultations,
  getById: getConsultationById,
  update: updateConsultation,
  delete: deleteConsultation,
};
