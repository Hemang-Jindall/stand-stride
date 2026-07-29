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
  TrendingUp,
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
    eligible: boolean;

    certificate: {
      id: string;
      title: string;
      fileUrl: string | null;
      issuedOn: string;
    } | null;
  };

  performance: {
    overallProgress: number;
    remarks: string;
    certificateEligible: boolean;
  };
}

export default function Performance() {
  const location = useLocation();
  const navigate = useNavigate();

  const studentId =
    location.state?.student?.id ??
    location.state?.studentId ??
    null;

  const [data, setData] =
    useState<PerformanceData | null>(
      null
    );

  const [
    overallProgress,
    setOverallProgress,
  ] = useState(0);

  const [remarks, setRemarks] =
    useState("");

  const [
    certificateEligible,
    setCertificateEligible,
  ] = useState(false);

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
          navigate("/login");
          return;
        }

        const response =
          await api.get<PerformanceData>(
            `/performance/${studentId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const performanceData =
          response.data;

        setData(performanceData);

        setOverallProgress(
          performanceData.performance
            .overallProgress
        );

        setRemarks(
          performanceData.performance
            .remarks
        );

        setCertificateEligible(
          performanceData.performance
            .certificateEligible
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
    }, [studentId, navigate]);

  useEffect(() => {
    loadPerformance();
  }, [loadPerformance]);

  // =========================
  // SAVE PERFORMANCE
  // =========================

  async function handleSave() {
    if (!studentId) {
      return;
    }

    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      await api.put(
        `/performance/${studentId}`,
        {
          overallProgress,
          remarks,
          certificateEligible,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setData((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,

          certificate: {
            ...current.certificate,
            eligible:
              certificateEligible,
          },

          performance: {
            overallProgress,
            remarks,
            certificateEligible,
          },
        };
      });

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (error: any) {
      console.error(
        "SAVE PERFORMANCE ERROR:",
        error
      );

      setError(
        error.response?.data?.message ??
          "Failed to save performance."
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================
  // PROGRESS CHANGE
  // =========================

  function handleProgressChange(
    value: string
  ) {
    const parsedValue =
      Number(value);

    if (
      Number.isNaN(parsedValue)
    ) {
      setOverallProgress(0);
      return;
    }

    setOverallProgress(
      Math.min(
        100,
        Math.max(
          0,
          Math.round(parsedValue)
        )
      )
    );

    setSaved(false);
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
                navigate(
                  "/admin/students"
                )
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

        {/* =========================
            STUDENT
        ========================= */}

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

          {/* =========================
              OVERALL PROGRESS
          ========================= */}

          <div className="bg-slate-50 rounded-xl p-4">

            <div className="flex items-center justify-between mb-3">

              <div className="flex items-center gap-2">

                <TrendingUp
                  size={18}
                  className="text-emerald-600"
                />

                <span className="font-medium">
                  Overall Progress
                </span>

              </div>

              <span className="font-bold text-emerald-600">
                {overallProgress}%
              </span>

            </div>

            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">

              <div
                className="h-full bg-emerald-600 rounded-full transition-all"
                style={{
                  width:
                    `${overallProgress}%`,
                }}
              />

            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={overallProgress}
              onChange={(e) =>
                handleProgressChange(
                  e.target.value
                )
              }
              className="w-full mt-4"
            />

            <div className="flex items-center gap-3 mt-3">

              <input
                type="number"
                min="0"
                max="100"
                value={overallProgress}
                onChange={(e) =>
                  handleProgressChange(
                    e.target.value
                  )
                }
                className="w-24 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
              />

              <span className="text-sm text-slate-500">
                Enter progress from
                0–100%
              </span>

            </div>

          </div>

          {/* =========================
              ATTENDANCE
          ========================= */}

          <div className="mt-5">

            <div className="flex justify-between mb-2">

              <span>
                Attendance
              </span>

              <span className="font-semibold">
                {
                  data.attendance
                    .percentage
                }
                %
              </span>

            </div>

            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">

              <div
                className="h-3 rounded-full bg-emerald-600"
                style={{
                  width: `${Math.min(
                    data.attendance
                      .percentage,
                    100
                  )}%`,
                }}
              />

            </div>

          </div>

          {/* =========================
              STATS
          ========================= */}

          <div className="grid grid-cols-2 gap-4 mt-5">

            {/* Present */}

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
                {
                  data.attendance
                    .present
                }
              </p>

              <p className="text-xs text-slate-500">
                of{" "}
                {data.attendance.total}{" "}
                records
              </p>

            </div>

            {/* Leave */}

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
                {
                  data.attendance
                    .leave
                }
              </p>

              <p className="text-xs text-slate-500">
                {
                  data.attendance
                    .absent
                }{" "}
                absent
              </p>

            </div>

            {/* Mentor */}

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
                {data.student.mentor
                  ?.name ??
                  "Not assigned"}
              </p>

            </div>

            {/* Certificate */}

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

              {data.certificate
                .issued ? (
                <p className="font-semibold text-emerald-600">
                  Issued
                </p>
              ) : certificateEligible ? (
                <p className="font-semibold text-emerald-600">
                  Eligible
                </p>
              ) : (
                <p className="font-semibold text-amber-600">
                  Not Eligible
                </p>
              )}

            </div>

          </div>

        </section>

        {/* =========================
            CERTIFICATE ELIGIBILITY
        ========================= */}

        <section className="mx-5 mt-5 bg-white rounded-xl shadow-sm p-5">

          <h3 className="text-lg font-semibold">
            Certificate Eligibility
          </h3>

          <p className="text-sm text-slate-500 mt-1 mb-4">
            Mark whether this student
            has completed the requirements
            for a certificate.
          </p>

          <button
            type="button"
            onClick={() => {
              setCertificateEligible(
                (current) => !current
              );

              setSaved(false);
            }}
            className="w-full flex items-center justify-between bg-slate-50 rounded-xl p-4"
          >

            <div className="flex items-center gap-3">

              <BadgeCheck
                size={20}
                className={
                  certificateEligible
                    ? "text-emerald-600"
                    : "text-slate-400"
                }
              />

              <span className="font-medium">
                Eligible for Certificate
              </span>

            </div>

            <div
              className={`w-12 h-7 rounded-full p-1 transition ${
                certificateEligible
                  ? "bg-emerald-600"
                  : "bg-slate-300"
              }`}
            >

              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  certificateEligible
                    ? "translate-x-5"
                    : ""
                }`}
              />

            </div>

          </button>

        </section>

        {/* =========================
            REMARKS
        ========================= */}

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

          {/* =========================
              SAVE
          ========================= */}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-xl py-3 flex justify-center items-center gap-2 transition"
          >

            <Save size={18} />

            {saving
              ? "Saving..."
              : "Save Performance"}

          </button>

          {saved && (
            <div className="mt-4 flex items-center justify-center gap-2 text-emerald-600 font-medium">

              <CheckCircle2
                size={18}
              />

              Performance saved successfully.

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