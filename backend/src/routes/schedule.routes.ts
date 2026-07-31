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
  requireStudent,
  requireAdminRole,
} from "../middleware/auth.middleware.js";

const router = Router();

// =========================
// STUDENT — OWN SCHEDULE
// =========================

router.get(
  "/me",
  authenticate,
  requireStudent,
  getMySchedule
);

// =========================
// STAFF — VIEW SCHEDULE
// =========================

// FACILITATOR
// COORDINATOR
// MENTOR
// ADMIN
//
// Mentor can view the schedule,
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
  getScheduleItems
);

// =========================
// STAFF — CREATE SCHEDULE
// =========================

// COORDINATOR
// ADMIN
//
// FACILITATOR and MENTOR
// cannot create schedule items.

router.post(
  "/",
  authenticate,
  requireAdminRole(
    "COORDINATOR",
    "ADMIN"
  ),
  createScheduleItem
);

// =========================
// STAFF — UPDATE SCHEDULE
// =========================

// COORDINATOR
// ADMIN
//
// FACILITATOR and MENTOR
// cannot update schedule items.

router.put(
  "/:id",
  authenticate,
  requireAdminRole(
    "COORDINATOR",
    "ADMIN"
  ),
  updateScheduleItem
);

// =========================
// STAFF — DELETE SCHEDULE
// =========================

// COORDINATOR
// ADMIN
//
// FACILITATOR and MENTOR
// cannot delete schedule items.

router.delete(
  "/:id",
  authenticate,
  requireAdminRole(
    "COORDINATOR",
    "ADMIN"
  ),
  deleteScheduleItem
);

export default router;