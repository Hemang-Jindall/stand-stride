import { Router } from "express";

import {
  getAttendance,
  getMyAttendance,
  markAttendance,
} from "../controllers/attendance.controller.js";

import {
  authenticate,
  requireStudent,
  requireAdminRole,
} from "../middleware/auth.middleware.js";

const router = Router();

// =========================
// STUDENT — OWN ATTENDANCE
// =========================

router.get(
  "/me",
  authenticate,
  requireStudent,
  getMyAttendance
);

// =========================
// STAFF — VIEW ATTENDANCE
// =========================

// FACILITATOR
// COORDINATOR
// MENTOR
// ADMIN
//
// Mentor can view attendance,
// but cannot modify it.

router.get(
  "/",
  authenticate,
  requireAdminRole(
    "FACILITATOR",
    "COORDINATOR",
    "MENTOR",
    "ADMIN"
  ),
  getAttendance
);

// =========================
// STAFF — MARK ATTENDANCE
// =========================

// COORDINATOR
// ADMIN
//
// FACILITATOR and MENTOR
// can view attendance,
// but cannot modify it.

router.post(
  "/",
  authenticate,
  requireAdminRole(
    "COORDINATOR",
    "ADMIN"
  ),
  markAttendance
);

export default router;