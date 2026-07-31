import {
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
  hasPermission,
} from "../../utils/permissions";

import {
  Search,
  CircleCheck,
  ChevronRight,
  Plus,
  ChartNoAxesColumnIncreasing,
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
  phone: string | null;
  batchId: string;
  batch: Batch;
}

export default function Students() {
  const navigate = useNavigate();

  const [students, setStudents] =
    useState<Student[]>([]);

  const [search, setSearch] =
    useState("");

  const [selectedBatch, setSelectedBatch] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =======================
  // Permissions
  // =======================

  const canCreateStudent =
    hasPermission(
      "CREATE_STUDENTS"
    );

  const canViewPerformance =
    hasPermission(
      "VIEW_PERFORMANCE"
    );

  // =======================
  // Load Students
  // =======================

  useEffect(() => {
    async function loadStudents() {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token");

        if (!token) {
          navigate("/login", {
            replace: true,
          });

          return;
        }

        const response =
          await api.get(
            "/students",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setStudents(
          response.data
        );
      } catch (error) {
        console.error(
          "Failed to load students:",
          error
        );

        setError(
          "Failed to load students."
        );
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, [navigate]);

  // =======================
  // Available Batches
  // =======================

  const batches =
    useMemo(() => {
      const names =
        students
          .map(
            (student) =>
              student.batch?.name
          )
          .filter(
            (
              name
            ): name is string =>
              Boolean(name)
          );

      return [
        ...new Set(names),
      ];
    }, [students]);

  // =======================
  // Search + Batch Filter
  // =======================

  const filteredStudents =
    useMemo(() => {
      const searchText =
        search
          .toLowerCase()
          .trim();

      return students.filter(
        (student) => {
          const fullName =
            `${student.firstName} ${student.lastName}`
              .toLowerCase();

          const matchesSearch =
            fullName.includes(
              searchText
            ) ||
            student.rollNumber
              .toLowerCase()
              .includes(
                searchText
              ) ||
            student.email
              .toLowerCase()
              .includes(
                searchText
              );

          const matchesBatch =
            selectedBatch ===
              "All" ||
            student.batch?.name ===
              selectedBatch;

          return (
            matchesSearch &&
            matchesBatch
          );
        }
      );
    }, [
      students,
      search,
      selectedBatch,
    ]);

  // =======================
  // Navigation
  // =======================

  function openStudent(
    student: Student
  ) {
    navigate(
      "/admin/student",
      {
        state: {
          student,
        },
      }
    );
  }

  function openPerformance(
    student: Student
  ) {
    if (
      !canViewPerformance
    ) {
      return;
    }

    navigate(
      "/admin/performance",
      {
        state: {
          studentId:
            student.id,
        },
      }
    );
  }

  // =======================
  // UI
  // =======================

  return (
    <MobileLayout>

      <Header />

      <main className="flex-1 py-4 overflow-y-auto">

        <section className="mx-5">

          {/* Heading */}

          <div className="flex items-center justify-between mb-4">

            <h1 className="text-2xl font-bold">
              Students
            </h1>

            {canCreateStudent && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/admin/students/add"
                  )
                }
                className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
              >

                <Plus size={18} />

                Add

              </button>
            )}

          </div>

          {/* Search */}

          <div className="relative mb-4">

            <Search
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 outline-none focus:border-emerald-500"
            />

          </div>

          {/* Batch Filter */}

          <div className="mb-5">

            <select
              value={selectedBatch}
              onChange={(e) =>
                setSelectedBatch(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 outline-none focus:border-emerald-500"
            >

              <option value="All">
                All Batches
              </option>

              {batches.map(
                (batch) => (
                  <option
                    key={batch}
                    value={batch}
                  >
                    {batch}
                  </option>
                )
              )}

            </select>

          </div>

          {/* Loading */}

          {loading && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-500">
              Loading students...
            </div>
          )}

          {/* Error */}

          {!loading &&
            error && (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center text-red-500">
                {error}
              </div>
            )}

          {/* Students */}

          {!loading &&
            !error && (
              <div className="space-y-3">

                {filteredStudents.length >
                0 ? (

                  filteredStudents.map(
                    (student) => (

                      <div
                        key={
                          student.id
                        }
                        className="bg-white rounded-xl shadow-sm overflow-hidden"
                      >

                        {/* Student Details */}

                        <button
                          type="button"
                          onClick={() =>
                            openStudent(
                              student
                            )
                          }
                          className="w-full p-4 flex justify-between items-center hover:bg-slate-50 transition"
                        >

                          <div>

                            <h3 className="font-semibold text-left">
                              {
                                student.firstName
                              }{" "}
                              {
                                student.lastName
                              }
                            </h3>

                            <p className="text-sm text-slate-500 text-left">
                              {
                                student.rollNumber
                              }

                              {" • "}

                              {student.batch
                                ?.name ??
                                "No Batch"}
                            </p>

                          </div>

                          <div className="flex items-center gap-3">

                            <div className="flex items-center gap-1">

                              <CircleCheck
                                size={
                                  16
                                }
                                className="text-emerald-600"
                              />

                              <span className="text-xs">
                                Active
                              </span>

                            </div>

                            <ChevronRight
                              size={18}
                              className="text-slate-400"
                            />

                          </div>

                        </button>

                        {/* Performance */}

                        {canViewPerformance && (
                          <div className="border-t border-slate-100 p-3">

                            <button
                              type="button"
                              onClick={() =>
                                openPerformance(
                                  student
                                )
                              }
                              className="w-full rounded-lg bg-emerald-50 text-emerald-700 py-2.5 flex items-center justify-center gap-2 font-medium hover:bg-emerald-100 transition"
                            >

                              <ChartNoAxesColumnIncreasing
                                size={
                                  18
                                }
                              />

                              View Performance

                            </button>

                          </div>
                        )}

                      </div>

                    )
                  )

                ) : (

                  <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-500">
                    No students found.
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