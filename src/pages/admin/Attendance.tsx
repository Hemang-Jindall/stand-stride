import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import MobileLayout from "../../layouts/MobileLayout";
import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

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

interface Batch {
  id: string;
  name: string;
}

interface Student {
  id: string;
  rollNumber: string;
  firstName: string;
  lastName: string;
  batchId: string;
  batch?: Batch;
}

interface AttendanceRecord {
  id: string;
  date: string;
  status: AttendanceStatus;
  studentId: string;
}

export default function AdminAttendance() {
  const navigate = useNavigate();

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const [selectedDate, setSelectedDate] =
    useState(today);

  const [students, setStudents] =
    useState<Student[]>([]);

  const [attendance, setAttendance] =
    useState<AttendanceRecord[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [savingStudentId, setSavingStudentId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  // =========================
  // Load students + attendance
  // =========================

  const loadData = useCallback(async () => {
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

      const [
        studentsResponse,
        attendanceResponse,
      ] = await Promise.all([
        api.get("/students", {
          headers,
        }),

        api.get("/attendance", {
          headers,
        }),
      ]);

      setStudents(studentsResponse.data);
      setAttendance(attendanceResponse.data);
    } catch (error) {
      console.error(
        "LOAD ATTENDANCE ERROR:",
        error
      );

      setError(
        "Failed to load attendance."
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // =========================
  // Get attendance status
  // =========================

  function getStatus(
    studentId: string
  ): AttendanceStatus | null {
    const record = attendance.find(
      (item) =>
        item.studentId === studentId &&
        item.date.split("T")[0] ===
          selectedDate
    );

    return record?.status ?? null;
  }

  // =========================
  // Mark attendance
  // =========================

  async function markAttendance(
    studentId: string,
    status: AttendanceStatus
  ) {
    try {
      setSavingStudentId(studentId);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.post(
        "/attendance",
        {
          studentId,
          date: selectedDate,
          status,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const savedRecord =
        response.data as AttendanceRecord;

      // Replace the attendance entry for
      // this student + date in local state.

      setAttendance((current) => [
        ...current.filter(
          (item) =>
            !(
              item.studentId ===
                studentId &&
              item.date.split("T")[0] ===
                selectedDate
            )
        ),

        savedRecord,
      ]);
    } catch (error) {
      console.error(
        "MARK ATTENDANCE ERROR:",
        error
      );

      setError(
        "Failed to save attendance."
      );
    } finally {
      setSavingStudentId(null);
    }
  }

  return (
    <MobileLayout>
      <Header />

      <main className="flex-1 py-4 overflow-y-auto">
        <section className="mx-5">

          <h1 className="text-2xl font-bold mb-5">
            Attendance
          </h1>

          {/* Date selector */}

          <div className="bg-white rounded-xl shadow-sm p-4 mb-5">

            <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-2">

              <CalendarDays size={18} />

              Select Date

            </label>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) =>
                setSelectedDate(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
            />

          </div>

          {/* Error */}

          {error && (
            <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Loading */}

          {loading && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-500">
              Loading attendance...
            </div>
          )}

          {/* Student list */}

          {!loading && (
            <div className="space-y-3">

              {students.map((student) => {
                const status =
                  getStatus(student.id);

                const saving =
                  savingStudentId ===
                  student.id;

                return (
                  <div
                    key={student.id}
                    className="bg-white rounded-xl shadow-sm p-4"
                  >

                    {/* Student info */}

                    <div className="mb-3">

                      <h3 className="font-semibold">
                        {student.firstName}{" "}
                        {student.lastName}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {student.rollNumber}
                        {" • "}
                        {student.batch?.name ??
                          "No Batch"}
                      </p>

                    </div>

                    {/* Attendance buttons */}

                    <div className="grid grid-cols-3 gap-2">

                      {/* PRESENT */}

                      <button
                        type="button"
                        disabled={saving}
                        onClick={() =>
                          markAttendance(
                            student.id,
                            "PRESENT"
                          )
                        }
                        className={`rounded-lg py-2 flex items-center justify-center gap-1 text-sm font-medium transition disabled:opacity-50 ${
                          status === "PRESENT"
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >

                        <CircleCheck
                          size={16}
                        />

                        Present

                      </button>

                      {/* ABSENT */}

                      <button
                        type="button"
                        disabled={saving}
                        onClick={() =>
                          markAttendance(
                            student.id,
                            "ABSENT"
                          )
                        }
                        className={`rounded-lg py-2 flex items-center justify-center gap-1 text-sm font-medium transition disabled:opacity-50 ${
                          status === "ABSENT"
                            ? "bg-red-500 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >

                        <CircleX size={16} />

                        Absent

                      </button>

                      {/* LEAVE */}

                      <button
                        type="button"
                        disabled={saving}
                        onClick={() =>
                          markAttendance(
                            student.id,
                            "LEAVE"
                          )
                        }
                        className={`rounded-lg py-2 flex items-center justify-center gap-1 text-sm font-medium transition disabled:opacity-50 ${
                          status === "LEAVE"
                            ? "bg-amber-500 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >

                        <Clock size={16} />

                        Leave

                      </button>

                    </div>

                    {saving && (
                      <p className="text-xs text-slate-400 mt-2">
                        Saving...
                      </p>
                    )}

                  </div>
                );
              })}

              {students.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-500">
                  No students found.
                </div>
              )}

            </div>
          )}

        </section>
      </main>

      <AdminBottomNavigation />
    </MobileLayout>
  );
}