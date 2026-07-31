import { Router } from "express";

import {
  createCertificate,
  getCertificates,
  getMyCertificates,
} from "../controllers/certificate.controller.js";

import {
  authenticate,
  requireStudent,
  requireAdminRole,
} from "../middleware/auth.middleware.js";

const router = Router();

// =========================
// STUDENT — OWN CERTIFICATES
// =========================

router.get(
  "/me",
  authenticate,
  requireStudent,
  getMyCertificates
);

// =========================
// STAFF — VIEW CERTIFICATES
// =========================

// FACILITATOR
// COORDINATOR
// MENTOR
// ADMIN
//
// Mentor can view certificates,
// but cannot issue them.

router.get(
  "/",
  authenticate,
  requireAdminRole(
    "FACILITATOR",
    "COORDINATOR",
    "MENTOR",
    "ADMIN"
  ),
  getCertificates
);

// =========================
// STAFF — ISSUE CERTIFICATE
// =========================

// COORDINATOR
// ADMIN
//
// FACILITATOR and MENTOR
// can view certificates,
// but cannot issue them.

router.post(
  "/",
  authenticate,
  requireAdminRole(
    "COORDINATOR",
    "ADMIN"
  ),
  createCertificate
);

export default router;