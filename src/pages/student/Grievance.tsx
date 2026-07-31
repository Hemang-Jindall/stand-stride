import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import MobileLayout from "../../layouts/MobileLayout";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";

import api from "../../api/api";

import {
  CircleCheck,
  Clock3,
  LoaderCircle,
  Plus,
  X,
} from "lucide-react";

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
}

export default function Grievance() {
  const navigate = useNavigate();

  const [grievances, setGrievances] =
    useState<GrievanceRecord[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [showForm, setShowForm] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [error, setError] =
    useState("");

  // =========================
  // Invalid Session
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
  // Load Student Grievances
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
          role !== "student"
        ) {
          clearSession();
          return;
        }

        const response =
          await api.get<GrievanceRecord[]>(
            "/grievances/me",
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
      } catch (error: any) {
        console.error(
          "LOAD STUDENT GRIEVANCES ERROR:",
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
  // Submit Grievance
  // =========================

  async function submitGrievance(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !title.trim() ||
      !description.trim()
    ) {
      setError(
        "Title and description are required."
      );

      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        clearSession();
        return;
      }

      await api.post(
        "/grievances",
        {
          title: title.trim(),
          description:
            description.trim(),
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setTitle("");
      setDescription("");
      setShowForm(false);

      await loadGrievances();
    } catch (error: any) {
      console.error(
        "CREATE GRIEVANCE ERROR:",
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
          "Failed to submit grievance."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // =========================
  // Status Helpers
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
        <CircleCheck size={16} />
      );
    }

    if (status === "IN_PROGRESS") {
      return (
        <LoaderCircle size={16} />
      );
    }

    return (
      <Clock3 size={16} />
    );
  }

  return (
    <MobileLayout>
      <Header />

      <main className="flex-1 py-4 overflow-y-auto">
        <section className="mx-5">

          <div className="flex justify-between items-center mb-5">

            <h1 className="text-2xl font-bold">
              Grievances
            </h1>

            <button
              type="button"
              onClick={() => {
                setShowForm(
                  (current) =>
                    !current
                );

                setError("");
              }}
              className="bg-emerald-600 text-white rounded-lg px-3 py-2 flex items-center gap-2"
            >
              {showForm ? (
                <X size={18} />
              ) : (
                <Plus size={18} />
              )}

              {showForm
                ? "Cancel"
                : "New"}
            </button>

          </div>

          {error && (
            <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-4 text-sm">
              {error}
            </div>
          )}

          {showForm && (
            <form
              onSubmit={
                submitGrievance
              }
              className="bg-white rounded-xl shadow-sm p-4 mb-5 space-y-3"
            >

              <h2 className="font-semibold">
                Submit Grievance
              </h2>

              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                required
                className="w-full border border-slate-200 rounded-lg p-3 outline-none focus:border-emerald-500"
              />

              <textarea
                placeholder="Describe your grievance"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                rows={5}
                required
                className="w-full border border-slate-200 rounded-lg p-3 outline-none focus:border-emerald-500 resize-none"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 text-white rounded-lg py-3 font-medium disabled:opacity-50"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Grievance"}
              </button>

            </form>
          )}

          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-500">
              Loading grievances...
            </div>
          ) : grievances.length ===
            0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-500">
              You haven't submitted any grievances.
            </div>
          ) : (
            <div className="space-y-3">

              {grievances.map(
                (grievance) => (
                  <div
                    key={
                      grievance.id
                    }
                    className="bg-white rounded-xl shadow-sm p-4"
                  >

                    <div className="flex justify-between items-start gap-3">

                      <div className="min-w-0">

                        <h3 className="font-semibold">
                          {
                            grievance.title
                          }
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(
                            grievance.createdAt
                          ).toLocaleDateString()}
                        </p>

                      </div>

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

                    <p className="text-sm text-slate-600 mt-3 whitespace-pre-wrap">
                      {
                        grievance.description
                      }
                    </p>

                  </div>
                )
              )}

            </div>
          )}

        </section>
      </main>

      <BottomNavigation />
    </MobileLayout>
  );
}