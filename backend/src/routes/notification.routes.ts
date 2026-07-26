import { Router } from "express";

import {
  getMyNotifications,
  getNotifications,
  sendNotificationToAll,
} from "../controllers/notification.controller.js";

import {
  authenticate,
} from "../middleware/auth.middleware.js";

const router = Router();

// Student
router.get(
  "/me",
  authenticate,
  getMyNotifications
);

// Admin
router.get(
  "/",
  authenticate,
  getNotifications
);

router.post(
  "/broadcast",
  authenticate,
  sendNotificationToAll
);

export default router;