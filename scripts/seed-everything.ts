import { seedAdmin } from "./seed-admin"
import { seedPaymentGateway } from "./seed-payment-gateway"
import { seedStoreSetting } from "./seed-store-setting"
import { db } from "@/src/prisma/db";

async function main(){
    try {
        
    await seedAdmin()
    await seedPaymentGateway()
    await seedStoreSetting()

    } catch (error) {
        console.error(error)
    }finally{
        await db.close()
    }
}
main()

