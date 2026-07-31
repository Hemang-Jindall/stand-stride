import {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

// =========================
// Roles
// =========================

export type UserRole =
  | "admin"
  | "student";

export type AdminRole =
  | "FACILITATOR"
  | "COORDINATOR"
  | "MENTOR"
  | "ADMIN";

// =========================
// Auth User
// =========================

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  adminRole?: AdminRole;
}

export interface AuthRequest
  extends Request {
  user?: AuthUser;
}

// =========================
// JWT Payload
// =========================

interface JwtPayload {
  id?: string;
  email?: string;
  role?: UserRole;
  adminRole?: AdminRole;
}

// =========================
// Helpers
// =========================

function isUserRole(
  role: unknown
): role is UserRole {
  return (
    role === "admin" ||
    role === "student"
  );
}

function isAdminRole(
  role: unknown
): role is AdminRole {
  return (
    role === "FACILITATOR" ||
    role === "COORDINATOR" ||
    role === "MENTOR" ||
    role === "ADMIN"
  );
}

// =========================
// Authenticate
// =========================

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader =
    req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  // =========================
  // Validate Bearer Token
  // =========================

  const [type, token] =
    authHeader.split(" ");

  if (
    type !== "Bearer" ||
    !token
  ) {
    return res.status(401).json({
      message: "Invalid token",
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

  try {
    // =========================
    // Verify JWT
    // =========================

    const decoded =
      jwt.verify(
        token,
        secret
      ) as JwtPayload;

    // =========================
    // Validate Base Payload
    // =========================

    if (
      typeof decoded.id !==
        "string" ||
      !decoded.id ||
      typeof decoded.email !==
        "string" ||
      !decoded.email ||
      !isUserRole(decoded.role)
    ) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    // =========================
    // Validate Staff Role
    // =========================

    if (
      decoded.role === "admin" &&
      !isAdminRole(
        decoded.adminRole
      )
    ) {
      return res.status(401).json({
        message:
          "Invalid staff role",
      });
    }

    // =========================
    // Build Auth User
    // =========================

    if (
      decoded.role === "admin"
    ) {
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: "admin",
        adminRole:
          decoded.adminRole,
      };
    } else {
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: "student",
      };
    }

    next();
  } catch (error) {
    console.error(
      "AUTHENTICATION ERROR:",
      error
    );

    return res.status(401).json({
      message:
        "Invalid or expired token",
    });
  }
};

// =========================
// Require Admin / Staff Account
// =========================

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (
    !req.user ||
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      message:
        "Staff access required",
    });
  }

  next();
};

// =========================
// Require Student Account
// =========================

export const requireStudent = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (
    !req.user ||
    req.user.role !== "student"
  ) {
    return res.status(403).json({
      message:
        "Student access required",
    });
  }

  next();
};

// =========================
// Require Specific Staff Role
// =========================

export function requireAdminRole(
  ...allowedRoles: AdminRole[]
) {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    // =========================
    // Must Be Staff
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

    // =========================
    // Must Have Staff Role
    // =========================

    if (!req.user.adminRole) {
      return res.status(403).json({
        message:
          "Staff role unavailable. Please log in again.",
      });
    }

    // =========================
    // Check Allowed Roles
    // =========================

    if (
      !allowedRoles.includes(
        req.user.adminRole
      )
    ) {
      return res.status(403).json({
        message:
          "You do not have permission to perform this action",
      });
    }

    next();
  };
}