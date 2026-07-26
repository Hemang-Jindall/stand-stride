import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import MobileLayout from "../../layouts/MobileLayout";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";

import api from "../../api/api";

import {
  CalendarDays,
  CircleCheck,
  CircleX,
  Clock,
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

interface StoredStudent {
  id: string;
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function Attendance() {
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

  const student = useMemo<StoredStudent | null>(() => {
    try {
      const stored =
        localStorage.getItem("student");

      if (!stored) {
        return null;
      }

      return JSON.parse(
        stored
      ) as StoredStudent;
    } catch {
      return null;
    }
  }, []);

  // =========================
  // Load Attendance
  // =========================

  useEffect(() => {
    async function loadAttendance() {
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

        // Backend now returns ONLY the
        // logged-in student's attendance.
        const response = await api.get(
          "/attendance/me",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const records =
          response.data as AttendanceRecord[];

        setAttendance(records);

      } catch (error: any) {
        console.error(
          "LOAD STUDENT ATTENDANCE ERROR:",
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
          "Failed to load attendance."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAttendance();
  }, [navigate, student]);

  // =========================
  // Statistics
  // =========================

  const presentCount =
    attendance.filter(
      (record) =>
        record.status === "PRESENT"
    ).length;

  const absentCount =
    attendance.filter(
      (record) =>
        record.status === "ABSENT"
    ).length;

  const leaveCount =
    attendance.filter(
      (record) =>
        record.status === "LEAVE"
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
  // Helpers
  // =========================

  function formatDate(date: string) {
    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  function statusIcon(
    status: AttendanceStatus
  ) {
    if (status === "PRESENT") {
      return (
        <CircleCheck
          size={20}
          className="text-emerald-600"
        />
      );
    }

    if (status === "ABSENT") {
      return (
        <CircleX
          size={20}
          className="text-red-500"
        />
      );
    }

    return (
      <Clock
        size={20}
        className="text-amber-500"
      />
    );
  }

  function statusLabel(
    status: AttendanceStatus
  ) {
    if (status === "PRESENT") {
      return "Present";
    }

    if (status === "ABSENT") {
      return "Absent";
    }

    return "Leave";
  }

  // =========================
  // UI
  // =========================

  return (
    <MobileLayout>
      <Header />

      <main className="flex-1 py-4 overflow-y-auto">

        <section className="mx-5">

          {/* Page Header */}

          <h1 className="text-2xl font-bold">
            Attendance
          </h1>

          {student && (
            <p className="text-sm text-slate-500 mt-1">
              {student.firstName}{" "}
              {student.lastName}
              {" • "}
              {student.rollNumber}
            </p>
          )}

          {/* Loading */}

          {loading && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-500 mt-5">
              Loading attendance...
            </div>
          )}

          {/* Error */}

          {error && !loading && (
            <div className="bg-red-50 text-red-600 rounded-xl p-4 mt-5">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>

              {/* =========================
                  Overall Attendance
              ========================= */}

              <div className="bg-white rounded-xl shadow-sm p-5 mt-5">

                <p className="text-sm text-slate-500">
                  Overall Attendance
                </p>

                <div className="flex items-end gap-2 mt-1">

                  <span className="text-4xl font-bold text-emerald-600">
                    {attendancePercentage}%
                  </span>

                  <span className="text-sm text-slate-500 mb-1">
                    {presentCount} of{" "}
                    {totalCount} days present
                  </span>

                </div>

              </div>

              {/* =========================
                  Statistics
              ========================= */}

              <div className="grid grid-cols-3 gap-3 mt-4">

                {/* Present */}

                <div className="bg-white rounded-xl shadow-sm p-4 text-center">

                  <CircleCheck
                    size={22}
                    className="text-emerald-600 mx-auto"
                  />

                  <p className="text-xl font-bold mt-2">
                    {presentCount}
                  </p>

                  <p className="text-xs text-slate-500">
                    Present
                  </p>

                </div>

                {/* Absent */}

                <div className="bg-white rounded-xl shadow-sm p-4 text-center">

                  <CircleX
                    size={22}
                    className="text-red-500 mx-auto"
                  />

                  <p className="text-xl font-bold mt-2">
                    {absentCount}
                  </p>

                  <p className="text-xs text-slate-500">
                    Absent
                  </p>

                </div>

                {/* Leave */}

                <div className="bg-white rounded-xl shadow-sm p-4 text-center">

                  <Clock
                    size={22}
                    className="text-amber-500 mx-auto"
                  />

                  <p className="text-xl font-bold mt-2">
                    {leaveCount}
                  </p>

                  <p className="text-xs text-slate-500">
                    Leave
                  </p>

                </div>

              </div>

              {/* =========================
                  Attendance History
              ========================= */}

              <div className="mt-6">

                <div className="flex items-center gap-2 mb-3">

                  <CalendarDays
                    size={20}
                    className="text-slate-600"
                  />

                  <h2 className="font-semibold text-lg">
                    Attendance History
                  </h2>

                </div>

                {attendance.length === 0 ? (

                  <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-500">
                    No attendance records yet.
                  </div>

                ) : (

                  <div className="space-y-3">

                    {attendance.map(
                      (record) => (
                        <div
                          key={record.id}
                          className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between"
                        >

                          {/* Date */}

                          <div>

                            <p className="font-medium">
                              {formatDate(
                                record.date
                              )}
                            </p>

                            <p className="text-xs text-slate-500">
                              Attendance
                            </p>

                          </div>

                          {/* Status */}

                          <div className="flex items-center gap-2">

                            {statusIcon(
                              record.status
                            )}

                            <span className="text-sm font-medium">
                              {statusLabel(
                                record.status
                              )}
                            </span>

                          </div>

                        </div>
                      )
                    )}

                  </div>

                )}

              </div>

            </>
          )}

        </section>

      </main>

      <BottomNavigation />
    </MobileLayout>
  );
}