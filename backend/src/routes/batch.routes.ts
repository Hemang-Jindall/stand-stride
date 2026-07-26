import {
  Router,
} from "express";

import {
  getBatches,
  getVenues,
  createVenue,
  updateBatchVenue,
} from "../controllers/batch.controller.js";

import {
  authenticate,
} from "../middleware/auth.middleware.js";

const router = Router();

// =========================
// Batches
// =========================

router.get(
  "/",
  authenticate,
  getBatches
);

// =========================
// Venues
// Admin
// =========================

router.get(
  "/venues",
  authenticate,
  getVenues
);

router.post(
  "/venues",
  authenticate,
  createVenue
);

// =========================
// Batch Venue Assignment
// Admin
// =========================

router.put(
  "/:batchId/venue",
  authenticate,
  updateBatchVenue
);

export default router;