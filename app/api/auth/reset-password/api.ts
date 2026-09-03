import { ApiRequestType } from "@/lib/requestAPI";

type ResetPasswordDataPayload = {
    email: string;
    otp: string;
    password: string;
}

export const resetPasswordWithOtpApi = (data: ResetPasswordDataPayload): ApiRequestType => {
    return {
        method: "post",
        route: `/auth/reset-password`,
        payload: data,
        showToast: true,
        successMessage: "Password reset successfully"
    };
}

