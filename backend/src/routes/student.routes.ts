import { Router } from "express";

import {
  getStudents,
  getStudent,
  getMyProfile,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller.js";

import {
  authenticate,
  requireStudent,
  requireAdminRole,
} from "../middleware/auth.middleware.js";

const router = Router();

// =========================
// STUDENT — OWN PROFILE
// =========================

// IMPORTANT:
// /me must stay before /:id
//
// Student can only access
// their own profile.

router.get(
  "/me",
  authenticate,
  requireStudent,
  getMyProfile
);

// =========================
// STAFF — VIEW STUDENTS
// =========================

// FACILITATOR
// COORDINATOR
// MENTOR
// ADMIN
//
// Mentor can view students.
// We will later restrict Mentor
// results to assigned students only.

router.get(
  "/",
  authenticate,
  requireAdminRole(
    "FACILITATOR",
    "COORDINATOR",
    "MENTOR",
    "ADMIN"
  ),
  getStudents
);

router.get(
  "/:id",
  authenticate,
  requireAdminRole(
    "FACILITATOR",
    "COORDINATOR",
    "MENTOR",
    "ADMIN"
  ),
  getStudent
);

// =========================
// STAFF — CREATE STUDENT
// =========================

// FACILITATOR
// COORDINATOR
// ADMIN
//
// MENTOR cannot create students.

router.post(
  "/",
  authenticate,
  requireAdminRole(
    "FACILITATOR",
    "COORDINATOR",
    "ADMIN"
  ),
  createStudent
);

// =========================
// STAFF — UPDATE STUDENT
// =========================

// FACILITATOR
// COORDINATOR
// ADMIN
//
// MENTOR cannot edit student
// account/profile information.

router.put(
  "/:id",
  authenticate,
  requireAdminRole(
    "FACILITATOR",
    "COORDINATOR",
    "ADMIN"
  ),
  updateStudent
);

// =========================
// ADMIN — DELETE STUDENT
// =========================

// Only ADMIN can permanently
// delete a student.

router.delete(
  "/:id",
  authenticate,
  requireAdminRole(
    "ADMIN"
  ),
  deleteStudent
);

export default router;