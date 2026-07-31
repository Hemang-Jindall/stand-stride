import type { Response } from "express";

import prisma from "../lib/prisma.js";

import type {
  AuthRequest,
} from "../middleware/auth.middleware.js";

// =======================
// HELPER — GET MENTOR
// =======================

async function getLoggedInMentor(
  adminId: string
) {
  return prisma.mentor.findUnique({
    where: {
      adminId,
    },

    select: {
      id: true,
    },
  });
}

// =======================
// GET ALL ATTENDANCE
// Staff only
//
// Mentor:
// Assigned students only
//
// Other authorized staff:
// All students
// =======================

export async function getAttendance(
  req: AuthRequest,
  res: Response
) {
  try {
    if (
      !req.user ||
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Staff access required",
      });
    }

    // =======================
    // MENTOR
    // =======================

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
            "Mentor profile not found",
        });
      }

      const attendance =
        await prisma.attendance.findMany({
          where: {
            student: {
              mentorId: mentor.id,
            },
          },

          include: {
            student: {
              include: {
                batch: true,
              },
            },
          },

          orderBy: {
            date: "desc",
          },
        });

      return res
        .status(200)
        .json(attendance);
    }

    // =======================
    // OTHER STAFF
    // =======================

    const attendance =
      await prisma.attendance.findMany({
        include: {
          student: {
            include: {
              batch: true,
            },
          },
        },

        orderBy: {
          date: "desc",
        },
      });

    return res
      .status(200)
      .json(attendance);
  } catch (error) {
    console.error(
      "GET ATTENDANCE ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Internal Server Error",
    });
  }
}

// =======================
// GET MY ATTENDANCE
// Student only
// =======================

export async function getMyAttendance(
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

    const attendance =
      await prisma.attendance.findMany({
        where: {
          studentId: req.user.id,
        },

        orderBy: {
          date: "desc",
        },
      });

    return res
      .status(200)
      .json(attendance);
  } catch (error) {
    console.error(
      "GET MY ATTENDANCE ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Internal Server Error",
    });
  }
}

// =======================
// CREATE / UPDATE ATTENDANCE
// Authorized staff only
//
// Mentor:
// Assigned students only
// =======================

export async function markAttendance(
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

    const {
      studentId,
      date,
      status,
    } = req.body;

    // =======================
    // VALIDATE FIELDS
    // =======================

    if (
      typeof studentId !== "string" ||
      !studentId.trim() ||
      typeof date !== "string" ||
      !date.trim() ||
      typeof status !== "string" ||
      !status.trim()
    ) {
      return res.status(400).json({
        message:
          "studentId, date and status are required",
      });
    }

    // =======================
    // VALIDATE STATUS
    // =======================

    if (
      status !== "PRESENT" &&
      status !== "ABSENT" &&
      status !== "LEAVE"
    ) {
      return res.status(400).json({
        message:
          "Invalid attendance status",
      });
    }

    // =======================
    // GET STUDENT
    // =======================

    const student =
      await prisma.student.findUnique({
        where: {
          id: studentId,
        },

        select: {
          id: true,
          mentorId: true,
        },
      });

    if (!student) {
      return res.status(404).json({
        message:
          "Student not found",
      });
    }

    // =======================
    // MENTOR OWNERSHIP CHECK
    // =======================

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
            "Mentor profile not found",
        });
      }

      if (
        student.mentorId !== mentor.id
      ) {
        return res.status(403).json({
          message:
            "You can only mark attendance for students assigned to you",
        });
      }
    }

    // =======================
    // CONVERT DATE
    // =======================

    const attendanceDate =
      new Date(
        `${date}T00:00:00.000Z`
      );

    if (
      Number.isNaN(
        attendanceDate.getTime()
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid date",
      });
    }

    // =======================
    // CREATE / UPDATE
    // =======================

    const attendance =
      await prisma.attendance.upsert({
        where: {
          studentId_date: {
            studentId,
            date: attendanceDate,
          },
        },

        update: {
          status,
        },

        create: {
          studentId,
          date: attendanceDate,
          status,
        },

        include: {
          student: {
            include: {
              batch: true,
            },
          },
        },
      });

    return res
      .status(200)
      .json(attendance);
  } catch (error) {
    console.error(
      "MARK ATTENDANCE ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Internal Server Error",
    });
  }
}