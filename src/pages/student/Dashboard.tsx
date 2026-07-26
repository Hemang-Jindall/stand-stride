import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import MobileLayout from "../../layouts/MobileLayout";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";

import QuickActions from "../../components/QuickActions";

import api from "../../api/api";

import {
  User,
  Users,
  CalendarCheck,
  CircleCheck,
  ArrowRight,
} from "lucide-react";

type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LEAVE";

interface AttendanceRecord {
  id: string;
  date: string;
  status: AttendanceStatus;
  studentId: string;
}

interface Batch {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
}

interface Student {
  id: string;
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  batchId: string;
  batch?: Batch;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [attendance, setAttendance] =
    useState<AttendanceRecord[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================
  // Logged-in Student
  // =========================

  const student = useMemo<Student | null>(() => {
    try {
      const stored =
        localStorage.getItem("student");

      if (!stored) {
        return null;
      }

      return JSON.parse(stored) as Student;
    } catch {
      return null;
    }
  }, []);

  // =========================
  // Load Dashboard Data
  // =========================

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token");

        const role =
          localStorage.getItem("role");

        if (
          !token ||
          !student ||
          role !== "student"
        ) {
          navigate("/login");
          return;
        }

        const response = await api.get(
          "/attendance/me",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setAttendance(
          response.data as AttendanceRecord[]
        );
      } catch (error: any) {
        console.error(
          "LOAD DASHBOARD ERROR:",
          error
        );

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("student");
          localStorage.removeItem("role");

          navigate("/login");
          return;
        }

        setError(
          "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [navigate, student]);

  // =========================
  // Attendance Statistics
  // =========================

  const presentCount =
    attendance.filter(
      (record) =>
        record.status === "PRESENT"
    ).length;

  const totalCount =
    attendance.length;

  const attendancePercentage =
    totalCount === 0
      ? 0
      : Math.round(
          (presentCount / totalCount) *
            100
        );

  // =========================
  // Internship Progress
  // =========================

  function getInternshipProgress() {
    if (
      !student?.batch?.startDate ||
      !student?.batch?.endDate
    ) {
      return null;
    }

    const start = new Date(
      student.batch.startDate
    ).getTime();

    const end = new Date(
      student.batch.endDate
    ).getTime();

    const now = Date.now();

    if (
      Number.isNaN(start) ||
      Number.isNaN(end) ||
      end <= start
    ) {
      return null;
    }

    if (now <= start) {
      return 0;
    }

    if (now >= end) {
      return 100;
    }

    return Math.round(
      ((now - start) /
        (end - start)) *
        100
    );
  }

  const internshipProgress =
    getInternshipProgress();

  // =========================
  // UI
  // =========================

  return (
    <MobileLayout>
      <Header />

      <main className="flex-1 py-4 overflow-y-auto">

        {/* =========================
            Greeting
        ========================= */}

        <section className="mx-5">

          <p className="text-sm text-slate-500">
            Welcome back,
          </p>

          <h1 className="text-2xl font-bold">
            {student?.firstName ??
              "Student"} 👋
          </h1>

        </section>

        {/* Loading */}

        {loading && (
          <section className="mx-5 mt-4">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center text-slate-500">
              Loading dashboard...
            </div>
          </section>
        )}

        {/* Error */}

        {error && !loading && (
          <section className="mx-5 mt-4">
            <div className="bg-red-50 text-red-600 rounded-xl p-4">
              {error}
            </div>
          </section>
        )}

        {!loading &&
          !error &&
          student && (
            <>

              {/* =========================
                  Student Summary
              ========================= */}

              <section className="mx-5 mt-4 bg-white rounded-xl shadow-sm p-5">

                <div className="flex items-center gap-3">

                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">

                    <User
                      size={24}
                      className="text-emerald-600"
                    />

                  </div>

                  <div>

                    <h2 className="font-semibold text-lg">
                      {student.firstName}{" "}
                      {student.lastName}
                    </h2>

                    <p className="text-sm text-slate-500">
                      {student.rollNumber}
                    </p>

                  </div>

                </div>

                <div className="border-t border-slate-100 mt-4 pt-4">

                  <div className="flex items-center gap-3">

                    <Users
                      size={19}
                      className="text-slate-400"
                    />

                    <div>

                      <p className="text-xs text-slate-500">
                        Batch
                      </p>

                      <p className="font-medium">
                        {student.batch?.name ??
                          "Not assigned"}
                      </p>

                    </div>

                  </div>

                </div>

              </section>

              {/* =========================
                  Attendance
              ========================= */}

              <section className="mx-5 mt-4 bg-white rounded-xl shadow-sm p-5">

                <div className="flex justify-between items-start">

                  <div>

                    <p className="text-sm text-slate-500">
                      Attendance
                    </p>

                    <p className="text-3xl font-bold text-emerald-600 mt-1">
                      {attendancePercentage}%
                    </p>

                  </div>

                  <CircleCheck
                    size={28}
                    className="text-emerald-600"
                  />

                </div>

                <p className="text-sm text-slate-500 mt-2">
                  {presentCount} of{" "}
                  {totalCount} recorded days
                  present
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/attendance")
                  }
                  className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-600"
                >
                  View Attendance

                  <ArrowRight size={16} />
                </button>

              </section>

              {/* =========================
                  Internship Progress
              ========================= */}

              <section className="mx-5 mt-4 bg-white rounded-xl shadow-sm p-5">

                <div className="flex items-center gap-2 mb-3">

                  <CalendarCheck
                    size={20}
                    className="text-emerald-600"
                  />

                  <h2 className="font-semibold">
                    Internship Progress
                  </h2>

                </div>

                {internshipProgress !== null ? (
                  <>

                    <div className="flex justify-between text-sm mb-2">

                      <span className="text-slate-500">
                        Progress
                      </span>

                      <span className="font-semibold">
                        {internshipProgress}%
                      </span>

                    </div>

                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all"
                        style={{
                          width:
                            `${internshipProgress}%`,
                        }}
                      />

                    </div>

                  </>
                ) : (
                  <p className="text-sm text-slate-500">
                    Internship dates are not
                    available.
                  </p>
                )}

              </section>

              {/* =========================
                  Quick Actions
              ========================= */}

              <section className="mt-4">
                <QuickActions />
              </section>

            </>
          )}

      </main>

      <BottomNavigation />
    </MobileLayout>
  );
}