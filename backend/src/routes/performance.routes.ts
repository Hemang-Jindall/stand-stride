import {
  Router,
} from "express";

import {
  getStudentPerformance,
  getMyPerformance,
  updatePerformance,
} from "../controllers/performance.controller.js";

import {
  authenticate,
} from "../middleware/auth.middleware.js";

const router = Router();

// =========================
// STUDENT
// =========================

router.get(
  "/me",
  authenticate,
  getMyPerformance
);

// =========================
// ADMIN
// =========================

router.get(
  "/:studentId",
  authenticate,
  getStudentPerformance
);

router.put(
  "/:studentId",
  authenticate,
  updatePerformance
);

export default router;