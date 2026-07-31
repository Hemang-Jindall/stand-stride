import { Router } from "express";

import {
  createLeaveRequest,
  getLeaveRequests,
  getMyLeaveRequests,
  updateLeaveRequestStatus,
} from "../controllers/leaveRequest.controller.js";

import {
  authenticate,
  requireStudent,
  requireAdminRole,
} from "../middleware/auth.middleware.js";

const router = Router();

// =========================
// STUDENT — OWN REQUESTS
// =========================

router.get(
  "/me",
  authenticate,
  requireStudent,
  getMyLeaveRequests
);

// =========================
// STUDENT — CREATE REQUEST
// =========================

router.post(
  "/",
  authenticate,
  requireStudent,
  createLeaveRequest
);

// =========================
// STAFF — VIEW ALL REQUESTS
// =========================

// FACILITATOR
// COORDINATOR
// ADMIN
//
// MENTOR has no access to
// student leave requests.

router.get(
  "/",
  authenticate,
  requireAdminRole(
    "FACILITATOR",
    "COORDINATOR",
    "ADMIN"
  ),
  getLeaveRequests
);

// =========================
// STAFF — APPROVE / REJECT
// =========================

// COORDINATOR
// ADMIN
//
// FACILITATOR can view requests,
// but cannot approve or reject them.
//
// MENTOR has no leave-request access.

router.patch(
  "/:id/status",
  authenticate,
  requireAdminRole(
    "COORDINATOR",
    "ADMIN"
  ),
  updateLeaveRequestStatus
);

export default router;