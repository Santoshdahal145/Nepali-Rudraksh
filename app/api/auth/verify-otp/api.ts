import { ApiRequestType } from "@/lib/requestAPI";

type VerifyOtpRegisterDataPayload = {
    email: string;
    otp: string;
}

export const verifyOtpRegisterApi = (data: VerifyOtpRegisterDataPayload): ApiRequestType => {
    return {
        method: "post",
        route: `/auth/verify-otp`,
        payload: data,
        showToast: true,
        successMessage: "Email verified successfully",
    };
}

