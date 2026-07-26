import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import MobileLayout from "../../layouts/MobileLayout";
import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import api from "../../api/api";

import {
  Bell,
  Send,
  Users,
} from "lucide-react";

interface NotificationStudent {
  id: string;
  rollNumber: string;
  firstName: string;
  lastName: string;
}

interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  studentId: string;
  createdAt: string;
  student?: NotificationStudent;
}

interface NotificationGroup {
  key: string;
  title: string;
  message: string;
  createdAt: string;
  recipients: number;
}

export default function AdminNotifications() {
  const navigate = useNavigate();

  const [title, setTitle] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [notifications, setNotifications] =
    useState<NotificationRecord[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
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
      localStorage.removeItem("admin");
      localStorage.removeItem("student");
      localStorage.removeItem("role");

      navigate("/login", {
        replace: true,
      });
    }, [navigate]);

  // =========================
  // Load Notifications
  // =========================

  const loadNotifications =
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
            "/notifications",
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
          "LOAD NOTIFICATIONS ERROR:",
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
    }, [clearSession]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // =========================
  // Group Broadcast Copies
  // =========================

  const recentNotifications =
    useMemo<NotificationGroup[]>(() => {
      const groups =
        new Map<
          string,
          NotificationGroup
        >();

      for (
        const notification
        of notifications
      ) {
        // Broadcast creates one DB row
        // per student. Group matching rows
        // so the admin sees one message.

        const timestamp =
          new Date(
            notification.createdAt
          );

        const minuteKey =
          `${timestamp.getFullYear()}-` +
          `${timestamp.getMonth()}-` +
          `${timestamp.getDate()}-` +
          `${timestamp.getHours()}-` +
          `${timestamp.getMinutes()}`;

        const key =
          `${notification.title}|` +
          `${notification.message}|` +
          minuteKey;

        const existing =
          groups.get(key);

        if (existing) {
          existing.recipients += 1;
        } else {
          groups.set(key, {
            key,
            title:
              notification.title,
            message:
              notification.message,
            createdAt:
              notification.createdAt,
            recipients: 1,
          });
        }
      }

      return Array.from(
        groups.values()
      )
        .sort(
          (a, b) =>
            new Date(
              b.createdAt
            ).getTime() -
            new Date(
              a.createdAt
            ).getTime()
        )
        .slice(0, 10);
    }, [notifications]);

  // =========================
  // Send Broadcast
  // =========================

  async function sendNotification() {
    try {
      setError("");
      setSuccess("");

      if (!title.trim()) {
        setError(
          "Please enter a title."
        );

        return;
      }

      if (!message.trim()) {
        setError(
          "Please enter a message."
        );

        return;
      }

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

      setSending(true);

      const response =
        await api.post(
          "/notifications/broadcast",
          {
            title: title.trim(),
            message: message.trim(),
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setTitle("");
      setMessage("");

      setSuccess(
        `Notification sent to ${response.data.recipients} student${
          response.data.recipients === 1
            ? ""
            : "s"
        }.`
      );

      await loadNotifications();
    } catch (error: any) {
      console.error(
        "SEND NOTIFICATION ERROR:",
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
          "Failed to send notification."
      );
    } finally {
      setSending(false);
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
    ).toLocaleString(
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

        {/* =========================
            Send Notification
        ========================= */}

        <section className="mx-5 bg-white rounded-xl shadow-sm p-5">

          <div className="flex items-center gap-2 mb-5">

            <Bell
              size={22}
              className="text-emerald-600"
            />

            <h1 className="text-2xl font-bold">
              Notifications
            </h1>

          </div>

          {error && (
            <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-4 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 text-emerald-700 rounded-xl p-4 mb-4 text-sm">
              {success}
            </div>
          )}

          {/* Title */}

          <div className="mb-4">

            <label
              htmlFor="notification-title"
              className="block text-sm font-medium text-slate-600 mb-2"
            >
              Title
            </label>

            <input
              id="notification-title"
              type="text"
              value={title}
              disabled={sending}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              placeholder="Notification title"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 disabled:opacity-60"
            />

          </div>

          {/* Message */}

          <div>

            <label
              htmlFor="notification-message"
              className="block text-sm font-medium text-slate-600 mb-2"
            >
              Message
            </label>

            <textarea
              id="notification-message"
              value={message}
              disabled={sending}
              onChange={(event) =>
                setMessage(
                  event.target.value
                )
              }
              placeholder="Write a notification for all interns..."
              className="w-full h-36 rounded-xl border border-slate-300 p-4 resize-none outline-none focus:border-emerald-600 disabled:opacity-60"
            />

          </div>

          <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">

            <Users size={15} />

            Sent to all interns

          </div>

          <button
            type="button"
            onClick={
              sendNotification
            }
            disabled={sending}
            className="mt-5 w-full bg-emerald-600 text-white rounded-xl py-3 flex items-center justify-center gap-2 disabled:opacity-60"
          >

            <Send size={18} />

            {sending
              ? "Sending..."
              : "Send Notification"}

          </button>

        </section>

        {/* =========================
            Recently Sent
        ========================= */}

        <section className="mx-5 mt-5 bg-white rounded-xl shadow-sm p-5">

          <h2 className="font-semibold mb-4">
            Recently Sent
          </h2>

          {loading ? (

            <div className="py-6 text-center text-slate-500 text-sm">
              Loading notifications...
            </div>

          ) : recentNotifications.length ===
            0 ? (

            <div className="py-6 text-center text-slate-500 text-sm">
              No notifications sent yet.
            </div>

          ) : (

            <div className="space-y-3">

              {recentNotifications.map(
                (notification) => (

                  <div
                    key={
                      notification.key
                    }
                    className="border border-slate-200 rounded-lg p-3"
                  >

                    <p className="font-medium">
                      {
                        notification.title
                      }
                    </p>

                    <p className="text-sm text-slate-600 mt-1">
                      {
                        notification.message
                      }
                    </p>

                    <div className="flex justify-between gap-3 mt-2 text-xs text-slate-500">

                      <span>
                        Sent to{" "}
                        {
                          notification.recipients
                        }{" "}
                        student
                        {notification.recipients ===
                        1
                          ? ""
                          : "s"}
                      </span>

                      <span>
                        {formatDate(
                          notification.createdAt
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

      <AdminBottomNavigation />

    </MobileLayout>
  );
}