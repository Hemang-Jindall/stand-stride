import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

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
import StudentDetails from "../pages/admin/StudentDetails";
import AdminAttendance from "../pages/admin/Attendance";
import AdminGrievances from "../pages/admin/Grievances";
import GrievanceDetails from "../pages/admin/GrievanceDetails";
import AdminCertificates from "../pages/admin/Certificates";
import AdminSettings from "../pages/admin/Settings";
import LeaveRequests from "../pages/admin/LeaveRequests";
import Performance from "../pages/admin/Performance";
import Remarks from "../pages/admin/Remarks";
import AdminNotifications from "../pages/admin/Notifications";
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
        ======================== */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* =======================
            Student Routes
        ======================== */}

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
          element={<EmergencySupport />}
        />

        <Route
          path="/about"
          element={<AboutInternship />}
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
            Admin Routes
        ======================== */}

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/students"
          element={<Students />}
        />

        <Route
          path="/admin/student"
          element={<StudentDetails />}
        />

        <Route
          path="/admin/attendance"
          element={<AdminAttendance />}
        />

        <Route
          path="/admin/grievances"
          element={<AdminGrievances />}
        />

        <Route
          path="/admin/grievance-details"
          element={<GrievanceDetails />}
        />

        <Route
          path="/admin/certificates"
          element={<AdminCertificates />}
        />

        <Route
          path="/admin/leave-requests"
          element={<LeaveRequests />}
        />

        <Route
          path="/admin/performance"
          element={<Performance />}
        />

        <Route
          path="/admin/remarks"
          element={<Remarks />}
        />

        <Route
          path="/admin/notifications"
          element={<AdminNotifications />}
        />

        <Route
          path="/admin/settings"
          element={<AdminSettings />}
        />

        <Route
          path="/admin/MasterData"
          element={<MasterData />}
        />

        <Route
          path="/admin/MentorAssignments"
          element={<MentorAssignments />}
        />

        <Route
          path="/admin/VenueAssignments"
          element={<VenueAssignments />}
        />

        <Route
          path="/admin/more"
          element={<AdminMore />}
        />

      </Routes>

    </BrowserRouter>
  );
}