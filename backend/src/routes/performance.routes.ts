import {
  Router,
} from "express";

import {
  getStudentPerformance,
  savePerformanceRemarks,
} from "../controllers/performance.controller.js";

import {
  authenticate,
} from "../middleware/auth.middleware.js";

const router = Router();

// =========================
// Student Performance
// Admin
// =========================

router.get(
  "/:studentId",
  authenticate,
  getStudentPerformance
);

router.put(
  "/:studentId/remarks",
  authenticate,
  savePerformanceRemarks
);

export default router;