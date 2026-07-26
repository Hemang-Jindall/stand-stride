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
  BadgeCheck,
  CircleCheck,
  FilePlus2,
} from "lucide-react";

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
  batchId: string;
  batch?: Batch;
}

interface Certificate {
  id: string;
  title: string;
  fileUrl: string | null;
  issuedOn: string;
  studentId: string;
  createdAt: string;
  student?: Student;
}

export default function AdminCertificates() {
  const navigate = useNavigate();

  const [students, setStudents] =
    useState<Student[]>([]);

  const [certificates, setCertificates] =
    useState<Certificate[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [issuingStudentId, setIssuingStudentId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =========================
  // Clear Session
  // =========================

  const clearSession = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("student");
    localStorage.removeItem("admin");
    localStorage.removeItem("role");

    navigate("/login", {
      replace: true,
    });
  }, [navigate]);

  // =========================
  // Load Students + Certificates
  // =========================

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      const role =
        localStorage.getItem("role");

      if (!token || role !== "admin") {
        clearSession();
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [
        studentsResponse,
        certificatesResponse,
      ] = await Promise.all([
        api.get("/students", {
          headers,
        }),

        api.get("/certificates", {
          headers,
        }),
      ]);

      setStudents(
        studentsResponse.data as Student[]
      );

      setCertificates(
        certificatesResponse.data as Certificate[]
      );
    } catch (error: any) {
      console.error(
        "LOAD CERTIFICATES ERROR:",
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
          "Failed to load certificates."
      );
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // =========================
  // Certificates By Student
  // =========================

  const certificateByStudent =
    useMemo(() => {
      const map =
        new Map<string, Certificate>();

      for (const certificate of certificates) {
        const current =
          map.get(certificate.studentId);

        if (
          !current ||
          new Date(
            certificate.issuedOn
          ).getTime() >
            new Date(
              current.issuedOn
            ).getTime()
        ) {
          map.set(
            certificate.studentId,
            certificate
          );
        }
      }

      return map;
    }, [certificates]);

  // =========================
  // Issue Certificate
  // =========================

  async function issueCertificate(
    student: Student
  ) {
    try {
      setError("");
      setSuccess("");

      const token =
        localStorage.getItem("token");

      const role =
        localStorage.getItem("role");

      if (!token || role !== "admin") {
        clearSession();
        return;
      }

      setIssuingStudentId(
        student.id
      );

      const response =
        await api.post(
          "/certificates",
          {
            studentId: student.id,
            title:
              "Internship Completion Certificate",
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const certificate =
        response.data as Certificate;

      setCertificates(
        (current) => [
          certificate,
          ...current,
        ]
      );

      setSuccess(
        `Certificate issued to ${student.firstName} ${student.lastName}.`
      );
    } catch (error: any) {
      console.error(
        "ISSUE CERTIFICATE ERROR:",
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
          "Failed to issue certificate."
      );
    } finally {
      setIssuingStudentId(null);
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

  // =========================
  // UI
  // =========================

  return (
    <MobileLayout>

      <Header />

      <main className="flex-1 py-4 overflow-y-auto">

        <section className="mx-5">

          <div className="flex items-center gap-2 mb-5">

            <BadgeCheck
              size={22}
              className="text-emerald-600"
            />

            <h1 className="text-2xl font-bold">
              Certificates
            </h1>

          </div>

          {/* Error */}

          {error && (
            <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Success */}

          {success && (
            <div className="bg-emerald-50 text-emerald-700 rounded-xl p-4 mb-4 text-sm">
              {success}
            </div>
          )}

          {/* Loading */}

          {loading ? (

            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-500">
              Loading certificates...
            </div>

          ) : students.length === 0 ? (

            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-500">
              No students found.
            </div>

          ) : (

            <div className="space-y-3">

              {students.map(
                (student) => {
                  const certificate =
                    certificateByStudent.get(
                      student.id
                    );

                  const issuing =
                    issuingStudentId ===
                    student.id;

                  return (
                    <div
                      key={student.id}
                      className="bg-white rounded-xl shadow-sm p-4"
                    >

                      {/* Student */}

                      <div className="flex justify-between items-start gap-3">

                        <div>

                          <h3 className="font-semibold">
                            {student.firstName}{" "}
                            {student.lastName}
                          </h3>

                          <p className="text-sm text-slate-500 mt-1">
                            {student.rollNumber}

                            {" • "}

                            {student.batch
                              ?.name ??
                              "No Batch"}
                          </p>

                        </div>

                        {certificate ? (

                          <span className="shrink-0 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                            Issued
                          </span>

                        ) : (

                          <span className="shrink-0 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            Not Issued
                          </span>

                        )}

                      </div>

                      {/* Existing Certificate */}

                      {certificate ? (

                        <div className="mt-4 border-t border-slate-100 pt-4">

                          <div className="flex items-start gap-2">

                            <CircleCheck
                              size={18}
                              className="text-emerald-600 mt-0.5"
                            />

                            <div>

                              <p className="text-sm font-medium">
                                {certificate.title}
                              </p>

                              <p className="text-xs text-slate-500 mt-1">
                                Issued{" "}
                                {formatDate(
                                  certificate.issuedOn
                                )}
                              </p>

                            </div>

                          </div>

                          {certificate.fileUrl && (
                            <a
                              href={
                                certificate.fileUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="mt-3 w-full bg-slate-100 text-slate-700 rounded-lg py-2 flex items-center justify-center text-sm font-medium"
                            >
                              Open Certificate
                            </a>
                          )}

                        </div>

                      ) : (

                        <button
                          type="button"
                          disabled={issuing}
                          onClick={() =>
                            issueCertificate(
                              student
                            )
                          }
                          className="mt-4 w-full rounded-lg py-2.5 flex items-center justify-center gap-2 bg-emerald-600 text-white disabled:opacity-60"
                        >

                          <FilePlus2
                            size={18}
                          />

                          {issuing
                            ? "Issuing..."
                            : "Issue Certificate"}

                        </button>

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