import { ApiRequestType } from "@/lib/requestAPI";

type ForgotPasswordDataPayload = {
    email: string;
}

export const forgotPasswordApi = (data: ForgotPasswordDataPayload): ApiRequestType => {
    return {
        method: "post",
        route: `/auth/forgot-password`,
        payload: data,
        showToast: true,
        successMessage: "OTP sent successfully",
    };
}

