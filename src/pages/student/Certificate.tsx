import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import MobileLayout from "../../layouts/MobileLayout";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";

import api from "../../api/api";

import {
  BadgeCheck,
  CalendarDays,
  Download,
  FileCheck2,
} from "lucide-react";

interface CertificateRecord {
  id: string;
  title: string;
  fileUrl: string | null;
  issuedOn: string;
  studentId: string;
  createdAt: string;
}

interface StoredStudent {
  id: string;
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function Certificate() {
  const navigate = useNavigate();

  const [certificates, setCertificates] =
    useState<CertificateRecord[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================
  // Student
  // =========================

  const student =
    useMemo<StoredStudent | null>(() => {
      try {
        const stored =
          localStorage.getItem("student");

        if (!stored) {
          return null;
        }

        return JSON.parse(stored);
      } catch {
        return null;
      }
    }, []);

  // =========================
  // Load Certificates
  // =========================

  useEffect(() => {
    async function loadCertificates() {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token");

        if (!token || !student) {
          navigate("/login", {
            replace: true,
          });

          return;
        }

        const response =
          await api.get(
            "/certificates/me",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setCertificates(
          response.data as CertificateRecord[]
        );
      } catch (error: any) {
        console.error(
          "LOAD STUDENT CERTIFICATES ERROR:",
          error
        );

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("student");
          localStorage.removeItem("admin");
          localStorage.removeItem("role");

          navigate("/login", {
            replace: true,
          });

          return;
        }

        setError(
          error.response?.data?.message ??
            "Failed to load certificates."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCertificates();
  }, [navigate, student]);

  // =========================
  // Helpers
  // =========================

  function formatDate(date: string) {
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

  function openCertificate(
    fileUrl: string
  ) {
    window.open(
      fileUrl,
      "_blank",
      "noopener,noreferrer"
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

          {/* Heading */}

          <div className="flex items-center gap-2 mb-5">
            <BadgeCheck
              size={22}
              className="text-emerald-600"
            />

            <h1 className="text-2xl font-bold">
              Certificates
            </h1>
          </div>

          {/* Loading */}

          {loading && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-500">
              Loading certificates...
            </div>
          )}

          {/* Error */}

          {error && !loading && (
            <div className="bg-red-50 text-red-600 rounded-xl p-4">
              {error}
            </div>
          )}

          {/* Content */}

          {!loading &&
            !error &&
            certificates.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">

                <div className="flex items-center gap-3">
                  <BadgeCheck
                    size={24}
                    className="text-amber-500"
                  />

                  <div>
                    <h2 className="font-semibold text-lg">
                      Certificate Pending
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      Your certificate has not
                      been issued yet.
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-slate-50 p-5 text-center">

                  <FileCheck2
                    size={42}
                    className="mx-auto text-slate-400"
                  />

                  <p className="font-medium mt-3">
                    Internship Certificate
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    Your certificate will
                    appear here once it is
                    issued by the administrator.
                  </p>

                </div>
              </div>
            )}

          {/* Certificates */}

          {!loading &&
            !error &&
            certificates.length > 0 && (
              <div className="space-y-4">

                {certificates.map(
                  (certificate) => (
                    <div
                      key={certificate.id}
                      className="bg-white rounded-xl shadow-sm p-5"
                    >

                      {/* Issued */}

                      <div className="flex justify-between items-start gap-3">

                        <div className="flex items-start gap-3">

                          <BadgeCheck
                            size={24}
                            className="text-emerald-600 mt-0.5"
                          />

                          <div>
                            <p className="text-xs font-medium text-emerald-600">
                              ISSUED
                            </p>

                            <h2 className="font-semibold text-lg mt-1">
                              {
                                certificate.title
                              }
                            </h2>
                          </div>

                        </div>

                      </div>

                      {/* Student */}

                      {student && (
                        <div className="mt-5">

                          <p className="text-sm text-slate-500">
                            Issued to
                          </p>

                          <p className="font-medium mt-1">
                            {
                              student.firstName
                            }{" "}
                            {
                              student.lastName
                            }
                          </p>

                          <p className="text-sm text-slate-500">
                            {
                              student.rollNumber
                            }
                          </p>

                        </div>
                      )}

                      {/* Date */}

                      <div className="flex items-center gap-2 mt-4 text-sm text-slate-500">

                        <CalendarDays
                          size={17}
                        />

                        <span>
                          Issued{" "}
                          {formatDate(
                            certificate.issuedOn
                          )}
                        </span>

                      </div>

                      {/* File */}

                      {certificate.fileUrl ? (

                        <button
                          type="button"
                          onClick={() =>
                            openCertificate(
                              certificate.fileUrl!
                            )
                          }
                          className="mt-5 w-full bg-emerald-600 text-white rounded-xl py-3 flex items-center justify-center gap-2 font-medium"
                        >

                          <Download
                            size={18}
                          />

                          Open Certificate

                        </button>

                      ) : (

                        <div className="mt-5 bg-emerald-50 text-emerald-700 rounded-xl p-4 text-sm">

                          <div className="flex items-center gap-2">

                            <FileCheck2
                              size={18}
                            />

                            <span className="font-medium">
                              Certificate issued
                            </span>

                          </div>

                          <p className="mt-1 text-emerald-600">
                            The certificate file
                            has not been uploaded
                            yet.
                          </p>

                        </div>

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