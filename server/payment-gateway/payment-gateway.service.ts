import { db } from "../../src/prisma/db";
import { UpdatePaymentGatewayInput } from "./payment-gateway.schema";


export async function updatePaymentGateway(
  data: UpdatePaymentGatewayInput
) {
  return await db.orm.public.PaymentSettings.where({id:1}).update(data)
}


export async function getPaymentGateway() {
  return await db.orm.public.PaymentSettings.first()
}