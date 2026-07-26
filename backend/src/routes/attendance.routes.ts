import { Router } from "express";

import {
  getAttendance,
  getMyAttendance,
  markAttendance,
} from "../controllers/attendance.controller.js";

import {
  authenticate,
} from "../middleware/auth.middleware.js";

const router = Router();

// Student's own attendance
router.get(
  "/me",
  authenticate,
  getMyAttendance
);

// All attendance - admin only
router.get(
  "/",
  authenticate,
  getAttendance
);

// Mark attendance - admin only
router.post(
  "/",
  authenticate,
  markAttendance
);

export default router;