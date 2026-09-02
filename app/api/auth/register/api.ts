import { ApiRequestType } from "@/lib/requestAPI";

type RegisterDataPayload = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
 
}

export const registerApi = (data: RegisterDataPayload): ApiRequestType => {
    return {
        method: "post",
        route: `/auth/register`,
        payload: data,
        showToast:true,
        successMessage:"Registered successfully",
    };
}

