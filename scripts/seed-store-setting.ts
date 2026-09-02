import { db } from "@/src/prisma/db";

async function seedStoreSetting() {
  const storeSettings = await db.orm.public.StoreSettings.upsert({
    create: {
  storeName: "Nepali Rudraksh",
  customerSupportEmail: "support@nepalirudraksh.com",
  standardConsecrationFee: 25,
  freeShippingThreshold: 100,
  primaryTempleConsecrationOrigin: "Pashupatinath Temple",
  
    },
    update:{
        standardConsecrationFee: 25,
        freeShippingThreshold: 100,
        primaryTempleConsecrationOrigin: "Pashupatinath Temple",
 
    }
  });

  console.log(`Store setting seeded: ${storeSettings}`);
}

seedStoreSetting()
  .catch((error) => {
    console.error("Failed to seed store setting:", error);
    process.exit(1);
  })
  .finally(async () => {
    await db.close();
  });