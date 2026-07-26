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
  CircleCheck,
  Clock3,
  LoaderCircle,
  ChevronRight,
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

export interface GrievanceRecord {
  id: string;
  title: string;
  description: string;
  status: GrievanceStatus;
  studentId: string;
  createdAt: string;
  student: Student;
}

export default function AdminGrievances() {
  const navigate = useNavigate();

  const [grievances, setGrievances] =
    useState<GrievanceRecord[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================
  // Logout / Invalid Session
  // =========================

  const clearSession =
    useCallback(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("student");
      localStorage.removeItem("admin");
      localStorage.removeItem("role");

      navigate("/login", {
        replace: true,
      });
    }, [navigate]);

  // =========================
  // Load Grievances
  // =========================

  const loadGrievances =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token");

        const role =
          localStorage.getItem("role");

        if (
          !token ||
          role !== "admin"
        ) {
          clearSession();
          return;
        }

        const response =
          await api.get(
            "/grievances",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setGrievances(
          response.data as GrievanceRecord[]
        );
      } catch (error: any) {
        console.error(
          "LOAD ADMIN GRIEVANCES ERROR:",
          error
        );

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          clearSession();
          return;
        }

        setError(
          error.response?.data?.message ??
            "Failed to load grievances."
        );
      } finally {
        setLoading(false);
      }
    }, [clearSession]);

  useEffect(() => {
    loadGrievances();
  }, [loadGrievances]);

  // =========================
  // Helpers
  // =========================

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

  function getStatusIcon(
    status: GrievanceStatus
  ) {
    if (status === "RESOLVED") {
      return (
        <CircleCheck
          size={18}
          className="text-emerald-600"
        />
      );
    }

    if (status === "IN_PROGRESS") {
      return (
        <LoaderCircle
          size={18}
          className="text-blue-500"
        />
      );
    }

    return (
      <Clock3
        size={18}
        className="text-amber-500"
      />
    );
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

  // =========================
  // UI
  // =========================

  return (
    <MobileLayout>
      <Header />

      <main className="flex-1 py-4 overflow-y-auto">
        <section className="mx-5">

          <h1 className="text-2xl font-bold mb-5">
            Grievances
          </h1>

          {error && (
            <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-4 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-500">
              Loading grievances...
            </div>
          ) : grievances.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-500">
              No grievances found.
            </div>
          ) : (
            <div className="space-y-3">

              {grievances.map(
                (grievance) => (
                  <button
                    key={grievance.id}
                    type="button"
                    onClick={() =>
                      navigate(
                        "/admin/grievance-details",
                        {
                          state: {
                            grievance,
                          },
                        }
                      )
                    }
                    className="w-full bg-white rounded-xl shadow-sm p-4 text-left active:scale-[0.98] transition"
                  >

                    <div className="flex justify-between items-start gap-3">

                      <div className="min-w-0">

                        <h3 className="font-semibold">
                          {grievance.student
                            .firstName}{" "}
                          {grievance.student
                            .lastName}
                        </h3>

                        <p className="text-sm font-medium text-slate-700 mt-1">
                          {grievance.title}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          {grievance.student
                            .rollNumber}

                          {grievance.student
                            .batch?.name &&
                            ` • ${grievance.student.batch.name}`}
                        </p>

                      </div>

                      <div className="flex items-center gap-2 shrink-0">

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium flex items-center gap-1 ${getStatusClasses(
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

                        <ChevronRight
                          size={18}
                          className="text-slate-400"
                        />

                      </div>

                    </div>

                    <p className="text-sm text-slate-500 mt-3 line-clamp-2">
                      {grievance.description}
                    </p>

                  </button>
                )
              )}

            </div>
          )}

        </section>
      </main>

      <AdminBottomNavigation />
    </MobileLayout>
  );
}