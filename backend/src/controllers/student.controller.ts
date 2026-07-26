import type {
  Request,
  Response,
} from "express";

import bcrypt from "bcrypt";

import prisma from "../lib/prisma.js";

// =========================
// GET ALL STUDENTS
// GET /api/students
// =========================

export async function getStudents(
  _req: Request,
  res: Response
) {
  try {
    const students =
      await prisma.student.findMany({
        include: {
          batch: true,
        },

        orderBy: {
          firstName: "asc",
        },
      });

    return res.status(200).json(
      students
    );
  } catch (error) {
    console.error(
      "GET STUDENTS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Internal Server Error",
    });
  }
}

// =========================
// GET ONE STUDENT
// GET /api/students/:id
// =========================

export async function getStudent(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const student =
      await prisma.student.findUnique({
        where: {
          id,
        },

        include: {
          batch: true,
        },
      });

    if (!student) {
      return res.status(404).json({
        message:
          "Student not found",
      });
    }

    return res.status(200).json(
      student
    );
  } catch (error) {
    console.error(
      "GET STUDENT ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Internal Server Error",
    });
  }
}

// =========================
// CREATE STUDENT
// POST /api/students
// =========================

export async function createStudent(
  req: Request,
  res: Response
) {
  try {
    const {
      rollNumber,
      firstName,
      lastName,
      email,
      phone,
      batchId,
      password,
    } = req.body;

    // =========================
    // Validation
    // =========================

    if (
      typeof rollNumber !== "string" ||
      !rollNumber.trim() ||
      typeof firstName !== "string" ||
      !firstName.trim() ||
      typeof lastName !== "string" ||
      !lastName.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof batchId !== "string" ||
      !batchId.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message:
          "rollNumber, firstName, lastName, email, batchId and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    // =========================
    // Check Batch
    // =========================

    const batch =
      await prisma.batch.findUnique({
        where: {
          id: batchId,
        },
      });

    if (!batch) {
      return res.status(400).json({
        message:
          "Invalid batchId",
      });
    }

    // =========================
    // Check Existing Student
    // =========================

    const existingStudent =
      await prisma.student.findFirst({
        where: {
          OR: [
            {
              email:
                email
                  .trim()
                  .toLowerCase(),
            },
            {
              rollNumber:
                rollNumber.trim(),
            },
          ],
        },
      });

    if (existingStudent) {
      return res.status(409).json({
        message:
          "A student with this email or roll number already exists",
      });
    }

    // =========================
    // Hash Password
    // =========================

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // =========================
    // Create Student
    // =========================

    const student =
      await prisma.student.create({
        data: {
          rollNumber:
            rollNumber.trim(),

          firstName:
            firstName.trim(),

          lastName:
            lastName.trim(),

          email:
            email
              .trim()
              .toLowerCase(),

          phone:
            typeof phone ===
              "string" &&
            phone.trim()
              ? phone.trim()
              : null,

          password:
            hashedPassword,

          batch: {
            connect: {
              id: batchId,
            },
          },
        },

        include: {
          batch: true,
        },
      });

    return res.status(201).json(
      student
    );
  } catch (error) {
    console.error(
      "CREATE STUDENT ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Internal Server Error",
    });
  }
}

// =========================
// UPDATE STUDENT
// PUT /api/students/:id
// =========================

export async function updateStudent(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const existingStudent =
      await prisma.student.findUnique({
        where: {
          id,
        },
      });

    if (!existingStudent) {
      return res.status(404).json({
        message:
          "Student not found",
      });
    }

    const {
      rollNumber,
      firstName,
      lastName,
      email,
      phone,
      batchId,
      password,
    } = req.body;

    // =========================
    // Check Batch
    // =========================

    if (batchId !== undefined) {
      if (
        typeof batchId !==
          "string" ||
        !batchId.trim()
      ) {
        return res.status(400).json({
          message:
            "Invalid batchId",
        });
      }

      const batch =
        await prisma.batch.findUnique({
          where: {
            id: batchId,
          },
        });

      if (!batch) {
        return res.status(400).json({
          message:
            "Invalid batchId",
        });
      }
    }

    // =========================
    // Password
    // =========================

    let hashedPassword:
      | string
      | undefined;

    if (password !== undefined) {
      if (
        typeof password !==
          "string" ||
        password.length < 6
      ) {
        return res.status(400).json({
          message:
            "Password must be at least 6 characters",
        });
      }

      hashedPassword =
        await bcrypt.hash(
          password,
          10
        );
    }

    // =========================
    // Update Student
    // =========================

    const student =
      await prisma.student.update({
        where: {
          id,
        },

        data: {
          ...(rollNumber !==
            undefined && {
            rollNumber:
              String(
                rollNumber
              ).trim(),
          }),

          ...(firstName !==
            undefined && {
            firstName:
              String(
                firstName
              ).trim(),
          }),

          ...(lastName !==
            undefined && {
            lastName:
              String(
                lastName
              ).trim(),
          }),

          ...(email !==
            undefined && {
            email:
              String(email)
                .trim()
                .toLowerCase(),
          }),

          ...(phone !==
            undefined && {
            phone:
              typeof phone ===
                "string" &&
              phone.trim()
                ? phone.trim()
                : null,
          }),

          ...(batchId !==
            undefined && {
            batch: {
              connect: {
                id: batchId,
              },
            },
          }),

          ...(hashedPassword !==
            undefined && {
            password:
              hashedPassword,
          }),
        },

        include: {
          batch: true,
        },
      });

    return res.status(200).json(
      student
    );
  } catch (error) {
    console.error(
      "UPDATE STUDENT ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Internal Server Error",
    });
  }
}

// =========================
// DELETE STUDENT
// DELETE /api/students/:id
// =========================

export async function deleteStudent(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const existingStudent =
      await prisma.student.findUnique({
        where: {
          id,
        },
      });

    if (!existingStudent) {
      return res.status(404).json({
        message:
          "Student not found",
      });
    }

    await prisma.student.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message:
        "Student deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE STUDENT ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Internal Server Error",
    });
  }
}