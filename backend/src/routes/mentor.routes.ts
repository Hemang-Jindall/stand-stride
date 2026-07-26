import { Router } from "express";

import {
  getMentors,
  createMentor,
  getMentorAssignments,
  assignMentor,
  removeMentorAssignment,
  getMyMentor,
} from "../controllers/mentor.controller.js";

import {
  authenticate,
} from "../middleware/auth.middleware.js";

const router = Router();

// =========================
// Student
// =========================

router.get(
  "/me",
  authenticate,
  getMyMentor
);

// =========================
// Admin - Mentors
// =========================

router.get(
  "/",
  authenticate,
  getMentors
);

router.post(
  "/",
  authenticate,
  createMentor
);

// =========================
// Admin - Assignments
// =========================

router.get(
  "/assignments",
  authenticate,
  getMentorAssignments
);

router.put(
  "/assignments/:studentId",
  authenticate,
  assignMentor
);

router.delete(
  "/assignments/:studentId",
  authenticate,
  removeMentorAssignment
);

export default router;