import { ApiRequestType } from "@/lib/requestAPI";

type UpdateUserDataPayload = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

export const updateUserApi = ( data: UpdateUserDataPayload): ApiRequestType => {
    return {
        method: "post",
        route: `/users/me`,
        payload: data,
        showToast: true,
        successMessage: "Profile updated successfully"
    };
}

