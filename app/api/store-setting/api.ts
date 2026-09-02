import { ApiRequestType } from "@/lib/requestAPI";

type UpdateStoreSettingPayload = {
    storeName:string;
    customerSupportEmail:string;
    standardConsecrationFee:number;
    freeShippingThreshold:number;
    primaryTempleConsecrationOrigin:string;
}

 const updateStoreSetting = (data: UpdateStoreSettingPayload): ApiRequestType => {
    return {
        method: "post",
        route: `/store-setting`,
        payload: data,
        showToast: true,
        successMessage: "Store setting updated successfully"
    };
}


const getStoreSetting=():ApiRequestType=>{
    return {
        method: "get",
        route: `/store-setting`,
        showToast: false,
    };
}

export const storeSettingApi={updateStoreSetting,getStoreSetting}