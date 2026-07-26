import type { Response } from "express";

import prisma from "../lib/prisma.js";

import type {
  AuthRequest,
} from "../middleware/auth.middleware.js";

// =========================
// GET ALL MENTORS
// Admin
// =========================

export async function getMentors(
  req: AuthRequest,
  res: Response
) {
  try {
    if (
      !req.user ||
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    const mentors =
      await prisma.mentor.findMany({
        include: {
          _count: {
            select: {
              students: true,
            },
          },
        },

        orderBy: {
          name: "asc",
        },
      });

    return res.json(mentors);
  } catch (error) {
    console.error(
      "GET MENTORS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to load mentors.",
    });
  }
}

// =========================
// CREATE MENTOR
// Admin
// =========================

export async function createMentor(
  req: AuthRequest,
  res: Response
) {
  try {
    if (
      !req.user ||
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    const {
      name,
      email,
      phone,
    } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return res.status(400).json({
        message: "Mentor name is required",
      });
    }

    const cleanEmail =
      typeof email === "string" &&
      email.trim()
        ? email.trim().toLowerCase()
        : null;

    const cleanPhone =
      typeof phone === "string" &&
      phone.trim()
        ? phone.trim()
        : null;

    if (cleanEmail) {
      const existing =
        await prisma.mentor.findUnique({
          where: {
            email: cleanEmail,
          },
        });

      if (existing) {
        return res.status(409).json({
          message:
            "A mentor with this email already exists",
        });
      }
    }

    const mentor =
      await prisma.mentor.create({
        data: {
          name: name.trim(),
          email: cleanEmail,
          phone: cleanPhone,
        },
      });

    return res.status(201).json(mentor);
  } catch (error) {
    console.error(
      "CREATE MENTOR ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to create mentor.",
    });
  }
}

// =========================
// GET MENTOR ASSIGNMENTS
// Admin
// =========================

export async function getMentorAssignments(
  req: AuthRequest,
  res: Response
) {
  try {
    if (
      !req.user ||
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    const students =
      await prisma.student.findMany({
        select: {
          id: true,
          rollNumber: true,
          firstName: true,
          lastName: true,
          email: true,
          mentorId: true,

          batch: {
            select: {
              id: true,
              name: true,
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

        orderBy: [
          {
            firstName: "asc",
          },
          {
            lastName: "asc",
          },
        ],
      });

    return res.json(students);
  } catch (error) {
    console.error(
      "GET MENTOR ASSIGNMENTS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load mentor assignments.",
    });
  }
}

// =========================
// ASSIGN MENTOR
// Admin
// =========================

export async function assignMentor(
  req: AuthRequest,
  res: Response
) {
  try {
    if (
      !req.user ||
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    const studentId =
      req.params.studentId;

    if (
      typeof studentId !== "string"
    ) {
      return res.status(400).json({
        message: "Invalid student ID",
      });
    }

    const { mentorId } = req.body;

    if (
      typeof mentorId !== "string" ||
      !mentorId
    ) {
      return res.status(400).json({
        message: "Mentor is required",
      });
    }

    const student =
      await prisma.student.findUnique({
        where: {
          id: studentId,
        },
      });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const mentor =
      await prisma.mentor.findUnique({
        where: {
          id: mentorId,
        },
      });

    if (!mentor) {
      return res.status(404).json({
        message: "Mentor not found",
      });
    }

    const updatedStudent =
      await prisma.student.update({
        where: {
          id: studentId,
        },

        data: {
          mentorId,
        },

        include: {
          batch: true,
          mentor: true,
        },
      });

    return res.json(updatedStudent);
  } catch (error) {
    console.error(
      "ASSIGN MENTOR ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to assign mentor.",
    });
  }
}

// =========================
// REMOVE MENTOR ASSIGNMENT
// Admin
// =========================

export async function removeMentorAssignment(
  req: AuthRequest,
  res: Response
) {
  try {
    if (
      !req.user ||
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    const studentId =
      req.params.studentId;

    if (
      typeof studentId !== "string"
    ) {
      return res.status(400).json({
        message: "Invalid student ID",
      });
    }

    const student =
      await prisma.student.findUnique({
        where: {
          id: studentId,
        },
      });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const updatedStudent =
      await prisma.student.update({
        where: {
          id: studentId,
        },

        data: {
          mentorId: null,
        },

        include: {
          batch: true,
          mentor: true,
        },
      });

    return res.json(updatedStudent);
  } catch (error) {
    console.error(
      "REMOVE MENTOR ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to remove mentor assignment.",
    });
  }
}

// =========================
// GET MY MENTOR
// Student
// =========================

export async function getMyMentor(
  req: AuthRequest,
  res: Response
) {
  try {
    if (
      !req.user ||
      req.user.role !== "student"
    ) {
      return res.status(403).json({
        message: "Student access required",
      });
    }

    const student =
      await prisma.student.findUnique({
        where: {
          id: req.user.id,
        },

        select: {
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
        message: "Student not found",
      });
    }

    return res.json({
      mentor: student.mentor,
    });
  } catch (error) {
    console.error(
      "GET MY MENTOR ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to load mentor.",
    });
  }
}