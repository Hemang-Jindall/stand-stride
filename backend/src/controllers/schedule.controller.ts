import type { Response } from "express";

import prisma from "../lib/prisma.js";

import type {
  AuthRequest,
} from "../middleware/auth.middleware.js";

// =========================
// GET ALL SCHEDULE ITEMS
// Admin
// =========================

export async function getScheduleItems(
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

    const items =
      await prisma.scheduleItem.findMany({
        include: {
          batch: {
            include: {
              venue: true,
            },
          },
        },

        orderBy: [
          {
            date: "asc",
          },
          {
            startTime: "asc",
          },
        ],
      });

    return res.json(items);
  } catch (error) {
    console.error(
      "GET SCHEDULE ITEMS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to load schedule.",
    });
  }
}

// =========================
// GET MY SCHEDULE
// Student
// =========================

export async function getMySchedule(
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
          id: true,
          batchId: true,
        },
      });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const items =
      await prisma.scheduleItem.findMany({
        where: {
          batchId: student.batchId,
        },

        include: {
          batch: {
            include: {
              venue: true,
            },
          },
        },

        orderBy: [
          {
            date: "asc",
          },
          {
            startTime: "asc",
          },
        ],
      });

    return res.json(items);
  } catch (error) {
    console.error(
      "GET MY SCHEDULE ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to load schedule.",
    });
  }
}

// =========================
// CREATE SCHEDULE ITEM
// Admin
// =========================

export async function createScheduleItem(
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
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      batchId,
    } = req.body;

    // =========================
    // Validation
    // =========================

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    if (
      typeof date !== "string" ||
      !date
    ) {
      return res.status(400).json({
        message: "Date is required",
      });
    }

    if (
      typeof startTime !== "string" ||
      !startTime
    ) {
      return res.status(400).json({
        message: "Start time is required",
      });
    }

    if (
      typeof endTime !== "string" ||
      !endTime
    ) {
      return res.status(400).json({
        message: "End time is required",
      });
    }

    if (
      typeof batchId !== "string" ||
      !batchId
    ) {
      return res.status(400).json({
        message: "Batch is required",
      });
    }

    // =========================
    // Parse Date
    // =========================

    const parsedDate =
      new Date(`${date}T00:00:00.000Z`);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return res.status(400).json({
        message: "Invalid date",
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
      return res.status(404).json({
        message: "Batch not found",
      });
    }

    // =========================
    // Create
    // =========================

    const item =
      await prisma.scheduleItem.create({
        data: {
          title: title.trim(),

          description:
            typeof description === "string" &&
            description.trim()
              ? description.trim()
              : null,

          date: parsedDate,

          startTime: startTime.trim(),

          endTime: endTime.trim(),

          location:
            typeof location === "string" &&
            location.trim()
              ? location.trim()
              : null,

          batchId,
        },

        include: {
          batch: {
            include: {
              venue: true,
            },
          },
        },
      });

    return res.status(201).json(item);
  } catch (error) {
    console.error(
      "CREATE SCHEDULE ITEM ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to create schedule item.",
    });
  }
}

// =========================
// UPDATE SCHEDULE ITEM
// Admin
// =========================

export async function updateScheduleItem(
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

    // =========================
    // Validate ID
    // =========================

    const id = req.params.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        message:
          "Invalid schedule item ID",
      });
    }

    const {
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      batchId,
    } = req.body;

    // =========================
    // Check Existing Item
    // =========================

    const existing =
      await prisma.scheduleItem.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      return res.status(404).json({
        message:
          "Schedule item not found",
      });
    }

    // =========================
    // Validation
    // =========================

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof date !== "string" ||
      !date ||
      typeof startTime !== "string" ||
      !startTime ||
      typeof endTime !== "string" ||
      !endTime ||
      typeof batchId !== "string" ||
      !batchId
    ) {
      return res.status(400).json({
        message:
          "Title, date, times and batch are required",
      });
    }

    // =========================
    // Parse Date
    // =========================

    const parsedDate =
      new Date(`${date}T00:00:00.000Z`);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return res.status(400).json({
        message: "Invalid date",
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
      return res.status(404).json({
        message: "Batch not found",
      });
    }

    // =========================
    // Update
    // =========================

    const updated =
      await prisma.scheduleItem.update({
        where: {
          id,
        },

        data: {
          title: title.trim(),

          description:
            typeof description === "string" &&
            description.trim()
              ? description.trim()
              : null,

          date: parsedDate,

          startTime: startTime.trim(),

          endTime: endTime.trim(),

          location:
            typeof location === "string" &&
            location.trim()
              ? location.trim()
              : null,

          batchId,
        },

        include: {
          batch: {
            include: {
              venue: true,
            },
          },
        },
      });

    return res.json(updated);
  } catch (error) {
    console.error(
      "UPDATE SCHEDULE ITEM ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update schedule item.",
    });
  }
}

// =========================
// DELETE SCHEDULE ITEM
// Admin
// =========================

export async function deleteScheduleItem(
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

    // =========================
    // Validate ID
    // =========================

    const id = req.params.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        message:
          "Invalid schedule item ID",
      });
    }

    // =========================
    // Check Existing Item
    // =========================

    const existing =
      await prisma.scheduleItem.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      return res.status(404).json({
        message:
          "Schedule item not found",
      });
    }

    // =========================
    // Delete
    // =========================

    await prisma.scheduleItem.delete({
      where: {
        id,
      },
    });

    return res.json({
      message: "Schedule item deleted",
    });
  } catch (error) {
    console.error(
      "DELETE SCHEDULE ITEM ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to delete schedule item.",
    });
  }
}