import { ApiRequestType } from "@/lib/requestAPI";

type LoginDataPayload = {
    email: string;
    password: string;
}

export const loginApi = (data: LoginDataPayload): ApiRequestType => {
    return {
        method: "post",
        route: `/auth/login`,
        payload: data,
        showToast: true,
        successMessage: "Logged in successfully"
    };
}

