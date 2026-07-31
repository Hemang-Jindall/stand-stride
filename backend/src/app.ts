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
import masterDataRoutes from "./routes/masterData.routes.js";

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
// Authentication
// =======================

app.use(
  "/api/auth",
  authRoutes
);

// =======================
// Students
// =======================

app.use(
  "/api/students",
  studentRoutes
);

// =======================
// Batches
// =======================

app.use(
  "/api/batches",
  batchRoutes
);

// =======================
// Attendance
// =======================

app.use(
  "/api/attendance",
  attendanceRoutes
);

// =======================
// Leave Requests
// =======================

app.use(
  "/api/leave-requests",
  leaveRequestRoutes
);

// =======================
// Grievances
// =======================

app.use(
  "/api/grievances",
  grievanceRoutes
);

// =======================
// Certificates
// =======================

app.use(
  "/api/certificates",
  certificateRoutes
);

// =======================
// Notifications
// =======================

app.use(
  "/api/notifications",
  notificationRoutes
);

// =======================
// Schedule
// =======================

app.use(
  "/api/schedule",
  scheduleRoutes
);

// =======================
// Mentors
// =======================

app.use(
  "/api/mentors",
  mentorRoutes
);

// =======================
// Performance
// =======================

app.use(
  "/api/performance",
  performanceRoutes
);

// =======================
// Master Data
// =======================

app.use(
  "/api/master-data",
  masterDataRoutes
);

export default app;