import { Router } from "express";

import {
  getMyNotifications,
  getNotifications,
  sendNotificationToAll,
} from "../controllers/notification.controller.js";

import {
  authenticate,
  requireStudent,
  requireAdminRole,
} from "../middleware/auth.middleware.js";

const router = Router();

// =========================
// STUDENT — OWN NOTIFICATIONS
// =========================

router.get(
  "/me",
  authenticate,
  requireStudent,
  getMyNotifications
);

// =========================
// STAFF — VIEW NOTIFICATIONS
// =========================

// FACILITATOR
// COORDINATOR
// ADMIN
//
// MENTOR has no access to
// staff notification management.

router.get(
  "/",
  authenticate,
  requireAdminRole(
    "FACILITATOR",
    "COORDINATOR",
    "ADMIN"
  ),
  getNotifications
);

// =========================
// STAFF — BROADCAST
// =========================

// COORDINATOR
// ADMIN
//
// FACILITATOR can view notifications,
// but cannot broadcast them.
//
// MENTOR has no access to
// notification management.

router.post(
  "/broadcast",
  authenticate,
  requireAdminRole(
    "COORDINATOR",
    "ADMIN"
  ),
  sendNotificationToAll
);

export default router;