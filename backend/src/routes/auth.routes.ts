import { Router } from "express";

import {
  login,
  changeStaffPassword,
} from "../controllers/auth.controller.js";

import {
  studentLogin,
} from "../controllers/studentAuth.controller.js";

import {
  authenticate,
  requireAdmin,
  type AuthRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

// =========================
// STAFF LOGIN
// =========================

// FACILITATOR
// COORDINATOR
// MENTOR
// ADMIN
//
// All staff roles use the
// same login endpoint.

router.post(
  "/login",
  login
);

// =========================
// STUDENT LOGIN
// =========================

router.post(
  "/student/login",
  studentLogin
);

// =========================
// CHANGE STAFF PASSWORD
// =========================

// FACILITATOR
// COORDINATOR
// MENTOR
// ADMIN
//
// Staff must be authenticated
// before changing their password.

router.put(
  "/change-password",
  authenticate,
  requireAdmin,
  changeStaffPassword
);

// =========================
// CURRENT AUTHENTICATED USER
// =========================

// Useful for checking that the JWT
// contains the correct account role
// and staff role.

router.get(
  "/me",
  authenticate,
  (
    req: AuthRequest,
    res
  ) => {
    if (!req.user) {
      return res.status(401).json({
        message:
          "Not authenticated",
      });
    }

    return res.status(200).json({
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,

        adminRole:
          req.user.adminRole ??
          null,
      },
    });
  }
);

export default router;