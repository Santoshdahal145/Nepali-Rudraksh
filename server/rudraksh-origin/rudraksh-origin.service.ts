import { db } from "../../src/prisma/db";
import { CreateRudrakshOriginInput, UpdateRudrakshOriginInput } from "./rudraksh-origin.schema";

export async function createRudrakshOrigin(data: CreateRudrakshOriginInput) {
  const existing = await db.orm.public.RudrakshaOrigin.where({
    name: data.name,
    country: data.country,
  }).first();

  if (existing) {
    throw new Error(
      `Rudraksha origin "${data.name}" in "${data.country}" already exists`
    );
  }

  return await db.orm.public.RudrakshaOrigin.create({
    name: data.name,
    country: data.country,
  });
}

export async function updateRudrakshOrigin(
  id: number,
  data: UpdateRudrakshOriginInput
) {
  const existing = await db.orm.public.RudrakshaOrigin.where({ id }).first();

  if (!existing) {
    throw new Error("Rudraksha origin not found");
  }

  if (data.name || data.country) {
    const targetName = data.name ?? existing.name;
    const targetCountry = data.country ?? existing.country;

    const duplicate = await db.orm.public.RudrakshaOrigin.where({
      name: targetName,
      country: targetCountry,
    }).first();

    if (duplicate && duplicate.id !== id) {
      throw new Error(
        `Rudraksha origin "${targetName}" in "${targetCountry}" already exists`
      );
    }
  }

  return await db.orm.public.RudrakshaOrigin.where({ id }).update(data);
}

export async function getAllRudrakshOrigin() {
  return await db.orm.public.RudrakshaOrigin.orderBy((o) =>
    o.createdAt.desc()
  ).all();
}

export async function getRudrakshOriginById(id: number) {
  return await db.orm.public.RudrakshaOrigin.where({ id }).first();
}

export async function deleteRudrakshOrigin(id: number) {
  const existing = await db.orm.public.RudrakshaOrigin.where({ id }).first();

  if (!existing) {
    throw new Error("Rudraksha origin not found");
  }

  // Check if any product variant is using this origin
  const variantInUse = await db.orm.public.ProductVariant.where({
    originId: id,
  }).first();

  if (variantInUse) {
    throw new Error(
      "Cannot delete this origin as it is assigned to one or more product variants"
    );
  }

  return await db.orm.public.RudrakshaOrigin.where({ id }).delete();
}


