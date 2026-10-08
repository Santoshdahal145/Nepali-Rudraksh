import { z } from "zod";

export const ConsultationStatusEnum = z.enum([
  "PENDING",
  "CONTACTED",
  "COMPLETED",
  "CANCELLED",
]);
export type ConsultationStatus = z.infer<typeof ConsultationStatusEnum>;

export const createConsultationRequestSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().trim().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .trim()
    .min(5, { message: "Phone number must be at least 5 digits" }),
  dob: z.string().trim().optional().nullable(),
  tob: z.string().trim().optional().nullable(),
  pob: z.string().trim().optional().nullable(),
  intention: z
    .string()
    .trim()
    .min(1, { message: "Consultation intention is required" }),
  preferredMode: z
    .string()
    .trim()
    .min(1, { message: "Preferred mode is required" }),
  notes: z.string().trim().optional().nullable(),
});
export type CreateConsultationRequestInput = z.infer<
  typeof createConsultationRequestSchema
>;

export const updateConsultationRequestSchema = z.object({
  status: ConsultationStatusEnum.optional(),
  adminNotes: z.string().trim().optional().nullable(),
  fullName: z.string().trim().min(2).optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().min(5).optional(),
  dob: z.string().trim().optional().nullable(),
  tob: z.string().trim().optional().nullable(),
  pob: z.string().trim().optional().nullable(),
  intention: z.string().trim().optional(),
  preferredMode: z.string().trim().optional(),
  notes: z.string().trim().optional().nullable(),
});
export type UpdateConsultationRequestInput = z.infer<
  typeof updateConsultationRequestSchema
>;

export const getConsultationRequestsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  status: ConsultationStatusEnum.optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "fullName"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
export type GetConsultationRequestsQueryInput = z.infer<
  typeof getConsultationRequestsQuerySchema
>;
