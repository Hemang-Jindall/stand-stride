import { Router } from "express";

import {
  getMasterData,
  createMasterData,
  updateMasterData,
  deleteMasterData,
} from "../controllers/masterData.controller.js";

import {
  authenticate,
  requireAdminRole,
} from "../middleware/auth.middleware.js";

const router = Router();

// =========================
// STAFF — VIEW MASTER DATA
// =========================

// FACILITATOR
// COORDINATOR
// ADMIN
//
// MENTOR has no access to
// Master Data.

router.get(
  "/",
  authenticate,
  requireAdminRole(
    "FACILITATOR",
    "COORDINATOR",
    "ADMIN"
  ),
  getMasterData
);

// =========================
// ADMIN — CREATE
// =========================

// Only ADMIN can create
// Master Data records.

router.post(
  "/",
  authenticate,
  requireAdminRole(
    "ADMIN"
  ),
  createMasterData
);

// =========================
// ADMIN — UPDATE
// =========================

// Only ADMIN can modify
// Master Data records.

router.put(
  "/:id",
  authenticate,
  requireAdminRole(
    "ADMIN"
  ),
  updateMasterData
);

// =========================
// ADMIN — DELETE
// =========================

// Only ADMIN can delete
// Master Data records.

router.delete(
  "/:id",
  authenticate,
  requireAdminRole(
    "ADMIN"
  ),
  deleteMasterData
);

export default router;