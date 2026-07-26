import { Router } from "express";

import {
  createCertificate,
  getCertificates,
  getMyCertificates,
} from "../controllers/certificate.controller.js";

import {
  authenticate,
} from "../middleware/auth.middleware.js";

const router = Router();

// Student
router.get(
  "/me",
  authenticate,
  getMyCertificates
);

// Admin
router.get(
  "/",
  authenticate,
  getCertificates
);

router.post(
  "/",
  authenticate,
  createCertificate
);

export default router;