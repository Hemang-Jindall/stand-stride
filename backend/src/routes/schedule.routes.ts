import { Router } from "express";

import {
  getScheduleItems,
  getMySchedule,
  createScheduleItem,
  updateScheduleItem,
  deleteScheduleItem,
} from "../controllers/schedule.controller.js";

import {
  authenticate,
} from "../middleware/auth.middleware.js";

const router = Router();

// Student schedule
router.get(
  "/me",
  authenticate,
  getMySchedule
);

// Admin schedule
router.get(
  "/",
  authenticate,
  getScheduleItems
);

router.post(
  "/",
  authenticate,
  createScheduleItem
);

router.put(
  "/:id",
  authenticate,
  updateScheduleItem
);

router.delete(
  "/:id",
  authenticate,
  deleteScheduleItem
);

export default router;