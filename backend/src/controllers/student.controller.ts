import type { Response } from "express";
import bcrypt from "bcrypt";

import prisma from "../lib/prisma.js";

import type {
  AuthRequest,
} from "../middleware/auth.middleware.js";

// =========================
// HELPER — GET LOGGED-IN MENTOR
// =========================

async function getLoggedInMentor(
  adminId: string
) {
  return prisma.mentor.findUnique({
    where: {
      adminId,
    },

    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  });
}

// =========================
// GET MY PROFILE
// GET /api/students/me
// Student
// =========================

export async function getMyProfile(
  req: AuthRequest,
  res: Response
) {
  try {
    if (
      !req.user ||
      req.user.role !== "student"
    ) {
      return res.status(403).json({
        message:
          "Student access required",
      });
    }

    const student =
      await prisma.student.findUnique({
        where: {
          id: req.user.id,
        },

        select: {
          id: true,
          rollNumber: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          createdAt: true,
          updatedAt: true,

          batch: {
            select: {
              id: true,
              name: true,
              startDate: true,
              endDate: true,

              venue: {
                select: {
                  id: true,
                  name: true,
                  address: true,
                },
              },
            },
          },

          mentor: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });

    if (!student) {
      return res.status(404).json({
        message:
          "Student not found",
      });
    }

    return res
      .status(200)
      .json(student);
  } catch (error) {
    console.error(
      "GET MY PROFILE ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Internal Server Error",
    });
  }
}

// =========================
// GET STUDENTS
// GET /api/students
//
// FACILITATOR
// COORDINATOR
// ADMIN
//   -> all students
//
// MENTOR
//   -> assigned students only
// =========================

export async function getStudents(
  req: AuthRequest,
  res: Response
) {
  try {
    if (
      !req.user ||
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message:
          "Staff access required",
      });
    }

    // =========================
    // MENTOR
    // =========================

    if (
      req.user.adminRole === "MENTOR"
    ) {
      const mentor =
        await getLoggedInMentor(
          req.user.id
        );

      if (!mentor) {
        return res.status(403).json({
          message:
            "This mentor account is not linked to a mentor profile",
        });
      }

      const students =
        await prisma.student.findMany({
          where: {
            mentorId: mentor.id,
          },

          include: {
            batch: true,
            mentor: true,
          },

          orderBy: [
            {
              firstName: "asc",
            },
            {
              lastName: "asc",
            },
          ],
        });

      return res
        .status(200)
        .json(students);
    }

    // =========================
    // OTHER STAFF
    // =========================

    const students =
      await prisma.student.findMany({
        include: {
          batch: true,
          mentor: true,
        },

        orderBy: [
          {
            firstName: "asc",
          },
          {
            lastName: "asc",
          },
        ],
      });

    return res
      .status(200)
      .json(students);
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
//
// MENTOR can only access
// assigned students.
// =========================

export async function getStudent(
  req: AuthRequest,
  res: Response
) {
  try {
    if (
      !req.user ||
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message:
          "Staff access required",
      });
    }

    const rawId =
      req.params.id;

    const id =
      Array.isArray(rawId)
        ? rawId[0]
        : rawId;

    if (!id) {
      return res.status(400).json({
        message:
          "Student ID is required",
      });
    }

    // =========================
    // MENTOR
    // =========================

    if (
      req.user.adminRole === "MENTOR"
    ) {
      const mentor =
        await getLoggedInMentor(
          req.user.id
        );

      if (!mentor) {
        return res.status(403).json({
          message:
            "This mentor account is not linked to a mentor profile",
        });
      }

      const student =
        await prisma.student.findFirst({
          where: {
            id,
            mentorId: mentor.id,
          },

          include: {
            batch: true,
            mentor: true,
          },
        });

      if (!student) {
        return res.status(404).json({
          message:
            "Student not found or not assigned to you",
        });
      }

      return res
        .status(200)
        .json(student);
    }

    // =========================
    // OTHER STAFF
    // =========================

    const student =
      await prisma.student.findUnique({
        where: {
          id,
        },

        include: {
          batch: true,
          mentor: true,
        },
      });

    if (!student) {
      return res.status(404).json({
        message:
          "Student not found",
      });
    }

    return res
      .status(200)
      .json(student);
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
//
// FACILITATOR
// COORDINATOR
// ADMIN
//
// MENTOR cannot create students.
// Route middleware enforces this.
// =========================

