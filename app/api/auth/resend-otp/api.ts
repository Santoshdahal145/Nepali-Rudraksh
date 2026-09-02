import { ApiRequestType } from "@/lib/requestAPI";

type ResendOtpDataPayload = {
    email: string;
}

export const resendOtpApi = (data: ResendOtpDataPayload): ApiRequestType => {
    return {
        method: "post",
        route: `/auth/resend-otp`,
        payload: data,
        showToast: true,
        successMessage: "OTP resent successfully",
    };
}

