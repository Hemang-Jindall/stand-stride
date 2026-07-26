import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import MobileLayout from "../../layouts/MobileLayout";
import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import api from "../../api/api";

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
}

export default function EditStudent() {
  const navigate = useNavigate();
  const location = useLocation();

  const student = location.state?.student as Student | undefined;

  const [batches, setBatches] = useState<Batch[]>([]);

  const [rollNumber, setRollNumber] = useState(
    student?.rollNumber ?? ""
  );

  const [firstName, setFirstName] = useState(
    student?.firstName ?? ""
  );

  const [lastName, setLastName] = useState(
    student?.lastName ?? ""
  );

  const [email, setEmail] = useState(
    student?.email ?? ""
  );

  const [phone, setPhone] = useState(
    student?.phone ?? ""
  );

  const [batchId, setBatchId] = useState(
    student?.batchId ?? ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBatches() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get("/batches", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBatches(response.data);
      } catch (error) {
        console.error("LOAD BATCHES ERROR:", error);
        setError("Failed to load batches.");
      }
    }

    loadBatches();
  }, [navigate]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!student) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.put(
        `/students/${student.id}`,
        {
          rollNumber,
          firstName,
          lastName,
          email,
          phone,
          batchId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/admin/student", {
        state: {
          student: response.data,
        },
      });
    } catch (error: any) {
      console.error("UPDATE STUDENT ERROR:", error);

      setError(
        error.response?.data?.message ??
          "Failed to update student."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!student) {
    return (
      <MobileLayout>
        <Header />

        <main className="flex-1 py-4 overflow-y-auto">
          <section className="mx-5 bg-white rounded-xl shadow-sm p-6 text-center">
            <p className="text-slate-500 mb-4">
              Student not found.
            </p>

            <button
              onClick={() => navigate("/admin/students")}
              className="bg-emerald-600 text-white px-5 py-3 rounded-xl"
            >
              Back to Students
            </button>
          </section>
        </main>

        <AdminBottomNavigation />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <Header />

      <main className="flex-1 py-4 overflow-y-auto">
        <section className="mx-5">
          <h1 className="text-2xl font-bold mb-4">
            Edit Student
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-sm p-5 space-y-4"
          >
            <input
              type="text"
              placeholder="Roll Number"
              value={rollNumber}
              onChange={(e) =>
                setRollNumber(e.target.value)
              }
              required
              className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-emerald-500"
            />

            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) =>
                setFirstName(e.target.value)
              }
              required
              className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-emerald-500"
            />

            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) =>
                setLastName(e.target.value)
              }
              required
              className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-emerald-500"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-emerald-500"
            />

            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-emerald-500"
            />

            <select
              value={batchId}
              onChange={(e) =>
                setBatchId(e.target.value)
              }
              required
              className="w-full rounded-xl border border-slate-200 bg-white p-3 outline-none focus:border-emerald-500"
            >
              {batches.map((batch) => (
                <option
                  key={batch.id}
                  value={batch.id}
                >
                  {batch.name}
                </option>
              ))}
            </select>

            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="border border-slate-200 rounded-xl py-3 font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 text-white rounded-xl py-3 font-semibold disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>
      </main>

      <AdminBottomNavigation />
    </MobileLayout>
  );
}