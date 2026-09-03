import bcrypt from "bcryptjs";
import { db } from "../../src/prisma/db";
import { sendEmail } from "../helpers/emailHelper";
import { generateOtp } from "../user/user.service";
import type { ChangePasswordInput, ForgotPasswordInput, LoginInput, ResetPasswordInput, ValidateOtpInput } from "./auth.schema";
import { issueTokens } from "./token.service";
import { NotFoundError, UnauthorizedError } from "@/lib/error";
import { Temporal } from "@js-temporal/polyfill";
import { FieldOutputTypes } from "@/src/prisma/contract";

const OTP_EXPIRY_MINUTES = 15;
const MAX_OTP_ATTEMPTS = 5;



const getSafeUserFromDB=(user: FieldOutputTypes["public"]["User"])=>{
    const { password,hashedRefreshToken,createdAt,updatedAt, ...safeUser } = user;
    return safeUser;
}

// ── services ─────────────────────────────────────────────────────────────────

export async function login(input: LoginInput) {

    const existing = await db.orm.public.User
        .where({ email: input.email })
        .first();
    if (!existing) {
  throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(input.password, existing.password);
    if (!isPasswordValid) {
         throw new UnauthorizedError("Invalid email or password");
    }
    const safeUser=getSafeUserFromDB(existing);
    const tokens = await issueTokens(existing.id, existing.role ?? "USER");

    return { user:safeUser, tokens };
}

/**
 * Validates a user's EMAIL_VERIFICATION OTP.
 * On success the OTP is consumed and the user's email is marked verified.
 */
export async function validateUserEmailVerificationOtp(input: ValidateOtpInput) {

    const user = await db.orm.public.User
        .where({ email: input.email })
        .first();
    if (!user) {
        throw new Error("User not found");
    }

const otp = await db.orm.public.Otp
  .where({
    userId: user.id,
    type: "EMAIL_VERIFICATION",
  })
  .orderBy((otp) => otp.createdAt.desc())
  .first();

    if (!otp) {
        throw new Error("No verification OTP found. Please request a new one.");
    }
   if (otp.consumedAt && otp.consumedAt <= otp.expiresAt) {
     
        throw new Error("OTP has already been used.");
    }
    const now = Temporal.Now.instant();
    const expiresAt = otp.expiresAt;

    if (Temporal.Instant.compare(now, expiresAt) > 0) {
        throw new Error("OTP has expired. Please request a new one.");
    }

    if (otp.attempts >= MAX_OTP_ATTEMPTS) {
        throw new Error("Too many failed attempts. Please request a new OTP.");
    }

    const isValid = await bcrypt.compare(input.otp, otp.codeHash);

    if (!isValid) {
        // Increment attempt counter
        await db.orm.public.Otp
            .where({ id: otp.id })
            .update({ attempts: otp.attempts + 1 });
        throw new Error("Invalid OTP.");
    }

    await db.transaction(async (tx) => {
        await tx.orm.public.Otp
            .where({ id: otp.id })
            .update({ consumedAt: Temporal.Now.instant() });

        await tx.orm.public.User
            .where({ id: user.id })
            .update({ isEmailVerified: true });
    });

    const safeUser=getSafeUserFromDB(user);
    const tokens = await issueTokens(user.id, user.role ?? "USER");

    return { user:safeUser, tokens };
}
/**
 * Issues a PASSWORD_RESET OTP for the given email and mails it to the user.
 * If a previous OTP of this type exists for the user it is replaced (upsert).
 */
export async function forgotUserPassword(input: ForgotPasswordInput) {
    const user = await db.orm.public.User
        .where({ email: input.email })
        .first();

    // Always return a generic message to avoid user-enumeration attacks
    if (!user) {
        return { message: "If that email is registered you will receive a reset code shortly." };
    }

    const code = generateOtp();
    const codeHash = await bcrypt.hash(code, 10);
 const expiresAt = Temporal.Now.instant().add({
    minutes: OTP_EXPIRY_MINUTES,
});

    // Delete any existing PASSWORD_RESET OTP for this user then create a fresh one
    await db.transaction(async (tx) => {
        const existing = await tx.orm.public.Otp
            .where({ userId: user.id, type: "PASSWORD_RESET" })
            .first();

        if (existing) {
            await tx.orm.public.Otp
                .where({ id: existing.id })
                .delete();
        }

        await tx.orm.public.Otp.create({
            userId: user.id,
            codeHash,
            type: "PASSWORD_RESET",
            expiresAt,
        });
    });

    await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: `<p>Your password reset code is <strong>${code}</strong>. It expires in ${OTP_EXPIRY_MINUTES} minutes.</p><p>If you did not request this, please ignore this email.</p>`,
    });

    return { message: "If that email is registered you will receive a reset code shortly." };
}

/**
 * Verifies the PASSWORD_RESET OTP and updates the user's password.
 * The OTP is consumed regardless of the outcome of the password update.
 */
export async function resetUserPassword(input: ResetPasswordInput) {
    const user = await db.orm.public.User
        .where({ email: input.email })
        .first();
    if (!user) {
        throw new Error("User not found");
    }

    const otp = await db.orm.public.Otp
        .where({ userId: user.id, type: "PASSWORD_RESET" })
        .first();
    if (!otp) {
        throw new Error("No password reset OTP found. Please request a new one.");
    }

    if (otp.consumedAt && otp.consumedAt <= otp.expiresAt) {
        throw new Error("OTP has already been used.");
    }

  if (Temporal.Instant.compare(Temporal.Now.instant(), otp.expiresAt) >= 0) {
    throw new Error("OTP has expired. Please request a new one.");
}

    if (otp.attempts >= MAX_OTP_ATTEMPTS) {
        throw new Error("Too many failed attempts. Please request a new OTP.");
    }

    const isValid = await bcrypt.compare(input.otp, otp.codeHash);

    if (!isValid) {
        await db.orm.public.Otp
            .where({ id: otp.id })
            .update({ attempts: otp.attempts + 1 });
        throw new Error("Invalid OTP.");
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    await db.transaction(async (tx) => {
        // Consume the OTP
        await tx.orm.public.Otp
            .where({ id: otp.id })
         .update({ consumedAt: Temporal.Now.instant()});

        // Update the user's password
        await tx.orm.public.User
            .where({ id: user.id })
            .update({ password: hashedPassword });
    });

    return { message: "Password reset successfully." };
}

export async function changeUserPassword(userId: number,input: ChangePasswordInput) {
    const user = await db.orm.public.User
        .where({ id: userId })
        .first();
    if (!user) {
        throw new NotFoundError("User not found");
    }
    const isPasswordValid = await bcrypt.compare(input.oldPassword, user.password);
    if (!isPasswordValid) {
         throw new UnauthorizedError("Invalid email or password");
    }
    const hashedPassword = await bcrypt.hash(input.newPassword, 10);
    await db.orm.public.User
        .where({ id: user.id })
        .update({ password: hashedPassword });


    return { message: "Password changed successfully." };
}
