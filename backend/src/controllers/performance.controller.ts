import type { Response } from "express";

import prisma from "../lib/prisma.js";

import type {
  AuthRequest,
} from "../middleware/auth.middleware.js";

// =========================
// GET STUDENT PERFORMANCE
// Admin
// =========================

export async function getStudentPerformance(
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

    const studentId = req.params.studentId;

    if (
      typeof studentId !== "string" ||
      !studentId
    ) {
      return res.status(400).json({
        message: "Student ID is required",
      });
    }

    const student =
      await prisma.student.findUnique({
        where: {
          id: studentId,
        },

        include: {
          batch: {
            include: {
              venue: true,
            },
          },

          mentor: true,

          attendance: {
            orderBy: {
              date: "asc",
            },
          },

          certificates: {
            orderBy: {
              issuedOn: "desc",
            },
          },

          performance: true,
        },
      });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // =========================
    // ATTENDANCE
    // =========================

    const totalAttendance =
      student.attendance.length;

    const presentCount =
      student.attendance.filter(
        (record) =>
          record.status === "PRESENT"
      ).length;

    const absentCount =
      student.attendance.filter(
        (record) =>
          record.status === "ABSENT"
      ).length;

    const leaveCount =
      student.attendance.filter(
        (record) =>
          record.status === "LEAVE"
      ).length;

    const attendancePercentage =
      totalAttendance > 0
        ? Math.round(
            (presentCount /
              totalAttendance) *
              100
          )
        : 0;

    // =========================
    // CERTIFICATE
    // =========================

    const certificateIssued =
      student.certificates.length > 0;

    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({
      student: {
        id: student.id,
        rollNumber:
          student.rollNumber,

        firstName:
          student.firstName,

        lastName:
          student.lastName,

        email: student.email,
        phone: student.phone,

        batch: student.batch,

        mentor: student.mentor,
      },

      attendance: {
        total: totalAttendance,
        present: presentCount,
        absent: absentCount,
        leave: leaveCount,
        percentage:
          attendancePercentage,
      },

      certificate: {
        issued:
          certificateIssued,

        certificate:
          student.certificates[0] ??
          null,
      },

      remarks:
        student.performance
          ?.remarks ?? "",
    });
  } catch (error) {
    console.error(
      "GET STUDENT PERFORMANCE ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load student performance.",
    });
  }
}

// =========================
// SAVE REMARKS
// Admin
// =========================

export async function savePerformanceRemarks(
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

    const { remarks } = req.body;

    if (
      typeof studentId !== "string" ||
      !studentId
    ) {
      return res.status(400).json({
        message: "Student ID is required",
      });
    }

    if (
      typeof remarks !== "string"
    ) {
      return res.status(400).json({
        message:
          "Remarks must be a string",
      });
    }

    const student =
      await prisma.student.findUnique({
        where: {
          id: studentId,
        },

        select: {
          id: true,
        },
      });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const performance =
      await prisma.performance.upsert({
        where: {
          studentId,
        },

        update: {
          remarks: remarks.trim(),
        },

        create: {
          studentId,
          remarks: remarks.trim(),
        },
      });

    return res.status(200).json({
      message:
        "Remarks saved successfully",

      performance,
    });
  } catch (error) {
    console.error(
      "SAVE PERFORMANCE REMARKS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to save remarks.",
    });
  }
}