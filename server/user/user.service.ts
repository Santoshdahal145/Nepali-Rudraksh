import bcrypt from "bcryptjs";
import { db } from "../../src/prisma/db";
import type { CreateUserInput, UpdateUserInput } from "./user.schema";

export async function checkIfUserExistsByEmail(email: string) {
    return db.orm.public.User
        .select("id")
        .where({ email })
        .first();
}

async function checkIfUserExistsById(id: number) {
    return db.orm.public.User
        .select("id")
        .where({ id })
        .first();
}

export async function createUser(input: CreateUserInput) {
    const existing = await checkIfUserExistsByEmail(input.email);
    if (existing) {
        throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    return db.orm.public.User.create({
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        password: hashedPassword,
        phoneNumber: input.phoneNumber,
    });
}

export async function updateUser(id: number, input: UpdateUserInput) {
    const existing = await checkIfUserExistsById(id);
    if (!existing) {
        throw new Error("User not found");
    }

    return db.orm.public.User
        .where({ id })
        .update(input);
}