import bcrypt from "bcrypt";
import prisma from "./src/lib/prisma.js";

async function main() {
  const admin = await prisma.admin.findUnique({
    where: {
      email: "admin@standstride.com",
    },
  });

  console.log("Admin found:", !!admin);

  if (admin) {
    const matches = await bcrypt.compare(
      "admin123",
      admin.password
    );

    console.log("Password matches admin123:", matches);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });