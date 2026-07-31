import bcrypt from "bcrypt";
import prisma from "../src/lib/prisma.js";

async function main() {
  const password = await bcrypt.hash(
    "admin123",
    10
  );

  // =========================
  // ADMIN
  // =========================

  await prisma.admin.upsert({
    where: {
      email: "admin@standstride.com",
    },

    update: {
      name: "Admin",
      role: "ADMIN",
      password,
    },

    create: {
      name: "Admin",
      email: "admin@standstride.com",
      password,
      role: "ADMIN",
    },
  });

  // =========================
  // COORDINATOR
  // =========================

  await prisma.admin.upsert({
    where: {
      email: "coordinator@standstride.com",
    },

    update: {
      name: "Coordinator",
      role: "COORDINATOR",
      password,
    },

    create: {
      name: "Coordinator",
      email: "coordinator@standstride.com",
      password,
      role: "COORDINATOR",
    },
  });

  // =========================
  // FACILITATOR
  // =========================

  await prisma.admin.upsert({
    where: {
      email: "facilitator@standstride.com",
    },

    update: {
      name: "Facilitator",
      role: "FACILITATOR",
      password,
    },

    create: {
      name: "Facilitator",
      email: "facilitator@standstride.com",
      password,
      role: "FACILITATOR",
    },
  });

  // =========================
  // MENTOR STAFF ACCOUNT
  // =========================

  const mentorAdmin =
    await prisma.admin.upsert({
      where: {
        email: "mentor@standstride.com",
      },

      update: {
        name: "Mentor",
        role: "MENTOR",
        password,
      },

      create: {
        name: "Mentor",
        email: "mentor@standstride.com",
        password,
        role: "MENTOR",
      },
    });

  // =========================
  // MENTOR PROFILE
  // =========================
  //
  // The Mentor profile is linked
  // to the staff account through
  // adminId.
  //
  // adminId is unique, so upsert
  // prevents duplicate Mentor
  // profiles when seed runs again.
  // =========================

  await prisma.mentor.upsert({
    where: {
      adminId: mentorAdmin.id,
    },

    update: {
      name: "Mentor",
      email: "mentor@standstride.com",
    },

    create: {
      name: "Mentor",
      email: "mentor@standstride.com",
      adminId: mentorAdmin.id,
    },
  });

  console.log(
    "✅ Admin, Coordinator, Facilitator and Mentor created"
  );
}

main()
  .catch((error) => {
    console.error(
      "SEED ERROR:",
      error
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });