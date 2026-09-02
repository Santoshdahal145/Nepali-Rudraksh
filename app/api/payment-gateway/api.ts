import { ApiRequestType } from "@/lib/requestAPI";

type UpdatePaymentGatewayPayload = {
    esewaEnabled:boolean;
    khaltiEnabled:boolean;
    stripeEnabled:boolean;
    codEnabled:boolean;
}

 const updatePaymentGateway = (data: UpdatePaymentGatewayPayload): ApiRequestType => {
    return {
        method: "post",
        route: `/payment-gateway`,
        payload: data,
        showToast: true,
        successMessage: "Payment gateway updated successfully"
    };
}


const getPaymentGateway=():ApiRequestType=>{
    return {
        method: "get",
        route: `/payment-gateway`,
        showToast: false,
    };
}

export const paymentGatewayApi={updatePaymentGateway,getPaymentGateway}