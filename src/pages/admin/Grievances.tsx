import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import MobileLayout from "../../layouts/MobileLayout";
import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import api from "../../api/api";

import {
  hasPermission,
} from "../../utils/permissions";

import {
  CircleCheck,
  Clock3,
  LoaderCircle,
  TriangleAlert,
} from "lucide-react";

// =========================
// Types
// =========================

type GrievanceStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED";

interface GrievanceRecord {
  id: string;
  title: string;
  description: string;
  status: GrievanceStatus;
  studentId: string;
  createdAt: string;

  student?: {
    id: string;
    rollNumber: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

// =========================
// Component
// =========================

export default function AdminGrievances() {
  const navigate = useNavigate();

  const [
    grievances,
    setGrievances,
  ] = useState<
    GrievanceRecord[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    updatingId,
    setUpdatingId,
  ] = useState<
    string | null
  >(null);

  const [
    error,
    setError,
  ] = useState("");

  // =========================
  // Permissions
  // =========================

  const canManageGrievances =
    hasPermission(
      "MANAGE_GRIEVANCES"
    );

  // =========================
  // Invalid Session
  // =========================

  const clearSession =
    useCallback(() => {
      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "admin"
      );

      localStorage.removeItem(
        "student"
      );

      localStorage.removeItem(
        "role"
      );

      localStorage.removeItem(
        "adminRole"
      );

      navigate(
        "/login",
        {
          replace: true,
        }
      );
    }, [navigate]);

  // =========================
  // Load Grievances
  // =========================

  const loadGrievances =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const token =
            localStorage.getItem(
              "token"
            );

          const role =
            localStorage.getItem(
              "role"
            );

          if (
            !token ||
            role !== "admin"
          ) {
            clearSession();
            return;
          }

          const response =
            await api.get<
              GrievanceRecord[]
            >(
              "/grievances",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          setGrievances(
            response.data
          );
        } catch (
          error: any
        ) {
          console.error(
            "LOAD ADMIN GRIEVANCES ERROR:",
            error
          );

          if (
            error.response
              ?.status === 401
          ) {
            clearSession();
            return;
          }

          setError(
            error.response?.data
              ?.message ??
              "Failed to load grievances."
          );
        } finally {
          setLoading(false);
        }
      },
      [clearSession]
    );

  useEffect(() => {
    loadGrievances();
  }, [loadGrievances]);

  // =========================
  // Update Status
  // =========================

  async function updateStatus(
    grievanceId: string,
    status: GrievanceStatus
  ) {
    if (
      !canManageGrievances
    ) {
      return;
    }

    try {
      setUpdatingId(
        grievanceId
      );

      setError("");

      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        clearSession();
        return;
      }

      const response =
        await api.patch(
          `/grievances/${grievanceId}/status`,
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

      const updated =
        response.data as GrievanceRecord;

      setGrievances(
        (current) =>
          current.map(
            (grievance) =>
              grievance.id ===
              grievanceId
                ? {
                    ...grievance,
                    ...updated,
                  }
                : grievance
          )
      );
    } catch (
      error: any
    ) {
      console.error(
        "UPDATE GRIEVANCE ERROR:",
        error
      );

      if (
        error.response
          ?.status === 401
      ) {
        clearSession();
        return;
      }

      setError(
        error.response?.data
          ?.message ??
          "Failed to update grievance."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  // =========================
  // Status Helpers
  // =========================

  function getStatusLabel(
    status: GrievanceStatus
  ) {
    if (
      status ===
      "IN_PROGRESS"
    ) {
      return "In Progress";
    }

    if (
      status === "RESOLVED"
    ) {
      return "Resolved";
    }

    return "Open";
  }

  function getStatusClasses(
    status: GrievanceStatus
  ) {
    if (
      status === "RESOLVED"
    ) {
      return (
        "bg-emerald-100 " +
        "text-emerald-700"
      );
    }

    if (
      status ===
      "IN_PROGRESS"
    ) {
      return (
        "bg-blue-100 " +
        "text-blue-700"
      );
    }

    return (
      "bg-amber-100 " +
      "text-amber-700"
    );
  }

  function getStatusIcon(
    status: GrievanceStatus
  ) {
    if (
      status === "RESOLVED"
    ) {
      return (
        <CircleCheck
          size={16}
        />
      );
    }

    if (
      status ===
      "IN_PROGRESS"
    ) {
      return (
        <LoaderCircle
          size={16}
        />
      );
    }

    return (
      <Clock3
        size={16}
      />
    );
  }

  // =========================
  // Student Name
  // =========================

  function getStudentName(
    grievance: GrievanceRecord
  ) {
    if (
      !grievance.student
    ) {
      return "Student";
    }

    return `${
      grievance.student
        .firstName
    } ${
      grievance.student
        .lastName
    }`;
  }

  // =========================
  // UI
  // =========================

  return (
    <MobileLayout>

      <Header />

      <main className="flex-1 py-4 overflow-y-auto">

        <section className="mx-5">

          {/* =========================
              Header
          ========================= */}

          <div className="flex items-center gap-2 mb-5">

            <TriangleAlert
              size={22}
              className="text-emerald-600"
            />

            <h1 className="text-2xl font-bold">
              Grievances
            </h1>

          </div>

          {/* =========================
              Error
          ========================= */}

          {error && (
            <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-4 text-sm">
              {error}
            </div>
          )}

          {/* =========================
              Loading
          ========================= */}

          {loading && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-500">
              Loading grievances...
            </div>
          )}

          {/* =========================
              Empty
          ========================= */}

          {!loading &&
            grievances.length ===
              0 && (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-500">
                No grievances found.
              </div>
            )}

          {/* =========================
              Grievances
          ========================= */}

          {!loading &&
            grievances.length >
              0 && (

            <div className="space-y-3">

              {grievances.map(
                (grievance) => {

                  const updating =
                    updatingId ===
                    grievance.id;

                  return (
                    <div
                      key={
                        grievance.id
                      }
                      className="bg-white rounded-xl shadow-sm p-4"
                    >

                      {/* =========================
                          Top
                      ========================= */}

                      <div className="flex justify-between items-start gap-3">

                        <div className="min-w-0">

                          <h2 className="font-semibold text-lg">
                            {
                              grievance.title
                            }
                          </h2>

                          <p className="text-sm text-slate-500 mt-1">

                            {getStudentName(
                              grievance
                            )}

                            {grievance
                              .student
                              ?.rollNumber && (
                              <>
                                {" • "}
                                {
                                  grievance
                                    .student
                                    .rollNumber
                                }
                              </>
                            )}

                          </p>

                          <p className="text-xs text-slate-400 mt-1">

                            {new Date(
                              grievance.createdAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}

                          </p>

                        </div>

                        {/* Status Badge */}

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium flex items-center gap-1 ${getStatusClasses(
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

                      {/* =========================
                          Description
                      ========================= */}

                      <p className="text-sm text-slate-600 mt-4 whitespace-pre-wrap">
                        {
                          grievance.description
                        }
                      </p>

                      {/* =========================
                          Management
                      ========================= */}

                      {canManageGrievances && (

                        <div className="mt-4 pt-4 border-t border-slate-100">

                          <p className="text-xs font-medium text-slate-500 mb-2">
                            Update Status
                          </p>

                          <div className="grid grid-cols-3 gap-2">

                            {/* OPEN */}

                            <button
                              type="button"
                              disabled={
                                updating
                              }
                              onClick={() =>
                                updateStatus(
                                  grievance.id,
                                  "OPEN"
                                )
                              }
                              className={`rounded-lg py-2 text-xs font-medium transition disabled:opacity-50 ${
                                grievance.status ===
                                "OPEN"
                                  ? "bg-amber-500 text-white"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              Open
                            </button>

                            {/* IN PROGRESS */}

                            <button
                              type="button"
                              disabled={
                                updating
                              }
                              onClick={() =>
                                updateStatus(
                                  grievance.id,
                                  "IN_PROGRESS"
                                )
                              }
                              className={`rounded-lg py-2 text-xs font-medium transition disabled:opacity-50 ${
                                grievance.status ===
                                "IN_PROGRESS"
                                  ? "bg-blue-500 text-white"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              In Progress
                            </button>

                            {/* RESOLVED */}

                            <button
                              type="button"
                              disabled={
                                updating
                              }
                              onClick={() =>
                                updateStatus(
                                  grievance.id,
                                  "RESOLVED"
                                )
                              }
                              className={`rounded-lg py-2 text-xs font-medium transition disabled:opacity-50 ${
                                grievance.status ===
                                "RESOLVED"
                                  ? "bg-emerald-600 text-white"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              Resolved
                            </button>

                          </div>

                          {updating && (
                            <p className="text-xs text-slate-400 mt-2">
                              Updating...
                            </p>
                          )}

                        </div>
                      )}

                    </div>
                  );
                }
              )}

            </div>
          )}

        </section>

      </main>

      <AdminBottomNavigation />

    </MobileLayout>
  );
}