import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import MobileLayout from "../../layouts/MobileLayout";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";

import api from "../../api/api";

import {
  CalendarDays,
  Clock,
  MapPin,
} from "lucide-react";

interface ScheduleItem {
  id: string;
  title: string;
  description: string | null;
  date: string;
  startTime: string;
  endTime: string;
  location: string | null;

  batch: {
    id: string;
    name: string;

    venue?: {
      id: string;
      name: string;
      address?: string | null;
    };
  };
}

export default function Schedule() {
  const [items, setItems] =
    useState<ScheduleItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================
  // LOAD SCHEDULE
  // =========================

  const loadSchedule =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token");

        if (!token) {
          setError(
            "You are not logged in."
          );
          return;
        }

        const response =
          await api.get(
            "/schedule/me",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setItems(response.data);
      } catch (error: any) {
        console.error(
          "LOAD STUDENT SCHEDULE ERROR:",
          error
        );

        setError(
          error.response?.data?.message ??
            "Failed to load schedule."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  // =========================
  // SORT
  // =========================

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const dateDifference =
        new Date(a.date).getTime() -
        new Date(b.date).getTime();

      if (dateDifference !== 0) {
        return dateDifference;
      }

      return a.startTime.localeCompare(
        b.startTime
      );
    });
  }, [items]);

  // =========================
  // HELPERS
  // =========================

  function formatDate(date: string) {
    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  function isToday(date: string) {
    const itemDate =
      new Date(date);

    const today =
      new Date();

    return (
      itemDate.getFullYear() ===
        today.getFullYear() &&
      itemDate.getMonth() ===
        today.getMonth() &&
      itemDate.getDate() ===
        today.getDate()
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

          <div className="flex items-center gap-2 mb-5">
            <CalendarDays
              size={22}
              className="text-emerald-600"
            />

            <h1 className="text-2xl font-bold">
              Schedule
            </h1>
          </div>

          {/* Loading */}

          {loading && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-500">
              Loading schedule...
            </div>
          )}

          {/* Error */}

          {!loading && error && (
            <div className="bg-red-50 text-red-600 rounded-xl p-4">
              {error}
            </div>
          )}

          {/* Empty */}

          {!loading &&
            !error &&
            sortedItems.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <CalendarDays
                  size={32}
                  className="mx-auto text-slate-400"
                />

                <p className="font-medium mt-3">
                  No sessions scheduled
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Your upcoming sessions
                  will appear here.
                </p>
              </div>
            )}

          {/* Schedule */}

          {!loading &&
            !error &&
            sortedItems.length > 0 && (
              <div className="space-y-3">

                {sortedItems.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl shadow-sm p-4"
                    >

                      {/* Heading */}

                      <div className="flex items-start justify-between gap-3">

                        <div>
                          <h2 className="font-semibold text-lg">
                            {item.title}
                          </h2>

                          <p className="text-sm text-slate-500 mt-1">
                            {item.batch.name}
                          </p>
                        </div>

                        {isToday(
                          item.date
                        ) && (
                          <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full">
                            Today
                          </span>
                        )}

                      </div>

                      {/* Details */}

                      <div className="mt-4 space-y-2 text-sm text-slate-600">

                        <div className="flex items-center gap-2">
                          <CalendarDays
                            size={16}
                          />

                          <span>
                            {formatDate(
                              item.date
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock
                            size={16}
                          />

                          <span>
                            {item.startTime}
                            {" – "}
                            {item.endTime}
                          </span>
                        </div>

                        {(item.location ||
                          item.batch
                            .venue?.name) && (
                          <div className="flex items-center gap-2">
                            <MapPin
                              size={16}
                            />

                            <span>
                              {item.location ??
                                item.batch
                                  .venue
                                  ?.name}
                            </span>
                          </div>
                        )}

                      </div>

                      {/* Description */}

                      {item.description && (
                        <p className="mt-4 text-sm text-slate-500 border-t pt-3">
                          {item.description}
                        </p>
                      )}

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