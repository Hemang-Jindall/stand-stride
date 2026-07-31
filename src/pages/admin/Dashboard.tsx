import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import MobileLayout from "../../layouts/MobileLayout";
import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import api from "../../api/api";

import {
  Users,
  ClipboardCheck,
  BadgeCheck,
  TriangleAlert,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";

import {
  hasPermission,
  getAdminRole,
} from "../../utils/permissions";

interface Student {
  id: string;
}

interface Attendance {
  id: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LEAVE";
  studentId: string;
}

interface Certificate {
  id: string;
  studentId: string;
}

interface Grievance {
  id: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
}

interface DashboardStats {
  activeInterns: number;
  attendanceToday: number;
  certificatesPending: number;
  openGrievances: number;
}

interface StatCard {
  title: string;
  value?: number;
  icon: React.ReactNode;
  route: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const adminRole = getAdminRole();
  const isMentor = adminRole === "MENTOR";

  const [dashboardStats, setDashboardStats] =
    useState<DashboardStats>({
      activeInterns: 0,
      attendanceToday: 0,
      certificatesPending: 0,
      openGrievances: 0,
    });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // =========================
        // STUDENTS
        // =========================

        let students: Student[] = [];

        if (
          hasPermission("VIEW_STUDENTS")
        ) {
          const response =
            await api.get<Student[]>(
              "/students",
              { headers }
            );

          students = response.data;
        }

        // For Mentor, /students is already
        // filtered by the backend to only
        // assigned students.

        const activeInterns =
          students.length;

        // =========================
        // ATTENDANCE
        // =========================

        let attendanceToday = 0;

        if (
          hasPermission(
            "VIEW_ATTENDANCE"
          )
        ) {
          const response =
            await api.get<Attendance[]>(
              "/attendance",
              { headers }
            );

          const attendance =
            response.data;

          const today = new Date();

          attendanceToday =
            attendance.filter(
              (record) => {
                const recordDate =
                  new Date(record.date);

                const isToday =
                  recordDate.getFullYear() ===
                    today.getFullYear() &&
                  recordDate.getMonth() ===
                    today.getMonth() &&
                  recordDate.getDate() ===
                    today.getDate();

                if (!isToday) {
                  return false;
                }

                if (
                  record.status !==
                  "PRESENT"
                ) {
                  return false;
                }

                // Mentor dashboard should
                // only count assigned students.

                if (isMentor) {
                  return students.some(
                    (student) =>
                      student.id ===
                      record.studentId
                  );
                }

                return true;
              }
            ).length;
        }

        // =========================
        // CERTIFICATES
        // =========================

        let certificatesPending = 0;

        if (
          hasPermission(
            "VIEW_CERTIFICATES"
          )
        ) {
          const response =
            await api.get<Certificate[]>(
              "/certificates",
              { headers }
            );

          const certificates =
            response.data;

          const studentsWithCertificates =
            new Set(
              certificates.map(
                (certificate) =>
                  certificate.studentId
              )
            );

          certificatesPending =
            students.filter(
              (student) =>
                !studentsWithCertificates.has(
                  student.id
                )
            ).length;
        }

        // =========================
        // GRIEVANCES
        // =========================

        let openGrievances = 0;

        if (
          hasPermission(
            "VIEW_GRIEVANCES"
          )
        ) {
          const response =
            await api.get<Grievance[]>(
              "/grievances",
              { headers }
            );

          openGrievances =
            response.data.filter(
              (grievance) =>
                grievance.status ===
                "OPEN"
            ).length;
        }

        setDashboardStats({
          activeInterns,
          attendanceToday,
          certificatesPending,
          openGrievances,
        });
      } catch (error) {
        console.error(
          "DASHBOARD ERROR:",
          error
        );

        setError(
          "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [navigate, isMentor]);

  // =========================
  // DASHBOARD CARDS
  // =========================

  const stats = useMemo(() => {
    const cards: StatCard[] = [];

    if (
      hasPermission("VIEW_STUDENTS")
    ) {
      cards.push({
        title: isMentor
          ? "My Interns"
          : "Active Interns",

        value:
          dashboardStats.activeInterns,

        icon: (
          <Users
            size={20}
            className="text-blue-600"
          />
        ),

        route: "/admin/students",
      });
    }

    if (
      hasPermission(
        "VIEW_ATTENDANCE"
      )
    ) {
      cards.push({
        title: "Attendance Today",

        value:
          dashboardStats.attendanceToday,

        icon: (
          <ClipboardCheck
            size={20}
            className="text-emerald-600"
          />
        ),

        route: "/admin/attendance",
      });
    }

    if (
      hasPermission(
        "VIEW_CERTIFICATES"
      )
    ) {
      cards.push({
        title:
          "Certificates Pending",

        value:
          dashboardStats.certificatesPending,

        icon: (
          <BadgeCheck
            size={20}
            className="text-yellow-600"
          />
        ),

        route:
          "/admin/certificates",
      });
    }

    if (
      hasPermission(
        "VIEW_GRIEVANCES"
      )
    ) {
      cards.push({
        title: "Open Grievances",

        value:
          dashboardStats.openGrievances,

        icon: (
          <TriangleAlert
            size={20}
            className="text-red-600"
          />
        ),

        route:
          "/admin/grievances",
      });
    }

    if (
      isMentor &&
      hasPermission(
        "VIEW_PERFORMANCE"
      )
    ) {
      cards.push({
        title: "Performance",

        icon: (
          <ChartNoAxesColumnIncreasing
            size={20}
            className="text-purple-600"
          />
        ),

        route:
          "/admin/performance",
      });
    }

    return cards;
  }, [
    dashboardStats,
    isMentor,
  ]);

  // =========================
  // TITLE
  // =========================

  const dashboardTitle =
    adminRole === "MENTOR"
      ? "Mentor Dashboard"
      : adminRole === "FACILITATOR"
        ? "Facilitator Dashboard"
        : adminRole === "COORDINATOR"
          ? "Coordinator Dashboard"
          : "Admin Dashboard";

  return (
    <MobileLayout>
      <Header />

      <main className="flex-1 py-4">
        <section className="mx-5">
          <h2 className="text-2xl font-bold mb-5">
            {dashboardTitle}
          </h2>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <button
                key={stat.title}
                onClick={() =>
                  navigate(stat.route)
                }
                className="bg-white rounded-xl shadow-sm p-4 text-left active:scale-95 transition"
              >
                <div className="mb-3">
                  {stat.icon}
                </div>

                {stat.value !==
                  undefined && (
                  <h3 className="text-3xl font-bold">
                    {loading
                      ? "—"
                      : stat.value}
                  </h3>
                )}

                <p
                  className={
                    stat.value === undefined
                      ? "text-sm font-medium text-slate-700"
                      : "text-sm text-slate-500 mt-1"
                  }
                >
                  {stat.title}
                </p>
              </button>
            ))}
          </div>
        </section>
      </main>

      <AdminBottomNavigation />
    </MobileLayout>
  );
}