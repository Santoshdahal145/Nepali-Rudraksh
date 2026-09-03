import { z } from "zod";

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
    email: z.email(),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
    email: z.email(),
    otp: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});
export const validateOtpSchema = z.object({
    email: z.email(),
    otp: z.string().min(6, "OTP must be at least 6 characters long"),

});
export const resendOtpSchema = z.object({
    email: z.email(),
    otpType:z.enum(["PASSWORD_RESET", "EMAIL_VERIFICATION"]),
});

export const changePasswordSchema = z.object({
    oldPassword: z.string().min(8, "Password must be at least 8 characters long"),
    newPassword: z.string().min(8, "Password must be at least 8 characters long"),

});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ValidateOtpInput = z.infer<typeof validateOtpSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;