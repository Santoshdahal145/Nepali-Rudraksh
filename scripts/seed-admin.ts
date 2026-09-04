import bcrypt from "bcryptjs";
import { db } from "@/src/prisma/db";

export async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const firstName = process.env.ADMIN_FIRST_NAME || "Admin";
  const lastName = process.env.ADMIN_LAST_NAME || "Admin";
  const phoneNumber = process.env.ADMIN_PHONE_NUMBER || "0000000000";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be defined in .env");
  }

  if (password.length < 8) {
    throw new Error("Admin password must be at least 8 characters.");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await db.orm.public.User.upsert({
    create: {
      email,
      firstName,
      lastName,
      phoneNumber,
      password: hashedPassword,
      role: "ADMIN",
    },
    update: {
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
    },
  });

  console.log(`Admin seeded: ${admin.email}`);
}
