import { Router } from "express";

import {
  createLeaveRequest,
  getLeaveRequests,
  getMyLeaveRequests,
  updateLeaveRequestStatus,
} from "../controllers/leaveRequest.controller.js";

import {
  authenticate,
} from "../middleware/auth.middleware.js";

const router = Router();

// Student: own requests
router.get(
  "/me",
  authenticate,
  getMyLeaveRequests
);

// Student: create request
router.post(
  "/",
  authenticate,
  createLeaveRequest
);

// Admin: all requests
router.get(
  "/",
  authenticate,
  getLeaveRequests
);

// Admin: approve/reject
router.patch(
  "/:id/status",
  authenticate,
  updateLeaveRequestStatus
);

export default router;