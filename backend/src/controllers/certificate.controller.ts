import type { Response } from "express";

import prisma from "../lib/prisma.js";

import type {
  AuthRequest,
} from "../middleware/auth.middleware.js";

// =========================
// GET ALL CERTIFICATES
// Admin only
// =========================

export async function getCertificates(
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

    const certificates =
      await prisma.certificate.findMany({
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

    return res.json(certificates);
  } catch (error) {
    console.error(
      "GET CERTIFICATES ERROR:",
      error
    );

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// =========================
// GET MY CERTIFICATES
// Student only
// =========================

export async function getMyCertificates(
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

    const certificates =
      await prisma.certificate.findMany({
        where: {
          studentId: req.user.id,
        },

        orderBy: {
          issuedOn: "desc",
        },
      });

    return res.json(certificates);
  } catch (error) {
    console.error(
      "GET MY CERTIFICATES ERROR:",
      error
    );

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// =========================
// ISSUE CERTIFICATE
// Admin only
// =========================

export async function createCertificate(
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
      studentId,
      title,
      fileUrl,
    } = req.body;

    if (
      typeof studentId !== "string" ||
      !studentId.trim()
    ) {
      return res.status(400).json({
        message: "Student ID is required",
      });
    }

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return res.status(400).json({
        message: "Certificate title is required",
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
        message: "Student not found",
      });
    }

    const certificate =
      await prisma.certificate.create({
        data: {
          studentId,

          title: title.trim(),

          fileUrl:
            typeof fileUrl === "string" &&
            fileUrl.trim()
              ? fileUrl.trim()
              : null,

          issuedOn: new Date(),
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
      .status(201)
      .json(certificate);
  } catch (error) {
    console.error(
      "CREATE CERTIFICATE ERROR:",
      error
    );

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}