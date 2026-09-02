import { ApiRequestType } from "@/lib/requestAPI";

type ChangePasswordDataPayload = {
    oldPassword: string;
    newPassword: string;
}

export const changePasswordApi = (data: ChangePasswordDataPayload): ApiRequestType => {
    return {
        method: "post",
        route: `/auth/change-password`,
        payload: data,
        showToast: true,
        successMessage: "Password changed successfully"
    };
}

