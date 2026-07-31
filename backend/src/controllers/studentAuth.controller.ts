import type {
  Request,
  Response,
} from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import prisma from "../lib/prisma.js";

// =========================
// STUDENT LOGIN
// POST /api/auth/student/login
// =========================

export async function studentLogin(
  req: Request,
  res: Response
) {
  try {
    const {
      email,
      password,
    } = req.body;

    // =========================
    // Validate Input
    // =========================

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }

    // =========================
    // JWT Secret
    // =========================

    const secret =
      process.env.JWT_SECRET;

    if (!secret) {
      console.error(
        "JWT_SECRET is missing"
      );

      return res.status(500).json({
        message:
          "Server configuration error",
      });
    }

    // =========================
    // Normalize Email
    // =========================

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    // =========================
    // Find Student
    // =========================

    const student =
      await prisma.student.findUnique({
        where: {
          email: cleanEmail,
        },

        include: {
          batch: true,
        },
      });

    if (
      !student ||
      !student.password
    ) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    // =========================
    // Verify Password
    // =========================

    const validPassword =
      await bcrypt.compare(
        password,
        student.password
      );

    if (!validPassword) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    // =========================
    // Generate JWT
    // =========================

    const token = jwt.sign(
      {
        id: student.id,
        email: student.email,

        // Account category
        role: "student",
      },
      secret,
      {
        expiresIn: "7d",
      }
    );

    // =========================
    // Response
    // =========================

    return res.status(200).json({
      message:
        "Login successful",

      token,

      student: {
        id:
          student.id,

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

        batchId:
          student.batchId,

        batch:
          student.batch,
      },
    });
  } catch (error) {
    console.error(
      "STUDENT LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Internal Server Error",
    });
  }
}