


import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db } from "../../src/prisma/db";
import { sendEmail } from "../helpers/emailHelper"; 
import type { CreateUserInput, UpdateUserInput } from "./user.schema";

const OTP_EXPIRY_MINUTES = 24 * 60;


// HELPER FUNCTIONS
// generates 6 digit otp
export function generateOtp(): string {
    return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

// checks if user exists by email
export async function checkIfUserExistsByEmail(email: string) {
    return db.orm.public.User
        .select("id")
        .where({ email })
        .first();
}

// checks if user exists by id
async function checkIfUserExistsById(id: number) {
    return db.orm.public.User
        .select("id")
        .where({ id })
        .first();
}


//SERVICES

// creates user and sends otp to email
export async function createUser(input: CreateUserInput) {
    const existing = await checkIfUserExistsByEmail(input.email);
    if (existing) {
        throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const code = generateOtp();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60_000);

    const user = await db.transaction(async (tx) => {
        const createdUser = await tx.orm.public.User.create({
            email: input.email,
            firstName: input.firstName,
            lastName: input.lastName,
            password: hashedPassword,
            phoneNumber: input.phoneNumber,
            isEmailVerified: false,
        });

        await tx.orm.public.Otp.create({
            userId: createdUser.id,
            codeHash,
            type: "EMAIL_VERIFICATION",
            expiresAt,
        });

        return createdUser;
    });

    // send the raw code by email — AFTER the transaction commits
    await sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: `<p>Your verification code is <strong>${code}</strong>. It expires in ${OTP_EXPIRY_MINUTES} minutes.</p>`,
    });

    // never return the password hash to the caller
    const { password, ...safeUser } = user;
    return safeUser;
}

// updates user by id
export async function updateUser(id: number, input: UpdateUserInput) {
    const existing = await checkIfUserExistsById(id);
    if (!existing) {
        throw new Error("User not found");
    }

    const updatedUser = await db.orm.public.User
        .where({ id })
        .update(input);

    if (updatedUser) {
        const { password, ...safeUser } = updatedUser;
        return safeUser;
    }
    else {
        throw new Error("Failed to update user");
    }
}