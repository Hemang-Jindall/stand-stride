import {
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import MobileLayout from "../../layouts/MobileLayout";
import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import api from "../../api/api";

import {
  TriangleAlert,
  User,
  CalendarDays,
  CircleCheck,
  Clock3,
  LoaderCircle,
  ArrowLeft,
} from "lucide-react";

type GrievanceStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED";

interface Batch {
  id: string;
  name: string;
}

interface Student {
  id: string;
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  batch?: Batch;
}

interface GrievanceRecord {
  id: string;
  title: string;
  description: string;
  status: GrievanceStatus;
  studentId: string;
  createdAt: string;
  student: Student;
}

interface LocationState {
  grievance?: GrievanceRecord;
}

export default function GrievanceDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const state =
    location.state as
      | LocationState
      | null;

  const initialGrievance =
    state?.grievance ?? null;

  const [grievance, setGrievance] =
    useState<GrievanceRecord | null>(
      initialGrievance
    );

  const [updating, setUpdating] =
    useState(false);

  const [error, setError] =
    useState("");

  // =========================
  // Helpers
  // =========================

  function formatDate(
    date: string
  ) {
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

  function getStatusLabel(
    status: GrievanceStatus
  ) {
    if (status === "IN_PROGRESS") {
      return "In Progress";
    }

    if (status === "RESOLVED") {
      return "Resolved";
    }

    return "Open";
  }

  function getStatusClasses(
    status: GrievanceStatus
  ) {
    if (status === "RESOLVED") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (status === "IN_PROGRESS") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-amber-100 text-amber-700";
  }

  function getStatusIcon(
    status: GrievanceStatus
  ) {
    if (status === "RESOLVED") {
      return (
        <CircleCheck size={15} />
      );
    }

    if (status === "IN_PROGRESS") {
      return (
        <LoaderCircle size={15} />
      );
    }

    return (
      <Clock3 size={15} />
    );
  }

  // =========================
  // Update Status
  // =========================

  async function updateStatus(
    status: GrievanceStatus
  ) {
    if (!grievance) {
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const token =
        localStorage.getItem("token");

      const role =
        localStorage.getItem("role");

      if (
        !token ||
        role !== "admin"
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        localStorage.removeItem("student");
        localStorage.removeItem("role");

        navigate("/login", {
          replace: true,
        });

        return;
      }

      const response =
        await api.patch(
          `/grievances/${grievance.id}/status`,
          {
            status,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setGrievance(
        response.data as GrievanceRecord
      );
    } catch (error: any) {
      console.error(
        "UPDATE GRIEVANCE ERROR:",
        error
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        localStorage.removeItem("student");
        localStorage.removeItem("role");

        navigate("/login", {
          replace: true,
        });

        return;
      }

      setError(
        error.response?.data?.message ??
          "Failed to update grievance."
      );
    } finally {
      setUpdating(false);
    }
  }

  // =========================
  // Missing State
  // =========================

  if (!grievance) {
    return (
      <MobileLayout>
        <Header />

        <main className="flex-1 py-4 overflow-y-auto">

          <section className="mx-5 bg-white rounded-xl shadow-sm p-5 text-center">

            <TriangleAlert
              size={32}
              className="text-amber-500 mx-auto"
            />

            <h2 className="text-lg font-semibold mt-3">
              Grievance not found
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Return to the grievance list
              and select a grievance.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/grievances"
                )
              }
              className="mt-5 w-full bg-emerald-600 text-white rounded-xl py-3"
            >
              Back to Grievances
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

        <section className="mx-5">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/grievances"
              )
            }
            className="flex items-center gap-2 text-sm text-slate-600 mb-4"
          >
            <ArrowLeft size={18} />

            Back to Grievances
          </button>

          <div className="bg-white rounded-xl shadow-sm p-5">

            {/* Heading */}

            <div className="flex items-center gap-2 mb-5">

              <TriangleAlert
                size={22}
                className="text-red-500"
              />

              <h2 className="text-xl font-bold">
                Grievance Details
              </h2>

            </div>

            {error && (
              <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-5 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-5">

              {/* Student */}

              <div className="flex items-start gap-3">

                <User
                  size={18}
                  className="text-slate-500 mt-1"
                />

                <div>

                  <p className="font-medium">
                    {grievance.student
                      .firstName}{" "}
                    {grievance.student
                      .lastName}
                  </p>

                  <p className="text-sm text-slate-500">
                    {grievance.student
                      .rollNumber}

                    {grievance.student
                      .batch?.name &&
                      ` • ${grievance.student.batch.name}`}
                  </p>

                </div>

              </div>

              {/* Date */}

              <div className="flex items-center gap-3">

                <CalendarDays
                  size={18}
                  className="text-slate-500"
                />

                <span>
                  {formatDate(
                    grievance.createdAt
                  )}
                </span>

              </div>

              {/* Title */}

              <div>

                <p className="text-sm text-slate-500 mb-2">
                  Title
                </p>

                <p className="font-medium">
                  {grievance.title}
                </p>

              </div>

              {/* Description */}

              <div>

                <p className="text-sm text-slate-500 mb-2">
                  Description
                </p>

                <p className="text-slate-700 whitespace-pre-wrap">
                  {grievance.description}
                </p>

              </div>

              {/* Status */}

              <div>

                <p className="text-sm text-slate-500 mb-2">
                  Status
                </p>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium ${getStatusClasses(
                    grievance.status
                  )}`}
                >

                  {getStatusIcon(
                    grievance.status
                  )}

                  {getStatusLabel(
                    grievance.status
                  )}

                </span>

              </div>

            </div>

            {/* Actions */}

            <div className="mt-6 space-y-2">

              {grievance.status ===
                "OPEN" && (
                <button
                  type="button"
                  disabled={updating}
                  onClick={() =>
                    updateStatus(
                      "IN_PROGRESS"
                    )
                  }
                  className="w-full bg-blue-600 text-white rounded-xl py-3 flex items-center justify-center gap-2 disabled:opacity-60"
                >

                  <LoaderCircle
                    size={18}
                  />

                  {updating
                    ? "Updating..."
                    : "Mark In Progress"}

                </button>
              )}

              {grievance.status !==
                "RESOLVED" && (
                <button
                  type="button"
                  disabled={updating}
                  onClick={() =>
                    updateStatus(
                      "RESOLVED"
                    )
                  }
                  className="w-full bg-emerald-600 text-white rounded-xl py-3 flex items-center justify-center gap-2 disabled:opacity-60"
                >

                  <CircleCheck
                    size={18}
                  />

                  {updating
                    ? "Updating..."
                    : "Mark as Resolved"}

                </button>
              )}

              {grievance.status ===
                "RESOLVED" && (
                <div className="bg-emerald-50 text-emerald-700 rounded-xl p-4 flex items-center justify-center gap-2 font-medium">

                  <CircleCheck
                    size={18}
                  />

                  Grievance Resolved

                </div>
              )}

            </div>

          </div>

        </section>

      </main>

      <AdminBottomNavigation />

    </MobileLayout>
  );
}