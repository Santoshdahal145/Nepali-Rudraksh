import { db } from "../../src/prisma/db";
import { AppError } from "../../lib/error";
import {
  CreateConsultationRequestInput,
  UpdateConsultationRequestInput,
  GetConsultationRequestsQueryInput,
} from "./consultation-request.schema";

/**
 * Public: Create a new consultation request
 */
export async function createConsultationRequest(
  data: CreateConsultationRequestInput,
) {
  const request = await db.orm.public.ConsultationRequest.create({
    fullName: data.fullName,
    email: data.email.toLowerCase(),
    phone: data.phone,
    dob: data.dob || null,
    tob: data.tob || null,
    pob: data.pob || null,
    intention: data.intention,
    preferredMode: data.preferredMode,
    notes: data.notes || null,
    status: "PENDING",
  });

  return request;
}

/**
 * Admin: Get all consultation requests with pagination, status filter & search
 */
export async function getAllConsultationRequestsAdmin(
  params: GetConsultationRequestsQueryInput = {
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
) {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const offset = (page - 1) * limit;

  let collection = db.orm.public.ConsultationRequest;

  if (status) {
    collection = collection.where({ status });
  }

  if (sortBy === "fullName") {
    collection = collection.orderBy((req) =>
      sortOrder === "asc" ? req.fullName.asc() : req.fullName.desc(),
    );
  } else if (sortBy === "updatedAt") {
    collection = collection.orderBy((req) =>
      sortOrder === "asc" ? req.updatedAt.asc() : req.updatedAt.desc(),
    );
  } else {
    collection = collection.orderBy((req) =>
      sortOrder === "asc" ? req.createdAt.asc() : req.createdAt.desc(),
    );
  }

  let allItems = await collection.all();

  if (search && search.trim()) {
    const s = search.trim().toLowerCase();
    allItems = allItems.filter(
      (req) =>
        req.fullName.toLowerCase().includes(s) ||
        req.email.toLowerCase().includes(s) ||
        req.phone.toLowerCase().includes(s) ||
        req.intention.toLowerCase().includes(s),
    );
  }

  const total = allItems.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginatedRequests = allItems.slice(offset, offset + limit);

  return {
    requests: paginatedRequests,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

/**
 * Admin: Get single consultation request by ID
 */
export async function getConsultationRequestById(id: number) {
  const request = await db.orm.public.ConsultationRequest.where({ id }).first();

  if (!request) {
    throw new AppError("Consultation request not found", 404);
  }

  return request;
}

/**
 * Admin: Update a consultation request (e.g. status, adminNotes)
 */
export async function updateConsultationRequest(
  id: number,
  data: UpdateConsultationRequestInput,
) {
  const existing = await db.orm.public.ConsultationRequest.where({ id }).first();
  if (!existing) {
    throw new AppError("Consultation request not found", 404);
  }

  const updateFields: Record<string, unknown> = {};

  if (data.status !== undefined) updateFields.status = data.status;
  if (data.adminNotes !== undefined) updateFields.adminNotes = data.adminNotes;
  if (data.fullName !== undefined) updateFields.fullName = data.fullName;
  if (data.email !== undefined) updateFields.email = data.email.toLowerCase();
  if (data.phone !== undefined) updateFields.phone = data.phone;
  if (data.dob !== undefined) updateFields.dob = data.dob;
  if (data.tob !== undefined) updateFields.tob = data.tob;
  if (data.pob !== undefined) updateFields.pob = data.pob;
  if (data.intention !== undefined) updateFields.intention = data.intention;
  if (data.preferredMode !== undefined)
    updateFields.preferredMode = data.preferredMode;
  if (data.notes !== undefined) updateFields.notes = data.notes;

  const updated = await db.orm.public.ConsultationRequest.where({ id }).update(
    updateFields,
  );

  return updated;
}

/**
 * Admin: Delete a consultation request
 */
export async function deleteConsultationRequest(id: number) {
  const existing = await db.orm.public.ConsultationRequest.where({ id }).first();
  if (!existing) {
    throw new AppError("Consultation request not found", 404);
  }

  await db.orm.public.ConsultationRequest.where({ id }).delete();

  return { success: true, message: "Consultation request deleted successfully" };
}
