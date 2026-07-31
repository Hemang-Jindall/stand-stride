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
  requireStudent,
  requireAdminRole,
} from "../middleware/auth.middleware.js";

const router = Router();

// =========================
// STUDENT — OWN MENTOR
// =========================

router.get(
  "/me",
  authenticate,
  requireStudent,
  getMyMentor
);

// =========================
// STAFF — VIEW ASSIGNMENTS
// =========================

// FACILITATOR
// COORDINATOR
// ADMIN
//
// MENTOR does not manage or view
// the mentor-assignment system.

router.get(
  "/assignments",
  authenticate,
  requireAdminRole(
    "FACILITATOR",
    "COORDINATOR",
    "ADMIN"
  ),
  getMentorAssignments
);

// =========================
// STAFF — ASSIGN MENTOR
// =========================

// COORDINATOR
// ADMIN
//
// FACILITATOR can view assignments
// but cannot change them.
//
// MENTOR has no access to
// assignment management.

router.put(
  "/assignments/:studentId",
  authenticate,
  requireAdminRole(
    "COORDINATOR",
    "ADMIN"
  ),
  assignMentor
);

// =========================
// STAFF — REMOVE ASSIGNMENT
// =========================

// COORDINATOR
// ADMIN

router.delete(
  "/assignments/:studentId",
  authenticate,
  requireAdminRole(
    "COORDINATOR",
    "ADMIN"
  ),
  removeMentorAssignment
);

// =========================
// STAFF — VIEW MENTORS
// =========================

// FACILITATOR
// COORDINATOR
// ADMIN
//
// MENTOR does not need access
// to the mentor-management page.

router.get(
  "/",
  authenticate,
  requireAdminRole(
    "FACILITATOR",
    "COORDINATOR",
    "ADMIN"
  ),
  getMentors
);

// =========================
// ADMIN — CREATE MENTOR
// =========================

// Only ADMIN can add mentors
// to the mentor directory.

router.post(
  "/",
  authenticate,
  requireAdminRole(
    "ADMIN"
  ),
  createMentor
);

export default router;