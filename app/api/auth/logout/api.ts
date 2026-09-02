import { ApiRequestType } from "@/lib/requestAPI";


export const logoutApi = (): ApiRequestType => {
    return {
        method: "post",
        route: `/auth/logout`,  
        showToast: true,
        successMessage: "Logged out successfully"
    };
}

