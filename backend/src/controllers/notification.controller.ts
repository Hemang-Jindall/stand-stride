import type { Response } from "express";

import prisma from "../lib/prisma.js";

import type {
  AuthRequest,
} from "../middleware/auth.middleware.js";

// =========================
// GET MY NOTIFICATIONS
// Student only
// =========================

export async function getMyNotifications(
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

    const notifications =
      await prisma.notification.findMany({
        where: {
          studentId: req.user.id,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return res.json(notifications);
  } catch (error) {
    console.error(
      "GET MY NOTIFICATIONS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// =========================
// GET ADMIN NOTIFICATIONS
// Admin only
// =========================

export async function getNotifications(
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

    const notifications =
      await prisma.notification.findMany({
        include: {
          student: {
            select: {
              id: true,
              rollNumber: true,
              firstName: true,
              lastName: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 50,
      });

    return res.json(notifications);
  } catch (error) {
    console.error(
      "GET NOTIFICATIONS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// =========================
// SEND TO ALL STUDENTS
// Admin only
// =========================

export async function sendNotificationToAll(
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
      message,
    } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return res.status(400).json({
        message:
          "Notification title is required",
      });
    }

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        message:
          "Notification message is required",
      });
    }

    const students =
      await prisma.student.findMany({
        select: {
          id: true,
        },
      });

    if (students.length === 0) {
      return res.status(400).json({
        message: "No students found",
      });
    }

    const result =
      await prisma.notification.createMany({
        data: students.map(
          (student) => ({
            title: title.trim(),
            message: message.trim(),
            studentId: student.id,
          })
        ),
      });

    return res.status(201).json({
      message:
        "Notification sent successfully",
      recipients: result.count,
    });
  } catch (error) {
    console.error(
      "SEND NOTIFICATION ERROR:",
      error
    );

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}