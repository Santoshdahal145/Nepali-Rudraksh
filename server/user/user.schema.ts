import { z } from "zod";

export const createUserSchema = z.object({
    email: z.email(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    phoneNumber: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const UserRoleEnum = z.enum(["ADMIN", "USER"]);
export type UserRole = z.infer<typeof UserRoleEnum>;

export const updateUserSchema = createUserSchema.partial().extend({
  role: UserRoleEnum.optional(),
  isEmailVerified: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;


export const getUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  role: UserRoleEnum.optional(),
  isEmailVerified: z.coerce.boolean().optional(),
  sortBy: z.enum(["createdAt", "firstName", "lastName", "email"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type GetUsersQueryInput = z.infer<typeof getUsersQuerySchema>;