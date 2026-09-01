import { ApiRequestType } from "@/lib/requestAPI";

type RegisterDataPayload = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    countryCode: string;
    phoneNumber: string;
    fullAddress: {
        address: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    }
}

export const registerApi = (data: RegisterDataPayload): ApiRequestType => {
    return {
        method: "post",
        route: `/user/register`,
        payload: data,

    };
}

