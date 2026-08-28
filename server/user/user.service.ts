
import { db } from "../../src/prisma/db"
import type { CreateUserInput } from "./user.schema"

export async function createUser(input: CreateUserInput) {
    const existing = await db.orm.public.User
        .select("id")
        .where({ email: input.email })
        .first();

    if (existing) {
        throw new Error("Email already in use");
    }

    return db.orm.public.User.create({
        email: input.email,
    });
}

