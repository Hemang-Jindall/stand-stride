import type {
  Request,
  Response,
} from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import prisma from "../lib/prisma.js";

import type {
  AuthRequest,
} from "../middleware/auth.middleware.js";

// ======================================
// STAFF LOGIN
// POST /api/auth/login
// ======================================

export const login = async (
  req: Request,
  res: Response
) => {
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

    const jwtSecret =
      process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error(
        "JWT_SECRET is not configured."
      );
    }

    // =========================
    // Find Staff Account
    // =========================

    const admin =
      await prisma.admin.findUnique({
        where: {
          email: email
            .trim()
            .toLowerCase(),
        },
      });

    if (!admin) {
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
        admin.password
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
        id: admin.id,
        email: admin.email,

        // Authentication category
        role: "admin",

        // Actual staff permission level
        adminRole: admin.role,
      },
      jwtSecret,
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

      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error(
      "STAFF LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Internal Server Error",

      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
};

// ======================================
// CHANGE STAFF PASSWORD
// PUT /api/auth/change-password
// Staff only
// ======================================

export const changeStaffPassword =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      // =========================
      // Check Authentication
      // =========================

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
        currentPassword,
        newPassword,
      } = req.body;

      // =========================
      // Validate Input
      // =========================

      if (
        typeof currentPassword !==
          "string" ||
        !currentPassword
      ) {
        return res.status(400).json({
          message:
            "Current password is required",
        });
      }

      if (
        typeof newPassword !==
          "string" ||
        !newPassword
      ) {
        return res.status(400).json({
          message:
            "New password is required",
        });
      }

      // =========================
      // Validate New Password
      // =========================

      if (newPassword.length < 8) {
        return res.status(400).json({
          message:
            "New password must be at least 8 characters long",
        });
      }

      if (
        currentPassword ===
        newPassword
      ) {
        return res.status(400).json({
          message:
            "New password must be different from current password",
        });
      }

      // =========================
      // Find Staff Account
      // =========================

      const admin =
        await prisma.admin.findUnique({
          where: {
            id: req.user.id,
          },
        });

      if (!admin) {
        return res.status(404).json({
          message:
            "Staff account not found",
        });
      }

      // =========================
      // Verify Current Password
      // =========================

      const validPassword =
        await bcrypt.compare(
          currentPassword,
          admin.password
        );

      if (!validPassword) {
        return res.status(401).json({
          message:
            "Current password is incorrect",
        });
      }

      // =========================
      // Hash New Password
      // =========================

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      // =========================
      // Update Password
      // =========================

      await prisma.admin.update({
        where: {
          id: admin.id,
        },

        data: {
          password:
            hashedPassword,
        },
      });

      // =========================
      // Response
      // =========================

      return res.status(200).json({
        message:
          "Password changed successfully",
      });
    } catch (error) {
      console.error(
        "CHANGE STAFF PASSWORD ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to change password",
      });
    }
  };