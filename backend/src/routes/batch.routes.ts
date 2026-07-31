import { Router } from "express";

import {
  getBatches,
  getVenues,
  createVenue,
  updateBatchVenue,
} from "../controllers/batch.controller.js";

import {
  authenticate,
  requireAdminRole,
} from "../middleware/auth.middleware.js";

const router = Router();

// =========================
// STAFF — VIEW BATCHES
// =========================

// FACILITATOR
// COORDINATOR
// MENTOR
// ADMIN
//
// Mentor can view batches because
// batch information is needed for
// students and schedules.

router.get(
  "/",
  authenticate,
  requireAdminRole(
    "FACILITATOR",
    "COORDINATOR",
    "MENTOR",
    "ADMIN"
  ),
  getBatches
);

// =========================
// STAFF — VIEW VENUES
// =========================

// FACILITATOR
// COORDINATOR
// ADMIN
//
// MENTOR does not have access to
// venue management.

router.get(
  "/venues",
  authenticate,
  requireAdminRole(
    "FACILITATOR",
    "COORDINATOR",
    "ADMIN"
  ),
  getVenues
);

// =========================
// ADMIN — CREATE VENUE
// =========================

// Only ADMIN can create venues.

router.post(
  "/venues",
  authenticate,
  requireAdminRole(
    "ADMIN"
  ),
  createVenue
);

// =========================
// STAFF — ASSIGN VENUE
// =========================

// COORDINATOR
// ADMIN
//
// FACILITATOR can view venue
// assignments but cannot change them.
//
// MENTOR has no venue-management
// access.

router.put(
  "/:batchId/venue",
  authenticate,
  requireAdminRole(
    "COORDINATOR",
    "ADMIN"
  ),
  updateBatchVenue
);

export default router;