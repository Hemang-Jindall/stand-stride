import type { Response } from "express";

import prisma from "../lib/prisma.js";

import type {
  AuthRequest,
} from "../middleware/auth.middleware.js";

// ======================================
// GET ALL GRIEVANCES
// Admin only
// ======================================

export async function getGrievances(
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

    const grievances =
      await prisma.grievance.findMany({
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

    return res.status(200).json(
      grievances
    );
  } catch (error) {
    console.error(
      "GET GRIEVANCES ERROR:",
      error
    );

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// ======================================
// GET MY GRIEVANCES
// Student only
// ======================================

export async function getMyGrievances(
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

    const grievances =
      await prisma.grievance.findMany({
        where: {
          studentId: req.user.id,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return res.status(200).json(
      grievances
    );
  } catch (error) {
    console.error(
      "GET MY GRIEVANCES ERROR:",
      error
    );

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// ======================================
// CREATE GRIEVANCE
// Student only
// ======================================

export async function createGrievance(
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
      title,
      description,
    } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      return res.status(400).json({
        message:
          "Title and description are required",
      });
    }

    const grievance =
      await prisma.grievance.create({
        data: {
          title: title.trim(),
          description:
            description.trim(),

          studentId: req.user.id,

          status: "OPEN",
        },
      });

    return res.status(201).json(
      grievance
    );
  } catch (error) {
    console.error(
      "CREATE GRIEVANCE ERROR:",
      error
    );

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// ======================================
// UPDATE GRIEVANCE STATUS
// Admin only
// ======================================

export async function updateGrievanceStatus(
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

    const rawId = req.params.id;

    const id =
      Array.isArray(rawId)
        ? rawId[0]
        : rawId;

    if (!id) {
      return res.status(400).json({
        message:
          "Grievance ID is required",
      });
    }

    const { status } = req.body;

    if (
      status !== "OPEN" &&
      status !== "IN_PROGRESS" &&
      status !== "RESOLVED"
    ) {
      return res.status(400).json({
        message:
          "Status must be OPEN, IN_PROGRESS or RESOLVED",
      });
    }

    const existingGrievance =
      await prisma.grievance.findUnique({
        where: {
          id,
        },
      });

    if (!existingGrievance) {
      return res.status(404).json({
        message:
          "Grievance not found",
      });
    }

    const grievance =
      await prisma.grievance.update({
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

    return res.status(200).json(
      grievance
    );
  } catch (error) {
    console.error(
      "UPDATE GRIEVANCE STATUS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}