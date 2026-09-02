


import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db } from "../../src/prisma/db";
import { sendEmail } from "../helpers/emailHelper"; 
import type { CreateUserInput, UpdateUserInput } from "./user.schema";
import { Temporal } from "@js-temporal/polyfill";
import { ResendOtpInput } from "../auth/auth.schema";

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
        .where({ email }).first()
       
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
    console.log("🚀 ~ createUser ~ code:", code)
    const codeHash = await bcrypt.hash(code, 10);
const expiresAt = Temporal.Now.instant().add({
  minutes: OTP_EXPIRY_MINUTES,
});

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
            consumedAt:null
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
// resend otp
const RESEND_COOLDOWN_MINUTES = 1;

export async function resendOtp(input:ResendOtpInput) {
    const existing = await db.orm.public.User
        .where({ email :input.email}).first();

    if (!existing) {
        throw new Error("User not found");
    }

    if (existing.isEmailVerified) {
        throw new Error("Email is already verified");
    }

    const lastOtp = await db.orm.public.Otp
        .where({ userId: existing.id, type: "EMAIL_VERIFICATION" })
        .first();

    if (lastOtp) {
        const cooldownEnds = Temporal.Instant
            .fromEpochMilliseconds(lastOtp.createdAt.getTime())
            .add({ minutes: RESEND_COOLDOWN_MINUTES });

        if (Temporal.Instant.compare(Temporal.Now.instant(), cooldownEnds) < 0) {
            const secondsLeft = Temporal.Now.instant().until(cooldownEnds).total("seconds");
            throw new Error(
                `Please wait ${Math.ceil(secondsLeft)} seconds before requesting a new code`
            );
        }
    }

    const code = generateOtp();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = Temporal.Now.instant().add({
        minutes: OTP_EXPIRY_MINUTES,
    });

   await db.transaction(async (tx) => {
        await tx.orm.public.Otp.create({
            userId: existing.id,
            codeHash,
            type: "EMAIL_VERIFICATION",
            expiresAt,
        });
    });

    // send the raw code by email — AFTER the transaction commits
    await sendEmail({
        to: existing.email,
        subject: "Verify your email",
        html: `<p>Your verification code is <strong>${code}</strong>. It expires in ${OTP_EXPIRY_MINUTES} minutes.</p>`,
    });

    // never return the password hash to the caller
    const { password, ...safeUser } = existing;
    return safeUser;
}
//create admin
export async function createAdmin(input: CreateUserInput) {
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