import { Router } from "express";

import { login } from "../controllers/auth.controller.js";
import { studentLogin } from "../controllers/studentAuth.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// =======================
// Admin Login
// =======================

router.post("/login", login);

// =======================
// Student Login
// =======================

router.post("/student/login", studentLogin);

// =======================
// Protected Auth Test
// =======================

router.get("/me", authenticate, (req, res) => {
  res.json({
    message: "Protected route working",
  });
});

export default router;