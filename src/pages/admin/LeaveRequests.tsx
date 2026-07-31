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
  hasPermission,
} from "../../utils/permissions";

import {
  CalendarDays,
  Check,
  X,
  Clock,
} from "lucide-react";

type LeaveStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

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

interface LeaveRequest {
  id: string;
  reason: string;
  fromDate: string;
  toDate: string;
  status: LeaveStatus;
  studentId: string;
  createdAt: string;
  student: Student;
}

export default function LeaveRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] =
    useState<LeaveRequest[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    updatingId,
    setUpdatingId,
  ] = useState<string | null>(
    null
  );

  // =========================
  // Permissions
  // =========================

  const canManageLeave =
    hasPermission(
      "MANAGE_LEAVE"
    );

  // =========================
  // Clear Session
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
  // Load Leave Requests
  // =========================

  const loadRequests =
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
            await api.get(
              "/leave-requests",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          setRequests(
            response.data
          );
        } catch (
          error: any
        ) {
          console.error(
            "LOAD LEAVE REQUESTS ERROR:",
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
              "Failed to load leave requests."
          );
        } finally {
          setLoading(false);
        }
      },
      [clearSession]
    );

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  // =========================
  // Update Status
  // =========================

  async function updateStatus(
    id: string,
    status:
      | "APPROVED"
      | "REJECTED"
  ) {
    // Frontend permission guard
    if (!canManageLeave) {
      return;
    }

    try {
      setUpdatingId(id);
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
          `/leave-requests/${id}/status`,
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

      const updatedRequest =
        response.data as LeaveRequest;

      setRequests(
        (current) =>
          current.map(
            (request) =>
              request.id === id
                ? {
                    ...request,
                    ...updatedRequest,
                  }
                : request
          )
      );
    } catch (
      error: any
    ) {
      console.error(
        "UPDATE LEAVE REQUEST ERROR:",
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
          "Failed to update leave request."
      );
    } finally {
      setUpdatingId(null);
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

  function getStatusClasses(
    status: LeaveStatus
  ) {
    if (
      status === "APPROVED"
    ) {
      return "bg-emerald-100 text-emerald-700";
    }

    if (
      status === "REJECTED"
    ) {
      return "bg-red-100 text-red-700";
    }

    return "bg-amber-100 text-amber-700";
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

  // =========================
  // UI
  // =========================

  return (
    <MobileLayout>

      <Header />

      <main className="flex-1 py-4 overflow-y-auto">

        <section className="mx-5">

          <h1 className="text-2xl font-bold mb-5">
            Leave Requests
          </h1>

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
              Loading leave requests...
            </div>
          )}

          {/* =========================
              Requests
          ========================= */}

          {!loading && (
            <div className="space-y-3">

              {requests.map(
                (request) => {
                  const updating =
                    updatingId ===
                    request.id;

                  return (
                    <div
                      key={
                        request.id
                      }
                      className="bg-white rounded-xl shadow-sm p-4"
                    >

                      {/* =========================
                          Student
                      ========================= */}

                      <div className="flex justify-between items-start gap-3">

                        <div>

                          <h3 className="font-semibold">

                            {
                              request.student
                                .firstName
                            }{" "}

                            {
                              request.student
                                .lastName
                            }

                          </h3>

                          <p className="text-sm text-slate-500">

                            {
                              request.student
                                .rollNumber
                            }

                            {" • "}

                            {request.student
                              .batch?.name ??
                              "No Batch"}

                          </p>

                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClasses(
                            request.status
                          )}`}
                        >

                          {getStatusLabel(
                            request.status
                          )}

                        </span>

                      </div>

                      {/* =========================
                          Dates
                      ========================= */}

                      <div className="flex items-start gap-2 mt-4">

                        <CalendarDays
                          size={18}
                          className="text-slate-400 mt-0.5"
                        />

                        <div>

                          <p className="text-xs text-slate-500">
                            Leave Period
                          </p>

                          <p className="text-sm font-medium">

                            {formatDate(
                              request.fromDate
                            )}

                            {" - "}

                            {formatDate(
                              request.toDate
                            )}

                          </p>

                        </div>

                      </div>

                      {/* =========================
                          Reason
                      ========================= */}

                      <div className="mt-4">

                        <p className="text-xs text-slate-500">
                          Reason
                        </p>

                        <p className="mt-1">
                          {
                            request.reason
                          }
                        </p>

                      </div>

                      {/* =========================
                          Pending Actions
                      ========================= */}

                      {request.status ===
                        "PENDING" &&
                        canManageLeave && (

                        <div className="flex gap-2 mt-4">

                          {/* Approve */}

                          <button
                            type="button"
                            disabled={
                              updating
                            }
                            onClick={() =>
                              updateStatus(
                                request.id,
                                "APPROVED"
                              )
                            }
                            className="flex-1 bg-emerald-600 text-white rounded-lg py-2.5 flex items-center justify-center gap-2 disabled:opacity-50"
                          >

                            <Check
                              size={17}
                            />

                            {updating
                              ? "Updating..."
                              : "Approve"}

                          </button>

                          {/* Reject */}

                          <button
                            type="button"
                            disabled={
                              updating
                            }
                            onClick={() =>
                              updateStatus(
                                request.id,
                                "REJECTED"
                              )
                            }
                            className="flex-1 bg-red-500 text-white rounded-lg py-2.5 flex items-center justify-center gap-2 disabled:opacity-50"
                          >

                            <X
                              size={17}
                            />

                            {updating
                              ? "Updating..."
                              : "Reject"}

                          </button>

                        </div>
                      )}

                      {/* =========================
                          Pending Read-Only
                      ========================= */}

                      {request.status ===
                        "PENDING" &&
                        !canManageLeave && (

                        <div className="mt-4 flex items-center gap-2 text-sm text-amber-600">

                          <Clock
                            size={17}
                          />

                          Awaiting decision

                        </div>
                      )}

                      {/* =========================
                          Decision
                      ========================= */}

                      {request.status !==
                        "PENDING" && (

                        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">

                          {request.status ===
                          "APPROVED" ? (

                            <Check
                              size={17}
                              className="text-emerald-600"
                            />

                          ) : (

                            <X
                              size={17}
                              className="text-red-500"
                            />

                          )}

                          Request{" "}

                          {getStatusLabel(
                            request.status
                          ).toLowerCase()}

                        </div>
                      )}

                    </div>
                  );
                }
              )}

              {/* =========================
                  Empty State
              ========================= */}

              {requests.length ===
                0 && (

                <div className="bg-white rounded-xl shadow-sm p-8 text-center">

                  <Clock
                    size={28}
                    className="mx-auto text-slate-400 mb-2"
                  />

                  <p className="text-slate-500">
                    No leave requests yet.
                  </p>

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