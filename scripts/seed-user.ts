import bcrypt from "bcryptjs";
import { db } from "@/src/prisma/db";

export interface SeedUserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isEmailVerified?: boolean;
}

export const sampleUsers: SeedUserData[] = [
  {
    firstName: "Aarav",
    lastName: "Sharma",
    email: "aarav.sharma@example.com",
    phoneNumber: "+977-9841122334",
    isEmailVerified: true,
  },
  {
    firstName: "Priya",
    lastName: "Adhikari",
    email: "priya.adhikari@example.com",
    phoneNumber: "+977-9841234567",
    isEmailVerified: true,
  },
  {
    firstName: "Rohan",
    lastName: "Shrestha",
    email: "rohan.shrestha@example.com",
    phoneNumber: "+977-9841345678",
    isEmailVerified: true,
  },
  {
    firstName: "Sunita",
    lastName: "Thapa",
    email: "sunita.thapa@example.com",
    phoneNumber: "+977-9841456789",
    isEmailVerified: true,
  },
  {
    firstName: "Bikash",
    lastName: "Karki",
    email: "bikash.karki@example.com",
    phoneNumber: "+977-9841567890",
    isEmailVerified: true,
  },
  {
    firstName: "Anjali",
    lastName: "Gurung",
    email: "anjali.gurung@example.com",
    phoneNumber: "+977-9841678901",
    isEmailVerified: true,
  },
  {
    firstName: "Deepak",
    lastName: "Poudel",
    email: "deepak.poudel@example.com",
    phoneNumber: "+977-9841789012",
    isEmailVerified: true,
  },
  {
    firstName: "Pooja",
    lastName: "Rai",
    email: "pooja.rai@example.com",
    phoneNumber: "+977-9841890123",
    isEmailVerified: true,
  },
  {
    firstName: "Manish",
    lastName: "Tamang",
    email: "manish.tamang@example.com",
    phoneNumber: "+977-9841901234",
    isEmailVerified: true,
  },
  {
    firstName: "Kriti",
    lastName: "Joshi",
    email: "kriti.joshi@example.com",
    phoneNumber: "+977-9842012345",
    isEmailVerified: true,
  },
];

export const DEFAULT_USER_PASSWORD = "UserPassword123!";

export async function seedUsers() {
  const hashedPassword = await bcrypt.hash(DEFAULT_USER_PASSWORD, 10);

  console.log(`Starting to seed ${sampleUsers.length} users...`);

  for (const user of sampleUsers) {
    const seededUser = await db.orm.public.User.upsert({
      create: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        password: hashedPassword,
        role: "USER",
        isEmailVerified: user.isEmailVerified ?? true,
      },
      update: {
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        password: hashedPassword,
        role: "USER",
        isEmailVerified: user.isEmailVerified ?? true,
      },
    });

    console.log(
      `User seeded: ${seededUser.firstName} ${seededUser.lastName} (${seededUser.email})`
    );
  }

  console.log(`Successfully seeded ${sampleUsers.length} users.`);
  console.log(`Default password for seeded users: ${DEFAULT_USER_PASSWORD}`);
}

async function main() {
  try {
    await seedUsers();
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    await db.close();
  }
}

const isDirectRun =
  Boolean(process.argv[1]?.includes("seed-user")) ||
  Boolean((import.meta as { main?: boolean }).main);

if (isDirectRun) {
  main();
}
