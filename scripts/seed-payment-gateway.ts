import { db } from "@/src/prisma/db";

export async function seedPaymentGateway() {
  const paymentGateway = await db.orm.public.PaymentSettings.upsert({
    create: {
      esewaEnabled: true,
      khaltiEnabled: true,
      stripeEnabled: true,
      codEnabled: true,

    },
    update: {
      esewaEnabled: true,
      khaltiEnabled: true,
      stripeEnabled: true,
      codEnabled: true,
    },
  });

  console.log(`Payment gateway seeded: ${paymentGateway}`);
}

