import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import batchRoutes from "./routes/batch.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import leaveRequestRoutes from "./routes/leaveRequest.routes.js";
import grievanceRoutes from "./routes/grievance.routes.js";
import certificateRoutes from "./routes/certificate.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import scheduleRoutes from "./routes/schedule.routes.js";
import mentorRoutes from "./routes/mentor.routes.js";
import performanceRoutes from "./routes/performance.routes.js";

const app = express();

// =======================
// Middleware
// =======================

app.use(cors());
app.use(express.json());

// =======================
// Health Check
// =======================

app.get("/", (_, res) => {
  res.send(
    "Stand & Stride Backend Running"
  );
});

// =======================
// Routes
// =======================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/students",
  studentRoutes
);

app.use(
  "/api/batches",
  batchRoutes
);

app.use(
  "/api/attendance",
  attendanceRoutes
);

app.use(
  "/api/leave-requests",
  leaveRequestRoutes
);

app.use(
  "/api/grievances",
  grievanceRoutes
);

app.use(
  "/api/certificates",
  certificateRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/schedule",
  scheduleRoutes
);

app.use(
  "/api/mentors",
  mentorRoutes
);

app.use(
  "/api/performance",
  performanceRoutes
);

export default app;