export async function createStudent(
  req: AuthRequest,
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

    const cleanBatchId =
      batchId.trim();

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    const cleanRollNumber =
      rollNumber.trim();

    const batch =
      await prisma.batch.findUnique({
        where: {
          id: cleanBatchId,
        },

        select: {
          id: true,
        },
      });

    if (!batch) {
      return res.status(400).json({
        message:
          "Invalid batchId",
      });
    }

    const existingStudent =
      await prisma.student.findFirst({
        where: {
          OR: [
            {
              email:
                cleanEmail,
            },
            {
              rollNumber:
                cleanRollNumber,
            },
          ],
        },

        select: {
          id: true,
        },
      });

    if (existingStudent) {
      return res.status(409).json({
        message:
          "A student with this email or roll number already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const student =
      await prisma.student.create({
        data: {
          rollNumber:
            cleanRollNumber,

          firstName:
            firstName.trim(),

          lastName:
            lastName.trim(),

          email:
            cleanEmail,

          phone:
            typeof phone === "string" &&
            phone.trim()
              ? phone.trim()
              : null,

          password:
            hashedPassword,

          batch: {
            connect: {
              id: cleanBatchId,
            },
          },
        },

        include: {
          batch: true,
          mentor: true,
        },
      });

    return res
      .status(201)
      .json(student);
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
//
// FACILITATOR
// COORDINATOR
// ADMIN
//
// MENTOR cannot edit students.
// Route middleware enforces this.
// =========================

export async function updateStudent(
  req: AuthRequest,
  res: Response
) {
  try {
    const rawId =
      req.params.id;

    const id =
      Array.isArray(rawId)
        ? rawId[0]
        : rawId;

    if (!id) {
      return res.status(400).json({
        message:
          "Student ID is required",
      });
    }

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
    // VALIDATE ROLL NUMBER
    // =========================

    let cleanRollNumber:
      | string
      | undefined;

    if (rollNumber !== undefined) {
      if (
        typeof rollNumber !== "string" ||
        !rollNumber.trim()
      ) {
        return res.status(400).json({
          message:
            "Invalid roll number",
        });
      }

      cleanRollNumber =
        rollNumber.trim();
    }

    // =========================
    // VALIDATE FIRST NAME
    // =========================

    let cleanFirstName:
      | string
      | undefined;

    if (firstName !== undefined) {
      if (
        typeof firstName !== "string" ||
        !firstName.trim()
      ) {
        return res.status(400).json({
          message:
            "Invalid first name",
        });
      }

      cleanFirstName =
        firstName.trim();
    }

    // =========================
    // VALIDATE LAST NAME
    // =========================

    let cleanLastName:
      | string
      | undefined;

    if (lastName !== undefined) {
      if (
        typeof lastName !== "string" ||
        !lastName.trim()
      ) {
        return res.status(400).json({
          message:
            "Invalid last name",
        });
      }

      cleanLastName =
        lastName.trim();
    }

    // =========================
    // VALIDATE EMAIL
    // =========================

    let cleanEmail:
      | string
      | undefined;

    if (email !== undefined) {
      if (
        typeof email !== "string" ||
        !email.trim()
      ) {
        return res.status(400).json({
          message:
            "Invalid email",
        });
      }

      cleanEmail =
        email
          .trim()
          .toLowerCase();
    }

    // =========================
    // VALIDATE BATCH
    // =========================

    let cleanBatchId:
      | string
      | undefined;

    if (batchId !== undefined) {
      if (
        typeof batchId !== "string" ||
        !batchId.trim()
      ) {
        return res.status(400).json({
          message:
            "Invalid batchId",
        });
      }

      cleanBatchId =
        batchId.trim();

      const batch =
        await prisma.batch.findUnique({
          where: {
            id: cleanBatchId,
          },

          select: {
            id: true,
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
    // CHECK UNIQUE FIELDS
    // =========================

    if (
      cleanEmail ||
      cleanRollNumber
    ) {
      const duplicate =
        await prisma.student.findFirst({
          where: {
            id: {
              not: id,
            },

            OR: [
              ...(cleanEmail
                ? [
                    {
                      email:
                        cleanEmail,
                    },
                  ]
                : []),

              ...(cleanRollNumber
                ? [
                    {
                      rollNumber:
                        cleanRollNumber,
                    },
                  ]
                : []),
            ],
          },

          select: {
            id: true,
          },
        });

      if (duplicate) {
        return res.status(409).json({
          message:
            "A student with this email or roll number already exists",
        });
      }
    }

    // =========================
    // PASSWORD
    // =========================

    let hashedPassword:
      | string
      | undefined;

    if (password !== undefined) {
      if (
        typeof password !== "string" ||
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
    // UPDATE
    // =========================

    const student =
      await prisma.student.update({
        where: {
          id,
        },

        data: {
          ...(cleanRollNumber !==
            undefined && {
            rollNumber:
              cleanRollNumber,
          }),

          ...(cleanFirstName !==
            undefined && {
            firstName:
              cleanFirstName,
          }),

          ...(cleanLastName !==
            undefined && {
            lastName:
              cleanLastName,
          }),

          ...(cleanEmail !==
            undefined && {
            email:
              cleanEmail,
          }),

          ...(phone !==
            undefined && {
            phone:
              typeof phone === "string" &&
              phone.trim()
                ? phone.trim()
                : null,
          }),

          ...(cleanBatchId !==
            undefined && {
            batch: {
              connect: {
                id: cleanBatchId,
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
          mentor: true,
        },
      });

    return res
      .status(200)
      .json(student);
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
//
// ADMIN ONLY
// Route middleware enforces this.
// =========================

export async function deleteStudent(
  req: AuthRequest,
  res: Response
) {
  try {
    const rawId =
      req.params.id;

    const id =
      Array.isArray(rawId)
        ? rawId[0]
        : rawId;

    if (!id) {
      return res.status(400).json({
        message:
          "Student ID is required",
      });
    }

    const existingStudent =
      await prisma.student.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
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