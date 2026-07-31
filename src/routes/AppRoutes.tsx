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
          element={
            <ProtectedRoute role="student">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute role="student">
              <Attendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/schedule"
          element={
            <ProtectedRoute role="student">
              <Schedule />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute role="student">
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/certificate"
          element={
            <ProtectedRoute role="student">
              <Certificate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/grievance"
          element={
            <ProtectedRoute role="student">
              <Grievance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leave-requests"
          element={
            <ProtectedRoute role="student">
              <StudentLeaveRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute role="student">
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute role="student">
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/announcements"
          element={
            <ProtectedRoute role="student">
              <Announcements />
            </ProtectedRoute>
          }
        />

        <Route
          path="/more"
          element={
            <ProtectedRoute role="student">
              <More />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contacts"
          element={
            <ProtectedRoute role="student">
              <SOPContacts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/emergency"
          element={
            <ProtectedRoute role="student">
              <EmergencySupport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/about"
          element={
            <ProtectedRoute role="student">
              <AboutInternship />
            </ProtectedRoute>
          }
        />

        <Route
          path="/privacy"
          element={
            <ProtectedRoute role="student">
              <Privacy />
            </ProtectedRoute>
          }
        />

        <Route
          path="/help"
          element={
            <ProtectedRoute role="student">
              <Help />
            </ProtectedRoute>
          }
        />

        {/* =======================
            Admin Dashboard
        ======================= */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
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
            <ProtectedRoute
              role="admin"
              permission="VIEW_STUDENTS"
            >
              <Students />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/students/add"
          element={
            <ProtectedRoute
              role="admin"
              permission="CREATE_STUDENTS"
            >
              <AddStudent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/students/edit"
          element={
            <ProtectedRoute
              role="admin"
              permission="EDIT_STUDENTS"
            >
              <EditStudent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/student"
          element={
            <ProtectedRoute
              role="admin"
              permission="VIEW_STUDENTS"
            >
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
            <ProtectedRoute
              role="admin"
              permission="VIEW_ATTENDANCE"
            >
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
            <ProtectedRoute
              role="admin"
              permission="VIEW_SCHEDULE"
            >
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
            <ProtectedRoute
              role="admin"
              permission="VIEW_GRIEVANCES"
            >
              <AdminGrievances />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/grievance-details"
          element={
            <ProtectedRoute
              role="admin"
              permission="VIEW_GRIEVANCES"
            >
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
            <ProtectedRoute
              role="admin"
              permission="VIEW_CERTIFICATES"
            >
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
            <ProtectedRoute
              role="admin"
              permission="VIEW_LEAVE"
            >
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
            <ProtectedRoute
              role="admin"
              permission="VIEW_PERFORMANCE"
            >
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
            <ProtectedRoute
              role="admin"
              permission="VIEW_NOTIFICATIONS"
            >
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
            <ProtectedRoute role="admin">
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
            <ProtectedRoute
              role="admin"
              permission="VIEW_MASTER_DATA"
            >
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
            <ProtectedRoute
              role="admin"
              permission="VIEW_MENTORS"
            >
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
            <ProtectedRoute
              role="admin"
              permission="VIEW_VENUES"
            >
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
            <ProtectedRoute role="admin">
              <AdminMore />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}