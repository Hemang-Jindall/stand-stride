import type { Response } from "express";

import prisma from "../lib/prisma.js";

import type {
  AuthRequest,
} from "../middleware/auth.middleware.js";

// =========================
// HELPER
// Build Performance Response
// =========================

async function buildPerformanceResponse(
  studentId: string
) {
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
    return null;
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

  return {
    student: {
      id: student.id,

      rollNumber:
        student.rollNumber,

      firstName:
        student.firstName,

      lastName:
        student.lastName,

      email:
        student.email,

      phone:
        student.phone,

      batch:
        student.batch,

      mentor:
        student.mentor,
    },

    attendance: {
      total:
        totalAttendance,

      present:
        presentCount,

      absent:
        absentCount,

      leave:
        leaveCount,

      percentage:
        attendancePercentage,
    },

    certificate: {
      issued:
        certificateIssued,

      eligible:
        student.performance
          ?.certificateEligible ??
        false,

      certificate:
        student.certificates[0] ??
        null,
    },

    performance: {
      overallProgress:
        student.performance
          ?.overallProgress ??
        0,

      remarks:
        student.performance
          ?.remarks ??
        "",

      certificateEligible:
        student.performance
          ?.certificateEligible ??
        false,
    },
  };
}

// =========================
// GET STUDENT PERFORMANCE
// Admin
// GET /api/performance/:studentId
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
        message:
          "Admin access required",
      });
    }

    const studentId =
      req.params.studentId;

    if (
      typeof studentId !==
        "string" ||
      !studentId
    ) {
      return res.status(400).json({
        message:
          "Student ID is required",
      });
    }

    const result =
      await buildPerformanceResponse(
        studentId
      );

    if (!result) {
      return res.status(404).json({
        message:
          "Student not found",
      });
    }

    return res
      .status(200)
      .json(result);
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
// GET MY PERFORMANCE
// Student
// GET /api/performance/me
// =========================

export async function getMyPerformance(
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

    const result =
      await buildPerformanceResponse(
        req.user.id
      );

    if (!result) {
      return res.status(404).json({
        message:
          "Student not found",
      });
    }

    return res
      .status(200)
      .json(result);
  } catch (error) {
    console.error(
      "GET MY PERFORMANCE ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load performance.",
    });
  }
}

// =========================
// UPDATE PERFORMANCE
// Admin
// PUT /api/performance/:studentId
// =========================

export async function updatePerformance(
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
          "Admin access required",
      });
    }

    const studentId =
      req.params.studentId;

    if (
      typeof studentId !==
        "string" ||
      !studentId
    ) {
      return res.status(400).json({
        message:
          "Student ID is required",
      });
    }

    const {
      overallProgress,
      remarks,
      certificateEligible,
    } = req.body;

    // =========================
    // VALIDATION
    // =========================

    if (
      typeof overallProgress !==
        "number" ||
      !Number.isInteger(
        overallProgress
      ) ||
      overallProgress < 0 ||
      overallProgress > 100
    ) {
      return res.status(400).json({
        message:
          "Overall progress must be an integer between 0 and 100",
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

    if (
      typeof certificateEligible !==
      "boolean"
    ) {
      return res.status(400).json({
        message:
          "Certificate eligibility must be a boolean",
      });
    }

    // =========================
    // CHECK STUDENT
    // =========================

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
        message:
          "Student not found",
      });
    }

    // =========================
    // UPSERT PERFORMANCE
    // =========================

    const performance =
      await prisma.performance.upsert({
        where: {
          studentId,
        },

        update: {
          overallProgress,

          remarks:
            remarks.trim(),

          certificateEligible,
        },

        create: {
          studentId,

          overallProgress,

          remarks:
            remarks.trim(),

          certificateEligible,
        },
      });

    return res.status(200).json({
      message:
        "Performance updated successfully",

      performance,
    });
  } catch (error) {
    console.error(
      "UPDATE PERFORMANCE ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update performance.",
    });
  }
}