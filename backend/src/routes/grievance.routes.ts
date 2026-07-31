import { Router } from "express";

import {
  createGrievance,
  getGrievances,
  getMyGrievances,
  updateGrievanceStatus,
} from "../controllers/grievance.controller.js";

import {
  authenticate,
  requireStudent,
  requireAdminRole,
} from "../middleware/auth.middleware.js";

const router = Router();

// =========================
// STUDENT — OWN GRIEVANCES
// =========================

router.get(
  "/me",
  authenticate,
  requireStudent,
  getMyGrievances
);

// =========================
// STUDENT — CREATE GRIEVANCE
// =========================

router.post(
  "/",
  authenticate,
  requireStudent,
  createGrievance
);

// =========================
// STAFF — VIEW GRIEVANCES
// =========================

// FACILITATOR
// COORDINATOR
// ADMIN
//
// MENTOR has no access to
// student grievances.

router.get(
  "/",
  authenticate,
  requireAdminRole(
    "FACILITATOR",
    "COORDINATOR",
    "ADMIN"
  ),
  getGrievances
);

// =========================
// STAFF — UPDATE STATUS
// =========================

// COORDINATOR
// ADMIN
//
// FACILITATOR can view grievances
// but cannot change their status.
//
// MENTOR has no grievance access.

router.patch(
  "/:id/status",
  authenticate,
  requireAdminRole(
    "COORDINATOR",
    "ADMIN"
  ),
  updateGrievanceStatus
);

export default router;