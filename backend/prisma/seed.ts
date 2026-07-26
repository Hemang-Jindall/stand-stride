import bcrypt from "bcrypt";
import prisma from "../src/lib/prisma.js";

async function main() {
  const password = await bcrypt.hash("admin123", 10);

  await prisma.admin.upsert({
    where: {
      email: "admin@standstride.com",
    },
    update: {},
    create: {
      name: "Admin",
      email: "admin@standstride.com",
      password,
    },
  });

  console.log("✅ Admin created");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });