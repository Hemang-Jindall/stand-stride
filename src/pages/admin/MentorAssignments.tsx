import {
  useCallback,
  useEffect,
  useState,
} from "react";

import MobileLayout from "../../layouts/MobileLayout";
import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import api from "../../api/api";

import {
  UserCheck,
  UserPlus,
  X,
} from "lucide-react";

interface Mentor {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;

  _count?: {
    students: number;
  };
}

interface Student {
  id: string;
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  mentorId: string | null;

  batch: {
    id: string;
    name: string;
  };

  mentor: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  } | null;
}

export default function MentorAssignments() {
  const [mentors, setMentors] =
    useState<Mentor[]>([]);

  const [students, setStudents] =
    useState<Student[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [savingStudentId, setSavingStudentId] =
    useState<string | null>(null);

  const [showAddMentor, setShowAddMentor] =
    useState(false);

  const [creatingMentor, setCreatingMentor] =
    useState(false);

  const [mentorForm, setMentorForm] =
    useState({
      name: "",
      email: "",
      phone: "",
    });

  // =========================
  // AUTH HEADER
  // =========================

  function getAuthHeaders() {
    const token =
      localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  // =========================
  // LOAD DATA
  // =========================

  const loadData =
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

        const [
          mentorsResponse,
          assignmentsResponse,
        ] = await Promise.all([
          api.get(
            "/mentors",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          ),

          api.get(
            "/mentors/assignments",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          ),
        ]);

        setMentors(
          mentorsResponse.data
        );

        setStudents(
          assignmentsResponse.data
        );
      } catch (error: any) {
        console.error(
          "LOAD MENTOR ASSIGNMENTS ERROR:",
          error
        );

        setError(
          error.response?.data?.message ??
            "Failed to load mentor assignments."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // =========================
  // ASSIGN MENTOR
  // =========================

  async function updateMentor(
    studentId: string,
    mentorId: string
  ) {
    try {
      setSavingStudentId(
        studentId
      );

      setError("");

      if (!mentorId) {
        await api.delete(
          `/mentors/assignments/${studentId}`,
          {
            headers:
              getAuthHeaders(),
          }
        );
      } else {
        await api.put(
          `/mentors/assignments/${studentId}`,
          {
            mentorId,
          },
          {
            headers:
              getAuthHeaders(),
          }
        );
      }

      await loadData();
    } catch (error: any) {
      console.error(
        "UPDATE MENTOR ERROR:",
        error
      );

      setError(
        error.response?.data?.message ??
          "Failed to update mentor."
      );
    } finally {
      setSavingStudentId(
        null
      );
    }
  }

  // =========================
  // CREATE MENTOR
  // =========================

  async function createMentor() {
    try {
      if (!mentorForm.name.trim()) {
        setError(
          "Mentor name is required."
        );
        return;
      }

      setCreatingMentor(true);
      setError("");

      await api.post(
        "/mentors",
        {
          name:
            mentorForm.name.trim(),

          email:
            mentorForm.email.trim() ||
            null,

          phone:
            mentorForm.phone.trim() ||
            null,
        },
        {
          headers:
            getAuthHeaders(),
        }
      );

      setMentorForm({
        name: "",
        email: "",
        phone: "",
      });

      setShowAddMentor(false);

      await loadData();
    } catch (error: any) {
      console.error(
        "CREATE MENTOR ERROR:",
        error
      );

      setError(
        error.response?.data?.message ??
          "Failed to create mentor."
      );
    } finally {
      setCreatingMentor(false);
    }
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

          <div className="flex items-center justify-between mb-5">

            <div className="flex items-center gap-2">
              <UserCheck
                size={22}
                className="text-emerald-600"
              />

              <h1 className="text-2xl font-bold">
                Mentor Assignment
              </h1>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowAddMentor(true)
              }
              className="bg-emerald-600 text-white rounded-lg p-2"
              title="Add mentor"
            >
              <UserPlus size={20} />
            </button>

          </div>

          {/* Error */}

          {error && (
            <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-4">
              {error}
            </div>
          )}

          {/* Add Mentor */}

          {showAddMentor && (
            <div className="bg-white rounded-xl shadow-sm p-4 mb-5">

              <div className="flex items-center justify-between mb-4">

                <h2 className="font-semibold text-lg">
                  Add Mentor
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setShowAddMentor(
                      false
                    )
                  }
                  className="text-slate-500"
                >
                  <X size={20} />
                </button>

              </div>

              <div className="space-y-3">

                <input
                  type="text"
                  placeholder="Mentor name"
                  value={
                    mentorForm.name
                  }
                  onChange={(e) =>
                    setMentorForm({
                      ...mentorForm,
                      name:
                        e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-3 outline-none focus:border-emerald-600"
                />

                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={
                    mentorForm.email
                  }
                  onChange={(e) =>
                    setMentorForm({
                      ...mentorForm,
                      email:
                        e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-3 outline-none focus:border-emerald-600"
                />

                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={
                    mentorForm.phone
                  }
                  onChange={(e) =>
                    setMentorForm({
                      ...mentorForm,
                      phone:
                        e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-3 outline-none focus:border-emerald-600"
                />

                <button
                  type="button"
                  onClick={
                    createMentor
                  }
                  disabled={
                    creatingMentor
                  }
                  className="w-full bg-emerald-600 text-white rounded-lg py-3 disabled:opacity-50"
                >
                  {creatingMentor
                    ? "Adding..."
                    : "Add Mentor"}
                </button>

              </div>

            </div>
          )}

          {/* Loading */}

          {loading && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-500">
              Loading mentor assignments...
            </div>
          )}

          {/* No Students */}

          {!loading &&
            students.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-500">
                No students found.
              </div>
            )}

          {/* Students */}

          {!loading &&
            students.length > 0 && (
              <div className="space-y-3">

                {students.map(
                  (student) => (
                    <div
                      key={student.id}
                      className="bg-white rounded-xl shadow-sm p-4"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div>
                          <h2 className="font-semibold">
                            {
                              student.firstName
                            }{" "}
                            {
                              student.lastName
                            }
                          </h2>

                          <p className="text-sm text-slate-500 mt-1">
                            {
                              student.rollNumber
                            }
                            {" • "}
                            {
                              student.batch.name
                            }
                          </p>
                        </div>

                        {student.mentor && (
                          <span className="text-xs bg-emerald-100 text-emerald-700 rounded-full px-2 py-1">
                            Assigned
                          </span>
                        )}

                      </div>

                      <div className="mt-4">

                        <label className="text-sm text-slate-500">
                          Mentor
                        </label>

                        <select
                          value={
                            student.mentorId ??
                            ""
                          }
                          disabled={
                            savingStudentId ===
                            student.id
                          }
                          onChange={(e) =>
                            updateMentor(
                              student.id,
                              e.target.value
                            )
                          }
                          className="w-full border rounded-lg p-3 mt-1 bg-white disabled:opacity-50"
                        >

                          <option value="">
                            No mentor assigned
                          </option>

                          {mentors.map(
                            (mentor) => (
                              <option
                                key={
                                  mentor.id
                                }
                                value={
                                  mentor.id
                                }
                              >
                                {
                                  mentor.name
                                }
                              </option>
                            )
                          )}

                        </select>

                        {savingStudentId ===
                          student.id && (
                          <p className="text-xs text-slate-500 mt-2">
                            Saving...
                          </p>
                        )}

                      </div>

                      {student.mentor && (
                        <div className="mt-3 bg-slate-50 rounded-lg p-3 text-sm">

                          <p className="font-medium">
                            {
                              student
                                .mentor
                                .name
                            }
                          </p>

                          {student.mentor
                            .email && (
                            <p className="text-slate-500 mt-1">
                              {
                                student
                                  .mentor
                                  .email
                              }
                            </p>
                          )}

                          {student.mentor
                            .phone && (
                            <p className="text-slate-500">
                              {
                                student
                                  .mentor
                                  .phone
                              }
                            </p>
                          )}

                        </div>
                      )}

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