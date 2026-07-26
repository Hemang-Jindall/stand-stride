import { useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import MobileLayout from "../../layouts/MobileLayout";
import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import api from "../../api/api";

import {
  User,
  Users,
  ClipboardCheck,
  BadgeCheck,
  TriangleAlert,
  CalendarDays,
  ChevronRight,
  Mail,
  Phone,
  Pencil,
  Trash2,
} from "lucide-react";

interface Student {
  id: string;
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  batchId: string;

  batch?: {
    id: string;
    name: string;
  };
}

export default function StudentDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const student =
    location.state?.student as
      | Student
      | undefined;

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState("");

  // =========================
  // DELETE STUDENT
  // =========================

  async function handleDelete() {
    if (!student) return;

    const confirmed =
      window.confirm(
        `Delete ${student.firstName} ${student.lastName}?`
      );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      await api.delete(
        `/students/${student.id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      navigate(
        "/admin/students",
        {
          replace: true,
        }
      );
    } catch (error: any) {
      console.error(
        "DELETE STUDENT ERROR:",
        error
      );

      setError(
        error.response?.data?.message ??
          "Failed to delete student."
      );
    } finally {
      setDeleting(false);
    }
  }

  // =========================
  // MENU NAVIGATION
  // =========================

  function openAttendance() {
    if (!student) return;

    navigate(
      "/admin/attendance",
      {
        state: {
          student,
          studentId: student.id,
        },
      }
    );
  }

  function openCertificates() {
    if (!student) return;

    navigate(
      "/admin/certificates",
      {
        state: {
          student,
          studentId: student.id,
        },
      }
    );
  }

  function openLeaveRequests() {
    if (!student) return;

    navigate(
      "/admin/leave-requests",
      {
        state: {
          student,
          studentId: student.id,
        },
      }
    );
  }

  function openGrievances() {
    if (!student) return;

    navigate(
      "/admin/grievances",
      {
        state: {
          student,
          studentId: student.id,
        },
      }
    );
  }

  function openPerformance() {
    if (!student) return;

    navigate(
      "/admin/performance",
      {
        state: {
          studentId: student.id,
        },
      }
    );
  }

  // =========================
  // NO STUDENT
  // =========================

  if (!student) {
    return (
      <MobileLayout>
        <Header />

        <main className="flex-1 py-4 overflow-y-auto">

          <section className="mx-5 bg-white rounded-xl shadow-sm p-6 text-center">

            <User
              size={42}
              className="mx-auto text-slate-400 mb-3"
            />

            <p className="font-semibold">
              Student not found
            </p>

            <p className="text-sm text-slate-500 mt-1 mb-4">
              Open a student from the
              Students page.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/students"
                )
              }
              className="w-full bg-emerald-600 text-white px-5 py-3 rounded-xl"
            >
              Back to Students
            </button>

          </section>

        </main>

        <AdminBottomNavigation />
      </MobileLayout>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <MobileLayout>
      <Header />

      <main className="flex-1 py-4 overflow-y-auto">

        {/* Student Information */}

        <section className="mx-5 bg-white rounded-xl shadow-sm p-5">

          <div className="flex items-center gap-3 mb-5">

            <User
              size={48}
              className="text-emerald-600"
            />

            <div>

              <h2 className="text-xl font-bold">
                {student.firstName}{" "}
                {student.lastName}
              </h2>

              <p className="text-slate-500">
                {student.rollNumber}
              </p>

            </div>

          </div>

          <div className="space-y-3">

            {/* Batch */}

            <div className="flex justify-between gap-4">

              <span className="text-slate-500">
                Batch
              </span>

              <span className="text-right font-medium">
                {student.batch?.name ??
                  "No Batch"}
              </span>

            </div>

            {/* Roll Number */}

            <div className="flex justify-between gap-4">

              <span className="text-slate-500">
                Student ID
              </span>

              <span className="text-right">
                {student.rollNumber}
              </span>

            </div>

            {/* Email */}

            <div className="flex justify-between gap-4">

              <span className="text-slate-500 flex items-center gap-1">
                <Mail size={15} />
                Email
              </span>

              <span className="text-right text-sm break-all">
                {student.email}
              </span>

            </div>

            {/* Phone */}

            <div className="flex justify-between gap-4">

              <span className="text-slate-500 flex items-center gap-1">
                <Phone size={15} />
                Phone
              </span>

              <span className="text-right">
                {student.phone ??
                  "Not provided"}
              </span>

            </div>

          </div>

          {/* Edit / Delete */}

          <div className="grid grid-cols-2 gap-3 mt-6">

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/students/edit",
                  {
                    state: {
                      student,
                    },
                  }
                )
              }
              className="rounded-xl bg-emerald-600 text-white py-3 flex items-center justify-center gap-2 font-semibold"
            >
              <Pencil size={17} />
              Edit
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-xl border border-red-200 text-red-600 py-3 flex items-center justify-center gap-2 font-semibold disabled:opacity-50"
            >
              <Trash2 size={17} />

              {deleting
                ? "Deleting..."
                : "Delete"}
            </button>

          </div>

          {error && (
            <p className="text-red-500 text-sm mt-3">
              {error}
            </p>
          )}

        </section>

        {/* Student Management */}

        <section className="mx-5 mt-4 bg-white rounded-xl shadow-sm">

          <button
            type="button"
            onClick={openAttendance}
            className="w-full flex justify-between items-center px-5 py-4 border-b hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <ClipboardCheck
                size={18}
              />

              <span>
                Attendance
              </span>
            </div>

            <ChevronRight
              size={18}
              className="text-slate-400"
            />
          </button>

          <button
            type="button"
            onClick={openCertificates}
            className="w-full flex justify-between items-center px-5 py-4 border-b hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <BadgeCheck
                size={18}
              />

              <span>
                Certificates
              </span>
            </div>

            <ChevronRight
              size={18}
              className="text-slate-400"
            />
          </button>

          <button
            type="button"
            onClick={openLeaveRequests}
            className="w-full flex justify-between items-center px-5 py-4 border-b hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <CalendarDays
                size={18}
              />

              <span>
                Leave Requests
              </span>
            </div>

            <ChevronRight
              size={18}
              className="text-slate-400"
            />
          </button>

          <button
            type="button"
            onClick={openGrievances}
            className="w-full flex justify-between items-center px-5 py-4 border-b hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <TriangleAlert
                size={18}
              />

              <span>
                Grievances
              </span>
            </div>

            <ChevronRight
              size={18}
              className="text-slate-400"
            />
          </button>

          <button
            type="button"
            onClick={openPerformance}
            className="w-full flex justify-between items-center px-5 py-4 hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <Users
                size={18}
              />

              <span>
                Internship Progress
              </span>
            </div>

            <ChevronRight
              size={18}
              className="text-slate-400"
            />
          </button>

        </section>

      </main>

      <AdminBottomNavigation />
    </MobileLayout>
  );
}