export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { seedAdmin } = await import("@/scripts/seed-admin");
    try {
      await seedAdmin();
    } catch (error) {
      console.error("Auto-seeding admin failed on startup:", error);
    }
  }
}
