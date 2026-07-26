import { Router } from "express";

import {
  createGrievance,
  getGrievances,
  getMyGrievances,
  updateGrievanceStatus,
} from "../controllers/grievance.controller.js";

import {
  authenticate,
} from "../middleware/auth.middleware.js";

const router = Router();

// Student
router.get(
  "/me",
  authenticate,
  getMyGrievances
);

router.post(
  "/",
  authenticate,
  createGrievance
);

// Admin
router.get(
  "/",
  authenticate,
  getGrievances
);

router.patch(
  "/:id/status",
  authenticate,
  updateGrievanceStatus
);

export default router;