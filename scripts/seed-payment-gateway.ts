import { db } from "@/src/prisma/db";

async function seedPaymentGateway() {
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

seedPaymentGateway()
  .catch((error) => {
    console.error("Failed to seed payment gateway:", error);
    process.exit(1);
  })
  .finally(async () => {
    await db.close();
  });