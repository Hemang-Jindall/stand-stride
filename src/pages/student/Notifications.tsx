import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import MobileLayout from "../../layouts/MobileLayout";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";

import api from "../../api/api";

import {
  Bell,
  CalendarDays,
} from "lucide-react";

interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  studentId: string;
  createdAt: string;
}

export default function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] =
    useState<NotificationRecord[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================
  // Load Notifications
  // =========================

  useEffect(() => {
    async function loadNotifications() {
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
            "/notifications/me",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setNotifications(
          response.data as NotificationRecord[]
        );
      } catch (error: any) {
        console.error(
          "LOAD STUDENT NOTIFICATIONS ERROR:",
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
            "Failed to load notifications."
        );
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, []);

  // =========================
  // Clear Session
  // =========================

  function clearSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("student");
    localStorage.removeItem("admin");
    localStorage.removeItem("role");

    navigate("/login", {
      replace: true,
    });
  }

  // =========================
  // Format Date
  // =========================

  function formatDate(date: string) {
    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <MobileLayout>

      <Header />

      <main className="flex-1 py-4 overflow-y-auto">

        <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

          {/* Header */}

          <div className="flex items-center gap-2 mb-5">

            <Bell
              size={20}
              className="text-emerald-600"
            />

            <h1 className="text-xl font-semibold">
              Notifications
            </h1>

          </div>

          {/* Loading */}

          {loading && (
            <div className="py-8 text-center text-slate-500 text-sm">
              Loading notifications...
            </div>
          )}

          {/* Error */}

          {error && !loading && (
            <div className="bg-red-50 text-red-600 rounded-xl p-4 text-sm">
              {error}
            </div>
          )}

          {/* Empty */}

          {!loading &&
            !error &&
            notifications.length === 0 && (

              <div className="py-10 text-center">

                <Bell
                  size={36}
                  className="mx-auto text-slate-300"
                />

                <p className="font-medium mt-3">
                  No notifications
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  New updates will appear here.
                </p>

              </div>

            )}

          {/* Notifications */}

          {!loading &&
            !error &&
            notifications.length > 0 && (

              <div className="space-y-4">

                {notifications.map(
                  (notification) => (

                    <div
                      key={notification.id}
                      className="border-b border-slate-100 pb-4 last:border-none last:pb-0"
                    >

                      <div className="flex gap-3">

                        {/* Icon */}

                        <div className="mt-1 shrink-0">

                          <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">

                            <Bell
                              size={17}
                              className="text-emerald-600"
                            />

                          </div>

                        </div>

                        {/* Content */}

                        <div className="min-w-0 flex-1">

                          <p className="font-medium">
                            {notification.title}
                          </p>

                          <p className="text-sm text-slate-500 mt-1">
                            {notification.message}
                          </p>

                          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">

                            <CalendarDays
                              size={13}
                            />

                            <span>
                              {formatDate(
                                notification.createdAt
                              )}
                            </span>

                          </div>

                        </div>

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