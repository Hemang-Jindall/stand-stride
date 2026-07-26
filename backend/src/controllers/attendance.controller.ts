import type {
  Request,
  Response,
} from "express";

import prisma from "../lib/prisma.js";

import type {
  AuthRequest,
} from "../middleware/auth.middleware.js";

// =======================
// GET all attendance
// ADMIN ONLY
// =======================

export async function getAttendance(
  req: AuthRequest,
  res: Response
) {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

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
// GET logged-in student's
// attendance
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
// CREATE / UPDATE
// ADMIN ONLY
// =======================

export async function markAttendance(
  req: AuthRequest,
  res: Response
) {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    const {
      studentId,
      date,
      status,
    } = req.body;

    if (
      !studentId ||
      !date ||
      !status
    ) {
      return res.status(400).json({
        message:
          "studentId, date and status are required",
      });
    }

    if (
      ![
        "PRESENT",
        "ABSENT",
        "LEAVE",
      ].includes(status)
    ) {
      return res.status(400).json({
        message:
          "Invalid attendance status",
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
        message:
          "Student not found",
      });
    }

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
        message: "Invalid date",
      });
    }

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