import bcrypt from "bcryptjs";
import { db } from "../../src/prisma/db";
import { LoginInput } from "./auth.schema";
import { checkIfUserExistsByEmail } from "../user/user.service";


export async function login(input: LoginInput) {
    const existing = await checkIfUserExistsByEmail(input.email);
    if (!existing) {
        throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(input.password, existing.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }
    return existing;
}

export async function validateUserOtp(){}
