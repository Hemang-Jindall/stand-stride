import type { Response } from "express";

import prisma from "../lib/prisma.js";

import type {
  AuthRequest,
} from "../middleware/auth.middleware.js";

// =========================
// GET ALL TOPICS
// Admin
// =========================

export async function getTopics(
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

    const topics =
      await prisma.topic.findMany({
        include: {
          batch: true,
        },

        orderBy: [
          {
            batch: {
              name: "asc",
            },
          },
          {
            dayNumber: "asc",
          },
        ],
      });

    return res.status(200).json(
      topics
    );
  } catch (error) {
    console.error(
      "GET TOPICS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load topics.",
    });
  }
}

// =========================
// GET MY TOPICS
// Student
// =========================

export async function getMyTopics(
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
          batchId: true,
        },
      });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const topics =
      await prisma.topic.findMany({
        where: {
          batchId:
            student.batchId,
        },

        include: {
          batch: true,
        },

        orderBy: {
          dayNumber: "asc",
        },
      });

    return res.status(200).json(
      topics
    );
  } catch (error) {
    console.error(
      "GET MY TOPICS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load topics.",
    });
  }
}

// =========================
// CREATE TOPIC
// Admin
// =========================

export async function createTopic(
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
      dayNumber,
      batchId,
    } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    if (
      !Number.isInteger(dayNumber) ||
      dayNumber < 1 ||
      dayNumber > 5
    ) {
      return res.status(400).json({
        message:
          "Day number must be between 1 and 5",
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

    const topic =
      await prisma.topic.create({
        data: {
          title: title.trim(),

          description:
            typeof description ===
              "string" &&
            description.trim()
              ? description.trim()
              : null,

          dayNumber,
          batchId,
        },

        include: {
          batch: true,
        },
      });

    return res
      .status(201)
      .json(topic);
  } catch (error) {
    console.error(
      "CREATE TOPIC ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to create topic.",
    });
  }
}

// =========================
// UPDATE TOPIC
// Admin
// =========================

export async function updateTopic(
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

    const { id } = req.params;

    if (
      typeof id !== "string" ||
      !id
    ) {
      return res.status(400).json({
        message: "Topic ID is required",
      });
    }

    const {
      title,
      description,
      dayNumber,
      batchId,
    } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    if (
      !Number.isInteger(dayNumber) ||
      dayNumber < 1 ||
      dayNumber > 5
    ) {
      return res.status(400).json({
        message:
          "Day number must be between 1 and 5",
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

    const existing =
      await prisma.topic.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      return res.status(404).json({
        message: "Topic not found",
      });
    }

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

    const topic =
      await prisma.topic.update({
        where: {
          id,
        },

        data: {
          title: title.trim(),

          description:
            typeof description ===
              "string" &&
            description.trim()
              ? description.trim()
              : null,

          dayNumber,
          batchId,
        },

        include: {
          batch: true,
        },
      });

    return res.status(200).json(
      topic
    );
  } catch (error) {
    console.error(
      "UPDATE TOPIC ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update topic.",
    });
  }
}

// =========================
// DELETE TOPIC
// Admin
// =========================

export async function deleteTopic(
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

    const { id } = req.params;

    if (
      typeof id !== "string" ||
      !id
    ) {
      return res.status(400).json({
        message: "Topic ID is required",
      });
    }

    const existing =
      await prisma.topic.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      return res.status(404).json({
        message: "Topic not found",
      });
    }

    await prisma.topic.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message:
        "Topic deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE TOPIC ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to delete topic.",
    });
  }
}