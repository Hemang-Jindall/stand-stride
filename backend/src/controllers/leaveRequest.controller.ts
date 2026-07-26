import type { Response } from "express";

import prisma from "../lib/prisma.js";

import type {
  AuthRequest,
} from "../middleware/auth.middleware.js";

// ======================================
// GET ALL LEAVE REQUESTS
// ADMIN ONLY
// ======================================

export async function getLeaveRequests(
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

    const requests =
      await prisma.leaveRequest.findMany({
        include: {
          student: {
            include: {
              batch: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return res.status(200).json(requests);

  } catch (error) {
    console.error(
      "GET LEAVE REQUESTS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// ======================================
// GET LOGGED-IN STUDENT'S REQUESTS
// STUDENT ONLY
// ======================================

export async function getMyLeaveRequests(
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

    const requests =
      await prisma.leaveRequest.findMany({
        where: {
          studentId: req.user.id,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return res.status(200).json(requests);

  } catch (error) {
    console.error(
      "GET MY LEAVE REQUESTS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// ======================================
// CREATE LEAVE REQUEST
// STUDENT ONLY
// ======================================

export async function createLeaveRequest(
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

    const {
      reason,
      fromDate,
      toDate,
    } = req.body;

    // =======================
    // Validate Fields
    // =======================

    if (
      typeof reason !== "string" ||
      !reason.trim() ||
      typeof fromDate !== "string" ||
      !fromDate ||
      typeof toDate !== "string" ||
      !toDate
    ) {
      return res.status(400).json({
        message:
          "Reason, from date and to date are required",
      });
    }

    // =======================
    // Convert Dates
    // =======================

    const start = new Date(
      `${fromDate}T00:00:00.000Z`
    );

    const end = new Date(
      `${toDate}T00:00:00.000Z`
    );

    // =======================
    // Validate Dates
    // =======================

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      return res.status(400).json({
        message: "Invalid date",
      });
    }

    if (end < start) {
      return res.status(400).json({
        message:
          "To date cannot be before from date",
      });
    }

    // =======================
    // Create Request
    // =======================

    const request =
      await prisma.leaveRequest.create({
        data: {
          reason: reason.trim(),

          fromDate: start,

          toDate: end,

          studentId: req.user.id,

          status: "PENDING",
        },
      });

    return res.status(201).json(request);

  } catch (error) {
    console.error(
      "CREATE LEAVE REQUEST ERROR:",
      error
    );

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// ======================================
// UPDATE LEAVE REQUEST STATUS
// ADMIN ONLY
// ======================================

export async function updateLeaveRequestStatus(
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

    // =======================
    // Get ID
    // =======================

    const rawId = req.params.id;

    const id =
      Array.isArray(rawId)
        ? rawId[0]
        : rawId;

    if (!id) {
      return res.status(400).json({
        message:
          "Leave request ID is required",
      });
    }

    // =======================
    // Get Status
    // =======================

    const { status } = req.body;

    if (
      status !== "APPROVED" &&
      status !== "REJECTED"
    ) {
      return res.status(400).json({
        message:
          "Status must be APPROVED or REJECTED",
      });
    }

    // =======================
    // Check Request Exists
    // =======================

    const existingRequest =
      await prisma.leaveRequest.findUnique({
        where: {
          id,
        },
      });

    if (!existingRequest) {
      return res.status(404).json({
        message:
          "Leave request not found",
      });
    }

    // =======================
    // Update Request
    // =======================

    const request =
      await prisma.leaveRequest.update({
        where: {
          id,
        },

        data: {
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

    return res.status(200).json(request);

  } catch (error) {
    console.error(
      "UPDATE LEAVE REQUEST ERROR:",
      error
    );

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}