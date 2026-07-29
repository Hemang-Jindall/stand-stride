import {
  Router,
} from "express";

import {
  getTopics,
  getMyTopics,
  createTopic,
  updateTopic,
  deleteTopic,
} from "../controllers/topic.controller.js";

import {
  authenticate,
} from "../middleware/auth.middleware.js";

const router = Router();

// Student
router.get(
  "/me",
  authenticate,
  getMyTopics
);

// Admin
router.get(
  "/",
  authenticate,
  getTopics
);

router.post(
  "/",
  authenticate,
  createTopic
);

router.put(
  "/:id",
  authenticate,
  updateTopic
);

router.delete(
  "/:id",
  authenticate,
  deleteTopic
);

export default router;