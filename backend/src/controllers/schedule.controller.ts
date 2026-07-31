import type { Response } from "express";

import prisma from "../lib/prisma.js";

import type {
  AuthRequest,
} from "../middleware/auth.middleware.js";

// =========================
// HELPER — GET MENTOR PROFILE
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
    },
  });
}

// =========================
// GET ALL SCHEDULE ITEMS
// Staff
//
// MENTOR:
// Only schedule items belonging
// to batches containing students
// assigned to that mentor.
//
// FACILITATOR / COORDINATOR / ADMIN:
// All schedule items.
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
            "Mentor profile not found",
        });
      }

      // Get all batches containing
      // students assigned to mentor.

      const assignedStudents =
        await prisma.student.findMany({
          where: {
            mentorId: mentor.id,
          },

          select: {
            batchId: true,
          },
        });

      const batchIds = [
        ...new Set(
          assignedStudents.map(
            (student) =>
              student.batchId
          )
        ),
      ];

      if (batchIds.length === 0) {
        return res
          .status(200)
          .json([]);
      }

      const items =
        await prisma.scheduleItem.findMany({
          where: {
            batchId: {
              in: batchIds,
            },
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

      return res
        .status(200)
        .json(items);
    }

    // =========================
    // OTHER STAFF
    // =========================

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

    return res
      .status(200)
      .json(items);
  } catch (error) {
    console.error(
      "GET SCHEDULE ITEMS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load schedule.",
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
          batchId: true,
        },
      });

    if (!student) {
      return res.status(404).json({
        message:
          "Student not found",
      });
    }

    const items =
      await prisma.scheduleItem.findMany({
        where: {
          batchId:
            student.batchId,
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

    return res
      .status(200)
      .json(items);
  } catch (error) {
    console.error(
      "GET MY SCHEDULE ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load schedule.",
    });
  }
}

// =========================
// CREATE SCHEDULE ITEM
// Authorized staff only
//
// Route middleware:
// COORDINATOR / ADMIN
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
        message:
          "Staff access required",
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
    // VALIDATION
    // =========================

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return res.status(400).json({
        message:
          "Title is required",
      });
    }

    if (
      typeof date !== "string" ||
      !date.trim()
    ) {
      return res.status(400).json({
        message:
          "Date is required",
      });
    }

    if (
      typeof startTime !== "string" ||
      !startTime.trim()
    ) {
      return res.status(400).json({
        message:
          "Start time is required",
      });
    }

    if (
      typeof endTime !== "string" ||
      !endTime.trim()
    ) {
      return res.status(400).json({
        message:
          "End time is required",
      });
    }

    if (
      typeof batchId !== "string" ||
      !batchId.trim()
    ) {
      return res.status(400).json({
        message:
          "Batch is required",
      });
    }

    // =========================
    // PARSE DATE
    // =========================

    const parsedDate =
      new Date(
        `${date}T00:00:00.000Z`
      );

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid date",
      });
    }

    // =========================
    // CHECK BATCH
    // =========================

    const batch =
      await prisma.batch.findUnique({
        where: {
          id: batchId,
        },

        select: {
          id: true,
        },
      });

    if (!batch) {
      return res.status(404).json({
        message:
          "Batch not found",
      });
    }

    // =========================
    // CREATE
    // =========================

    const item =
      await prisma.scheduleItem.create({
        data: {
          title:
            title.trim(),

          description:
            typeof description ===
              "string" &&
            description.trim()
              ? description.trim()
              : null,

          date:
            parsedDate,

          startTime:
            startTime.trim(),

          endTime:
            endTime.trim(),

          location:
            typeof location ===
              "string" &&
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

    return res
      .status(201)
      .json(item);
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
// Authorized staff only
//
// Route middleware:
// COORDINATOR / ADMIN
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
        message:
          "Staff access required",
      });
    }

    // =========================
    // VALIDATE ID
    // =========================

    const rawId =
      req.params.id;

    const id =
      Array.isArray(rawId)
        ? rawId[0]
        : rawId;

    if (!id) {
      return res.status(400).json({
        message:
          "Invalid schedule item ID",
      });
    }

    // =========================
    // CHECK EXISTING ITEM
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
    // VALIDATION
    // =========================

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof date !== "string" ||
      !date.trim() ||
      typeof startTime !== "string" ||
      !startTime.trim() ||
      typeof endTime !== "string" ||
      !endTime.trim() ||
      typeof batchId !== "string" ||
      !batchId.trim()
    ) {
      return res.status(400).json({
        message:
          "Title, date, times and batch are required",
      });
    }

    // =========================
    // PARSE DATE
    // =========================

    const parsedDate =
      new Date(
        `${date}T00:00:00.000Z`
      );

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid date",
      });
    }

    // =========================
    // CHECK BATCH
    // =========================

    const batch =
      await prisma.batch.findUnique({
        where: {
          id: batchId,
        },

        select: {
          id: true,
        },
      });

    if (!batch) {
      return res.status(404).json({
        message:
          "Batch not found",
      });
    }

    // =========================
    // UPDATE
    // =========================

    const updated =
      await prisma.scheduleItem.update({
        where: {
          id,
        },

        data: {
          title:
            title.trim(),

          description:
            typeof description ===
              "string" &&
            description.trim()
              ? description.trim()
              : null,

          date:
            parsedDate,

          startTime:
            startTime.trim(),

          endTime:
            endTime.trim(),

          location:
            typeof location ===
              "string" &&
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

    return res
      .status(200)
      .json(updated);
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
// Authorized staff only
//
// Route middleware:
// COORDINATOR / ADMIN
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
        message:
          "Staff access required",
      });
    }

    // =========================
    // VALIDATE ID
    // =========================

    const rawId =
      req.params.id;

    const id =
      Array.isArray(rawId)
        ? rawId[0]
        : rawId;

    if (!id) {
      return res.status(400).json({
        message:
          "Invalid schedule item ID",
      });
    }

    // =========================
    // CHECK EXISTING ITEM
    // =========================

    const existing =
      await prisma.scheduleItem.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
        },
      });

    if (!existing) {
      return res.status(404).json({
        message:
          "Schedule item not found",
      });
    }

    // =========================
    // DELETE
    // =========================

    await prisma.scheduleItem.delete({
      where: {
        id,
      },
    });

    return res
      .status(200)
      .json({
        message:
          "Schedule item deleted",
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