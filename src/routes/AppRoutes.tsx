import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";

// =======================
// Login
// =======================

import Login from "../pages/Login";

// =======================
// Student Pages
// =======================

import Dashboard from "../pages/student/Dashboard";
import Attendance from "../pages/student/Attendance";
import Schedule from "../pages/student/Schedule";
import Profile from "../pages/student/Profile";

import Certificate from "../pages/student/Certificate";
import Grievance from "../pages/student/Grievance";

import StudentLeaveRequests from "../pages/student/LeaveRequests";

import Notifications from "../pages/student/Notifications";
import SettingsPage from "../pages/student/Settings";
import Announcements from "../pages/student/Announcements";

import More from "../pages/student/More";
import SOPContacts from "../pages/student/SOPContacts";
import EmergencySupport from "../pages/student/EmergencySupport";
import AboutInternship from "../pages/student/AboutInternship";
import Privacy from "../pages/student/Privacy";
import Help from "../pages/student/Help";

// =======================
// Admin Pages
// =======================

import AdminDashboard from "../pages/admin/Dashboard";

import Students from "../pages/admin/Students";
import AddStudent from "../pages/admin/AddStudent";
import EditStudent from "../pages/admin/EditStudent";
import StudentDetails from "../pages/admin/StudentDetails";

import AdminAttendance from "../pages/admin/Attendance";
import AdminSchedule from "../pages/admin/Schedule";

import AdminGrievances from "../pages/admin/Grievances";
import GrievanceDetails from "../pages/admin/GrievanceDetails";

import AdminCertificates from "../pages/admin/Certificates";

import AdminLeaveRequests from "../pages/admin/LeaveRequests";

import Performance from "../pages/admin/Performance";

import AdminNotifications from "../pages/admin/Notifications";
import AdminSettings from "../pages/admin/Settings";
import AdminMore from "../pages/admin/More";

import MasterData from "../pages/admin/MasterData";
import MentorAssignments from "../pages/admin/MentorAssignments";
import VenueAssignments from "../pages/admin/VenueAssignments";

export default function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =======================
            Login
        ======================= */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* =======================
            Student
        ======================= */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/attendance"
          element={<Attendance />}
        />

        <Route
          path="/schedule"
          element={<Schedule />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/certificate"
          element={<Certificate />}
        />

        <Route
          path="/grievance"
          element={<Grievance />}
        />

        <Route
          path="/leave-requests"
          element={
            <StudentLeaveRequests />
          }
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/settings"
          element={<SettingsPage />}
        />

        <Route
          path="/announcements"
          element={<Announcements />}
        />

        <Route
          path="/more"
          element={<More />}
        />

        <Route
          path="/contacts"
          element={<SOPContacts />}
        />

        <Route
          path="/emergency"
          element={
            <EmergencySupport />
          }
        />

        <Route
          path="/about"
          element={
            <AboutInternship />
          }
        />

        <Route
          path="/privacy"
          element={<Privacy />}
        />

        <Route
          path="/help"
          element={<Help />}
        />

        {/* =======================
            Admin Dashboard
        ======================= */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* =======================
            Students
        ======================= */}

        <Route
          path="/admin/students"
          element={
            <ProtectedRoute>
              <Students />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/students/add"
          element={
            <ProtectedRoute>
              <AddStudent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/students/edit"
          element={
            <ProtectedRoute>
              <EditStudent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/student"
          element={
            <ProtectedRoute>
              <StudentDetails />
            </ProtectedRoute>
          }
        />

        {/* =======================
            Attendance
        ======================= */}

        <Route
          path="/admin/attendance"
          element={
            <ProtectedRoute>
              <AdminAttendance />
            </ProtectedRoute>
          }
        />

        {/* =======================
            Schedule
        ======================= */}

        <Route
          path="/admin/schedule"
          element={
            <ProtectedRoute>
              <AdminSchedule />
            </ProtectedRoute>
          }
        />

        {/* =======================
            Grievances
        ======================= */}

        <Route
          path="/admin/grievances"
          element={
            <ProtectedRoute>
              <AdminGrievances />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/grievance-details"
          element={
            <ProtectedRoute>
              <GrievanceDetails />
            </ProtectedRoute>
          }
        />

        {/* =======================
            Certificates
        ======================= */}

        <Route
          path="/admin/certificates"
          element={
            <ProtectedRoute>
              <AdminCertificates />
            </ProtectedRoute>
          }
        />

        {/* =======================
            Leave Requests
        ======================= */}

        <Route
          path="/admin/leave-requests"
          element={
            <ProtectedRoute>
              <AdminLeaveRequests />
            </ProtectedRoute>
          }
        />

        {/* =======================
            Performance
        ======================= */}

        <Route
          path="/admin/performance"
          element={
            <ProtectedRoute>
              <Performance />
            </ProtectedRoute>
          }
        />

        {/* =======================
            Notifications
        ======================= */}

        <Route
          path="/admin/notifications"
          element={
            <ProtectedRoute>
              <AdminNotifications />
            </ProtectedRoute>
          }
        />

        {/* =======================
            Settings
        ======================= */}

        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          }
        />

        {/* =======================
            Master Data
        ======================= */}

        <Route
          path="/admin/MasterData"
          element={
            <ProtectedRoute>
              <MasterData />
            </ProtectedRoute>
          }
        />

        {/* =======================
            Mentor Assignments
        ======================= */}

        <Route
          path="/admin/MentorAssignments"
          element={
            <ProtectedRoute>
              <MentorAssignments />
            </ProtectedRoute>
          }
        />

        {/* =======================
            Venue Assignments
        ======================= */}

        <Route
          path="/admin/VenueAssignments"
          element={
            <ProtectedRoute>
              <VenueAssignments />
            </ProtectedRoute>
          }
        />

        {/* =======================
            Admin More
        ======================= */}

        <Route
          path="/admin/more"
          element={
            <ProtectedRoute>
              <AdminMore />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}