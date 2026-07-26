import {
  useCallback,
  useEffect,
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
  User,
  CircleCheck,
  BadgeCheck,
  Save,
  CheckCircle2,
  UserCheck,
  CalendarDays,
} from "lucide-react";

interface PerformanceData {
  student: {
    id: string;
    rollNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;

    batch: {
      id: string;
      name: string;
      startDate: string;
      endDate: string;

      venue: {
        id: string;
        name: string;
        address: string | null;
      };
    };

    mentor: {
      id: string;
      name: string;
      email: string | null;
      phone: string | null;
    } | null;
  };

  attendance: {
    total: number;
    present: number;
    absent: number;
    leave: number;
    percentage: number;
  };

  certificate: {
    issued: boolean;

    certificate: {
      id: string;
      title: string;
      fileUrl: string | null;
      issuedOn: string;
    } | null;
  };

  remarks: string;
}

export default function Performance() {
  const location = useLocation();
  const navigate = useNavigate();

  const studentId =
    location.state?.student?.id ??
    location.state?.studentId ??
    null;

  const [data, setData] =
    useState<PerformanceData | null>(null);

  const [remarks, setRemarks] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState("");

  // =========================
  // LOAD PERFORMANCE
  // =========================

  const loadPerformance =
    useCallback(async () => {
      if (!studentId) {
        setError(
          "No student was selected."
        );

        setLoading(false);
        return;
      }

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
            `/performance/${studentId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setData(response.data);

        setRemarks(
          response.data.remarks ?? ""
        );
      } catch (error: any) {
        console.error(
          "LOAD PERFORMANCE ERROR:",
          error
        );

        setError(
          error.response?.data?.message ??
            "Failed to load performance."
        );
      } finally {
        setLoading(false);
      }
    }, [studentId]);

  useEffect(() => {
    loadPerformance();
  }, [loadPerformance]);

  // =========================
  // SAVE REMARKS
  // =========================

  async function handleSave() {
    if (!studentId) return;

    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError(
          "You are not logged in."
        );
        return;
      }

      await api.put(
        `/performance/${studentId}/remarks`,
        {
          remarks,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (error: any) {
      console.error(
        "SAVE REMARKS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ??
          "Failed to save remarks."
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <MobileLayout>
        <Header />

        <main className="flex-1 py-4">
          <div className="mx-5 bg-white rounded-xl shadow-sm p-8 text-center text-slate-500">
            Loading performance...
          </div>
        </main>

        <AdminBottomNavigation />
      </MobileLayout>
    );
  }

  // =========================
  // ERROR / NO STUDENT
  // =========================

  if (!data) {
    return (
      <MobileLayout>
        <Header />

        <main className="flex-1 py-4">
          <div className="mx-5 bg-white rounded-xl shadow-sm p-5">
            <p className="text-red-600">
              {error ||
                "Unable to load student."}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/students")
              }
              className="mt-4 w-full bg-emerald-600 text-white rounded-xl py-3"
            >
              Back to Students
            </button>
          </div>
        </main>

        <AdminBottomNavigation />
      </MobileLayout>
    );
  }

  const fullName =
    `${data.student.firstName} ${data.student.lastName}`;

  return (
    <MobileLayout>
      <Header />

      <main className="flex-1 py-4 overflow-y-auto">

        {/* Student */}

        <section className="mx-5 bg-white rounded-xl shadow-sm p-5">

          <div className="flex items-center gap-3 mb-6">

            <User
              size={48}
              className="text-emerald-600"
            />

            <div>
              <h2 className="text-xl font-bold">
                {fullName}
              </h2>

              <p className="text-slate-500">
                {data.student.rollNumber}
                {" • "}
                Batch{" "}
                {data.student.batch.name}
              </p>
            </div>

          </div>

          <h3 className="text-lg font-semibold mb-4">
            Internship Performance
          </h3>

          {/* Attendance */}

          <div>

            <div className="flex justify-between mb-2">
              <span>
                Attendance
              </span>

              <span className="font-semibold">
                {data.attendance.percentage}%
              </span>
            </div>

            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-3 rounded-full bg-emerald-600"
                style={{
                  width: `${Math.min(
                    data.attendance.percentage,
                    100
                  )}%`,
                }}
              />
            </div>

          </div>

          {/* Stats */}

          <div className="grid grid-cols-2 gap-4 mt-5">

            <div className="bg-slate-50 rounded-xl p-4">

              <div className="flex items-center gap-2 mb-2">
                <CircleCheck
                  size={18}
                  className="text-emerald-600"
                />

                <span className="font-medium">
                  Present
                </span>
              </div>

              <p className="text-2xl font-bold">
                {data.attendance.present}
              </p>

              <p className="text-xs text-slate-500">
                of {data.attendance.total} records
              </p>

            </div>

            <div className="bg-slate-50 rounded-xl p-4">

              <div className="flex items-center gap-2 mb-2">
                <CalendarDays
                  size={18}
                  className="text-orange-600"
                />

                <span className="font-medium">
                  Leave
                </span>
              </div>

              <p className="text-2xl font-bold">
                {data.attendance.leave}
              </p>

              <p className="text-xs text-slate-500">
                {data.attendance.absent} absent
              </p>

            </div>

            <div className="bg-slate-50 rounded-xl p-4">

              <div className="flex items-center gap-2 mb-2">
                <UserCheck
                  size={18}
                  className="text-blue-600"
                />

                <span className="font-medium">
                  Mentor
                </span>
              </div>

              <p className="font-semibold">
                {data.student.mentor?.name ??
                  "Not assigned"}
              </p>

            </div>

            <div className="bg-slate-50 rounded-xl p-4">

              <div className="flex items-center gap-2 mb-2">
                <BadgeCheck
                  size={18}
                  className="text-purple-600"
                />

                <span className="font-medium">
                  Certificate
                </span>
              </div>

              <p
                className={
                  data.certificate.issued
                    ? "font-semibold text-emerald-600"
                    : "font-semibold text-amber-600"
                }
              >
                {data.certificate.issued
                  ? "Issued"
                  : "Not Issued"}
              </p>

            </div>

          </div>

        </section>

        {/* Remarks */}

        <section className="mx-5 mt-5 bg-white rounded-xl shadow-sm p-5">

          <h3 className="text-lg font-semibold mb-4">
            Mentor Remarks
          </h3>

          <textarea
            value={remarks}
            onChange={(e) => {
              setRemarks(
                e.target.value
              );

              setSaved(false);
            }}
            rows={6}
            className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-emerald-500 resize-none"
            placeholder="Enter mentor remarks..."
          />

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-xl py-3 flex justify-center items-center gap-2 transition"
          >
            <Save size={18} />

            {saving
              ? "Saving..."
              : "Save Remarks"}
          </button>

          {saved && (
            <div className="mt-4 flex items-center justify-center gap-2 text-emerald-600 font-medium">
              <CheckCircle2
                size={18}
              />

              Remarks saved successfully.
            </div>
          )}

          {error && (
            <p className="mt-4 text-sm text-red-600 text-center">
              {error}
            </p>
          )}

        </section>

      </main>

      <AdminBottomNavigation />
    </MobileLayout>
  );
}