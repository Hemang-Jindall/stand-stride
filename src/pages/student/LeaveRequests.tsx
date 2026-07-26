import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type { FormEvent } from "react";

import { useNavigate } from "react-router-dom";

import MobileLayout from "../../layouts/MobileLayout";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";

import api from "../../api/api";

import {
  CalendarDays,
  Check,
  Clock,
  Plus,
  X,
} from "lucide-react";

type LeaveStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

interface LeaveRequest {
  id: string;
  reason: string;
  fromDate: string;
  toDate: string;
  status: LeaveStatus;
  studentId: string;
  createdAt: string;
}

export default function LeaveRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] =
    useState<LeaveRequest[]>([]);

  const [reason, setReason] =
    useState("");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =========================
  // Clear Session
  // =========================

  const clearSession =
    useCallback(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("student");
      localStorage.removeItem("admin");
      localStorage.removeItem("role");

      navigate("/login");
    }, [navigate]);

  // =========================
  // Load My Leave Requests
  // =========================

  const loadRequests =
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
          await api.get(
            "/leave-requests/me",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setRequests(
          response.data as LeaveRequest[]
        );
      } catch (error: any) {
        console.error(
          "LOAD LEAVE REQUESTS ERROR:",
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
          "Failed to load leave requests."
        );
      } finally {
        setLoading(false);
      }
    }, [clearSession]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  // =========================
  // Submit Leave Request
  // =========================

  async function submitRequest(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setError("");
      setSuccess("");

      if (
        !reason.trim() ||
        !fromDate ||
        !toDate
      ) {
        setError(
          "Please complete all fields."
        );
        return;
      }

      if (toDate < fromDate) {
        setError(
          "To date cannot be before from date."
        );
        return;
      }

      const token =
        localStorage.getItem("token");

      if (!token) {
        clearSession();
        return;
      }

      setSubmitting(true);

      const response =
        await api.post(
          "/leave-requests",
          {
            reason:
              reason.trim(),

            fromDate,

            toDate,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const newRequest =
        response.data as LeaveRequest;

      setRequests(
        (current) => [
          newRequest,
          ...current,
        ]
      );

      setReason("");
      setFromDate("");
      setToDate("");

      setShowForm(false);

      setSuccess(
        "Leave request submitted successfully."
      );
    } catch (error: any) {
      console.error(
        "CREATE LEAVE REQUEST ERROR:",
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
          "Failed to submit leave request."
      );
    } finally {
      setSubmitting(false);
    }
  }

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
    status: LeaveStatus
  ) {
    if (
      status === "APPROVED"
    ) {
      return "Approved";
    }

    if (
      status === "REJECTED"
    ) {
      return "Rejected";
    }

    return "Pending";
  }

  function getStatusClasses(
    status: LeaveStatus
  ) {
    if (
      status === "APPROVED"
    ) {
      return (
        "bg-emerald-100 " +
        "text-emerald-700"
      );
    }

    if (
      status === "REJECTED"
    ) {
      return (
        "bg-red-100 " +
        "text-red-700"
      );
    }

    return (
      "bg-amber-100 " +
      "text-amber-700"
    );
  }

  function getStatusIcon(
    status: LeaveStatus
  ) {
    if (
      status === "APPROVED"
    ) {
      return (
        <Check size={15} />
      );
    }

    if (
      status === "REJECTED"
    ) {
      return (
        <X size={15} />
      );
    }

    return (
      <Clock size={15} />
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

          {/* Header */}

          <div className="flex items-center justify-between gap-4">

            <h1 className="text-2xl font-bold">
              Leave Requests
            </h1>

            <button
              type="button"
              onClick={() => {
                setShowForm(
                  (current) =>
                    !current
                );

                setError("");
                setSuccess("");
              }}
              className="bg-emerald-600 text-white rounded-lg px-3 py-2 flex items-center gap-1 text-sm font-medium"
            >

              {showForm ? (
                <X size={17} />
              ) : (
                <Plus size={17} />
              )}

              {showForm
                ? "Cancel"
                : "New"}

            </button>

          </div>

          {/* Success */}

          {success && (
            <div className="bg-emerald-50 text-emerald-700 rounded-xl p-4 mt-4 text-sm">
              {success}
            </div>
          )}

          {/* Error */}

          {error && (
            <div className="bg-red-50 text-red-600 rounded-xl p-4 mt-4 text-sm">
              {error}
            </div>
          )}

          {/* Request Form */}

          {showForm && (
            <form
              onSubmit={
                submitRequest
              }
              className="bg-white rounded-xl shadow-sm p-5 mt-4"
            >

              <h2 className="font-semibold text-lg mb-4">
                Request Leave
              </h2>

              {/* From Date */}

              <div className="mb-4">

                <label
                  htmlFor="leave-from-date"
                  className="block text-sm font-medium text-slate-600 mb-2"
                >
                  From Date
                </label>

                <input
                  id="leave-from-date"
                  type="date"
                  value={fromDate}
                  disabled={
                    submitting
                  }
                  onChange={(event) =>
                    setFromDate(
                      event.target
                        .value
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 disabled:opacity-60"
                />

              </div>

              {/* To Date */}

              <div className="mb-4">

                <label
                  htmlFor="leave-to-date"
                  className="block text-sm font-medium text-slate-600 mb-2"
                >
                  To Date
                </label>

                <input
                  id="leave-to-date"
                  type="date"
                  value={toDate}
                  min={
                    fromDate ||
                    undefined
                  }
                  disabled={
                    submitting
                  }
                  onChange={(event) =>
                    setToDate(
                      event.target
                        .value
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 disabled:opacity-60"
                />

              </div>

              {/* Reason */}

              <div>

                <label
                  htmlFor="leave-reason"
                  className="block text-sm font-medium text-slate-600 mb-2"
                >
                  Reason
                </label>

                <textarea
                  id="leave-reason"
                  value={reason}
                  disabled={
                    submitting
                  }
                  onChange={(event) =>
                    setReason(
                      event.target
                        .value
                    )
                  }
                  placeholder="Why do you need leave?"
                  rows={4}
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 resize-none disabled:opacity-60"
                />

              </div>

              <button
                type="submit"
                disabled={
                  submitting
                }
                className="w-full bg-emerald-600 text-white rounded-lg py-3 mt-4 font-medium disabled:opacity-60"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Request"}
              </button>

            </form>
          )}

          {/* My Requests */}

          <h2 className="font-semibold text-lg mt-6 mb-3">
            My Requests
          </h2>

          {loading ? (

            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-500">
              Loading leave requests...
            </div>

          ) : requests.length ===
            0 ? (

            <div className="bg-white rounded-xl shadow-sm p-8 text-center">

              <CalendarDays
                size={30}
                className="mx-auto text-slate-400"
              />

              <p className="text-slate-500 mt-2">
                No leave requests yet.
              </p>

            </div>

          ) : (

            <div className="space-y-3">

              {requests.map(
                (request) => (

                  <div
                    key={
                      request.id
                    }
                    className="bg-white rounded-xl shadow-sm p-4"
                  >

                    <div className="flex justify-between items-start gap-3">

                      <div className="flex items-start gap-2">

                        <CalendarDays
                          size={18}
                          className="text-slate-400 mt-0.5"
                        />

                        <div>

                          <p className="font-medium">
                            {formatDate(
                              request.fromDate
                            )}

                            {" - "}

                            {formatDate(
                              request.toDate
                            )}
                          </p>

                          <p className="text-sm text-slate-500 mt-1">
                            {
                              request.reason
                            }
                          </p>

                        </div>

                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium flex items-center gap-1 ${getStatusClasses(
                          request.status
                        )}`}
                      >

                        {getStatusIcon(
                          request.status
                        )}

                        {getStatusLabel(
                          request.status
                        )}

                      </span>

                    </div>

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