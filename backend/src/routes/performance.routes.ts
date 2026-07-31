import { Router } from "express";

import {
  getStudentPerformance,
  getMyPerformance,
  updatePerformance,
} from "../controllers/performance.controller.js";

import {
  authenticate,
  requireStudent,
  requireAdminRole,
} from "../middleware/auth.middleware.js";

const router = Router();

// =========================
// STUDENT — OWN PERFORMANCE
// =========================

router.get(
  "/me",
  authenticate,
  requireStudent,
  getMyPerformance
);

// =========================
// STAFF — VIEW PERFORMANCE
// =========================

// FACILITATOR
// COORDINATOR
// MENTOR
// ADMIN
//
// All staff roles listed below
// can view student performance.

router.get(
  "/:studentId",
  authenticate,
  requireAdminRole(
    "FACILITATOR",
    "COORDINATOR",
    "MENTOR",
    "ADMIN"
  ),
  getStudentPerformance
);

// =========================
// STAFF — UPDATE PERFORMANCE
// =========================

// COORDINATOR
// MENTOR
// ADMIN
//
// Mentor can update performance
// because performance/progress and
// remarks are part of their role.
//
// Facilitator can only view.

router.put(
  "/:studentId",
  authenticate,
  requireAdminRole(
    "COORDINATOR",
    "MENTOR",
    "ADMIN"
  ),
  updatePerformance
);

export default router;